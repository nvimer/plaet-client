import { Card, Badge, Button } from "@/components";
import { OrderStatus, OrderType } from "@/types";
import { Filter, RotateCcw } from "lucide-react";

// ============== TYPES ===============
interface OrderFiltersProps {
    statusFilter: OrderStatus | "ALL";
    typeFilter: OrderType | "ALL";
    onStatusChange: (status: OrderStatus | "ALL") => void;
    onTypeChange: (type: OrderType | "ALL") => void;
    onReset: () => void;
    counts: {
        all: number;
        pending: number;
        inKitchen: number;
        ready: number;
        delivered: number;
    };
}

/**
 * OrderFilters Component
 *
 * Filter controls for orders list
 */
export function OrderFilters({
    statusFilter,
    typeFilter,
    onStatusChange,
    onTypeChange,
    onReset,
    counts,
}: OrderFiltersProps) {
    // =============== FILTER OPTIONS ==========
    const statusOptions: {
        value: OrderStatus | "ALL";
        label: string;
        color: string;
    }[] = [
            { value: "ALL", label: "Todos", color: "bg-carbon-900" },
            { value: OrderStatus.PENDING, label: "Pendientes", color: "bg-yellow-500" },
            {
                value: OrderStatus.IN_KITCHEN,
                label: "En Cocina",
                color: "bg-orange-500",
            },
            { value: OrderStatus.READY, label: "Listos", color: "bg-sage-green-500" },
            {
                value: OrderStatus.DELIVERED,
                label: "Entregados",
                color: "bg-green-500",
            },
        ];

    const typeOptions: { value: OrderType | "ALL"; label: string }[] = [
        { value: "ALL", label: "Todos los tipos" },
        { value: OrderType.DINE_IN, label: "Para comer aquí" },
        { value: OrderType.TAKE_OUT, label: "Para lllevar" },
        { value: OrderType.DELIVERY, label: "Domicilio" },
    ];

    // =============== RENDER =============
    return (
        <Card variant="elevated" padding="lg" className="mb-8">
            <div className="space-y-4">
                {/* ============== STATUS FILTER =============  */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-carbon-700 font-medium">
                        <Filter className="w-5 h-5" />
                        <span>Estado:</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => {
                            const count =
                                option.value === "ALL"
                                    ? counts.all
                                    : option.value === OrderStatus.PENDING
                                        ? counts.pending
                                        : option.value === OrderStatus.IN_KITCHEN
                                            ? counts.inKitchen
                                            : option.value === OrderStatus.READY
                                                ? counts.ready
                                                : counts.delivered;

                            return (
                                <Button
                                    key={option.value}
                                    variant={statusFilter === option.value ? "primary" : "ghost"}
                                    size="sm"
                                    onClick={() => onStatusChange(option.value)}
                                    className={statusFilter === option.value ? `${option.color} hover:opacity-90 text-white` : ""}
                                >
                                    {option.label}
                                    <Badge
                                        size="md"
                                        variant={
                                            statusFilter === option.value ? "neutral" : "success"
                                        }
                                        className="ml-2"
                                    >
                                        {count}
                                    </Badge>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* =============== TYPE FILTER ================== */}
                <div className="flex items-center gap-4">
                    <span className="text-carbon-700 font-medium">Tipo:</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => onTypeChange(e.target.value as OrderType | "ALL")}
                        className="px-4 py-2 border-2 border-sage-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-green-300 focus:border-sage-green-300 bg-white text-carbon-900 font-medium text-sm"
                    >
                        {typeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    {(statusFilter !== "ALL" || typeFilter !== "ALL") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Limpiar Filtros
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
