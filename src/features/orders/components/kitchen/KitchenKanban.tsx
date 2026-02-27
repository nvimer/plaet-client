import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Clock, ChefHat, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useKitchenOrders } from "../../hooks";
import { useUpdateOrderStatus } from "../../hooks/useUpdateOrderStatus";
import { OrderStatus } from "@/types";
import { type Order } from "@/types";
import { KitchenColumn } from "./KitchenColumn";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { Skeleton, EmptyState } from "@/components";
import { cn } from "@/utils/cn";

type TabType = "pending" | "inKitchen" | "ready";

interface KitchenKanbanProps {
  proteinCategoryIds?: number[];
  extraCategoryIds?: number[];
}

const TABS_CONFIG = [
  {
    id: "pending" as TabType,
    label: "Pendientes",
    icon: Clock,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  {
    id: "inKitchen" as TabType,
    label: "Cocinando",
    icon: ChefHat,
    color: "bg-orange-500",
    textColor: "text-orange-700",
    bgColor: "bg-orange-50",
  },
  {
    id: "ready" as TabType,
    label: "Listos",
    icon: CheckCircle,
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-50",
  },
];

export function KitchenKanban({
  proteinCategoryIds,
  extraCategoryIds,
}: KitchenKanbanProps) {
  const { data: allOrders, isLoading, error, refetch } = useKitchenOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const [readyItemIds, setReadyItemIds] = useState<number[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const ordersByStatus = useMemo(() => {
    if (!allOrders) return { pending: [], inKitchen: [], ready: [] };

    const pending = allOrders
      .filter((o) => o.status === OrderStatus.PENDING)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const inKitchen = allOrders
      .filter((o) => o.status === OrderStatus.IN_KITCHEN)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    const ready = allOrders
      .filter((o) => o.status === OrderStatus.READY)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    return { pending, inKitchen, ready };
  }, [allOrders]);

  const getOrdersForTab = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return ordersByStatus.pending;
      case "inKitchen":
        return ordersByStatus.inKitchen;
      case "ready":
        return ordersByStatus.ready;
    }
  };

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const order = allOrders?.find((o) => o.id === active.id);
      if (order) {
        setActiveOrder(order);
      }
    },
    [allOrders],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveOrder(null);

      if (!over) return;

      const orderId = active.id as string;
      
      // Smart status detection: check if over is a column or another card
      let newStatus: OrderStatus | null = null;
      
      if (over.data.current?.type === "column") {
        newStatus = over.data.current.status as OrderStatus;
      } else if (over.data.current?.type === "order") {
        newStatus = over.data.current.order.status as OrderStatus;
      } else {
        // Fallback to ID if it's a valid status
        const possibleStatus = over.id as OrderStatus;
        if ([OrderStatus.PENDING, OrderStatus.IN_KITCHEN, OrderStatus.READY].includes(possibleStatus)) {
          newStatus = possibleStatus;
        }
      }

      if (newStatus && newStatus !== active.data.current?.order?.status) {
        updateStatus(
          { id: orderId, orderStatus: newStatus },
          {
            onSuccess: () => {
              toast.success(`Pedido movido a ${getStatusLabel(newStatus!)}`);
            },
            onError: () => {
              toast.error("Error al mover el pedido");
            },
          },
        );
      }
    },
    [updateStatus],
  );

  const handleToggleItemReady = useCallback(
    (_orderId: string, itemId: number, ready: boolean) => {
      setReadyItemIds((prev) => {
        if (ready) {
          return [...prev, itemId];
        } else {
          return prev.filter((id) => id !== itemId);
        }
      });
    },
    [],
  );

  const handleStatusChange = useCallback(
    (orderId: string, status: OrderStatus) => {
      updateStatus(
        { id: orderId, orderStatus: status },
        {
          onSuccess: () => {
            toast.success(`Pedido marcado como ${getStatusLabel(status)}`);
          },
          onError: () => {
            toast.error("Error al actualizar el estado");
          },
        },
      );
    },
    [updateStatus],
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  /**
   * Custom collision detection strategy
   * Solves the bug where dropping on a non-empty column is difficult.
   */
  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    // 1. First try pointerWithin (most intuitive)
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;

    // 2. Fallback to rectIntersection
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;

    // 3. Last resort: closest corners for sorting within list
    return closestCorners(args);
  }, []);

  const categoryConfig = useMemo(() => ({
    proteinCategoryIds: proteinCategoryIds || [],
    extraCategoryIds: extraCategoryIds || [],
  }), [proteinCategoryIds, extraCategoryIds]);

  if (isLoading) {
    return (
      <div className="h-full p-6 space-y-6">
        <div className="grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton height={60} />
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} height={200} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={<ChefHat className="w-16 h-16" />}
        title="Error al cargar pedidos"
        description={error.message}
        onAction={() => refetch()}
      />
    );
  }

  const totalOrders =
    ordersByStatus.pending.length +
    ordersByStatus.inKitchen.length +
    ordersByStatus.ready.length;

  const currentTabOrders = getOrdersForTab(activeTab);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        {/* ============ PAGE HEADER =============== */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 lg:py-6 bg-white border-b border-sage-200 flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sage-600">
              <ChefHat className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operación en Tiempo Real</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-carbon-900 tracking-tight">
                Vista de Cocina
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-carbon-400 bg-sage-50 px-2 py-1 rounded-lg uppercase tracking-widest border border-sage-100">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span>Auto-refresh: 30s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest leading-none mb-1">Órdenes Activas</p>
              <p className="text-2xl font-bold text-sage-700 tracking-tight leading-none">{totalOrders}</p>
            </div>
            
            {/* Desktop Only: Quick Filter Info or similar could go here */}
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {totalOrders === 0 ? (
            <EmptyState
              icon={<ChefHat className="w-16 h-16" />}
              title="No hay pedidos en cocina"
              description="Los pedidos aparecerán aquí cuando sean enviados a cocina"
            />
          ) : isMobile ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentTabOrders.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-carbon-400">
                    <p className="text-center">No hay pedidos</p>
                  </div>
                ) : (
                  currentTabOrders.map((order) => (
                    <KitchenOrderCard
                      key={order.id}
                      order={order}
                      readyItemIds={readyItemIds}
                      onToggleItemReady={handleToggleItemReady}
                      onStatusChange={handleStatusChange}
                      isMobile={isMobile}
                    />
                  ))
                )}
              </div>

              <div className="bg-white border-t border-sage-200 px-2 py-2">
                <div className="flex justify-around items-center">
                  {TABS_CONFIG.map((tab) => {
                    const Icon = tab.icon;
                    const count = getOrdersForTab(tab.id).length;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                          "flex flex-col items-center justify-center py-2 px-4 rounded-xl min-w-[80px] transition-all",
                          isActive
                            ? `${tab.bgColor} ${tab.textColor}`
                            : "text-carbon-400 hover:bg-sage-50",
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-full mb-1",
                            isActive ? tab.color : "bg-sage-100",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5",
                              isActive ? "text-white" : "text-carbon-400",
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            isActive ? tab.textColor : "text-carbon-500",
                          )}
                        >
                          {tab.label}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold",
                            isActive ? tab.textColor : "text-carbon-400",
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-6 min-h-0 h-full">
                <KitchenColumn
                  id={OrderStatus.PENDING}
                  title="Pendientes"
                  icon={<Clock className="w-6 h-6" />}
                  color="bg-amber-100 text-amber-800"
                  orders={ordersByStatus.pending}
                  readyItemIds={readyItemIds}
                  onToggleItemReady={handleToggleItemReady}
                  onStatusChange={handleStatusChange}
                  isMobile={false}
                  categoryConfig={categoryConfig}
                />
                <KitchenColumn
                  id={OrderStatus.IN_KITCHEN}
                  title="Cocinando"
                  icon={<ChefHat className="w-6 h-6" />}
                  color="bg-orange-100 text-orange-800"
                  orders={ordersByStatus.inKitchen}
                  readyItemIds={readyItemIds}
                  onToggleItemReady={handleToggleItemReady}
                  onStatusChange={handleStatusChange}
                  isMobile={false}
                  categoryConfig={categoryConfig}
                />
                <KitchenColumn
                  id={OrderStatus.READY}
                  title="Listos"
                  icon={<CheckCircle className="w-6 h-6" />}
                  color="bg-emerald-100 text-emerald-800"
                  orders={ordersByStatus.ready}
                  readyItemIds={readyItemIds}
                  onToggleItemReady={handleToggleItemReady}
                  onStatusChange={handleStatusChange}
                  isMobile={false}
                  categoryConfig={categoryConfig}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeOrder && (
          <KitchenOrderCard
            order={activeOrder}
            readyItemIds={readyItemIds}
            onToggleItemReady={handleToggleItemReady}
            onStatusChange={handleStatusChange}
            categoryConfig={categoryConfig}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function getStatusLabel(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PENDING:
      return "Pendiente";
    case OrderStatus.IN_KITCHEN:
      return "En Cocina";
    case OrderStatus.READY:
      return "Listo";
    default:
      return status;
  }
}
