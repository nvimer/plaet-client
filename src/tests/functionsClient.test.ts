import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  FUNCTIONS_BASE: "https://test.supabase.co/functions/v1",
  supabase: {},
  getStoredToken: () => globalThis.localStorage?.getItem("accessToken") ?? null,
}));

import { callFunction, fetchWithRefresh } from "@/services/functionsClient";
import * as cashClosureApi from "@/services/cashClosureApi";
import * as customerApi from "@/services/customerApi";
import * as menuApi from "@/services/menuApi";
import * as orderApi from "@/services/orderApi";
import * as paymentApi from "@/services/paymentApi";
import * as permissionsApi from "@/services/permissionsApi";
import * as restaurantApi from "@/services/restaurantApi";
import * as rolesApi from "@/services/rolesApi";
import * as tablesApi from "@/services/tablesApi";
import {
  getStoredRefreshToken,
  getStoredToken,
  logout,
  storeTokens,
} from "@/services/authApi";

/**
 * In-memory localStorage. Recent Node versions ship an experimental global
 * `localStorage` that shadows jsdom's and is undefined without a flag, so the tests
 * bring their own instead of depending on the environment.
 */
function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => [...data.keys()][index] ?? null,
    removeItem: (key) => void data.delete(key),
    setItem: (key, value) => void data.set(key, String(value)),
  };
}

/**
 * Stand-in for the Edge Functions. It rotates refresh tokens the way the real
 * server does: a refresh token works once, and presenting it again is rejected.
 */
function fakeServer(options: { rejectEverything?: boolean } = {}) {
  let generation = 1;
  let validAccess = "A1";
  let validRefresh = "R1";
  const calls: { fn: string; auth: string | null; refreshToken?: string }[] = [];

  const reply = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  const fetchMock = vi.fn(async (url: string, init: RequestInit = {}) => {
    const fn = url.split("/").pop()!;
    const auth = new Headers(init.headers).get("Authorization");
    const body = init.body ? JSON.parse(init.body as string) : {};
    calls.push({ fn, auth, refreshToken: body.refreshToken });

    if (fn === "auth-refresh-token") {
      // Keep the refresh in flight long enough for concurrent requests to pile up.
      await new Promise((resolve) => setTimeout(resolve, 20));

      if (body.refreshToken !== validRefresh) {
        return reply(401, { success: false, code: "TOKEN_REUSED", message: "closed" });
      }
      generation += 1;
      validAccess = `A${generation}`;
      validRefresh = `R${generation}`;
      return reply(200, {
        success: true,
        message: "Session refreshed",
        data: { accessToken: validAccess, refreshToken: validRefresh, user: { id: "u1" } },
      });
    }

    if (fn === "auth-logout") return reply(200, { success: true, data: null });

    if (options.rejectEverything || auth !== `Bearer ${validAccess}`) {
      return reply(401, { success: false, message: "Unauthorized" });
    }
    return reply(200, { success: true, message: "ok", data: { fn } });
  });

  return {
    fetchMock,
    calls,
    functionsCalled: () => calls.map((c) => c.fn),
    refreshCalls: () => calls.filter((c) => c.fn === "auth-refresh-token").length,
  };
}

