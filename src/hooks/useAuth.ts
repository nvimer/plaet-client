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
 * Facilita el acceso al store de autenticación.
 * 
 * @returns Datos y funciones de autenticación
 */
export function useAuth() {
  return useAuthStore()
}
