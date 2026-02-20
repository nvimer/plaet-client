import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cashClosureApi } from "@/services";
import { CreateCashClosureDTO, CloseCashClosureDTO } from "@/types/cash-closure";
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

  // Mutation to open a new shift
  const openShiftMutation = useMutation({
    mutationFn: (dto: CreateCashClosureDTO) => cashClosureApi.openShift(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-closure"] });
      toast.success("Turno abierto exitosamente");
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Error al cerrar el turno");
    },
  });

  return {
    currentShift,
    isLoading,
    error,
    openShift: openShiftMutation.mutate,
    isOpening: openShiftMutation.isPending,
    closeShift: closeShiftMutation.mutate,
    isClosing: closeShiftMutation.isPending,
    isOpen: !!currentShift && currentShift.status === "OPEN",
  };
};