describe("callFunction: renovar la sesión cuando el token vence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("no refresca cuando el token sirve", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A1", "R1");

    const res = await callFunction("orders-list");

    expect(res.success).toBe(true);
    expect(server.refreshCalls()).toBe(0);
  });

  it("refresca una vez y repite la petición con el token nuevo", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R1");

    const res = await callFunction("orders-list");

    expect(res.success).toBe(true);
    expect(server.functionsCalled()).toEqual(["orders-list", "auth-refresh-token", "orders-list"]);
    expect(server.calls[2].auth).toBe("Bearer A2");
    expect(getStoredToken()).toBe("A2");
    expect(getStoredRefreshToken()).toBe("R2");
  });

  it("varias peticiones con 401 a la vez comparten un solo refresco", async () => {
    // With rotation, a second refresh would present the already-burned token and
    // close the whole session, so this is the case that matters most.
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R1");

    const results = await Promise.all([
      callFunction("orders-list"),
      callFunction("menu-items-list"),
      callFunction("tables-list"),
    ]);

    expect(results.every((r) => r.success)).toBe(true);
    expect(server.refreshCalls()).toBe(1);
    expect(getStoredRefreshToken()).toBe("R2");
  });

  it("si el refresh falla, devuelve el 401, limpia los tokens y no repite la petición", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R-quemado");

    await expect(callFunction("orders-list")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(server.functionsCalled()).toEqual(["orders-list", "auth-refresh-token"]);
    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
  });

  it("sin refresh token guardado no intenta refrescar", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    localStorage.setItem("accessToken", "A0-vencido");

    await expect(callFunction("orders-list")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(server.refreshCalls()).toBe(0);
  });

  it("no entra en bucle si la petición sigue dando 401 después de refrescar", async () => {
    const server = fakeServer({ rejectEverything: true });
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A1", "R1");

    await expect(callFunction("orders-list")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(server.functionsCalled()).toEqual(["orders-list", "auth-refresh-token", "orders-list"]);
  });
});

describe("fetchWithRefresh: servicios que leen el token por su cuenta", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("un Authorization viejo pasado por el llamador no impide que la repetición use el token nuevo", async () => {
    // rolesApi, permissionsApi and restaurantApi build their own Authorization header
    // before calling. If that header won, the replay would carry the expired token
    // and fail again.
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R1");

    const res = await fetchWithRefresh("https://test.supabase.co/functions/v1/roles-list", {
      headers: { Authorization: "Bearer A0-vencido" },
    });

    expect(res.status).toBe(200);
    expect(server.functionsCalled()).toEqual(["roles-list", "auth-refresh-token", "roles-list"]);
    expect(server.calls[2].auth).toBe("Bearer A2");
  });

  it("si el refresh falla devuelve la respuesta 401 original, sin lanzar", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R-quemado");

    const res = await fetchWithRefresh("https://test.supabase.co/functions/v1/roles-list");

    expect(res.status).toBe(401);
    expect(server.functionsCalled()).toEqual(["roles-list", "auth-refresh-token"]);
    expect(getStoredToken()).toBeNull();
  });
});

// One representative read per service. If a service goes back to its own fetch it
// stops refreshing, and the session dies at 30 minutes on that screen only.
type Reader = () => Promise<unknown>;
const call = (fn: unknown): Reader => () => (fn as () => Promise<unknown>)();

const readers: [string, Reader][] = [
  ["orderApi.getOrders", call(orderApi.getOrders)],
  ["tablesApi.getTables", call(tablesApi.getTables)],
  ["customerApi.getCustomers", call(customerApi.getCustomers)],
  ["cashClosureApi.getCashClosures", call(cashClosureApi.getCashClosures)],
  ["paymentApi.getPayments", call(paymentApi.getPayments)],
  ["rolesApi.getRoles", call(rolesApi.getRoles)],
  ["permissionsApi.getPermissions", call(permissionsApi.getPermissions)],
  ["restaurantApi.getRestaurants", call(restaurantApi.getRestaurants)],
  ["menuApi.getCategories", call(menuApi.getCategories)],
];

describe("todos los servicios renuevan la sesión cuando el token vence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each(readers)("%s refresca y repite la petición", async (_name, read) => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A0-vencido", "R1");

    // What the service does with the body afterwards is not under test.
    await read().catch(() => undefined);

    const first = server.functionsCalled()[0];
    expect(server.functionsCalled()).toEqual([first, "auth-refresh-token", first]);
    expect(server.calls[2].auth).toBe("Bearer A2");
  });
});

describe("logout", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("quema el refresh token en el servidor y limpia el almacenamiento", async () => {
    const server = fakeServer();
    vi.stubGlobal("fetch", server.fetchMock);
    storeTokens("A1", "R1");

    await logout();

    const call = server.calls.find((c) => c.fn === "auth-logout")!;
    expect(call.auth).toBe("Bearer A1");
    expect(call.refreshToken).toBe("R1");
    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
  });

  it("cierra la sesión local aunque no haya red", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    storeTokens("A1", "R1");

    await expect(logout()).resolves.toMatchObject({ success: true });

    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
  });
});
