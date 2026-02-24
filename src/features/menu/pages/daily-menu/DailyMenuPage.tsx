import { useState } from "react";
import { Card, Button } from "@/components";
import { DailyMenuConfigForm } from "./DailyMenuConfigForm";
import { useDailyMenuToday, useDailyMenuByDate } from "@/features/menu/hooks/useDailyMenu";
import { useAuth } from "@/hooks";
import { RoleName } from "@/types";
import { Calendar, RefreshCw, UtensilsCrossed, Edit2, ArrowLeft, Beef, Salad, CupSoda, IceCream, PlusCircle, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton/Skeleton";
import { toast } from "sonner";
import { motion } from "framer-motion";

function LoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton variant="card" height={400} />
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card variant="elevated" padding="lg" className="max-w-md w-full border border-sage-200 shadow-sm rounded-2xl mx-auto">
      <div className="text-center">
        <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-rose-500">
          <UtensilsCrossed className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-semibold text-carbon-900 mb-2">Error al cargar el menú</h2>
        <p className="text-carbon-500 text-sm mb-6">No se pudo cargar la información del menú del día.</p>
        <Button variant="primary" size="lg" onClick={onRetry} fullWidth className="min-h-[44px]">
          <RefreshCw className="w-5 h-5 mr-2" />
          Reintentar
        </Button>
      </div>
    </Card>
  );
}

function HelpCard() {
  return (
    <Card variant="bordered" className="p-6 rounded-2xl bg-sage-50/50">
      <h3 className="font-semibold text-carbon-900 mb-2">Cómo Configurar</h3>
      <ol className="text-sm text-carbon-500 space-y-2 list-decimal list-inside">
        <li>Elige hasta 2 opciones para Sopas, Principios, Ensaladas y Bebidas.</li>
        <li>Selecciona todas las proteínas que estarán disponibles hoy.</li>
        <li>El precio de venta se calcula: Margen Base + Precio de la Proteína.</li>
      </ol>
    </Card>
  );
}

/**
 * Visual Component to render a category of the menu
 */
