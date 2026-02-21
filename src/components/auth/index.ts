/**
 * AUTH COMPONENTS EXPORTS
 *
 * Centralized exports for authentication components
 */

// Auth components
export { default as ProtectedRoute } from "./ProtectedRoute";
export { withAuth, withRole, withPermission } from "./hocs";
export { RegisterForm } from "./RegisterForm";