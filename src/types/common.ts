/**
 * COMMON TYPES
 *
 *
 * Tipos que se usan en múltiples lugares de la aplicación.
 */

/**
 * Estructura estándar de respuesta de tu API
 *
 * T es un "generic" - puede ser cualquier tipo
 * Ejemplo: ApiResponse<Order[]> para una lista de pedidos
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Estructura de error de la API
 */
export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Estado de carga genérico
 * Útil para componentes que cargan datos
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