function MenuCategoryGroup({ title, icon: Icon, items, colorClass }: { title: string; icon: LucideIcon; items?: {name: string}[]; colorClass: string }) {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="bg-white border border-carbon-100 rounded-2xl p-5 shadow-soft-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-carbon-800 text-lg">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-carbon-600 font-medium before:content-[''] before:w-1.5 before:h-1.5 before:bg-sage-300 before:rounded-full">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DailyMenuPage() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(r => 
    (typeof r === 'object' && 'name' in r ? r.name : r) === RoleName.ADMIN
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const todayMenu = useDailyMenuToday();
  const historicalMenu = useDailyMenuByDate(selectedDate || "");

  const dailyMenu = selectedDate ? historicalMenu.data : todayMenu.data;
  const isLoading = selectedDate ? historicalMenu.isLoading : todayMenu.isLoading;
  const error = selectedDate ? historicalMenu.error : todayMenu.error;
  const refetch = selectedDate ? historicalMenu.refetch : todayMenu.refetch;

  const displayDate = selectedDate ? new Date(selectedDate + "T12:00:00") : new Date();

  const formattedDate = displayDate.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSuccess = () => {
    toast.success("Menú del día actualizado correctamente");
    setIsEditing(false); // Switch back to view mode
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasOptions = 
    (dailyMenu?.soupOptions?.length || 0) > 0 ||
    (dailyMenu?.principleOptions?.length || 0) > 0 ||
    (dailyMenu?.saladOptions?.length || 0) > 0 ||
    (dailyMenu?.proteinOptions?.length || 0) > 0 ||
    (dailyMenu?.drinkOptions?.length || 0) > 0;

  if (isLoading) {
    return (
      <>
        <div className="mb-8">
          <Skeleton variant="text" width={280} height={36} className="mb-2" />
          <Skeleton variant="text" width={400} height={20} />
        </div>
        <LoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Menú Diario
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[50vh]">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-carbon-900 tracking-tight">
            Menú Diario
          </h1>
          <p className="text-sm text-carbon-500 mt-1">
            Visualiza y administra las opciones de almuerzo para tu equipo.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && !isEditing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-sage-100 rounded-xl shadow-sm">
              <Calendar className="w-4 h-4 text-sage-600" />
              <span className="text-xs font-bold text-carbon-600 uppercase">
                Ver Fecha:
              </span>
              <input
                type="date"
                value={selectedDate || new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setIsEditing(false); // Cancel edit mode if date changes
                }}
                className="bg-transparent border-none text-sm font-black text-carbon-900 focus:ring-0 cursor-pointer p-0 outline-none"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-carbon-600 bg-sage-50 px-4 py-2 rounded-xl border border-sage-200 font-medium">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>
      </div>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-carbon-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Edit2 className="w-4 h-4" />
              </div>
              Modo Edición
            </h2>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-carbon-500 hover:text-carbon-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a la vista
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DailyMenuConfigForm
                key={selectedDate || "today"}
                initialData={dailyMenu}
                onSuccess={handleSuccess}
                selectedDate={selectedDate}
              />
            </div>
            <div className="space-y-4">
              <HelpCard />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {hasOptions ? (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-sage-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-sage-50 rounded-lg border border-sage-200">
                    <span className="text-xs text-carbon-500 block mb-0.5">Margen Base</span>
                    <span className="font-black text-lg text-sage-700">${dailyMenu?.basePrice?.toLocaleString()}</span>
                  </div>
                  <div className="hidden sm:block text-sm text-carbon-500">
                    + Precio individual por proteína
                  </div>
                </div>
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Menú
                </Button>
              </div>

              {/* Visual Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MenuCategoryGroup 
                  title="Proteínas" 
                  icon={Beef} 
                  items={dailyMenu.proteinOptions} 
                  colorClass="bg-rose-100 text-rose-600" 
                />
                <MenuCategoryGroup 
                  title="Sopas" 
                  icon={UtensilsCrossed} 
                  items={dailyMenu.soupOptions} 
                  colorClass="bg-amber-100 text-amber-600" 
                />
                <MenuCategoryGroup 
                  title="Principios" 
                  icon={Salad} 
                  items={dailyMenu.principleOptions} 
                  colorClass="bg-emerald-100 text-emerald-600" 
                />
                <MenuCategoryGroup 
                  title="Ensaladas" 
                  icon={Salad} 
                  items={dailyMenu.saladOptions} 
                  colorClass="bg-lime-100 text-lime-600" 
                />
                <MenuCategoryGroup 
                  title="Bebidas" 
                  icon={CupSoda} 
                  items={dailyMenu.drinkOptions} 
                  colorClass="bg-blue-100 text-blue-600" 
                />
                <MenuCategoryGroup 
                  title="Extras" 
                  icon={PlusCircle} 
                  items={dailyMenu.extraOptions} 
                  colorClass="bg-purple-100 text-purple-600" 
                />
                <MenuCategoryGroup 
                  title="Postres" 
                  icon={IceCream} 
                  items={dailyMenu.dessertOptions} 
                  colorClass="bg-pink-100 text-pink-600" 
                />
              </div>
            </div>
          ) : (
            /* Empty State */
            <Card className="flex flex-col items-center justify-center min-h-[500px] text-center border-dashed border-2 border-sage-200 bg-sage-50/30">
              <div className="w-24 h-24 bg-white rounded-full shadow-soft-md flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-10 h-10 text-sage-400" />
              </div>
              <h2 className="text-3xl font-black text-carbon-900 mb-3 tracking-tight">Aún no hay menú para hoy</h2>
              <p className="text-carbon-500 mb-8 max-w-md text-lg font-light leading-relaxed">
                Configura las proteínas, sopas, principios y establece el precio base para que tu equipo de meseros pueda empezar a tomar pedidos.
              </p>
              <Button size="lg" variant="primary" onClick={() => setIsEditing(true)} className="px-8 py-6 text-lg rounded-2xl shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-1 transition-all">
                <PlusCircle className="w-6 h-6 mr-2" />
                Configurar Menú del Día
              </Button>
            </Card>
          )}
        </motion.div>
      )}
    </>
  );
}