import { Button, Card, StatCard } from "@/components";
import { useTables } from "@/features/tables";
import { useOrders } from "@/features/orders";
import { getTableManageRoute } from "@/app/routes";
import { TableStatus, OrderStatus } from "@/types";
import type { Order, OrderItem } from "@/types";
import {
  Table2,
  ClipboardList,
  DollarSign,
  Plus,
  MenuIcon,
  CircleCheck,
  CircleDot,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "@/utils/cn";

export function DashboardPage() {
  const { data } = useTables();
  const tables = data?.tables;
  // Helper function to get today's date filter
  const getTodayFilter = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    return {
      fromDate: todayString,
      toDate: todayString,
      pageSize: 1000, // Get all orders for today
    };
  };

  const { data: todayOrders } = useOrders(getTodayFilter());
  const navigate = useNavigate();

  const activeTables =
    tables?.filter((t) => t.status === "OCCUPIED").length || 0;

  const totalTables = tables?.length || 0;

  // Calculate today's metrics
  const todayMetrics = useMemo(() => {
    if (!todayOrders) {
      return {
        totalOrders: 0,
        paidOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        popularItems: [],
      };
    }

    const orders = todayOrders;
    const paidOrders = orders.filter((order: Order) => order.status === OrderStatus.PAID);
    const pendingOrders = orders.filter((order: Order) =>
      [OrderStatus.PENDING, OrderStatus.IN_KITCHEN, OrderStatus.READY].includes(order.status)
    );

    // Calculate total revenue from paid orders
    const totalRevenue = paidOrders.reduce((sum: number, order: Order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    // Find popular items
    const itemCounts: Record<string, { name: string; count: number }> = {};
    orders.forEach((order: Order) => {
      order.items?.forEach((item: OrderItem) => {
        const itemName = item.menuItem?.name || `Item #${item.menuItemId}`;
        if (!itemCounts[itemName]) {
          itemCounts[itemName] = { name: itemName, count: 0 };
        }
        itemCounts[itemName].count += item.quantity;
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      popularItems,
    };
  }, [todayOrders]);



  return (
    <>
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-neutral-900 tracking-tight mb-3">
          Dashboard
        </h1>
        <p className="text-[15px] text-neutral-600 font-light">
          Bienvenido de nuevo, aquí está un resumen de hoy
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard
          title="Mesas Activas"
          value={activeTables.toString()}
          change={{ value: `${totalTables - activeTables} disponibles`, type: "increase" as const }}
          description="de un total de mesas"
          icon={<Table2 className="w-6 h-6 text-primary-600" />}
        />

        <StatCard
          title="Órdenes de hoy"
          value={todayMetrics.totalOrders.toString()}
          change={{ value: `${todayMetrics.pendingOrders} pendientes`, type: "increase" as const }}
          description={`de las cuales ${todayMetrics.paidOrders} pagadas`}
          icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Ingresos Hoy"
          value={`$${todayMetrics.totalRevenue.toLocaleString()}`}
          change={{ value: `${todayMetrics.paidOrders} pedidos`, type: "increase" as const }}
          description="pedidos pagados hoy"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
        />

        <StatCard
          title="Pedidos Pendientes"
          value={todayMetrics.pendingOrders.toString()}
          change={{ value: "En proceso", type: "increase" as const }}
          description="esperando atención"
          icon={<ClipboardList className="w-6 h-6 text-orange-600" />}
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Tables - same style as TableCard */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-carbon-900 mb-1">
                Estado de Mesas
              </h3>
              <p className="text-sm text-carbon-500">
                {activeTables} de {totalTables} mesas ocupadas
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/tables")}
            >
              Ver todas
            </Button>
          </div>

          <div className="space-y-2">
            {tables?.slice(0, 5).map((table) => {
              const isAvailable = table.status === TableStatus.AVAILABLE;
              const isOccupied = table.status === TableStatus.OCCUPIED;
              const isCleaning = table.status === TableStatus.NEEDS_CLEANING;
              // Use isCleaning to avoid unused variable warning
              const _unused = isCleaning;
              void _unused;
              const statusConfig = isAvailable
                ? {
                    label: "Disponible",
                    icon: CircleCheck,
                    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
                    box: "bg-emerald-50 border-emerald-200",
                    text: "text-emerald-700",
                  }
                : isOccupied
                  ? {
                      label: "Ocupada",
                      icon: CircleDot,
                      pill: "bg-rose-100 text-rose-700 border-rose-200",
                      box: "bg-rose-50 border-rose-200",
                      text: "text-rose-700",
                    }
                  : {
                      label: "Limpieza",
                      icon: Clock,
                      pill: "bg-amber-100 text-amber-700 border-amber-200",
                      box: "bg-amber-50 border-amber-200",
                      text: "text-amber-700",
                    };
              const StatusIcon = statusConfig.icon;
              return (
                <button
                  key={table.id}
                  type="button"
                  onClick={() => navigate(getTableManageRoute(table.id))}
                  className={cn(
                    "w-full flex items-center justify-between gap-4 p-3 rounded-xl",
                    "border-2 border-sage-200/60 bg-white",
                    "hover:border-sage-300 hover:bg-sage-50/50",
                    "transition-all duration-200 text-left"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                        "font-bold text-lg border",
                        statusConfig.box,
                        statusConfig.text
                      )}
                    >
                      {table.number}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-carbon-900 truncate">
                        Mesa {table.number}
                      </p>
                      {table.location && (
                        <p className="text-xs text-carbon-500 truncate">
                          {table.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
                      "text-xs font-medium border flex-shrink-0",
                      statusConfig.pill
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                </button>
              );
            })}
          </div>
          {tables?.length === 0 && (
            <div className="text-center py-8">
              <Table2 className="w-12 h-12 text-carbon-300 mx-auto mb-4" />
              <p className="text-carbon-500">No hay mesas registradas</p>
            </div>
          )}
        </Card>

        {/* Popular Items */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Productos Populares
              </h3>
              <p className="text-sm text-neutral-600 font-light">
                Los más vendidos hoy
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/menu")}
            >
              Ver menú
            </Button>
          </div>

          <div className="space-y-4">
            {todayMetrics.popularItems.length > 0 ? (
              todayMetrics.popularItems.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center font-semibold text-primary-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">
                        {item.name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {item.count} {item.count === 1 ? 'unidad' : 'unidades'} vendidas
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-neutral-700">
                    #{item.count}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MenuIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500">No hay ventas hoy</p>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Acciones Rápidas</h3>

          <div>
            <button
              onClick={() => navigate("/tables")}
              className="w-full flex items-center gap-4 p-5 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all hover:shadow-smooth group"
            >
              <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                <Plus className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-neutral-900">Nueva Mesa</div>
                <div className="text-sm text-neutral-500 font-light">
                  Agregar mesa al sistema
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/menu")}
              className="w-full flex items-center gap-4 p-5 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all hover:shadow-smooth group"
            >
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <MenuIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-neutral-900">
                  Nuevo Producto
                </div>
                <div className="text-sm text-neutral-500 font-light">
                  Agregar al menú
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
