import { axiosClient } from "./axiosClient";
import type { CashClosure, CreateCashClosureDTO, CloseCashClosureDTO, ApiResponse } from "../types";

/**
 * CASH CLOSURE API - Client
 * Handles opening and closing of cash shifts.
 */

export const openShift = async (dto: CreateCashClosureDTO): Promise<CashClosure> => {
  const { data } = await axiosClient.post<ApiResponse<CashClosure>>("/cash-closures", dto);
  return data.data;
};

export const closeShift = async (id: string, dto: CloseCashClosureDTO): Promise<CashClosure> => {
  const { data } = await axiosClient.patch<ApiResponse<CashClosure>>(`/cash-closures/${id}/close`, dto);
  return data.data;
};

export const getCurrentShift = async (): Promise<CashClosure | null> => {
  const { data } = await axiosClient.get<ApiResponse<CashClosure | null>>("/cash-closures/current");
  return data.data;
};

export const getShiftHistory = async (page: number = 1, limit: number = 10): Promise<CashClosure[]> => {
  const { data } = await axiosClient.get<ApiResponse<CashClosure[]>>(`/cash-closures`, {
    params: { page, limit }
  });
  return data.data;
};
