import { EmptyState, Skeleton } from "@/components";
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
  type DragStartEvent,
  type DragEndEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Clock, ChefHat, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useKitchenOrders, useUpdateOrderItemStatus } from "../../hooks";
import { OrderItemStatus, type OrderItem, type Order } from "@/types";
import { KitchenColumn } from "./KitchenColumn";
import { KitchenOrderCard } from "./KitchenOrderCard"; // We will adapt this or use a new ItemCard
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { variants, transitions } from "@/utils/motion";

type TabType = "pending" | "inKitchen" | "ready";

interface KitchenKanbanProps {
  proteinCategoryIds?: number[];
  extraCategoryIds?: number[];
}

const TABS_CONFIG = [
  {
    id: "pending" as TabType,
    label: "Nuevos",
    icon: Clock,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
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
    color: "bg-success-500",
    textColor: "text-success-700",
    bgColor: "bg-success-50",
  },
];

// Extended OrderItem type for UI needs
export type KitchenItem = OrderItem & {
  order: Order; // Reference to parent order for table info, etc.
};

export function KitchenKanban({
  proteinCategoryIds,
  extraCategoryIds,
}: KitchenKanbanProps) {
  const { data: allOrders, isLoading, error, refetch } = useKitchenOrders();
  const { mutate: updateItemStatus } = useUpdateOrderItemStatus();

  const [activeItem, setActiveItem] = useState<KitchenItem | null>(null);
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
    }, 10000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Flatten all items from all active orders and group them by status
  const itemsByStatus = useMemo(() => {
    const initial = { pending: [] as KitchenItem[], inKitchen: [] as KitchenItem[], ready: [] as KitchenItem[] };
    if (!allOrders) return initial;

    return allOrders.reduce((acc, order) => {
      order.items?.forEach(item => {
        // FILTER: Do not show Portacomidas or manual items in kitchen
        const isPackaging = item.notes?.toLowerCase().includes("portacomida") || !item.menuItemId;
        if (isPackaging) return;

        const kitchenItem: KitchenItem = { ...item, order };
        
        if (item.status === OrderItemStatus.PENDING) acc.pending.push(kitchenItem);
        else if (item.status === OrderItemStatus.IN_KITCHEN) acc.inKitchen.push(kitchenItem);
        else if (item.status === OrderItemStatus.READY) acc.ready.push(kitchenItem);
      });
      return acc;
    }, initial);
  }, [allOrders]);

  const getItemsForTab = (tab: TabType) => {
    switch (tab) {
      case "pending": return itemsByStatus.pending;
      case "inKitchen": return itemsByStatus.inKitchen;
      case "ready": return itemsByStatus.ready;
    }
  };

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      // Find the item in our flattened lists
      const item = [...itemsByStatus.pending, ...itemsByStatus.inKitchen, ...itemsByStatus.ready]
        .find(i => i.id === active.id);
      
      if (item) {
        setActiveItem(item);
      }
    },
    [itemsByStatus],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (!over) return;

      const itemId = active.id as number;
      const orderId = active.data.current?.item?.orderId as string;
      
      let newStatus: OrderItemStatus | null = null;
      
      if (over.data.current?.type === "column") {
        newStatus = over.data.current.status as OrderItemStatus;
      } else if (over.data.current?.type === "item") {
        newStatus = over.data.current.item.status as OrderItemStatus;
      }

      if (newStatus && newStatus !== active.data.current?.item?.status) {
        updateItemStatus(
          { orderId, itemId, status: newStatus },
          {
            onSuccess: () => {
              toast.success(`Plato movido a ${getStatusLabel(newStatus!)}`);
            },
            onError: () => {
              toast.error("Error al mover el plato");
            },
          },
        );
      }
    },
    [updateItemStatus],
  );

  const handleItemStatusChange = useCallback(
    (orderId: string, itemId: number, status: OrderItemStatus) => {
      updateItemStatus(
        { orderId, itemId, status },
        {
          onSuccess: () => {
            toast.success(`Plato marcado como ${getStatusLabel(status)}`);
          },
          onError: () => {
            toast.error("Error al actualizar el estado");
          },
        },
      );
    },
    [updateItemStatus],
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const customCollisionDetection: CollisionDetection = useCallback((args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;
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
                <Skeleton key={j} height={120} />
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

  const totalItemsCount =
    itemsByStatus.pending.length +
    itemsByStatus.inKitchen.length +
    itemsByStatus.ready.length;

  const currentTabItems = getItemsForTab(activeTab);

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
              <span className="text-[10px] font-semibold tracking-[0.2em]">Cocina Master-Detail</span>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold text-carbon-900 tracking-tight">
                Vista de Cocina
              </h1>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-carbon-400 bg-sage-50 px-2 py-1 rounded-lg tracking-wide border border-sage-100">
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span>Auto-refresh: 30s</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-carbon-400 tracking-wide leading-none mb-1">Platos Activos</p>
              <p className="text-2xl font-bold text-sage-700 tracking-tight leading-none">{totalItemsCount}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          {totalItemsCount === 0 ? (
            <EmptyState
              icon={<ChefHat className="w-16 h-16" />}
              title="No hay platos pendientes"
              description="Los platos aparecerán aquí cuando se registren en una mesa"
            />
          ) : isMobile ? (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentTabItems.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-carbon-400">
                    <p className="text-center">No hay platos en esta etapa</p>
                  </div>
                ) : (
                  currentTabItems.map((item) => (
                    <KitchenOrderCard
                      key={item.id}
                      item={item}
                      onStatusChange={handleItemStatusChange}
                      isMobile={isMobile}
                      categoryConfig={categoryConfig}
                    />
                  ))
                )}
              </div>

              <div className="bg-white border-t border-sage-200 px-2 py-2">
                <div className="flex justify-around items-center">
                  {TABS_CONFIG.map((tab) => {
                    const Icon = tab.icon;
                    const count = getItemsForTab(tab.id).length;
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
              <motion.div 
                variants={transitions.stagger(0.1)}
                initial="initial"
                animate="animate"
                className="grid grid-cols-3 gap-6 min-h-0 h-full"
              >
                <motion.div variants={variants.fadeInUp} className="h-full">
                  <KitchenColumn
                    id={OrderItemStatus.PENDING}
                    title="Nuevos"
                    icon={<Clock className="w-6 h-6" />}
                    color="bg-blue-100 text-blue-800"
                    items={itemsByStatus.pending}
                    onStatusChange={handleItemStatusChange}
                    isMobile={false}
                    categoryConfig={categoryConfig}
                  />
                </motion.div>
                <motion.div variants={variants.fadeInUp} className="h-full">
                  <KitchenColumn
                    id={OrderItemStatus.IN_KITCHEN}
                    title="Preparando"
                    icon={<ChefHat className="w-6 h-6" />}
                    color="bg-orange-100 text-orange-800"
                    items={itemsByStatus.inKitchen}
                    onStatusChange={handleItemStatusChange}
                    isMobile={false}
                    categoryConfig={categoryConfig}
                  />
                </motion.div>
                <motion.div variants={variants.fadeInUp} className="h-full">
                  <KitchenColumn
                    id={OrderItemStatus.READY}
                    title="Listos"
                    icon={<CheckCircle className="w-6 h-6" />}
                    color="bg-success-100 text-success-800"
                    items={itemsByStatus.ready}
                    onStatusChange={handleItemStatusChange}
                    isMobile={false}
                    categoryConfig={categoryConfig}
                  />
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeItem && (
          <KitchenOrderCard
            item={activeItem}
            onStatusChange={handleItemStatusChange}
            categoryConfig={categoryConfig}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function getStatusLabel(status: OrderItemStatus): string {
  switch (status) {
    case OrderItemStatus.PENDING: return "Pendiente";
    case OrderItemStatus.IN_KITCHEN: return "En Cocina";
    case OrderItemStatus.READY: return "Listo";
    case OrderItemStatus.DELIVERED: return "Entregado";
    case OrderItemStatus.CANCELLED: return "Cancelado";
    default: return status;
  }
}
