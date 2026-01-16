/**
 * AUTH CONTEXT
 *
 * Manage authentication across the application.
 * Provides: logged-in user, token login/logout functions
 */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginInput, AuthResponse } from "@/types";
import { authApi, profileApi } from "@/services";

/**
 * Defines what data and functions the context will share
 */
interface AuthContextType {
  user: User | null; // User logged or null
  token: string | null; // Token JWT (null if !session)
  isAuthenticated: boolean; // true if user is logged
  isLoading: boolean; // true while session verify

  login: (credentials: LoginInput) => Promise<void>;
  logout: () => void;
}

/**
 * Crear el contexto con valor undefined por defecto
 * undefined = no hay Provider (error de desarrollo)
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ============================================================
// 3. CREAR EL PROVIDER
// ============================================================

/**
 * Props del AuthProvider
 * children = todos los componentes que envuelve
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider
 *
 * Este componente:
 * 1. Guarda el usuario y token en estado
 * 2. Persiste la sesión en localStorage
 * 3. Provee funciones login/logout
 * 4. Comparte todo con los componentes hijos
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // ============================================================
  // ESTADO LOCAL
  // ============================================================

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true

  // ============================================================
  // EFECTO: RESTAURAR SESIÓN AL CARGAR
  // ============================================================

  /**
   * useEffect se ejecuta cuando el componente se monta
   * Aquí verificamos si hay una sesión guardada en localStorage
   */
  useEffect(() => {
    // Función para restaurar sesión guardada
    const restoreSession = () => {
      try {
        // Intentar obtener token del localStorage
        const storedToken = localStorage.getItem("authToken");

        // Intentar obtener usuario del localStorage
        const storedUser = localStorage.getItem("user");

        // Si hay token Y usuario guardados
        if (storedToken && storedUser) {
          // Restaurar en el estado
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // Convertir string JSON a objeto

          console.log("✅ Sesión restaurada desde localStorage");
        } else {
          console.log("ℹ️ No hay sesión guardada");
        }
      } catch (error) {
        // Si hay error al parsear el JSON, limpiar todo
        console.error("❌ Error al restaurar sesión:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        // Siempre marcar como "no cargando"
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []); // [] = solo se ejecuta una vez al montar

  // ============================================================
  // FUNCIÓN: LOGIN
  // ============================================================

  /**
   * Función para iniciar sesión
   *
   * 1. Llama a la API con email y password
   * 2. Si es exitoso, guarda token y usuario
   * 3. Persiste en localStorage
   */
  const login = async (credentials: LoginInput) => {
    try {
      // Llamar a la API de login
      const response: AuthResponse = await authApi.login(credentials);

      // Extraer token de la ubicación correcta (según tu API)
      const authToken = response.data.access.token;
      console.log("🔍 Token extraído:", authToken);

      // Guardar token en el estado
      setToken(authToken);

      // Persistir token en localStorage
      localStorage.setItem("authToken", authToken);

      // Get user profile with roles and permissions
      const profileResponse = await profileApi.getMyProfile();
      const userData = profileResponse.data;

      // If user has ID, try to get roles and permissions
      if (userData.id) {
        try {
          const { usersApi } = await import("@/services");
          const rolesResponse = await usersApi.getUserWithRolesAndPermissions(
            userData.id
          );
          // Merge roles into user data
          const userWithRoles = {
            ...userData,
            roles: rolesResponse.data.roles.map((r) => r.role),
          };
          setUser(userWithRoles);
          localStorage.setItem("user", JSON.stringify(userWithRoles));
        } catch (error) {
          // If fails, just use user without roles
          console.warn("Could not fetch user roles:", error);
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } else {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error: any) {
      // Si hay error, limpiar todo
      console.error("❌ Error en login:", error);

      // Re-lanzar el error para que el componente pueda manejarlo
      throw error;
    }
  };

  // ============================================================
  // FUNCIÓN: LOGOUT
  // ============================================================

  /**
   * Función para cerrar sesión
   *
   * 1. Llama a la API de logout (opcional)
   * 2. Limpia el estado
   * 3. Limpia localStorage
   */
  const logout = () => {
    try {
      // Intentar llamar a la API de logout
      // No esperamos la respuesta (fire and forget)
      authApi.logout().catch((error) => {
        console.error("Error al hacer logout en el servidor:", error);
      });
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar estado local
      setUser(null);
      setToken(null);

      // Limpiar localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      console.log("✅ Sesión cerrada");
    }
  };

  // ============================================================
  // VALOR A COMPARTIR
  // ============================================================

  /**
   * Este objeto es lo que compartimos con todos los componentes
   * Cualquier componente hijo puede acceder a esto con useAuth()
   */
  const value: AuthContextType = {
    // Estado
    user,
    token,
    isAuthenticated: !!user && !!token, // !! convierte a boolean
    isLoading,

    // Funciones
    login,
    logout,
  };

  // ============================================================
  // RENDERIZAR PROVIDER
  // ============================================================

  /**
   * El Provider envuelve a los hijos y les da acceso al value
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
