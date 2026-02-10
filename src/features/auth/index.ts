/**
 * AUTH FEATURE EXPORTS
 *
 * Centralized exports for authentication components and utilities
 */

// Components
export { default as RegisterForm } from "../../components/auth/RegisterForm";
export {
  ProtectedRoute,
  withAuth,
  withRole,
  withPermission,
} from "../../components/auth";

// Pages
export { default as LoginPage } from "./pages/LoginPage";

// Types
export type { AuthError } from "../../contexts/EnhancedAuthContext";
