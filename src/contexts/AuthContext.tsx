/**
 * AUTH CONTEXT
 *
 * Manage authentication across the application.
 * Provides: logged-in user, token login/logout functions
 */

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginInput } from "@/types";
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
 * Create the context with undefined default value
 * undefined = no Provider (development error)
 */
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// ============================================================
// 3. CREATE PROVIDER
// ============================================================

/**
 * Props of the AuthProvider
 * children = all components it wraps
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider
 *
 * This component:
 * 1. Stores user and token in state
 * 2. Persists session in localStorage
 * 3. Provides login/logout functions
 * 4. Shares everything with child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // ============================================================
  // LOCAL STATE
  // ============================================================

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Starts as true

  // ============================================================
  // EFFECT: RESTORE SESSION ON LOAD
  // ============================================================

  /**
   * useEffect runs when the component mounts
   * Here we verify if there is a saved session in localStorage
   */
  useEffect(() => {
    // Function to restore saved session
    const restoreSession = () => {
      try {
        // Try to get token from localStorage
        const storedToken = localStorage.getItem("authToken");

        // Try to get user from localStorage
        const storedUser = localStorage.getItem("user");

        // If both token and user are saved
        if (storedToken && storedUser) {
          // Restore in state
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // Convert JSON string to object

          console.log("✅ Session restored from localStorage");
        } else {
          console.log("ℹ️ No saved session");
        }
      } catch (error) {
        // If there is an error parsing JSON, clean everything
        console.error("❌ Error restoring session:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        // Always mark as "not loading"
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []); // [] = only runs once when mounted

  // ============================================================
  // FUNCTION: LOGIN
  // ============================================================

  /**
   * Function to login
   *
   * 1. Call API with email and password
   * 2. If successful, store token and user
   * 3. NOTE: Tokens are now handled in httpOnly cookies
   */
  const login = async (credentials: LoginInput) => {
    try {
      // Call the login API
      await authApi.login(credentials);

      // Tokens are automatically handled by httpOnly cookies
      // No longer necessary to save token in state
      setToken(null); // No token visible on the client

      // Get user profile with roles and permissions
      const profileResponse = await profileApi.getMyProfile();
      const userData = profileResponse.data;

      // If user has ID, try to get roles and permissions
      if (userData.id) {
        try {
          const { usersApi } = await import("@/services");
          const rolesResponse = await usersApi.getUserWithRolesAndPermissions(
            userData.id,
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
    } catch (error) {
      // If there is an error, clean everything
      console.error("❌ Login error:", error);

      // Re-throw the error so the component can handle it
      throw error;
    }
  };

  // ============================================================
  // FUNCTION: LOGOUT
  // ============================================================

  /**
   * Function to logout
   *
   * 1. Call the logout API (optional)
   * 2. Clear state
   * 3. Clear localStorage
   */
  const logout = () => {
    try {
      // Try to call the logout API
      // We don't wait for the response (fire and forget)
      authApi.logout().catch((error) => {
        console.error("Error logging out on server:", error);
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state
      setUser(null);
      setToken(null);

      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      console.log("✅ Session closed");
    }
  };

  // ============================================================
  // VALUE TO SHARE
  // ============================================================

  /**
   * This object is what we share with all components
   * Any child component can access this with useAuth()
   */
  const value: AuthContextType = {
    // State
    user,
    token,
    isAuthenticated: !!user, // !! converts to boolean
    isLoading,

    // Functions
    login,
    logout,
  };

  // ============================================================
  // RENDER PROVIDER
  // ============================================================

  /**
   * The Provider wraps children and gives them access to the value
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
