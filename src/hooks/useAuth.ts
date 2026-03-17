/**
 * CUSTOM HOOK: useAuth
 * 
 * Hook personalizado para acceder al useAuthStore de Zustand fácilmente.
 * 
 * Migrado de Context API a Zustand para mejor rendimiento.
 * 
 * Simplemente:
 *   const { user, login, logout } = useAuth()
 */

import { useAuthStore } from '@/stores/useAuthStore'

/**
 * Hook useAuth
 * 
 * Facilita el acceso al store de autenticación con soporte para selectores.
 * 
 * @param selector - Función para seleccionar parte del estado
 * @returns Datos y funciones de autenticación
 */
export function useAuth<T>(selector?: (state: any) => T): T {
  // @ts-ignore - support selector-less call
  return useAuthStore(selector);
}
