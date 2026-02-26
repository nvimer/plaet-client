import { Button, Card, StatCard } from "@/components";
import { useTables } from "@/features/tables";
import { useOrders } from "@/features/orders";
import { getTableManageRoute, ROUTES } from "@/app/routes";
import { TableStatus, OrderStatus, RoleName } from "@/types";
import type { Order, OrderItem } from "@/types";
import {
  Table2,
  ClipboardList,
  DollarSign,
  Plus,
  MenuIcon,
  CircleCheck as _CircleCheck,
  CircleDot as _CircleDot,
  Clock,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
} from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ActiveShiftWidget } from "../components/ActiveShiftWidget";
import { TodaySalesChart } from "../components/TodaySalesChart";
import { useAuth, usePermissions } from "@/hooks";

export function DashboardPage() {
  const { isSuperAdmin } = usePermissions();
  const navigate = useNavigate();

  // Redirigir SuperAdmin a su panel principal si lo prefieres,
  // o mostrar métricas globales. Por ahora, si es SuperAdmin,
  // mostraremos un Dashboard simplificado para evitar errores de carga.
  if (isSuperAdmin()) {
    return (
      <div className="space-y-8">
        <header>
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm font-medium tracking-wide">Panel de Control Global</span>
          </div>
          <h1 className="text-4xl font-black text-carbon-900 tracking-tight">
            Bienvenido, SuperAdmin
          </h1>
          <p className="text-carbon-500 font-medium">
            Gestión global de la plataforma Plaet POS
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card 
            variant="elevated" 
            padding="lg" 
            className="flex flex-col items-center text-center p-12 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate(ROUTES.RESTAURANTS)}
          >
            <div className="w-16 h-16 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-carbon-900 mb-2">Gestión de Restaurantes</h3>
            <p className="text-carbon-500 mb-6">Administra los clientes, sus suscripciones y estados.</p>
            <Button>Ver Restaurantes</Button>
          </Card>

          <Card 
            variant="elevated" 
            padding="lg" 
            className="flex flex-col items-center text-center p-12 hover:shadow-xl transition-shadow opacity-50 cursor-not-allowed"
          >
            <div className="w-16 h-16 rounded-2xl bg-carbon-100 text-carbon-600 flex items-center justify-center mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-carbon-900 mb-2">Soporte Global</h3>
            <p className="text-carbon-500 mb-6">Próximamente: Tickets de soporte y ayuda técnica.</p>
            <Button disabled>Próximamente</Button>
          </Card>
        </div>
      </div>
    );
  }

  const { data: tablesData } = useTables();
  const tables = tablesData?.tables;

  // Helper function to get today's date filter
  const getTodayFilter = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return {
      fromDate: todayString,
      toDate: todayString,
      pageSize: 1000,
    };
  };

  const { data: todayOrders } = useOrders(getTodayFilter());

  const activeTables = tables?.filter((t) => t.status === "OCCUPIED").length || 0;
  const totalTables = tables?.length || 0;

  // Real-time Greeting logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const formattedDate = new Intl.DateTimeFormat('es-CO', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  }).format(new Date());

  // Metrics calculation
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

    const totalRevenue = paidOrders.reduce((sum: number, order: Order) => sum + (Number(order.totalAmount) || 0), 0);

    const itemCounts: Record<string, { name: string; count: number }> = {};
    orders.forEach((order: Order) => {
      order.items?.forEach((item: OrderItem) => {
        const itemName = item.menuItem?.name || `Item #${item.menuItemId}`;
        if (!itemCounts[itemName]) itemCounts[itemName] = { name: itemName, count: 0 };
        itemCounts[itemName].count += item.quantity;
      });
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      popularItems,
    };
  }, [todayOrders]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-12"
    >
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Panel Principal</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">
            {greeting}, {user?.firstName || 'Admin'}
          </h1>
          <p className="text-sm text-carbon-500 font-medium capitalize">
            {formattedDate}
          </p>
        </div>
        
        <div className="w-full md:w-80">
          <ActiveShiftWidget />
        </div>
      </header>

      {/* 2. Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos Hoy"
          value={`$${todayMetrics.totalRevenue.toLocaleString()}`}
          variant="success"
          icon={<DollarSign className="w-6 h-6" />}
          trend={{ value: 8.2, isUp: true }}
        />
        <StatCard
          title="Mesas Ocupadas"
          value={`${activeTables}/${totalTables}`}
          variant="primary"
          icon={<Table2 className="w-6 h-6" />}
        />
        <StatCard
          title="Pedidos Totales"
          value={todayMetrics.totalOrders.toString()}
          variant="info"
          icon={<ClipboardList className="w-6 h-6" />}
        />
        <StatCard
          title="Pendientes"
          value={todayMetrics.pendingOrders.toString()}
          variant="warning"
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* 3. Main Content: Charts & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart - Spans 2 columns */}
        <div className="lg:col-span-2">
          <Card variant="elevated" padding="lg" className="h-full shadow-smooth-lg border-none">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-carbon-900">Tendencia de Ventas</h3>
                <p className="text-sm text-carbon-500">Actividad económica por horas</p>
              </div>
              <div className="bg-success-50 text-success-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> En tiempo real
              </div>
            </div>
            <TodaySalesChart orders={todayOrders || []} />
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <Card variant="elevated" padding="lg" className="shadow-smooth-lg border-none bg-white">
            <h3 className="text-lg font-bold text-carbon-900 mb-4 px-1">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate("/orders/new")}
                className="w-full flex items-center justify-between p-4 bg-sage-50 rounded-2xl hover:bg-sage-100 transition-all group border border-sage-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                    <Plus className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="font-bold text-carbon-800">Nuevo Pedido</span>
                </div>
                <ArrowRight className="w-4 h-4 text-carbon-400 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate("/menu/daily")}
                className="w-full flex items-center justify-between p-4 bg-sage-50 rounded-2xl hover:bg-sage-100 transition-all group border border-sage-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                    <MenuIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="font-bold text-carbon-800">Menú del Día</span>
                </div>
                <ArrowRight className="w-4 h-4 text-carbon-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>

          {/* Popular Items - Compact Vertical */}
          <Card variant="elevated" padding="lg" className="shadow-smooth-lg border-none">
            <h3 className="text-lg font-bold text-carbon-900 mb-4">Top Productos</h3>
            <div className="space-y-4">
              {todayMetrics.popularItems.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-carbon-300">0{idx + 1}</span>
                    <span className="font-bold text-carbon-800 text-sm truncate max-w-[120px]">{item.name}</span>
                  </div>
                  <span className="px-2 py-1 bg-sage-50 text-sage-700 rounded-lg text-xs font-black">
                    {item.count} vendidos
                  </span>
                </div>
              ))}
              {todayMetrics.popularItems.length === 0 && (
                <p className="text-sm text-carbon-400 italic text-center py-4">Sin ventas aún</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Bottom Grid: Tables Status */}
      <div className="grid grid-cols-1 gap-8">
        <Card variant="elevated" padding="lg" className="shadow-smooth-lg border-none overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-carbon-900">Estado de Mesas</h3>
              <p className="text-sm text-carbon-500">Vista rápida del salón</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/tables")} className="rounded-xl border-sage-200">
              Ver Mapa Completo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tables?.slice(0, 10).map((table) => {
              const isOccupied = table.status === TableStatus.OCCUPIED;
              const isCleaning = table.status === TableStatus.NEEDS_CLEANING;
              
              return (
                <button
                  key={table.id}
                  onClick={() => navigate(getTableManageRoute(table.id))}
                  className={cn(
                    "relative p-4 rounded-2xl border-2 transition-all text-left group",
                    isOccupied 
                      ? "bg-rose-50 border-rose-100" 
                      : isCleaning 
                        ? "bg-amber-50 border-amber-100" 
                        : "bg-white border-sage-100 hover:border-sage-300"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-2",
                    isOccupied ? "bg-rose-500 text-white" : isCleaning ? "bg-amber-500 text-white" : "bg-sage-100 text-sage-700"
                  )}>
                    {table.number}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-[10px] font-semibold tracking-wide",
                      isOccupied ? "text-rose-600" : isCleaning ? "text-amber-600" : "text-carbon-400"
                    )}>
                      {isOccupied ? "Ocupada" : isCleaning ? "Limpieza" : "Libre"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
