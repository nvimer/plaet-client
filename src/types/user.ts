/**
 * USER TYPES
 */

import { RoleName } from "./enums";

/**
 * User's profile
 */
export interface Profile {
  id: string;
  userId: string;
  photoUrl?: string | null;
  birthDate?: string | null;
  identification?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string | null;
}

/**
 * Role with basic information
 */
export interface Role {
  id: number;
  name: RoleName;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

/**
 * Permissions
 */
export interface Permission {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

/**
 * Complete USER
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profile?: Profile;
  roles?: Role[]; // Roles del usuario (opcional, puede no venir en todas las respuestas)
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  deletedAt?: string;
}

/**
 *  User with roles and permissions
 * 
 * Structure matches backend AuthenticatedUser type
 */
export interface UserWithRolesAndPermissions extends User {
  roles: {
    role: Role & {
      permissions: {
        permission: Permission;
      }[];
    };
  }[];
}

/**
 * Datos para registro de usuario
 */
export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleIds?: number[]; // IDs de roles a asignar
}

/**
 * Datos para login
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Respuesta del login
 * Lo que devuelve POST /auth/login (estructura real de tu API)
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
}

/**
 * Datos para actualizar usuario
 * Usado en PATCH /users/:id
 */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleIds?: number[];
}

/**
 * Response GET /profile/me
 */
export interface ProfileMeResponse {
  success: boolean;
  message: string;
  data: User;
}
