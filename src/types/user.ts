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
 * UserRole relation structure
 * Represents the many-to-many relationship between User and Role
 * This is what the backend returns when including roles in user queries
 */
export interface UserRole {
  roleId: number;
  userId: string;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
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
  // Roles can be either UserRole[] (from backend with relation) or Role[] (direct)
  roles?: (UserRole | Role)[];
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
 * Nota: Los tokens se envían en cookies httpOnly, no en el body
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
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
