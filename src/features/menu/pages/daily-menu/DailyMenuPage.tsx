import { useState } from "react";
import { Card, Button } from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { DailyMenuConfigForm } from "./DailyMenuConfigForm";
import { useDailyMenuToday, useDailyMenuByDate } from "@/features/menu/hooks/useDailyMenu";
import { useAuth } from "@/hooks";
import { RoleName } from "@/types";
import { Calendar, RefreshCw, UtensilsCrossed, Edit2, ArrowLeft, Beef, Salad, CupSoda, IceCream, PlusCircle, Settings2, type LucideIcon } from "lucide-react";
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
      <SidebarLayout hideTitle fullWidth>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="mb-8">
            <Skeleton variant="text" width={280} height={36} className="mb-2" />
            <Skeleton variant="text" width={400} height={20} />
          </div>
          <LoadingState />
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout hideTitle fullWidth>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-center">
          <header className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-sage-600">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operación Diaria</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Menú del Día</h1>
          </header>
          <div className="flex items-center justify-center min-h-[50vh]">
            <ErrorState onRetry={() => refetch()} />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <UtensilsCrossed className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Operación Diaria</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">Menú del Día</h1>
            <p className="text-lg text-carbon-500 font-medium">Gestiona el "Corrientazo" y las ofertas diarias de tu restaurante.</p>
          </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-smooth-md border border-sage-100 ring-4 ring-sage-50/50">
            <div className="flex items-center gap-2 px-3 py-2 bg-sage-50 rounded-xl text-sage-700">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fecha</span>
            </div>
            <input 
              type="date" 
              value={selectedDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setIsEditing(false);
              }}
              className="bg-transparent border-none text-carbon-900 font-bold text-sm focus:ring-0 cursor-pointer pr-4"
            />
          </div>

          {!isEditing && isAdmin && hasOptions && (
            <Button
              size="lg"
              variant="primary"
              onClick={() => setIsEditing(true)}
              className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold bg-carbon-900 hover:bg-carbon-800"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Editar Menú
            </Button>
          )}

          {isEditing && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="rounded-2xl h-14 px-8 border-sage-200 text-sage-700 hover:bg-sage-50 transition-all font-bold"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
          )}
        </div>
      </header>

      {isEditing ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
              {/* Informational Banner */}
              <div className="flex items-center justify-between p-4 bg-sage-50 rounded-2xl border border-sage-200 shadow-sm mb-6">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-white rounded-xl border border-sage-100 shadow-sm">
                    <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest block mb-0.5">Margen Base</span>
                    <span className="font-bold text-lg text-sage-700">${dailyMenu?.basePrice?.toLocaleString("es-CO")}</span>
                  </div>
                  <div className="hidden sm:block text-sm text-carbon-500 font-medium italic">
                    + Precio individual por cada proteína seleccionada
                  </div>
                </div>
                <div className="flex items-center gap-2 text-carbon-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-semibold capitalize">{formattedDate}</span>
                </div>
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
            <Card className="flex flex-col items-center justify-center min-h-[500px] text-center border-dashed border-2 border-sage-200 bg-sage-50/30 rounded-3xl">
              <div className="w-24 h-24 bg-white rounded-full shadow-soft-md flex items-center justify-center mb-6">
                <UtensilsCrossed className="w-10 h-10 text-sage-400" />
              </div>
              <h2 className="text-3xl font-bold text-carbon-900 mb-3 tracking-tight">Aún no hay menú para hoy</h2>
              <p className="text-carbon-500 mb-8 max-w-md text-lg font-medium leading-relaxed">
                Configura las proteínas, sopas, principios y establece el precio base para que tu equipo de meseros pueda empezar a tomar pedidos.
              </p>
              <Button size="lg" variant="primary" onClick={() => setIsEditing(true)} className="px-8 py-6 text-lg rounded-2xl shadow-soft-lg hover:shadow-soft-xl hover:-translate-y-1 transition-all bg-carbon-900 hover:bg-carbon-800">
                <PlusCircle className="w-6 h-6 mr-2" />
                Configurar Menú del Día
              </Button>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  </SidebarLayout>
);
}
        