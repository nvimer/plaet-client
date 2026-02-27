/**
 * API SERVICES - Centralized Export
 * 
 * Import all API services from a single place:
 * import { authApi, tablesApi, menuApi } from '@/api'
 */

// Axios client configured
export { axiosClient } from "./axiosClient";

// API services by module
export * as authApi from "./authApi";
export * as tablesApi from "./tablesApi";
export * as menuApi from "./menuApi";
export * as profileApi from "./profileApi";
export * as orderApi from "./orderApi";
export * as dailyMenuApi from "./dailyMenuApi";
export * as usersApi from "./usersApi";
export * as rolesApi from "./rolesApi";
export * as permissionsApi from "./permissionsApi";
export * as analyticsApi from "./analyticsApi";
export * as cashClosureApi from "./cashClosureApi";
export * as expensesApi from "./expensesApi";
export * as paymentApi from "./paymentApi";
