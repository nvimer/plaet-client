import { Button, Card, StatCard, Skeleton } from "@/components";
import { Badge } from "@/components/ui/Badge";
import { useTables } from "@/features/tables";
import { useOrders } from "@/features/orders";
import { TableStatus, OrderStatus, type Order } from "@/types";
import {
  Table2,
  ClipboardList,
  DollarSign,
  Plus,
  MenuIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export function DashboardPage() {
  const { data: tables, isLoading: isLoadingTables } = useTables();
  // Helper function to get today's date filter
  const getTodayFilter = () => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // YYYY-MM-DD
    return {
      fromDate: todayString,
      toDate: todayString,
      pageSize: 1000, // Get all orders for today
    };
  };

  const { data: todayOrders, isLoading: isLoadingOrders } = useOrders(getTodayFilter());
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
    const paidOrders = orders.filter(
      (order: Order) => order.status === OrderStatus.PAID,
    );
    const pendingOrders = orders.filter((order: Order) =>
      [OrderStatus.PENDING, OrderStatus.IN_KITCHEN, OrderStatus.READY].includes(
        order.status,
      ),
    );

    // Calculate total revenue from paid orders
    const totalRevenue = paidOrders.reduce((sum: number, order: Order) => {
      return sum + (order.totalAmount || 0);
    }, 0);

    // Find popular items
    const itemCounts: Record<string, { name: string; count: number }> = {};
    orders.forEach((order: Order) => {
      order.items?.forEach((item: any) => {
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

  // Loading state
  if (isLoadingTables || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-neutral-50 p-10">
        <div className="mb-12">
          <Skeleton variant="text" width={256} height={40} className="mb-2" />
          <Skeleton variant="text" width={384} height={24} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="card" height={120} />
          ))}
        </div>
      </div>
    );
  }

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
          change={{
            value: `${totalTables - activeTables} disponibles`,
            type: "increase" as const,
          }}
          description="de un total de mesas"
          icon={<Table2 className="w-6 h-6 text-primary-600" />}
        />

        <StatCard
          title="Órdenes de hoy"
          value={todayMetrics.totalOrders.toString()}
          change={{
            value: `${todayMetrics.pendingOrders} pendientes`,
            type: "increase" as const,
          }}
          description={`de las cuales ${todayMetrics.paidOrders} pagadas`}
          icon={<ClipboardList className="w-6 h-6 text-blue-600" />}
        />

        <StatCard
          title="Ingresos Hoy"
          value={`$${todayMetrics.totalRevenue.toLocaleString()}`}
          change={{
            value: `${todayMetrics.paidOrders} pedidos`,
            type: "increase" as const,
          }}
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
        {/* Recent Tables */}
        <Card variant="elevated" padding="lg">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Estado de Mesas
              </h3>
              <p className="text-sm text-neutral-600 font-light">
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

          <div className="space-y-3">
            {tables?.slice(0, 5).map((table) => (
              <div
                key={table.id}
                className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-semibold text-neutral-700 border border-neutral-200">
                    {table.number}
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">
                      Mesa {table.number}
                    </div>
                  </div>
                </div>
                <Badge
                  variant={
                    table.status === TableStatus.OCCUPIED
                      ? "error"
                      : table.status === TableStatus.NEEDS_CLEANING
                        ? "warning"
                        : "success"
                  }
                >
                  {table.status === TableStatus.OCCUPIED
                    ? "Ocupada"
                    : table.status === TableStatus.NEEDS_CLEANING
                      ? "Limpieza"
                      : "Disponible"}
                </Badge>
              </div>
            ))}
          </div>
          {tables?.length === 0 && (
            <div>
              <Table2 className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p>No hay mesas registradas</p>
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/menu")}>
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
                        {item.count} {item.count === 1 ? "unidad" : "unidades"}{" "}
                        vendidas
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
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">
            Acciones Rápidas
          </h3>

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
