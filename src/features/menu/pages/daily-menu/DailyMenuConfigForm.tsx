import { useEffect, useState, useCallback } from "react";
import { Card, Button } from "@/components";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Save, UtensilsCrossed, Check } from "lucide-react";
import {
  useUpdateDailyMenu,
  useItemsByCategory,
} from "@/features/menu/hooks/useDailyMenu";
import {
  type DailyMenu,
  type UpdateDailyMenuData,
} from "@/services/dailyMenuApi";
import { useCategories } from "@/features/menu/categories/hooks";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface DailyMenuConfigFormProps {
  initialData?: DailyMenu | null;
  onSuccess?: () => void;
}

interface FormState {
  basePrice: number;
  soupCategoryId: number | null;
  principleCategoryId: number | null;
  proteinCategoryId: number | null;
  drinkCategoryId: number | null;
  extraCategoryId: number | null;
  saladCategoryId: number | null;
  dessertCategoryId: number | null;
  includeDessert: boolean;
  soupOption1Id: number | null;
  soupOption2Id: number | null;
  principleOption1Id: number | null;
  principleOption2Id: number | null;
  drinkOption1Id: number | null;
  drinkOption2Id: number | null;
  extraOption1Id: number | null;
  extraOption2Id: number | null;
  saladOption1Id: number | null;
  saladOption2Id: number | null;
  dessertOption1Id: number | null;
  dessertOption2Id: number | null;
  // All available proteins (checkbox selection)
  selectedProteinIds: number[];
}

const defaultPrices = {
  basePrice: 4000,
};

// Default category names that should be auto-selected
const DEFAULT_CATEGORY_NAMES = {
  soup: "Sopas",
  principle: "Principios",
  protein: "Proteínas",
  drink: "Jugos",
  extra: "Extras",
  salad: "Ensaladas",
  dessert: "Postres",
};

