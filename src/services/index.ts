/**
 * API SERVICES - Exportación centralizada
 *
 * Importa todos los servicios de API desde un solo lugar:
 * import { authApi, tablesApi, menuApi } from '@/api'
 */

// Cliente Axios configurado
export { axiosClient } from "./axiosClient";

// Servicios API por módulo
export * as authApi from "./authApi";
export * as tablesApi from "./tablesApi";
export * as menuApi from "./menuApi";
export * as profileApi from "./profileApi";
export * as orderApi from "./orderApi";
export * as dailyMenuApi from "./dailyMenuApi";
export * as usersApi from "./usersApi";
export * as rolesApi from "./rolesApi";
export * as permissionsApi from "./permissionsApi";
