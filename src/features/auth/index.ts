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
export { default as ForgotPasswordPage } from "./pages/ForgotPasswordPage";
export { default as ResetPasswordPage } from "./pages/ResetPasswordPage";
export { default as VerifyEmailPage } from "./pages/VerifyEmailPage";

// Types
export type { AuthError } from "../../contexts/EnhancedAuthContext";
