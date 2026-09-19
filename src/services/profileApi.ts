/**
 * PROFILE API SERVICE
 *
 * Services related to the user profile
 * Base endpoints: /profile/*
 */
import type {
  ProfileMeResponse,
  User,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";
import type { UpdateProfileInput } from "@/features/users/schemas/userSchemas";
import { callFunction, query } from "./functionsClient";

/**
 * GET /profile/me
 *
 * Gets the data of the current authenticated user
 *
 * @returns Complete user with profile
 */
export const getMyProfile = async () => {
  return await callFunction<unknown>("profiles-me") as unknown as ProfileMeResponse;
};

/**
 * GET /profile
 * 
 * Get paginated list of profiles
 */
export const getProfiles = async (params?: PaginationParams) => {
  return await callFunction<User[]>(`users-list${query({ page: params?.page, limit: params?.limit })}`) as unknown as PaginatedResponse<User>;
};

/**
 * GET /profile/:id
 * 
 * Get profile by user ID
 */
export const getProfileById = async (id: string) => {
  return await callFunction<User>(`users-get${query({ id })}`) as unknown as ApiResponse<User>;
};

/**
 * PATCH /profile/me/photo
 * 
 * Update profile photo
 */
export const uploadPhoto = async (photo: File): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("photo", photo);

  // Photo upload still needs Supabase Storage; no Edge Function serves it yet.
  void formData;
  throw new Error("La foto de perfil todavía no está disponible: falta migrar la subida a Supabase Storage.");
};

/**
 * PATCH /profile/:id
 * 
 * Update profile
 */
export const updateProfile = async (
  id: string,
  profileData: UpdateProfileInput
) => {
  return await callFunction<User>(`profiles-update${query({ id })}`, {
    method: "PATCH",
    body: JSON.stringify(profileData),
  }) as unknown as ApiResponse<User>;
};
