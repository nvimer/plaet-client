import { useState, useMemo } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useDailyMenuHistory } from "../../hooks/useDailyMenu";
import { Card, Button } from "@/components";
import { ROUTES } from "@/app/routes";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  History, 
  UtensilsCrossed, 
  Beef, 
  Salad, 
  ArrowRight,
  Sparkles,
  CupSoda
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * DailyMenuHistoryPage Component
 * 
 * Interactive calendar view to browse past daily menu configurations.
 */
export function DailyMenuHistoryPage() {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(new Date());
  
  // Fetch a larger set of history to populate the calendar (up to 100 items cover 3+ months)
  const { data, isLoading } = useDailyMenuHistory(1, 100);
  const menus = data?.data || [];

  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  // Calendar Logic
  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const days = [];
    
    // Fill leading empty slots (adjusting for Monday start)
    let firstDayIndex = firstDayOfMonth.getDay(); // 0 = Sun, 1 = Mon
    // Convert to Monday = 0, ..., Sunday = 6
    const leadingSlots = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    
    for (let i = 0; i < leadingSlots; i++) {
      days.push(null);
    }
    
    // Fill actual days
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    
    return days;
  }, [viewDate]);

  const monthName = viewDate.toLocaleString("es-ES", { month: "long" });
  const year = viewDate.getFullYear();

  const handlePrevMonth = () => {
    const prev = new Date(viewDate);
    prev.setMonth(prev.getMonth() - 1);
    setViewDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + 1);
    setViewDate(next);
  };

  // Map menus to dates for fast lookup using YYYY-MM-DD
  const menuMap = useMemo(() => {
    const map = new Map();
    menus.forEach(m => {
      const datePart = m.createdAt.split('T')[0];
      map.set(datePart, m);
    });
    return map;
  }, [menus]);

  const selectedMenu = useMemo(() => 
    menus.find(m => m.id === selectedMenuId), 
  [menus, selectedMenuId]);

  if (isLoading) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-6 w-96 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 h-[500px] bg-white rounded-[3rem] animate-pulse border-2 border-carbon-50" />
            <div className="h-[500px] bg-white rounded-[3rem] animate-pulse border-2 border-carbon-50" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 pb-32">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro Histórico</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight leading-tight">Calendario de Menús</h1>
            <p className="text-lg text-carbon-500 font-medium">Visualiza rápidamente qué se ofreció en fechas pasadas.</p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-smooth-md border border-carbon-100 ring-4 ring-carbon-50/50">
            <button 
              onClick={handlePrevMonth} 
              className="p-2.5 hover:bg-carbon-50 text-carbon-600 rounded-xl transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 text-sm font-black text-carbon-900 uppercase tracking-widest min-w-[160px] text-center">
              {monthName} {year}
            </div>
            <button 
              onClick={handleNextMonth} 
              className="p-2.5 hover:bg-carbon-50 text-carbon-600 rounded-xl transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* CALENDAR BOARD */}
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border-2 border-carbon-50 shadow-smooth-xl">
            <div className="grid grid-cols-7 gap-2 mb-8">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-carbon-300 uppercase tracking-widest py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {daysInMonth.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
                
                const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                const menu = menuMap.get(dateKey);
                const isSelected = selectedMenuId === menu?.id;
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <motion.button
                    whileHover={menu ? { y: -4, scale: 1.02 } : {}}
                    whileTap={menu ? { scale: 0.95 } : {}}
                    key={day.toISOString()}
                    onClick={() => menu && setSelectedMenuId(menu.id)}
                    className={cn(
                      "aspect-square rounded-[1.75rem] border-2 flex flex-col items-center justify-center relative transition-all duration-300",
                      menu 
                        ? isSelected 
                          ? "bg-carbon-900 border-carbon-900 text-white shadow-xl shadow-carbon-200" 
                          : "bg-sage-50/50 border-sage-100 text-carbon-900 hover:border-sage-400 hover:bg-white"
                        : "bg-white border-carbon-50 text-carbon-200 cursor-default opacity-30",
                      isToday && !isSelected && "ring-4 ring-blue-50 border-blue-200 text-blue-600"
                    )}
                  >
                    <span className={cn("text-base font-black", isSelected ? "text-white" : "text-carbon-900")}>
                      {day.getDate()}
                    </span>
                    {menu && !isSelected && (
                      <div className="absolute bottom-4 w-1.5 h-1.5 rounded-full bg-sage-500 shadow-sm" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* INSPECTOR PANEL */}
          <div className="lg:sticky lg:top-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {selectedMenu ? (
                <motion.div
                  key={selectedMenu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  <Card className="p-10 rounded-[3rem] border-2 border-carbon-900 shadow-soft-2xl bg-white space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                      <UtensilsCrossed className="w-40 h-40 text-carbon-900" />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-carbon-900 text-white flex items-center justify-center shadow-lg shadow-carbon-200">
                        <CalendarIcon className="w-7 h-7" />
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-1">Precio Base</p>
                        <p className="text-2xl font-black text-carbon-900 tracking-tight">
                          ${selectedMenu.basePrice.toLocaleString("es-CO")}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-3xl font-black text-carbon-900 capitalize tracking-tighter leading-tight mb-3">
                        {new Date(selectedMenu.createdAt).toLocaleDateString("es-ES", { weekday: 'long', day: 'numeric', month: 'long' })}
                      </h3>
                      <div className="h-1.5 w-16 bg-sage-500 rounded-full" />
                    </div>

                    <div className="space-y-6 relative z-10">
                      <div className="grid grid-cols-1 gap-5">
                        {selectedMenu.soupOptions.length > 0 && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-100">
                              <UtensilsCrossed className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-1">Sopas</p>
                              <p className="text-sm font-bold text-carbon-800 leading-tight">{selectedMenu.soupOptions.map(s => s.name).join(" o ")}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedMenu.principleOptions.length > 0 && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-100">
                              <Salad className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-1">Principios</p>
                              <p className="text-sm font-bold text-carbon-800 leading-tight">{selectedMenu.principleOptions.map(p => p.name).join(" o ")}</p>
                            </div>
                          </div>
                        )}

                        {selectedMenu.drinkOptions.length > 0 && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
                              <CupSoda className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-carbon-400 uppercase tracking-widest mb-1">Bebidas</p>
                              <p className="text-sm font-bold text-carbon-800 leading-tight">{selectedMenu.drinkOptions.map(d => d.name).join(" o ")}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-rose-50/50 rounded-[2rem] border-2 border-rose-100/50">
                        <div className="flex items-center gap-2 mb-4">
                          <Beef className="w-5 h-5 text-rose-600" />
                          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Proteínas Disponibles ({selectedMenu.proteinOptions.length})</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedMenu.proteinOptions.map(p => (
                            <span key={p.id} className="px-3 py-1.5 bg-white text-[11px] font-bold text-carbon-800 rounded-xl border border-rose-100 shadow-soft-xs">
                              {p.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="primary" 
                      onClick={() => navigate(ROUTES.DAILY_MENU_SETUP, { state: { date: selectedMenu.createdAt.split('T')[0] } })}
                      className="w-full h-16 rounded-[1.5rem] font-black bg-carbon-900 hover:bg-carbon-800 text-white shadow-xl transition-all active:scale-95 group"
                    >
                      <span className="flex-1 text-center">Editar este Menú</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border-2 border-dashed border-carbon-100 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center h-[600px] shadow-inner"
                >
                  <div className="w-24 h-24 bg-carbon-50 rounded-full flex items-center justify-center mb-8">
                    <Sparkles className="w-12 h-12 text-carbon-200" />
                  </div>
                  <h3 className="text-2xl font-bold text-carbon-400 tracking-tight">Selecciona un día</h3>
                  <p className="text-sm text-carbon-300 mt-3 max-w-[240px] leading-relaxed">
                    Toca cualquier día marcado en el calendario para inspeccionar su configuración.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}