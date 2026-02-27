/**
 * CUSTOM HOOK: useAuth
 * 
 * Hook personalizado para acceder al EnhancedAuthContext fácilmente.
 * 
 * En lugar de:
 *   const context = useContext(AuthContext)
 *   if (!context) throw new Error(...)
 * 
 * Simplemente:
 *   const { user, login, logout } = useAuth()
 */

import { useContext } from 'react'
import { AuthContext } from '@/contexts/EnhancedAuthContext'

/**
 * Hook useAuth
 * 
 * Facilita el acceso al contexto de autenticación mejorado.
 * 
 * @returns Datos y funciones de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export function useAuth() {
  // Obtener el contexto
  const context = useContext(AuthContext)

  // Verificar que estamos dentro de un Provider
  if (!context) {
    throw new Error(
      'useAuth debe usarse dentro de un AuthProvider. ' +
      'Asegúrate de envolver tu app con <AuthProvider>.'
    )
  }

  // Retornar el contexto
  return context
}
