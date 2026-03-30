import { Button, Card, EmptyState, Skeleton, Tooltip } from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Search, User, Phone, MapPin, Ticket, Plus, Edit2, History, Trash2, ShoppingBag } from "lucide-react";
import { useState, useMemo } from "react";
import { SellTicketBookModal } from "../components/SellTicketBookModal";
import { CustomerFormModal } from "../components/CustomerFormModal";
import { CustomerDetailDrawer } from "../components/CustomerDetailDrawer";
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useCustomer } from "../hooks";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/**
 * CustomersPage - Full Management Edition
 * 
 * Provides absolute control over the customer database:
 * - Create / Edit / Delete
 * - View detailed history (Orders & Ticket Books)
 * - Sell ticket books directly
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
    limit: 50 
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
    setEditingCustomer(customer); // Use this to store name/id for the modal
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

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este cliente?")) {
      await deleteCustomer.mutateAsync(id);
    }
  };

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Módulo Comercial</span>
            </div>
            <h1 className="text-5xl font-black text-carbon-900 tracking-tighter leading-none italic uppercase">
              Clientes <span className="text-primary-500">&</span> Lealtad
            </h1>
            <p className="text-lg text-carbon-500 font-medium max-w-xl">
              Gestiona tu base de datos, historial de consumos y saldos de tiqueteras prepago.
            </p>
          </div>

          <Button 
            size="lg" 
            onClick={handleCreateNew}
            className="rounded-[1.5rem] px-8 h-14 bg-carbon-900 hover:bg-carbon-800 text-white font-black shadow-xl shadow-carbon-200 uppercase tracking-widest text-xs"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </Button>
        </header>

        {/* Search & Filters */}
        <div className="relative group max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-carbon-300 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-6 bg-white border-2 border-sage-100 rounded-[2rem] text-carbon-900 placeholder-carbon-300 focus:ring-0 focus:border-primary-500 transition-all shadow-smooth-sm group-hover:shadow-smooth-md text-xl font-bold"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Customers Grid */}
        {loadingList ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} variant="card" height={280} className="rounded-[2.5rem]" />)}
          </div>
        ) : customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customers.map((customer: any) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className="p-8 rounded-[2.5rem] border-2 border-white hover:border-primary-100 transition-all duration-500 hover:shadow-soft-2xl group relative overflow-hidden bg-white h-full flex flex-col">
                  {/* Visual Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/30 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-primary-50/50 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-16 h-16 rounded-3xl bg-carbon-900 flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform duration-500">
                      <User className="w-8 h-8" />
                    </div>
                    <div className="flex gap-2">
                      <Tooltip content="Editar Datos">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="w-10 h-10 rounded-xl border-2 border-sage-50 text-carbon-400 hover:text-primary-600 hover:border-primary-100 hover:bg-primary-50 transition-all active:scale-90 flex items-center justify-center bg-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Eliminar">
                        <button 
                          onClick={() => handleDelete(customer.id)}
                          className="w-10 h-10 rounded-xl border-2 border-sage-50 text-carbon-400 hover:text-error-600 hover:border-error-100 hover:bg-error-50 transition-all active:scale-90 flex items-center justify-center bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-4 flex-1 relative z-10">
                    <div>
                      <h3 className="text-2xl font-black text-carbon-900 leading-tight tracking-tight">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="px-2 py-0.5 rounded-md bg-sage-100 text-sage-600 text-[9px] font-black uppercase tracking-widest">
                          ID: {customer.id.slice(-6).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-carbon-600 font-bold">
                        <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center text-sage-500">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-base">{customer.phone}</span>
                      </div>

                      {customer.address1 && (
                        <div className="flex items-start gap-3 text-carbon-400 font-medium">
                          <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center text-sage-500 shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="text-sm leading-tight pt-1">{customer.address1}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-8 grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-sage-50/50 p-3 rounded-2xl border border-sage-100/50">
                      <p className="text-[9px] font-black text-carbon-400 uppercase tracking-widest mb-1">Pedidos</p>
                      <div className="flex items-center gap-2 text-carbon-900 font-black">
                        <ShoppingBag className="w-3.5 h-3.5 text-primary-500" />
                        <span>{customer._count?.orders || 0}</span>
                      </div>
                    </div>
                    <div className="bg-warning-50/30 p-3 rounded-2xl border border-warning-100/50">
                      <p className="text-[9px] font-black text-carbon-400 uppercase tracking-widest mb-1">Tiqueteras</p>
                      <div className="flex items-center gap-2 text-carbon-900 font-black">
                        <Ticket className="w-3.5 h-3.5 text-warning-500" />
                        <span>{customer._count?.ticketBooks || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Footer */}
                  <div className="mt-6 pt-6 border-t border-sage-50 flex gap-3 relative z-10">
                    <Button 
                      variant="primary" 
                      className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest bg-carbon-900"
                      onClick={() => handleViewDetail(customer.id)}
                    >
                      <History className="w-4 h-4 mr-2" />
                      Ver Historial
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-2xl h-12 font-black text-[10px] uppercase tracking-widest border-2 border-warning-200 text-warning-700 hover:bg-warning-50"
                      onClick={() => handleSellTicket(customer)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tiquetera
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<User size={48} />}
            title="Tu base de datos está vacía"
            description="Comienza registrando a tu primer cliente para llevar un control de sus consumos."
            action={<Button onClick={handleCreateNew}>Registrar Cliente</Button>}
          />
        )}

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
