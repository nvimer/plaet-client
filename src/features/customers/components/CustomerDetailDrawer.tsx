import { Button, Card, Skeleton, OrderStatusBadge, Badge } from "@/components";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, User, Phone, MapPin, Mail, 
  Ticket, ShoppingBag, Calendar, 
  ChevronRight, ArrowRightLeft, Clock
} from "lucide-react";
import type { Customer, Order, TicketBook } from "@/types";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatUtils";

interface CustomerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: (Customer & { orders: Order[], ticketBooks: TicketBook[] }) | null;
  isLoading: boolean;
}

export function CustomerDetailDrawer({
  isOpen,
  onClose,
  customer,
  isLoading
}: CustomerDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-carbon-900/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-sage-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-white border-b border-sage-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-carbon-900 tracking-tight leading-none uppercase italic">Detalle de Cliente</h2>
              <p className="text-xs text-carbon-400 font-bold mt-1 uppercase tracking-widest">Historial y Datos</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-sage-50 flex items-center justify-center text-carbon-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton variant="card" height={150} />
              <Skeleton variant="text" width={150} />
              <Skeleton variant="card" height={100} />
              <Skeleton variant="card" height={100} />
            </div>
          ) : customer ? (
            <>
              {/* Basic Info Card */}
              <Card className="p-6 rounded-[2rem] border-2 border-white shadow-soft-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Nombre Completo</span>
                      <p className="text-lg font-black text-carbon-900 leading-tight">
                        {customer.firstName} {customer.lastName}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Contacto</span>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-carbon-700 font-bold">
                          <Phone className="w-4 h-4 text-primary-500" />
                          <span>{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-2 text-carbon-500 font-medium">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm truncate">{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-carbon-400 uppercase tracking-widest">Ubicación / Entrega</span>
                      <div className="space-y-2">
                        {customer.address1 ? (
                          <div className="flex items-start gap-2 text-carbon-700 font-bold">
                            <MapPin className="w-4 h-4 mt-1 text-primary-500" />
                            <div className="flex flex-col">
                              <span>{customer.address1}</span>
                              {customer.address2 && <span className="text-xs text-carbon-400">{customer.address2}</span>}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-carbon-300 italic">No hay dirección registrada</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tiqueteras Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-warning-500" />
                    <h3 className="font-black text-carbon-900 uppercase tracking-wider italic">Tiqueteras Activas</h3>
                  </div>
                  <Badge variant="warning">{customer.ticketBooks.filter(t => t.status === 'active').length}</Badge>
                </div>

                <div className="space-y-3">
                  {customer.ticketBooks.length > 0 ? (
                    customer.ticketBooks.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex items-center justify-between",
                          ticket.status === 'active' ? "bg-white border-warning-100 shadow-soft-sm" : "bg-sage-50/50 border-sage-100 grayscale opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-warning-50 text-warning-600 flex items-center justify-center">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-carbon-900 leading-none">
                              {ticket.remainingPortions} / {ticket.totalPortions} Porciones
                            </p>
                            <p className="text-[10px] text-carbon-400 font-bold mt-1 uppercase">
                              Vence: {new Date(ticket.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-carbon-900">${Number(ticket.purchasePrice).toLocaleString()}</p>
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block",
                            ticket.status === 'active' ? "bg-success-100 text-success-700" : "bg-carbon-100 text-carbon-500"
                          )}>
                            {ticket.status === 'active' ? 'ACTIVA' : 'AGOTADA'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/50 border-2 border-dashed border-sage-200 rounded-2xl p-8 text-center">
                      <Ticket className="w-8 h-8 text-sage-300 mx-auto mb-2" />
                      <p className="text-sm text-sage-500 font-bold">El cliente no tiene tiqueteras</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Order History Section */}
              <section className="space-y-4 pb-10">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-500" />
                    <h3 className="font-black text-carbon-900 uppercase tracking-wider italic">Pedidos Recientes</h3>
                  </div>
                  <Badge variant="primary">{customer.orders.length}</Badge>
                </div>

                <div className="space-y-3">
                  {customer.orders.length > 0 ? (
                    customer.orders.map((order) => (
                      <div 
                        key={order.id}
                        className="bg-white p-4 rounded-2xl border-2 border-sage-50 hover:border-primary-100 transition-all shadow-soft-sm group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-carbon-900 text-white flex items-center justify-center text-xs font-black">
                              {order.type === 'DELIVERY' ? 'D' : 'R'}
                            </div>
                            <div>
                              <p className="text-xs font-black text-carbon-900 uppercase">#{order.id.slice(-4).toUpperCase()}</p>
                              <div className="flex items-center gap-1 text-[10px] text-carbon-400 font-bold">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <OrderStatusBadge status={order.status} size="sm" />
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-sage-50">
                          <p className="text-[10px] font-bold text-carbon-500">
                            {order.items?.length || 0} productos
                          </p>
                          <p className="text-sm font-black text-carbon-900">
                            {formatCurrency(Number(order.totalAmount))}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-sage-400 italic text-center py-4 underline underline-offset-4 decoration-sage-200">
                      No se registran pedidos previos
                    </p>
                  )}
                </div>
              </section>
            </>
          ) : (
            <p>No se encontró información del cliente</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
