import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { OrderType, TableStatus } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Button, Input, Skeleton } from "@/components";
import { useTables } from "@/features/tables";
import { useOrder, useUpdateOrder } from "../hooks";
import { ROUTES, getOrderDetailRoute } from "@/app/routes";
import { toast } from "sonner";
import { Bike, ShoppingBag, UtensilsCrossed, Edit2, ArrowLeft } from "lucide-react";

/**
 * OrderEditPage Component
 */
export function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // ... rest of the component
  const { data: tablesData } = useTables();
  const tables = tablesData?.tables;
  const { data: order, isLoading, error } = useOrder(id);
  const { mutate: updateOrder, isPending } = useUpdateOrder();

  // State
  const [orderType, setOrderType] = useState<OrderType>(OrderType.DINE_IN);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [orderNotes, setOrderNotes] = useState("");

  // Load order data when it becomes available
  useEffect(() => {
    if (order) {
      setOrderType(order.type);
      setSelectedTable(order.tableId || null);
      setOrderNotes(order.notes || "");
    }
  }, [order]);

  // Filter available tables for dine-in
  const availableTables = tables?.filter(
    (table) =>
      table.status === TableStatus.AVAILABLE || table.id === order?.tableId,
  );

  // Handle order submission
  const handleSubmit = () => {
    if (!order) return;

    if (orderType === OrderType.DINE_IN && !selectedTable) {
      toast.error("Debes seleccionar una mesa para pedidos en local", {
        icon: "⚠️",
      });
      return;
    }

    updateOrder(
      {
        id: order.id,
        type: orderType,
        tableId:
          orderType === OrderType.DINE_IN
            ? selectedTable || undefined
            : undefined,
        notes: orderNotes,
      },
      {
        onSuccess: () => {
          toast.success("Orden actualizada exitosamente", {
            icon: "🎉",
          });
          navigate(getOrderDetailRoute(order.id));
        },
        onError: (error: AxiosErrorWithResponse) => {
          toast.error("Error al actualizar orden", {
            description: error.response?.data?.message || error.message,
            icon: "❌",
          });
        },
      },
    );
  };

  // Loading state
  if (isLoading || !order) {
    return (
      <SidebarLayout title="Cargando..." backRoute={ROUTES.ORDERS}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton variant="card" height={400} />
        </div>
      </SidebarLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <SidebarLayout title="Error" backRoute={ROUTES.ORDERS}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-2xl font-semibold text-carbon-900 mb-2">
              Error al cargar la orden
            </h2>
            <p className="text-carbon-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout
      title="Editar Orden"
      backRoute={getOrderDetailRoute(order.id)}
      hideHeader
    >
      <div className="max-w-4xl mx-auto space-y-10 pb-24">
        {/* ============ PAGE HEADER =============== */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sage-600">
              <Edit2 className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Modificación de Registro</span>
            </div>
            <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Editar Orden #{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-sm text-carbon-500 font-medium">Actualiza el tipo de servicio o las notas del pedido.</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate(getOrderDetailRoute(order.id))}
            className="rounded-2xl h-14 px-6 border-sage-200 text-sage-700 hover:bg-sage-50 transition-all font-bold"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </header>

        <div className="space-y-8">
          {/* Order Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-carbon-900 tracking-tight flex items-center gap-2">
              <div className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Tipo de Orden
            </h3>
            <div className="grid grid-cols-2 gap-4">
            <Button
              variant={orderType === OrderType.DINE_IN ? "primary" : "ghost"}
              size="lg"
              onClick={() => setOrderType(OrderType.DINE_IN)}
              className="h-20 flex-col gap-2"
            >
              <UtensilsCrossed className="w-6 h-6" />
              <span>Mesa</span>
            </Button>
            <Button
              variant={orderType === OrderType.TAKE_OUT ? "primary" : "ghost"}
              size="lg"
              onClick={() => setOrderType(OrderType.TAKE_OUT)}
              className="h-20 flex-col gap-2"
            >
              <Bike className="w-6 h-6" />
              <span>Para Llevar</span>
            </Button>
          </div>
        </div>

        {/* Table Selection */}
        {orderType === OrderType.DINE_IN && (
          <div>
            <h3 className="text-lg font-semibold text-carbon-900 mb-4">
              Seleccione Mesa
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {availableTables?.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable === table.id ? "primary" : "ghost"}
                  size="md"
                  onClick={() => setSelectedTable(table.id)}
                  className="h-16"
                >
                  {table.number}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Order Notes */}
        <div>
          <Input
            label="Notas de la Orden (opcional)"
            placeholder="Ej: Sin cebolla, extra picante..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            fullWidth
          />
        </div>

        {/* Current Order Items (Read-only for now) */}
        <div>
          <h3 className="text-lg font-semibold text-carbon-900 mb-4">
            Items Actuales de la Orden
          </h3>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-sage-50 rounded-xl"
              >
                <div>
                  <div className="font-medium text-carbon-900">
                    {item.quantity}x{" "}
                    {item.menuItem?.name || `Item #${item.menuItemId}`}
                  </div>
                  {item.notes && (
                    <div className="text-sm text-carbon-600">{item.notes}</div>
                  )}
                </div>
                <div className="font-semibold text-carbon-900">
                  $
                  {(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-carbon-500 mt-4">
            Nota: Los items de la orden no pueden ser modificados desde esta
            vista. Para cambiar items, contacte al administrador.
          </p>
        </div>

                  {/* Actions */}

                  <div className="flex gap-4 pt-8 border-t border-sage-100">

                    <Button

                      variant="primary"

                      size="lg"

                      onClick={handleSubmit}

                      isLoading={isPending}

                      disabled={isPending}

                      className="flex-1 h-16 rounded-2xl font-bold bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl shadow-carbon-200"

                    >

                      {!isPending && <CheckCircle className="w-5 h-5 mr-2 stroke-[3px]" />}

                      Guardar Cambios

                    </Button>

                    <Button

                      variant="ghost"

                      size="lg"

                      onClick={() => navigate(getOrderDetailRoute(order.id))}

                      disabled={isPending}

                      className="h-16 px-8 rounded-2xl font-bold text-carbon-400"

                    >

                      Cancelar

                    </Button>

                  </div>

        
      </div>
    </SidebarLayout>
  );
}
