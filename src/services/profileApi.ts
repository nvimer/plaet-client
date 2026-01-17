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
import axiosClient from "./axiosClient";

/**
 * GET /profile/me
 *
 * Gets the data of the current authenticated user
 *
 * @returns Complete user with profile
 */
export const getMyProfile = async () => {
  const { data } = await axiosClient.get<ProfileMeResponse>("profile/me");
  return data;
};

/**
 * GET /profile
 * 
 * Get paginated list of profiles
 */
export const getProfiles = async (params?: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<User>>("/profile", {
    params,
  });
  return data;
};

/**
 * GET /profile/:id
 * 
 * Get profile by user ID
 */
export const getProfileById = async (id: string) => {
  const { data } = await axiosClient.get<ApiResponse<User>>(`/profile/${id}`);
  return data;
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
  const { data } = await axiosClient.patch<ApiResponse<User>>(
    `/profile/${id}`,
    profileData
  );
  return data;
};
