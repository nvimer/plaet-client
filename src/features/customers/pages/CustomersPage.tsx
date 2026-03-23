import { Button, Card, EmptyState, Skeleton } from "@/components";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { customerApi } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Search, User, Phone, MapPin, Ticket, Plus } from "lucide-react";
import { useState } from "react";
import { SellTicketBookModal } from "../components/SellTicketBookModal";

/**
 * CustomersPage Component
 * 
 * List and manage restaurant customers. 
 * Allows selling ticket books directly from the list.
 */
export function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);

  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: () => customerApi.searchCustomers({ query: searchTerm, limit: 50 }),
  });

  const handleSellClick = (id: string, name: string) => {
    setSelectedCustomer({ id, name });
    setShowSellModal(true);
  };

  return (
    <SidebarLayout hideTitle fullWidth>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-600">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Gestión de Clientes</span>
            </div>
            <h1 className="text-4xl font-bold text-carbon-900 tracking-tight leading-tight text-balance">Directorio de Clientes</h1>
            <p className="text-lg text-carbon-500 font-medium">Administra la base de datos de tus clientes y sus tiqueteras.</p>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-carbon-400 group-focus-within:text-carbon-900 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-5 bg-white border-2 border-sage-100 rounded-3xl text-carbon-900 placeholder-carbon-400 focus:ring-0 focus:border-carbon-900 transition-all shadow-sm group-hover:shadow-md text-lg font-medium"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <Skeleton key={i} variant="card" height={200} />)}
          </div>
        ) : customers?.data && customers.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.data.map((customer) => (
              <Card key={customer.id} className="p-6 rounded-3xl border-2 border-white hover:border-primary-200 transition-all hover:shadow-soft-xl group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <User className="w-6 h-6" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl border-sage-200 text-carbon-600 hover:bg-carbon-900 hover:text-white hover:border-carbon-900 font-black text-[10px] px-3 py-1.5 h-auto uppercase tracking-wider"
                    onClick={() => handleSellClick(customer.id, `${customer.firstName} ${customer.lastName}`)}
                  >
                    <Plus className="w-3 h-3 mr-1.5" />
                    Tiquetera
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-carbon-900 leading-tight">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-carbon-500">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-bold">{customer.phone}</span>
                  </div>

                  {customer.address1 && (
                    <div className="flex items-start gap-2 text-carbon-400">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="text-xs font-medium leading-tight">{customer.address1}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-sage-50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sage-600 bg-sage-50 px-3 py-1.5 rounded-xl">
                    <Ticket className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase">Ver Historial</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<User />}
            title="No se encontraron clientes"
            description="Intenta buscar con otro nombre o número de teléfono."
          />
        )}

        {/* Sell Modal */}
        {selectedCustomer && (
          <SellTicketBookModal
            isOpen={showSellModal}
            onClose={() => setShowSellModal(false)}
            customerId={selectedCustomer.id}
            customerName={selectedCustomer.name}
          />
        )}
      </div>
    </SidebarLayout>
  );
}
