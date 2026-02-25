import { Badge } from "@/components/ui/Badge/Badge";
import { RestaurantStatus } from "@/types";

interface RestaurantStatusBadgeProps {
  status: RestaurantStatus;
}

export function RestaurantStatusBadge({ status }: RestaurantStatusBadgeProps) {
  const statusConfig = {
    [RestaurantStatus.ACTIVE]: {
      label: "Activo",
      variant: "success" as const,
    },
    [RestaurantStatus.SUSPENDED]: {
      label: "Suspendido",
      variant: "danger" as const,
    },
    [RestaurantStatus.TRIAL]: {
      label: "Prueba",
      variant: "warning" as const,
    },
    [RestaurantStatus.PAST_DUE]: {
      label: "Deuda",
      variant: "danger" as const,
    },
  };

  const config = statusConfig[status] || { label: status, variant: "neutral" as const };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
