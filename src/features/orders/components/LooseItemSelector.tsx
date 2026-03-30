import { Card, Input, Button } from "@/components";
import { cn } from "@/utils/cn";
import { Search, Plus, Minus, ShoppingBag, ImageIcon, PackageCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: number;
  name: string;
  price: string | number;
  imageUrl?: string | null;
  isAvailable: boolean;
}

interface SelectedItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface MenuItemSelectorProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: MenuItem[];
  popularProducts: Array<{ id: number; name: string; price: number }>;
  onAddItem: (item: { id: number; name: string; price: number }) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  selectedItems: SelectedItem[];
}

/**
 * Premium LooseItemSelector
 * 
 * Used for selecting "loose items" (drinks, extras, desserts) that are not part of the lunch menu.
 * High-density tactile interface with visual search.
 */
export function LooseItemSelector({
  searchTerm,
  setSearchTerm,
  filteredItems = [],
  popularProducts = [],
  onAddItem,
  onUpdateQuantity,
  selectedItems = [],
}: MenuItemSelectorProps) {
  
  const getSelectedQuantity = (id: number) => {
    return selectedItems?.find(i => i.id === id)?.quantity || 0;
  };

  const safeFilteredItems = Array.isArray(filteredItems) ? filteredItems : [];
  const safePopularProducts = Array.isArray(popularProducts) ? popularProducts : [];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="px-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-carbon-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1 h-4 bg-primary-500 rounded-full" />
            Adicionales y Bebidas
          </span>
          {selectedItems?.length > 0 && (
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
              {selectedItems.length} seleccionados
            </span>
          )}
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400 w-4 h-4 group-focus-within:text-primary-500 transition-colors" />
          <Input
            placeholder="Buscar bebidas, postres, extras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-14 bg-white border-2 border-sage-100 focus:border-primary-500 rounded-2xl shadow-soft-sm transition-all text-base"
            fullWidth
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {searchTerm === "" ? (
            <motion.div
              key="popular"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-[10px] font-bold text-carbon-400 uppercase tracking-widest ml-1">Productos Frecuentes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {safePopularProducts.map((item) => {
                  const quantity = getSelectedQuantity(item.id);
                  const isSelected = quantity > 0;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onAddItem(item)}
                      className={cn(
                        "group relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left active:scale-95",
                        isSelected
                          ? "border-primary-600 bg-white shadow-soft-xl z-10"
                          : "border-sage-50 bg-sage-50/20 hover:border-sage-200 hover:bg-white"
                      )}
                    >
                      <div className="flex flex-col h-full justify-between gap-3">
                        <div className="flex justify-between items-start">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            isSelected ? "bg-primary-100 text-primary-600" : "bg-white text-carbon-400"
                          )}>
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                          {quantity > 0 && (
                            <span className="bg-primary-600 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                              {quantity}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-carbon-900 line-clamp-2 leading-tight">{item.name}</p>
                          <p className="text-[10px] font-black text-primary-700 mt-1">${item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {safeFilteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {safeFilteredItems.map((item) => {
                    const quantity = getSelectedQuantity(item.id);
                    const isSelected = quantity > 0;
                    const price = parseFloat(String(item.price)) || 0;

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-2xl border-2 transition-all",
                          isSelected ? "border-primary-200 bg-primary-50/30" : "border-sage-50 bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-carbon-400 shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} className="w-full h-full object-cover rounded-xl" alt="" />
                            ) : (
                              <ShoppingBag className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-carbon-900 truncate">{item.name}</p>
                            <p className="text-[10px] font-black text-primary-700">${price.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <div className="flex items-center bg-white rounded-xl border border-primary-100 p-0.5 shadow-sm">
                              <button
                                onClick={() => onUpdateQuantity(item.id, quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center font-black text-carbon-900 text-xs">
                                {quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onAddItem({ id: item.id, name: item.name, price })}
                              className="h-8 rounded-xl border-sage-200 text-[10px] font-bold"
                            >
                              Agregar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-sage-50/30 rounded-[2rem] border-2 border-dashed border-sage-100">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-carbon-300 shadow-soft-sm">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-carbon-900">Sin resultados</p>
                    <p className="text-xs text-carbon-400">No encontramos &quot;{searchTerm}&quot;</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
