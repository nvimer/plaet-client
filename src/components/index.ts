/**
 * ATOMIC DESIGN SYSTEM - CENTRALIZED EXPORTS
 * 
 * This file centralizes all UI components following Atomic Design principles.
 * - Atoms: Basic building blocks (Button, Badge, Input)
 * - Molecules: Simple groups of atoms (StatCard, ConfirmDialog)
 * - Organisms: Complex UI sections
 */

// ATOMS (Pure UI Primitives)
export * from "./ui";

// MOLECULES (Simple functional groups)
export * from "./molecules";

// ORGANISMS (Complex layout sections)
export * from "./organisms";

// SEO
export { Seo } from "./seo/Seo";

// Filters (unified design for all modules)
export * from "./filters";

// Feedback
export * from "./feedback";

// Network
export { default as NetworkStatusManager } from "./network/NetworkStatusManager";

// Guards & Routing
export { default as ProtectedRoute } from "./guards/ProtectedRoute";
export { RoleProtectedRoute } from "./guards/RoleProtectedRoute";
export type { RoleProtectedRouteProps } from "./guards/RoleProtectedRoute";
