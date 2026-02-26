import { useState } from "react";
import { useRestaurants, useCreateRestaurant, useDeleteRestaurant } from "../hooks/useRestaurants";
import { RestaurantList } from "../components/RestaurantList";
import { RestaurantForm } from "../components/RestaurantForm";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { StatCard } from "@/components/ui/StatCard/StatCard";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { Pagination } from "@/components/ui/Pagination/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog/ConfirmDialog";
import type { RestaurantFormValues } from "../schemas/restaurant.schema";
import { Plus, Building2, MapPin, Phone, Globe, Trash2, Edit } from "lucide-react";
import { SidebarLayout } from "@/layouts/SidebarLayout";

/**
 * SuperAdmin page to manage all restaurant tenants.

import { RestaurantStatus } from "@/types";

export function RestaurantsPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const { data: response, isLoading } = useRestaurants({ page, limit: 10 });
  const createMutation = useCreateRestaurant();
  const deleteMutation = useDeleteRestaurant();

  const handleCreate = async (values: RestaurantFormValues) => {
    await createMutation.mutateAsync({
      name: values.name,
      address: values.address,
      phone: values.phone,
      nit: values.nit,
      currency: values.currency,
      timezone: values.timezone,
      adminUser: {
        firstName: values.adminFirstName,
        lastName: values.adminLastName,
        email: values.adminEmail,
        password: values.adminPassword,
      },
    });
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const restaurants = response?.data || [];
  const meta = response?.meta;

  // Stats calculation (real stats would come from a specific endpoint, but let's derive from current page for demo or use mock)
  const stats = [
    { label: "Total Restaurantes", value: meta?.total || 0, icon: Building2, color: "text-carbon-600" },
    { label: "Activos", value: restaurants.filter(r => r.status === RestaurantStatus.ACTIVE).length, icon: CheckCircle2, color: "text-sage-600" },
    { label: "En Prueba", value: restaurants.filter(r => r.status === RestaurantStatus.TRIAL).length, icon: Clock, color: "text-amber-600" },
    { label: "Suspendidos", value: restaurants.filter(r => r.status === RestaurantStatus.SUSPENDED).length, icon: AlertCircle, color: "text-red-600" },
  ];

  return (
    <SidebarLayout hideHeader fullWidth>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24">
      {/* ============ PAGE HEADER =============== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sage-600">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administración SaaS</span>
          </div>
          <h1 className="text-3xl font-bold text-carbon-900 tracking-tight">Gestión de Restaurantes</h1>
          <p className="text-sm text-carbon-500 font-medium">Panel de control global para la red de comercios asociados.</p>
        </div>
        
        <Button 
          size="lg" 
          variant="primary" 
          onClick={() => setIsModalOpen(true)} 
          className="rounded-2xl h-14 px-8 shadow-soft-lg transition-all active:scale-95 font-bold"
        >
          <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
          Nuevo Restaurante
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={<stat.icon className={`w-5 h-5 ${stat.color}`} />}
          />
        ))}
      </div>

      <Card variant="elevated" className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-carbon-500">Cargando restaurantes...</div>
        ) : restaurants.length > 0 ? (
          <>
            <RestaurantList
              restaurants={restaurants}
              onEdit={(_r) => {}}
              onDelete={setDeleteId}
            />
            {meta && meta.totalPages > 1 && (
              <div className="p-4 border-t border-carbon-50">
                <Pagination
                  currentPage={page}
                  totalPages={meta.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No hay restaurantes"
            description="Comienza registrando tu primer cliente en la plataforma."
            icon={<Building2 className="w-12 h-12 text-carbon-200" />}
            action={
              <Button onClick={() => setIsModalOpen(true)}>
                Registrar Primer Restaurante
              </Button>
            }
          />
        )}
      </Card>

      {/* Modal de Creación */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nuevo Restaurante"
        size="lg"
      >
        <div className="p-6">
          <RestaurantForm onSubmit={handleCreate} isLoading={createMutation.isPending} />
        </div>
      </BaseModal>

      {/* Diálogo de Confirmación para eliminar */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar restaurante?"
        description="Esta acción marcará el restaurante como eliminado. Los usuarios de este restaurante no podrán acceder al sistema."
        confirmLabel="Eliminar"
        variant="danger"
        isLoading={deleteMutation.isPending}
        />
      </div>
    </SidebarLayout>
  );
};
