import { Restaurant } from "@/types";
import { Card } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { RestaurantStatusBadge } from "./RestaurantStatusBadge";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
}

export function RestaurantList({ restaurants, onEdit, onDelete }: RestaurantListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-carbon-100">
            <th className="py-4 px-4 text-sm font-semibold text-carbon-600">Restaurante</th>
            <th className="py-4 px-4 text-sm font-semibold text-carbon-600">NIT / Identificación</th>
            <th className="py-4 px-4 text-sm font-semibold text-carbon-600">Estado</th>
            <th className="py-4 px-4 text-sm font-semibold text-carbon-600">Suscripción</th>
            <th className="py-4 px-4 text-sm font-semibold text-carbon-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id} className="border-b border-carbon-50 hover:bg-carbon-50/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sage-100 flex items-center justify-center text-sage-700 font-bold uppercase">
                    {restaurant.logoUrl ? (
                      <img src={restaurant.logoUrl} alt={restaurant.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      restaurant.name.substring(0, 2)
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-carbon-900">{restaurant.name}</div>
                    <div className="text-xs text-carbon-500">{restaurant.slug}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-carbon-600">
                {restaurant.nit || "N/A"}
              </td>
              <td className="py-4 px-4">
                <RestaurantStatusBadge status={restaurant.status} />
              </td>
              <td className="py-4 px-4 text-sm text-carbon-500">
                {format(new Date(restaurant.createdAt), "dd MMM, yyyy", { locale: es })}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(restaurant)}
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4 text-carbon-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(restaurant.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://${restaurant.slug}.plaet.app`, "_blank")}
                    title="Ver Sitio"
                  >
                    <ExternalLink className="w-4 h-4 text-sage-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
