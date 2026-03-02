import { useState } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useDailyMenuHistory } from "../../hooks/useDailyMenu";
import { Card, Button } from "@/components";
import { ROUTES } from "@/app/routes";
import { Calendar, History, ArrowRight, Beef, UtensilsCrossed, Salad } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function DailyMenuHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDailyMenuHistory(page, 10);

  if (isLoading) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          <div className="space-y-2 mb-12">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full rounded-[2rem]" />)}
        </div>
      </SidebarLayout>
    );
  }

  const menus = data?.data || [];
  const meta = data?.meta;

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro Histórico</span>
          </div>
          <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Menús Anteriores</h1>
          <p className="text-lg text-carbon-500 font-medium">Consulta las configuraciones del menú de días pasados.</p>
        </header>

        {menus.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed bg-blue-50/30 rounded-[3rem]">
            <Calendar className="w-16 h-16 text-blue-300 mb-4" />
            <h3 className="text-xl font-bold text-carbon-900">No hay menús registrados</h3>
            <p className="text-carbon-500 mt-2">Aún no se ha guardado ningún menú en el historial.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {menus.map((menu, idx) => {
              const menuDate = new Date(menu.createdAt);
              const formattedDate = menuDate.toLocaleDateString("es-ES", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              const proteins = menu.proteinOptions || [];
              const proteinCount = proteins.length;
              const soups = menu.soupOptions || [];
              const principles = menu.principleOptions || [];
              
              // Extract YYYY-MM-DD for the navigation state
              const dateString = menu.createdAt.split('T')[0];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={menu.id}
                >
                  <Card className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:shadow-smooth-lg transition-all rounded-[2rem] border-2 border-carbon-50 bg-white group">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <h3 className="font-black text-xl text-carbon-900 capitalize tracking-tight">{formattedDate}</h3>
                          <p className="text-xs font-bold text-sage-600 uppercase tracking-widest mt-1">Precio Base: ${menu.basePrice.toLocaleString("es-CO")}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-carbon-50">
                          {soups.length > 0 && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <UtensilsCrossed className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-tighter">Sopas</p>
                                <p className="text-sm font-bold text-carbon-700 truncate">{soups.map(s => s.name).join(" o ")}</p>
                              </div>
                            </div>
                          )}
                          {principles.length > 0 && (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                <Salad className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black text-carbon-400 uppercase tracking-tighter">Principios</p>
                                <p className="text-sm font-bold text-carbon-700 truncate">{principles.map(p => p.name).join(" o ")}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 bg-rose-50/50 p-3 rounded-2xl border border-rose-100/50">
                          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                            <Beef className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">Proteínas Disponibles ({proteinCount})</p>
                            <p className="text-[11px] font-bold text-carbon-800 truncate">
                              {proteins.slice(0, 4).map(p => p.name).join(", ")}{proteinCount > 4 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2">
                      <Button 
                        variant="primary" 
                        onClick={() => navigate(ROUTES.DAILY_MENU_SETUP, { state: { date: dateString } })}
                        className="flex-1 whitespace-nowrap rounded-2xl font-bold h-14 px-8 shadow-soft-lg bg-carbon-900 hover:bg-carbon-800 transition-all active:scale-95"
                      >
                        Ver Detalle <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}

            {meta && meta.totalPages > 1 && (
              <div className="pt-8">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  totalItems={meta.total}
                  itemsPerPage={meta.limit}
                  onPageChange={setPage}
                  onItemsPerPageChange={() => {}}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
