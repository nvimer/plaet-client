import { Badge } from "@/components";
import { OrderType } from "@/types";
import {
    Bike,
    MessageCircle,
    ShoppingBag,
    UtensilsCrossed,
} from "lucide-react";

// ======== TYPES =========
interface OrderTypeBadgeProps {
    type: OrderType;
    size?: "sm" | "md" | "lg";
}

/**
 * OrderTypeBadge Component
 *
 * Displays order type with icon
 */
export function OrderTypeBadge({ type, size = "sm" }: OrderTypeBadgeProps) {
    const typeConfig: Record<
        OrderType,
        { label: string; icon: typeof UtensilsCrossed }
    > = {
        [OrderType.DINE_IN]: { label: "Para comer aquí", icon: UtensilsCrossed },
        [OrderType.TAKE_OUT]: { label: "Para llevar", icon: ShoppingBag },
        [OrderType.DELIVERY]: { label: "Domicilio", icon: Bike },
        [OrderType.WHATSAPP]: { label: "Whatsapp", icon: MessageCircle },
    };

    const config = typeConfig[type];
    const Icon = config.icon;

    return (
        <Badge variant="neutral" size={size} className="bg-sage-50 text-carbon-700">
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
        </Badge>
    );
}
