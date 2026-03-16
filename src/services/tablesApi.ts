/**
 * TABLES API SERVICE
 *
 * Services related with tables of restaurant
 * Base Endpoints: /tables/*
 */

import { axiosClient } from "./axiosClient";
import type {
  Table,
  CreateTableInput,
  UpdateTableInput,
  UpdateTableStatusInput,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "@/types";

/**
 * GET /tables
 *
 * Get a paginated listed of tables
 *
 * @param params - Params of pagination
 * @returns Paginated list of tables
 */
export const getTables = async (params?: PaginationParams) => {
  const { data } = await axiosClient.get<PaginatedResponse<Table>>("tables", {
    params,
  });
  return data;
};

/**
 * GET /tables/:id
 *
 * Get a table by ID
 *
 * @param id -  Table ID
 * @returns Data of Table
 */
export const getTableById = async (id: number) => {
  const { data } = await axiosClient.get<ApiResponse<Table>>(`tables/${id}`);
  return data;
};

/**
 * POST /tables
 *
 * Create a new table
 *
 * @param tableData - Data of new table
 * @returns Created Table
 */
export const createTable = async (tableData: CreateTableInput) => {
  const { data } = await axiosClient.post<ApiResponse<Table>>(
    "tables",
    tableData,
  );
  return data;
};

/**
 * PUT /tables/:id
 *
 * Updated a existing table
 *
 * @param id - Table ID
 * @param tableData - Data to update
 * @returns Updated Table
 */
export const updateTable = async (id: number, tableData: UpdateTableInput) => {
  const { data } = await axiosClient.patch<ApiResponse<Table>>(
    `tables/${id}`,
    tableData,
  );
  return data;
};

/**
 * DELETE /tables/:id
 *
 * Delete a table (soft delete)
 *
 * @param id - Table ID
 */
export const deleteTable = async (id: number) => {
  const { data } = await axiosClient.delete<ApiResponse<null>>(`tables/${id}`);
  return data;
};

/**
 * PATCH /tables/:id/status
 *
 * Update only the state of table
 *
 * @param id - Table ID
 * @param statusData - New table status
 * @returns Updated Table
 */
export const updateTableStatus = async (
  id: number,
  statusData: UpdateTableStatusInput,
) => {
  const { data } = await axiosClient.patch<ApiResponse<Table>>(
    `tables/${id}/status`,
    statusData,
  );
  return data;
};