export function DailyMenuConfigForm({
  initialData,
  onSuccess,
}: DailyMenuConfigFormProps) {
  const updateMenu = useUpdateDailyMenu();
  const { data: categories } = useCategories();

  // Helper to find category ID by name - memoized to avoid ESLint warning
  const findCategoryIdByName = useCallback(
    (name: string): number | null => {
      if (!categories) return null;
      const category = categories.find(
        (c) => c.name.toLowerCase() === name.toLowerCase(),
      );
      return category?.id || null;
    },
    [categories],
  );

  const [formState, setFormState] = useState<FormState>({
    basePrice: initialData?.basePrice || defaultPrices.basePrice,
    soupCategoryId: initialData?.soupCategory?.id || null,
    principleCategoryId: initialData?.principleCategory?.id || null,
    proteinCategoryId: initialData?.proteinCategory?.id || null,
    drinkCategoryId: initialData?.drinkCategory?.id || null,
    extraCategoryId: initialData?.extraCategory?.id || null,
    saladCategoryId: initialData?.saladCategory?.id || null,
    dessertCategoryId: initialData?.dessertCategory?.id || null,
    includeDessert: !!initialData?.dessertCategory,
    soupOption1Id: initialData?.soupOptions?.[0]?.id || null,
    soupOption2Id: initialData?.soupOptions?.[1]?.id || null,
    principleOption1Id: initialData?.principleOptions?.[0]?.id || null,
    principleOption2Id: initialData?.principleOptions?.[1]?.id || null,
    drinkOption1Id: initialData?.drinkOptions?.[0]?.id || null,
    drinkOption2Id: initialData?.drinkOptions?.[1]?.id || null,
    extraOption1Id: initialData?.extraOptions?.[0]?.id || null,
    extraOption2Id: initialData?.extraOptions?.[1]?.id || null,
    saladOption1Id: initialData?.saladOptions?.[0]?.id || null,
    saladOption2Id: initialData?.saladOptions?.[1]?.id || null,
    dessertOption1Id: initialData?.dessertOptions?.[0]?.id || null,
    dessertOption2Id: initialData?.dessertOptions?.[1]?.id || null,
    selectedProteinIds: initialData?.proteinOptions?.map((p) => p.id) || [],
  });

  // Auto-set default categories when categories load and no initial data
  useEffect(() => {
    if (categories && !initialData) {
      setFormState((prev) => ({
        ...prev,
        soupCategoryId:
          prev.soupCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.soup),
        principleCategoryId:
          prev.principleCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.principle),
        proteinCategoryId:
          prev.proteinCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.protein),
        drinkCategoryId:
          prev.drinkCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.drink),
        extraCategoryId:
          prev.extraCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.extra),
        saladCategoryId:
          prev.saladCategoryId ||
          findCategoryIdByName(DEFAULT_CATEGORY_NAMES.salad),
      }));
    }
  }, [categories, initialData, findCategoryIdByName]);

  // Fetch items for each selected category
  const soupItems = useItemsByCategory(formState.soupCategoryId || 0);
  const principleItems = useItemsByCategory(formState.principleCategoryId || 0);
  const proteinItems = useItemsByCategory(formState.proteinCategoryId || 0);
  const drinkItems = useItemsByCategory(formState.drinkCategoryId || 0);
  const extraItems = useItemsByCategory(formState.extraCategoryId || 0);
  const saladItems = useItemsByCategory(formState.saladCategoryId || 0);
  const dessertItems = useItemsByCategory(formState.dessertCategoryId || 0);

  useEffect(() => {
    if (initialData) {
      setFormState({
        basePrice: initialData.basePrice || defaultPrices.basePrice,
        soupCategoryId: initialData.soupCategory?.id || null,
        principleCategoryId: initialData.principleCategory?.id || null,
        proteinCategoryId: initialData.proteinCategory?.id || null,
        drinkCategoryId: initialData.drinkCategory?.id || null,
        extraCategoryId: initialData.extraCategory?.id || null,
        // If saladCategory is null in initialData but categories are loaded, try to find it by name
        saladCategoryId:
          initialData.saladCategory?.id ||
          (categories
            ? findCategoryIdByName(DEFAULT_CATEGORY_NAMES.salad)
            : null),
        // Same for dessert
        dessertCategoryId:
          initialData.dessertCategory?.id ||
          (categories
            ? findCategoryIdByName(DEFAULT_CATEGORY_NAMES.dessert)
            : null),
        includeDessert: !!initialData.dessertCategory,
        soupOption1Id: initialData.soupOptions?.[0]?.id || null,
        soupOption2Id: initialData.soupOptions?.[1]?.id || null,
        principleOption1Id: initialData.principleOptions?.[0]?.id || null,
        principleOption2Id: initialData.principleOptions?.[1]?.id || null,
        drinkOption1Id: initialData.drinkOptions?.[0]?.id || null,
        drinkOption2Id: initialData.drinkOptions?.[1]?.id || null,
        extraOption1Id: initialData.extraOptions?.[0]?.id || null,
        extraOption2Id: initialData.extraOptions?.[1]?.id || null,
        saladOption1Id: initialData.saladOptions?.[0]?.id || null,
        saladOption2Id: initialData.saladOptions?.[1]?.id || null,
        dessertOption1Id: initialData.dessertOptions?.[0]?.id || null,
        dessertOption2Id: initialData.dessertOptions?.[1]?.id || null,
        selectedProteinIds: initialData.proteinOptions?.map((p) => p.id) || [],
      });
    }
  }, [initialData, categories, findCategoryIdByName]);

  const handleSubmit = async () => {
    try {
      const data: UpdateDailyMenuData = {
        basePrice: formState.basePrice,
        soupCategoryId: formState.soupCategoryId,
        principleCategoryId: formState.principleCategoryId,
        proteinCategoryId: formState.proteinCategoryId,
        drinkCategoryId: formState.drinkCategoryId,
        extraCategoryId: formState.extraCategoryId,
        saladCategoryId: formState.saladCategoryId,
        dessertCategoryId: formState.includeDessert
          ? formState.dessertCategoryId
          : null,
        soupOptions: {
          option1Id: formState.soupOption1Id,
          option2Id: formState.soupOption2Id,
        },
        principleOptions: {
          option1Id: formState.principleOption1Id,
          option2Id: formState.principleOption2Id,
        },
        drinkOptions: {
          option1Id: formState.drinkOption1Id,
          option2Id: formState.drinkOption2Id,
        },
        extraOptions: {
          option1Id: formState.extraOption1Id,
          option2Id: formState.extraOption2Id,
        },
        saladOptions: {
          option1Id: formState.saladOption1Id,
          option2Id: formState.saladOption2Id,
        },
        dessertOptions: formState.includeDessert
          ? {
              option1Id: formState.dessertOption1Id,
              option2Id: formState.dessertOption2Id,
            }
          : undefined,
        // All selected proteins
        allProteinIds:
          formState.selectedProteinIds.length > 0
            ? formState.selectedProteinIds
            : undefined,
      };

      await updateMenu.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update daily menu:", error);
      toast.error("Error al guardar el menú del día");
    }
  };

  const getItemOptions = (items: { id: number; name: string }[]) => [
    { value: "", label: "Seleccionar..." },
    ...items.map((item) => ({
      value: item.id.toString(),
      label: item.name,
    })),
  ];

  const toggleProtein = (proteinId: number) => {
    setFormState((prev) => ({
      ...prev,
      selectedProteinIds: prev.selectedProteinIds.includes(proteinId)
        ? prev.selectedProteinIds.filter((id) => id !== proteinId)
        : [...prev.selectedProteinIds, proteinId],
    }));
  };

  const isLoading =
    soupItems.isLoading ||
    principleItems.isLoading ||
    proteinItems.isLoading ||
    drinkItems.isLoading ||
    extraItems.isLoading ||
    saladItems.isLoading ||
    (formState.includeDessert && dessertItems.isLoading);

  return (
    <Card variant="elevated" className="p-6 rounded-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
          <UtensilsCrossed className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-carbon-900">
            Configurar Menú del Día
          </h2>
          <p className="text-sm text-carbon-500">
            Selecciona las categorías y opciones disponibles
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Prices Section - Margen Base Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-carbon-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
              $
            </span>
            Precios del Almuerzo
          </h3>

          {/* Margen Base Card */}
          <div
            className={cn(
              "relative p-4 rounded-xl border-2 transition-all",
              "bg-gradient-to-br from-sage-50 to-white",
              "border-sage-200 hover:border-sage-300",
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  Margen Base
                </span>
                <p className="text-xs text-carbon-500 mt-1.5">
                  Base del precio para todos los almuerzos
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-carbon-900">
                  ${formState.basePrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex gap-2 mb-3">
              {[3000, 4000, 5000].map((price) => (
                <button
                  key={price}
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, basePrice: price }))
                  }
                  className={cn(
                    "flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all",
                    formState.basePrice === price
                      ? "bg-sage-500 text-white shadow-md"
                      : "bg-white border border-carbon-200 text-carbon-600 hover:border-sage-300",
                  )}
                >
                  ${(price / 1000).toFixed(0)}k
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-carbon-400 text-sm">
                $
              </span>
              <input
                type="number"
                value={formState.basePrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({
                    ...formState,
                    basePrice: Number(e.target.value),
                  })
                }
                className="w-full pl-7 pr-3 py-2.5 border border-carbon-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 text-sm font-medium"
                placeholder="Precio personalizado"
              />
            </div>
          </div>

          {/* Price calculation explanation */}
          <div className="bg-sage-50 p-3 rounded-lg border border-sage-200 text-xs text-carbon-600">
            <p className="font-medium text-carbon-800 mb-1">
              Precio = ${formState.basePrice.toLocaleString()} + Proteína
            </p>
            <p className="text-carbon-500">
              Ej: Pollo $6,000 → Total $
              {(formState.basePrice + 6000).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Categories and Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Soup Section - Pre-selected category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Sopas del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.soupCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find((c) => c.id === formState.soupCategoryId)
                    ?.name || "Sopas"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.soupCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.soupOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      soupOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(soupItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.soupOption2Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      soupOption2Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(soupItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Sopas&quot;. Por favor, créala
                primero.
              </p>
            )}
          </div>

          {/* Principle Section - Pre-selected category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Principios del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.principleCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find(
                    (c) => c.id === formState.principleCategoryId,
                  )?.name || "Principios"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.principleCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.principleOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      principleOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(principleItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.principleOption2Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      principleOption2Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(principleItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Principios&quot;. Por favor,
                créala primero.
              </p>
            )}
          </div>

          {/* Salad Section - Pre-selected category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Ensaladas del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.saladCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find((c) => c.id === formState.saladCategoryId)
                    ?.name || "Ensaladas"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.saladCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.saladOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      saladOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(saladItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.saladOption2Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      saladOption2Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(saladItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Ensaladas&quot;. Por favor,
                créala primero.
              </p>
            )}
          </div>

          {/* Extra Section - Pre-selected category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Extras del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.extraCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find((c) => c.id === formState.extraCategoryId)
                    ?.name || "Extras"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.extraCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.extraOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      extraOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(extraItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.extraOption2Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      extraOption2Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(extraItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Extras&quot;. Por favor,
                créala primero.
              </p>
            )}
          </div>

          {/* Drink Section - Pre-selected category */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Bebidas del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.drinkCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find((c) => c.id === formState.drinkCategoryId)
                    ?.name || "Jugos"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.drinkCategoryId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.drinkOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      drinkOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(drinkItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.drinkOption2Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      drinkOption2Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(drinkItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Jugos&quot;. Por favor, créala
                primero.
              </p>
            )}
          </div>

          {/* Protein Section - All proteins available */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Proteínas Disponibles
              </label>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                Todas las disponibles en inventario
              </span>
            </div>
            {formState.proteinCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find((c) => c.id === formState.proteinCategoryId)
                    ?.name || "Proteínas"}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona todas las proteínas que estarán disponibles hoy:
                </p>
              </div>
            )}
            {formState.proteinCategoryId ? (
              <div className="pl-4 border-l-2 border-sage-200">
                {proteinItems.isLoading ? (
                  <p className="text-sm text-carbon-500">
                    Cargando proteínas...
                  </p>
                ) : proteinItems.data && proteinItems.data.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {proteinItems.data.map((protein) => {
                      const isSelected = formState.selectedProteinIds.includes(
                        protein.id,
                      );
                      return (
                        <button
                          key={protein.id}
                          type="button"
                          onClick={() => toggleProtein(protein.id)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all",
                            "hover:shadow-md active:scale-95",
                            isSelected
                              ? "border-sage-500 bg-sage-50 text-carbon-900"
                              : "border-carbon-200 bg-white text-carbon-600 hover:border-sage-300",
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-sage-500 border-sage-500"
                                : "border-carbon-300",
                            )}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium truncate">
                            {protein.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    No hay proteínas disponibles en esta categoría.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría &quot;Proteínas&quot;. Por favor,
                créala primero.
              </p>
            )}
          </div>

          {/* Dessert Section - Optional */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <label className="block text-sm font-medium text-carbon-700">
                  Postres del Día
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.includeDessert}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        includeDessert: e.target.checked,
                        dessertCategoryId: e.target.checked
                          ? prev.dessertCategoryId ||
                            findCategoryIdByName(DEFAULT_CATEGORY_NAMES.dessert)
                          : null,
                      }))
                    }
                    className="w-4 h-4 text-sage-600 rounded focus:ring-sage-500"
                  />
                  <span className="text-sm text-carbon-600">
                    Incluir postres
                  </span>
                </label>
              </div>
              {formState.includeDessert && (
                <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                  Opcional
                </span>
              )}
            </div>

            {formState.includeDessert && (
              <>
                {formState.dessertCategoryId && categories && (
                  <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                    <span className="text-sm font-medium text-carbon-800">
                      {categories.find(
                        (c) => c.id === formState.dessertCategoryId,
                      )?.name || "Postres"}
                    </span>
                    <p className="text-xs text-carbon-500 mt-1">
                      Selecciona las opciones disponibles:
                    </p>
                  </div>
                )}
                {formState.dessertCategoryId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4 border-l-2 border-sage-200">
                    <FilterSelect
                      value={formState.dessertOption1Id?.toString() || ""}
                      onChange={(value: string) =>
                        setFormState({
                          ...formState,
                          dessertOption1Id: value ? Number(value) : null,
                        })
                      }
                      options={getItemOptions(dessertItems.data || [])}
                      placeholder="Opción 1"
                    />
                    <FilterSelect
                      value={formState.dessertOption2Id?.toString() || ""}
                      onChange={(value: string) =>
                        setFormState({
                          ...formState,
                          dessertOption2Id: value ? Number(value) : null,
                        })
                      }
                      options={getItemOptions(dessertItems.data || [])}
                      placeholder="Opción 2"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    No se encontró la categoría &quot;Postres&quot;. Por favor,
                    créala primero.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-carbon-100">
          <Button
            onClick={handleSubmit}
            isLoading={updateMenu.isPending || isLoading}
            className="inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </Card>
  );
}
