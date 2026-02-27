import { Button, Card, StatCard } from "@/components";
import { useTables } from "@/features/tables";
import { useOrders } from "@/features/orders";
import { getTableManageRoute, ROUTES } from "@/app/routes";
import { TableStatus, OrderStatus } from "@/types";
import type { Order, OrderItem } from "@/types";
import {
  Table2,
  ClipboardList,
  DollarSign,
  Plus,
  Clock,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  LayoutGrid,
  Menu as MenuIcon,
  Package2,
  UtensilsCrossed,
  Settings,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ActiveShiftWidget } from "../components/ActiveShiftWidget";
import { TodaySalesChart } from "../components/TodaySalesChart";
import { useAuth, usePermissions } from "@/hooks";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * Dashboard Launchpad Option Interface
 */
interface LaunchOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
  bgColor: string;
  roles?: string[];
}

export function DashboardPage() {
  const { user } = useAuth();
  const { isSuperAdmin, isAdmin } = usePermissions();
  const navigate = useNavigate();

  // 1. SuperAdmin Special View
  if (isSuperAdmin()) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <header className="space-y-1.5">
            <div className="flex items-center gap-2 text-primary-600">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">SaaS Administration</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">
              Panel Global
            </h1>
            <p className="text-lg text-carbon-500 font-medium">
              Gestión centralizada de la red de restaurantes Plaet.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              variant="elevated" 
              padding="lg" 
              className="flex flex-col items-center text-center p-12 hover:shadow-2xl transition-all cursor-pointer rounded-3xl border-2 border-transparent hover:border-primary-100"
              onClick={() => navigate(ROUTES.RESTAURANTS)}
            >
              <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-carbon-900 mb-3">Gestión de Restaurantes</h3>
              <p className="text-carbon-500 mb-8 max-w-xs">Administra los clientes, sus suscripciones y estados operativos.</p>
              <Button size="lg" className="rounded-xl px-8">Ver Restaurantes</Button>
            </Card>

            <Card 
              variant="elevated" 
              padding="lg" 
              className="flex flex-col items-center text-center p-12 hover:shadow-2xl transition-all cursor-pointer rounded-3xl border-2 border-transparent hover:border-sage-100"
              onClick={() => navigate(ROUTES.PERMISSIONS)}
            >
              <div className="w-20 h-20 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center mb-6">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-carbon-900 mb-3">Seguridad y Roles</h3>
              <p className="text-carbon-500 mb-8 max-w-xs">Controla los permisos globales y la jerarquía del sistema.</p>
              <Button size="lg" variant="primary" className="rounded-xl px-8">Configurar Acceso</Button>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  // 2. Regular User Dashboard Logic
  const { data: tablesData } = useTables();
  const tables = tablesData?.tables;

  const getTodayFilter = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    return { fromDate: todayString, toDate: todayString, pageSize: 1000 };
  };

  const { data: todayOrders } = useOrders(getTodayFilter());

  const activeTables = tables?.filter((t) => t.status === "OCCUPIED").length || 0;
  const totalTables = tables?.length || 0;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  }, []);

  const formattedDate = new Intl.DateTimeFormat('es-CO', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  }).format(new Date());

  const todayMetrics = useMemo(() => {
    if (!todayOrders) return { totalOrders: 0, paidOrders: 0, pendingOrders: 0, totalRevenue: 0, popularItems: [] };
    const orders = todayOrders;
    const paidOrders = orders.filter((o: Order) => o.status === OrderStatus.PAID);
    const pendingOrders = orders.filter((o: Order) => [OrderStatus.PENDING, OrderStatus.IN_KITCHEN, OrderStatus.READY].includes(o.status));
    const totalRevenue = paidOrders.reduce((sum: number, o: Order) => sum + (Number(o.totalAmount) || 0), 0);
    const itemCounts: Record<string, { name: string; count: number }> = {};
    orders.forEach((o: Order) => o.items?.forEach((i: OrderItem) => {
      const name = i.menuItem?.name || `Item #${i.menuItemId}`;
      if (!itemCounts[name]) itemCounts[name] = { name, count: 0 };
      itemCounts[name].count += i.quantity;
    }));
    return {
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      popularItems: Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 4),
    };
  }, [todayOrders]);

  // Launchpad Options
  const launchOptions: LaunchOption[] = [
    {
      id: "tables",
      title: "Mapa de Mesas",
      description: "Ver y gestionar la sala",
      icon: LayoutGrid,
      path: ROUTES.TABLES,
      color: "text-sage-600",
      bgColor: "bg-sage-50",
    },
    {
      id: "orders",
      title: "Ventas y Pedidos",
      description: "Tomar y revisar órdenes",
      icon: ShoppingCart,
      path: ROUTES.ORDERS,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "daily-menu",
      title: "Menú del Día",
      description: "Configurar platos de hoy",
      icon: UtensilsCrossed,
      path: ROUTES.DAILY_MENU,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      id: "inventory",
      title: "Inventario",
      description: "Stock y materias primas",
      icon: Package2,
      path: ROUTES.INVENTORY,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      id: "admin",
      title: "Administración",
      description: "Caja, gastos y reportes",
      icon: Settings,
      path: "/admin",
      color: "text-carbon-600",
      bgColor: "bg-carbon-50",
    },
    {
      id: "team",
      title: "Mi Equipo",
      description: "Personal y asistencia",
      icon: Users,
      path: ROUTES.USERS,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <SidebarLayout hideTitle fullWidth>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-10 pb-20"
      >
        {/* 1. Greeting & Shift Info */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Centro de Operaciones</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">
              {greeting}, {user?.firstName || 'Admin'}
            </h1>
            <p className="text-lg text-carbon-500 font-medium capitalize">
              {formattedDate}
            </p>
          </div>
          <div className="w-full md:w-80">
            <ActiveShiftWidget />
          </div>
        </header>

        {/* 2. Launchpad Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-carbon-400 uppercase tracking-[0.2em]">Accesos Principales</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {launchOptions.map((option) => (
              <Card
                key={option.id}
                variant="elevated"
                padding="none"
                className="group cursor-pointer transition-all duration-300 hover:shadow-soft-xl hover:-translate-y-1 rounded-3xl border-2 border-transparent hover:border-sage-100"
                onClick={() => navigate(option.path)}
              >
                <div className="p-6 flex items-center gap-5">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", option.bgColor, option.color)}>
                    <option.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-carbon-900 group-hover:text-sage-700 transition-colors">{option.title}</h3>
                    <p className="text-sm text-carbon-400 font-medium truncate">{option.description}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-carbon-50 text-carbon-300 group-hover:bg-sage-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Metrics Summary */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-carbon-400 uppercase tracking-[0.2em]">Resumen de Hoy</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)} className="text-xs font-bold text-sage-600">
              Ver Analítica <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Ingresos"
              value={`$${todayMetrics.totalRevenue.toLocaleString()}`}
              variant="success"
              icon={<DollarSign className="w-6 h-6" />}
            />
            <StatCard
              title="Mesas Ocupadas"
              value={`${activeTables}/${totalTables}`}
              variant="primary"
              icon={<Table2 className="w-6 h-6" />}
            />
            <StatCard
              title="Total Pedidos"
              value={todayMetrics.totalOrders.toString()}
              variant="info"
              icon={<ClipboardList className="w-6 h-6" />}
            />
            <StatCard
              title="Por Entregar"
              value={todayMetrics.pendingOrders.toString()}
              variant="warning"
              icon={<Clock className="w-6 h-6" />}
            />
          </div>
        </section>

        {/* 4. Live Charts & Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card variant="elevated" padding="lg" className="lg:col-span-2 shadow-smooth-lg border-none rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-carbon-900 tracking-tight">Tendencia de Ventas</h3>
                <p className="text-sm text-carbon-500 font-medium italic">Actividad económica en tiempo real</p>
              </div>
              <div className="bg-success-50 text-success-700 px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 uppercase tracking-widest border border-success-100">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" /> Live
              </div>
            </div>
            <TodaySalesChart orders={todayOrders || []} />
          </Card>

          <Card variant="elevated" padding="lg" className="shadow-smooth-lg border-none rounded-3xl bg-carbon-900 text-white">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sage-400" />
              Top Productos
            </h3>
            <div className="space-y-5">
              {todayMetrics.popularItems.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-default group">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-xl bg-sage-500/20 text-sage-400 flex items-center justify-center font-black text-xs">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white text-sm group-hover:text-sage-300 transition-colors">{item.name}</span>
                  </div>
                  <span className="px-3 py-1 bg-white/10 text-white rounded-lg text-[10px] font-black uppercase">
                    {item.count} vendidos
                  </span>
                </div>
              ))}
              {todayMetrics.popularItems.length === 0 && (
                <p className="text-sm text-white/40 italic text-center py-10">Esperando primeras ventas...</p>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </SidebarLayout>
  );
}