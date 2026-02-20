import { axiosClient } from "./axiosClient";
import type { CashClosure, CreateCashClosureDTO, CloseCashClosureDTO } from "../types";

/**
 * CASH CLOSURE API - Client
 * Handles opening and closing of cash shifts.
 */

export const openShift = async (dto: CreateCashClosureDTO): Promise<CashClosure> => {
  const { data } = await axiosClient.post("/cash-closures", dto);
  return data;
};

export const closeShift = async (id: string, dto: CloseCashClosureDTO): Promise<CashClosure> => {
  const { data } = await axiosClient.patch(`/cash-closures/${id}/close`, dto);
  return data;
};

export const getCurrentShift = async (): Promise<CashClosure | null> => {
  const { data } = await axiosClient.get("/cash-closures/current");
  return data;
};

export const getShiftHistory = async (page: number = 1, limit: number = 10): Promise<CashClosure[]> => {
  const { data } = await axiosClient.get(`/cash-closures?page=${page}&limit=${limit}`);
  return data;
};
