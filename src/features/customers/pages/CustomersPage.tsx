import { Button, Card, EmptyState, Skeleton, Tooltip, FilterBar, FilterSearch, ActiveFilterChips } from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Search, User, Users, Phone, MapPin, Ticket, Plus, Edit2, History, Trash2, ShoppingBag, ChevronRight, Mail } from "lucide-react";
import { useState, useMemo } from "react";
import { SellTicketBookModal } from "../components/SellTicketBookModal";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { CustomerDetailDrawer } from "../components/CustomerDetailDrawer";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useCustomer } from "../hooks";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * CustomersPage - Normalized List Edition
 * 
 * Standardized list view for customer management.
 * Follows the functional design of orders and menu modules.
 */
export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  // --- DATA HOOKS ---
  const { data: customersResponse, isLoading: loadingList } = useCustomers({ 
    query: searchTerm, 
    limit: 100 
  });
  
  const { data: detailedCustomerResponse, isLoading: loadingDetail } = useCustomer(selectedCustomerId);
  
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers = customersResponse?.data || [];

  // --- HANDLERS ---
  const handleCreateNew = () => {
    setEditingCustomer(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setIsFormModalOpen(true);
  };

  const handleViewDetail = (id: string) => {
    setSelectedCustomerId(id);
    setIsDetailDrawerOpen(true);
  };

  const handleSellTicket = (customer: any) => {
    setEditingCustomer(customer);
    setIsSellModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingCustomer) {
      await updateCustomer.mutateAsync({ id: editingCustomer.id, data });
    } else {
      await createCustomer.mutateAsync(data);
    }
    setIsFormModalOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      deleteCustomer.mutate(id);
    }
  };

  const activeChips = [
    ...(searchTerm !== "" ? [{ key: "search", label: "Búsqueda", value: searchTerm }] : []),
  ];

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sage-600">
              <Users className="w-5 h-5" />
              <span className="text-[10px] font-semibold tracking-[0.2em]">Administración</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight">
              Directorio de Clientes
            </h1>
            <p className="text-lg text-carbon-500 font-medium">
              Gestiona perfiles, historial de consumos y tiqueteras.
            </p>
          </div>

          <Button 
            size="lg" 
            onClick={handleCreateNew}
            className="rounded-2xl px-8 h-14 bg-carbon-900 hover:bg-carbon-800 text-white font-bold shadow-soft-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Nuevo Cliente
          </Button>
        </header>

        {/* Unified Filter System */}
        <div className="space-y-6">
          <FilterBar>
            <div className="flex-1 max-w-md">
              <FilterSearch
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar por nombre o teléfono..."
                onClear={() => setSearchTerm("")}
              />
            </div>
          </FilterBar>

          <ActiveFilterChips
            chips={activeChips}
            resultCount={customers.length}
            resultLabel="clientes"
            onClearFilter={() => setSearchTerm("")}
            onClearAll={() => setSearchTerm("")}
          />
        </div>

        {/* Main List */}
        <Card padding="none" className="overflow-hidden border-2 border-sage-100 rounded-[2rem] shadow-soft-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-sage-50/50 border-b border-sage-100">
                  <th className="px-6 py-4 text-left text-[10px] font-black text-carbon-400 uppercase tracking-widest">Cliente</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-carbon-400 uppercase tracking-widest hidden md:table-cell">Contacto</th>
                  <th className="px-6 py-4 text-center text-[10px] font-black text-carbon-400 uppercase tracking-widest hidden sm:table-cell">Actividad</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-carbon-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage-50">
                {loadingList ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton variant="text" width={150} /></td>
                      <td className="px-6 py-4 hidden md:table-cell"><Skeleton variant="text" width={100} /></td>
                      <td className="px-6 py-4 hidden sm:table-cell"><div className="flex justify-center"><Skeleton variant="text" width={60} /></div></td>
                      <td className="px-6 py-4 text-right"><Skeleton variant="text" width={80} className="ml-auto" /></td>
                    </tr>
                  ))
                ) : customers.length > 0 ? (
                  customers.map((customer: any) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-sage-50/30 transition-colors cursor-pointer group"
                      onClick={() => handleViewDetail(customer.id)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-carbon-100 text-carbon-600 flex items-center justify-center font-black text-xs shadow-inner shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                            {customer.firstName.charAt(0)}{customer.lastName?.charAt(0) || ""}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-carbon-900 truncate">
                              {customer.firstName} {customer.lastName}
                            </p>
                            {customer.address1 && (
                              <p className="text-[10px] text-carbon-400 truncate flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {customer.address1}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-5 hidden md:table-cell">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-carbon-700 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-carbon-300" />
                            {customer.phone}
                          </p>
                          {customer.email && (
                            <p className="text-[10px] text-carbon-400 font-medium truncate max-w-[180px]">
                              {customer.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-5 hidden sm:table-cell text-center border-x border-sage-50/50">
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-black text-carbon-900">{customer._count?.orders || 0}</span>
                            <span className="text-[8px] font-bold text-carbon-400 uppercase tracking-tighter">pedidos</span>
                          </div>
                          <div className="w-px h-6 bg-sage-100" />
                          <div className="flex flex-col items-center">
                            <span className={cn(
                              "text-xs font-black",
                              (customer._count?.ticketBooks || 0) > 0 ? "text-warning-600" : "text-carbon-900"
                            )}>
                              {customer._count?.ticketBooks || 0}
                            </span>
                            <span className="text-[8px] font-bold text-carbon-400 uppercase tracking-tighter">tiquetera</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip content="Editar">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(customer); }}
                              className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-soft-sm border border-transparent hover:border-sage-200 flex items-center justify-center text-carbon-400 hover:text-primary-600 transition-all active:scale-90"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          
                          <Tooltip content="Tiquetera">
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSellTicket(customer); }}
                              className="w-9 h-9 rounded-lg hover:bg-white hover:shadow-soft-sm border border-transparent hover:border-warning-200 flex items-center justify-center text-carbon-400 hover:text-warning-600 transition-all active:scale-90"
                            >
                              <Ticket className="w-4 h-4" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Eliminar">
                            <button 
                              onClick={(e) => handleDelete(e, customer.id)}
                              className="w-9 h-9 rounded-lg hover:bg-error-50 border border-transparent hover:border-error-100 flex items-center justify-center text-carbon-400 hover:text-error-600 transition-all active:scale-90"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>

                          <ChevronRight className="w-5 h-5 text-sage-200 ml-2 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState
                        icon={<User size={48} />}
                        title="Sin resultados"
                        description={searchTerm ? `No encontramos clientes para "${searchTerm}"` : "Aún no tienes clientes registrados."}
                        action={!searchTerm ? <Button onClick={handleCreateNew}>Nuevo Cliente</Button> : undefined}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* --- MODALS & DRAWERS --- */}
        
        {/* Form Modal (Create/Edit) */}
        <CustomerFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          isPending={createCustomer.isPending || updateCustomer.isPending}
          customer={editingCustomer}
        />

        {/* Sell Ticket Book Modal */}
        {editingCustomer && (
          <SellTicketBookModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            customerId={editingCustomer.id}
            customerName={`${editingCustomer.firstName} ${editingCustomer.lastName || ""}`}
          />
        )}

        {/* History / Detail Drawer */}
        <CustomerDetailDrawer
          isOpen={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedCustomerId(null);
          }}
          customer={detailedCustomerResponse?.data ? (detailedCustomerResponse.data as any) : null}
          isLoading={loadingDetail}
        />

      </div>
    </SidebarLayout>
  );
}
