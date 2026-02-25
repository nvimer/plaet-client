import { RestaurantStatus } from "./enums";

/**
 * RESTAURANT TYPES
 */

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  status: RestaurantStatus;
  address: string | null;
  phone: string | null;
  nit: string | null;
  logoUrl: string | null;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRestaurantInput {
  name: string;
  address?: string;
  phone?: string;
  nit?: string;
  currency?: string;
  timezone?: string;
  adminUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    password: string;
  };
}

export interface UpdateRestaurantInput {
  name?: string;
  status?: RestaurantStatus;
  address?: string | null;
  phone?: string | null;
  nit?: string | null;
  currency?: string;
  timezone?: string;
  logoUrl?: string | null;
}

export interface RestaurantSearchParams {
  search?: string;
  status?: RestaurantStatus;
}
