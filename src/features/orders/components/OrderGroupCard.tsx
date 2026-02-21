import { useState } from "react";
import { OrderStatus } from "@/types";
import type { Order } from "@/types";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  User, 
  Receipt 
} from "lucide-react";
import { Button } from "@/components";
import { OrderCard } from "./OrderCard";
import { cn } from "@/utils/cn";

interface OrderGroupCardProps {
  groupId: string;
  title: string;
  orders: Order[];
  totalAmount: number;
  onViewDetail: (orderId: string) => void;
}

export function OrderGroupCard({
  title,
  orders,
  totalAmount,
  onViewDetail,
}: OrderGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive group status from orders
  // If any order is active (not PAID/CANCELLED), the group is active
  const isActive = orders.some(
    o => o.status !== OrderStatus.PAID && o.status !== OrderStatus.CANCELLED
  );

  // Get earliest creation time
  const createdAt = orders.length > 0 
    ? orders.reduce((earliest, order) => {
        return new Date(order.createdAt) < new Date(earliest) ? order.createdAt : earliest;
      }, orders[0].createdAt)
    : new Date().toISOString();

  const createdTime = new Date(createdAt).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate total items
  const totalItems = orders.reduce((sum, order) => {
    return sum + (order.items?.reduce((s, i) => s + i.quantity, 0) || 0);
  }, 0);

  // Get waiter name (assume same waiter for table)
  const waiterName = orders[0]?.waiter?.firstName;

  return (
    <div className={cn(
      "rounded-2xl border-2 bg-white overflow-hidden transition-all duration-300",
      isActive ? "border-sage-200 shadow-sm" : "border-gray-200 opacity-90"
    )}>
      {/* Group Header - Clickable to expand */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:bg-gray-50/80 transition-colors"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-sage-100 p-2 rounded-lg text-sage-700">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-carbon-900">{title}</h3>
                <div className="flex items-center gap-2 text-sm text-carbon-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {createdTime}
                  </span>
                  <span>•</span>
                  <span>{orders.length} pedidos</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm">
              {waiterName && (
                <div className="flex items-center gap-1.5 text-carbon-600 bg-carbon-50 px-2 py-1 rounded-md">
                  <User className="w-4 h-4" />
                  <span>{waiterName}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-carbon-600 bg-carbon-50 px-2 py-1 rounded-md">
                <Receipt className="w-4 h-4" />
                <span>{totalItems} productos</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-sage-700">
              ${totalAmount.toLocaleString("es-CO")}
            </div>
            <div className="text-sm text-carbon-500 font-medium mt-1">Total Mesa</div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-sage-600 hover:text-sage-800 hover:bg-sage-50"
            >
              {isExpanded ? (
                <>
                  <span className="mr-1">Ocultar</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span className="mr-1">Ver Pedidos</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Content: Individual Orders */}
      {isExpanded && (
        <div className="border-t-2 border-dashed border-gray-200 bg-gray-50/50 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetail={onViewDetail}
              compact // Use compact mode inside group
            />
          ))}
        </div>
      )}
    </div>
  );
}
