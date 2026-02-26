import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashClosureApi } from "@/services";
import type { CreateCashClosureDTO, CloseCashClosureDTO, AxiosErrorWithResponse } from "@/types";
import { toast } from "sonner";

/**
 * HOOK: useCashClosure
 * Manages the logic for cash shifts (opening, closing, status).
 */
export const useCashClosure = () => {
  const queryClient = useQueryClient();

  // Fetch current shift status
  const { data: currentShift, isLoading, error } = useQuery({
    queryKey: ["cash-closure", "current"],
    queryFn: cashClosureApi.getCurrentShift,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch summary only if shift is open
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["cash-closure", "summary", currentShift?.id],
    queryFn: () => cashClosureApi.getShiftSummary(currentShift!.id),
    enabled: !!currentShift && currentShift.status === "OPEN",
  });

  // Mutation to open a new shift
  const openShiftMutation = useMutation({
    mutationFn: (dto: CreateCashClosureDTO) => cashClosureApi.openShift(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-closure"] });
      toast.success("Turno abierto exitosamente");
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error?.response?.data?.message || "Error al abrir el turno");
    },
  });

  // Mutation to close the current shift
  const closeShiftMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CloseCashClosureDTO }) => 
      cashClosureApi.closeShift(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-closure"] });
      toast.success("Turno cerrado exitosamente");
    },
    onError: (error: AxiosErrorWithResponse) => {
      toast.error(error?.response?.data?.message || "Error al cerrar el turno");
    },
  });

  return {
    currentShift,
    summary,
    isLoading: isLoading || isLoadingSummary,
    error,
    openShift: openShiftMutation.mutate,
    isOpening: openShiftMutation.isPending,
    closeShift: closeShiftMutation.mutate,
    isClosing: closeShiftMutation.isPending,
    isOpen: !!currentShift && currentShift.status === "OPEN",
  };
};
