import { useState } from "react";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { useDailyMenuHistory } from "../../hooks/useDailyMenu";
import { Card, Button } from "@/components";
import { ROUTES } from "@/app/routes";
import { Calendar, History, ArrowRight } from "lucide-react";
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
          <Skeleton className="h-12 w-64 mb-8" />
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </SidebarLayout>
    );
  }

  const menus = data?.data || [];
  const meta = data?.meta;

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <History className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Registro Histórico</span>
          </div>
          <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Menús Anteriores</h1>
          <p className="text-lg text-carbon-500 font-medium">Consulta las configuraciones del menú de días pasados.</p>
        </header>

        {menus.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed bg-blue-50/30">
            <Calendar className="w-16 h-16 text-blue-300 mb-4" />
            <h3 className="text-xl font-bold text-carbon-900">No hay menús registrados</h3>
            <p className="text-carbon-500 mt-2">Aún no se ha guardado ningún menú en el historial.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {menus.map((menu, idx) => {
              const menuDate = new Date(menu.createdAt);
              const formattedDate = menuDate.toLocaleDateString("es-ES", {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              
              const proteinCount = menu.proteinOptions?.length || 0;
              const hasSoup = menu.soupOptions?.length > 0;
              const hasPrinciple = menu.principleOptions?.length > 0;
              
              // Extract YYYY-MM-DD for the navigation state
              const dateString = menu.createdAt.split('T')[0];

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={menu.id}
                >
                  <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-soft-lg transition-shadow rounded-2xl border border-carbon-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-carbon-900 capitalize">{formattedDate}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-sage-50 text-sage-700 text-[10px] font-black uppercase tracking-wider rounded-md border border-sage-100">
                            ${menu.basePrice.toLocaleString("es-CO")} Base
                          </span>
                          <span className="px-2 py-1 bg-carbon-50 text-carbon-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-carbon-100">
                            {proteinCount} Proteínas
                          </span>
                          {hasSoup && <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-amber-100">Sopa</span>}
                          {hasPrinciple && <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-100">Principio</span>}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(ROUTES.DAILY_MENU_SETUP, { state: { date: dateString } })}
                      className="whitespace-nowrap rounded-xl font-bold"
                    >
                      Ver Detalle <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
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
