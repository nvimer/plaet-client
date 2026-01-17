import type { CreateMenuItemInput, MenuItem } from "@/types";
import type { AxiosErrorWithResponse } from "@/types/common";
import { useCreateItem } from "../hooks/useCreateItem";
import { useUpdateItem } from "../hooks/useUpdateItem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createItemSchema } from "../schemas/itemsSchemas";
import { Button, Card, Input } from "@/components";
import { useCategories } from "../../categories/hooks";
import { Check, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";

// ===== TYPES ======
interface MenuItemFormProps {
    // if editing
    item?: MenuItem;
    onSuccess?: () => void;
    onCancel?: () => void;
}

/**
 * MenuItemForm Component
 *
 * Form to create or edit a menu item
 *
 * Features /
 * - React Hook Form with zod validation
 * - Create or Edit mode
 * - Category selection
 * - Price, availability, and extra toggles
 * - Image URL input
 * - Success/Error handling
 */
export function MenuItemForm({ item, onSuccess, onCancel }: MenuItemFormProps) {
    // ============== HOOK ============
    const { mutate: createMenuItem, isPending: isCreating } = useCreateItem();
    const { mutate: updateMenuItem, isPending: isUpdating } = useUpdateItem();
    const { data: categories, isLoading: loadingCategories } = useCategories();

    const isLoading = isCreating || isUpdating;

    // ============== FORM SETUP ============
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateMenuItemInput>({
        resolver: zodResolver(createItemSchema),
        // Default values based on mode
        defaultValues: item
            ? {
                name: item.name,
                description: item.description || "",
                categoryId: item.categoryId,
                price: item.price,
                isExtra: item.isExtra,
                isAvailable: item.isAvailable,
                imageUrl: item.imageUrl || "",
            }
            : {
                description: "",
                isExtra: false,
                isAvailable: true,
            },
    });

    // ================= FORM SUBMIT ========================
    const onSubmit = (data: CreateMenuItemInput) => {
        if (item) {
            // Update existing item
            updateMenuItem(
                { id: item.id, ...data },
                {
                    onSuccess: () => {
                        toast.success("Producto actualizado", {
                            description: `"${data.name}" ha sido actualizado exitosamente`,
                            icon: "✅",
                        });
                        onSuccess?.();
                    },
                    onError: (error: AxiosErrorWithResponse) => {
                        toast.error("Error al actualizar producto", {
                            description: error.response?.data?.message || error.message,
                            icon: "❌",
                        });
                    },
                },
            );
        } else {
            // Create new item
            createMenuItem(data, {
                onSuccess: () => {
                    toast.success("Producto creado", {
                        description: `"${data.name}" ha sido agregado al menú`,
                        icon: "🎉",
                    });
                    onSuccess?.();
                },
                    onError: (error: AxiosErrorWithResponse) => {
                    toast.error("Error al crear producto", {
                        description: error.response?.data?.message || error.message,
                        icon: "❌",
                    });
                },
            });
        }
    };

    // ========== RENDER ==========
    return (
        <Card variant="elevated" padding="lg">
            {/* =============== FORM HEADER ================== */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                    {item ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <p className="text-neutral-600 font-light">
                    {item
                        ? "Modifica los datos del producto"
                        : "Completa ls datos para crear un nuevo producto"}
                </p>
            </div>

            {/* ===================== FORM ===================== */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Item Name */}
                <Input
                    label="Nombre del Producto"
                    type="text"
                    placeholder="Ej: Chuleta de Cerdo, Chuleta de Pollo"
                    helperText="Nombre visible en el menú"
                    {...register("name")}
                    error={errors.name?.message}
                />

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        placeholder="Descripción detallada del producto (opcional)"
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-neutral-900 placeholder:text-neutral-400 placeholder:font-light transition-all resize-none"
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm mt-2 font-light">
                            {errors.description.message}
                        </p>
                    )}
                    <p className="text-xs text-neutral-500 mt-1.5 font-light">
                        Opcional: Ingredientes, preparación, etc.
                    </p>
                </div>

                {/* Price */}
                <Input
                    label="Precio"
                    type="text"
                    placeholder="12.500"
                    helperText="Precio del producto"
                    {...register("price")}
                    error={errors.price?.message}
                />

                {/* Category selection */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Categoría
                    </label>
                    <select
                        {...register("categoryId", { valueAsNumber: true })}
                        disabled={loadingCategories}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white text-neutral-900 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && (
                        <p className="text-red-600 text-sm mt-2 font-light">
                            {errors.categoryId.message}
                        </p>
                    )}
                    <p className="text-red-600 text-sm mt-2 font-light">
                        Categoría a la que pertenece este producto
                    </p>
                </div>

                {/* Image URL */}
                <div>
                    <label className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        URL de la Imagen
                    </label>
                    <Input
                        type="text"
                        placeholder="https://ejemplo.com/pizza.jpg"
                        helperText="Opcional: URL de la imagen del producto"
                        {...register("imageUrl")}
                        error={errors.imageUrl?.message}
                    />
                </div>

                {/* Toggles Section  */}
                <div className="space-y-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                    <p className="text-sm font-medium text-neutral-700 mb-3">
                        Opciones de Producto
                    </p>

                    {/* Available Toggle  */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register("isAvailable")}
                            className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        />
                        <div>
                            <span>Disponible</span>
                            <p>El producto está disponible para ordenar</p>
                        </div>
                    </label>

                    {/* Extra Toggle  */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            {...register("isExtra")}
                            className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        />
                        <div className="flex-1">
                            <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-600 transition-colors">
                                Extra
                            </span>
                            <p className="text-sm text-neutral-600 font-light">
                                Marca este producto como si es extra
                            </p>
                        </div>
                    </label>
                </div>

                {/* ================= ACTION BUTTONS ===================== */}
                <div className="flex gap-3 pt-6">
                    {/* Submit Button */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isLoading}
                        isLoading={isLoading}
                        fullWidth
                    >
                        {!isLoading && <Check className="w-5 h-5 mr-2" />}
                        {item ? "Actualizar Producto" : "Crear Producto"}
                    </Button>

                    {/* Cancel Button */}
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="lg"
                            onClick={onCancel}
                            fullWidth
                        >
                            <X className="w-5 h-5 mr-2" /> Cancelar
                        </Button>
                    )}
                </div>
            </form>
        </Card>
    );
}
