import { useEffect, useState, useCallback } from "react";
import { Card, Button } from "@/components";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Save, UtensilsCrossed } from "lucide-react";
import { useUpdateDailyMenu, useItemsByCategory } from "@/features/menu/hooks/useDailyMenu";
import { type DailyMenu, type UpdateDailyMenuData } from "@/services/dailyMenuApi";
import { useCategories } from "@/features/menu/categories/hooks";
import { toast } from "sonner";

interface DailyMenuConfigFormProps {
  initialData?: DailyMenu | null;
  onSuccess?: () => void;
}

interface FormState {
  basePrice: number;
  premiumProteinPrice: number;
  soupCategoryId: number | null;
  principleCategoryId: number | null;
  proteinCategoryId: number | null;
  drinkCategoryId: number | null;
  extraCategoryId: number | null;
  soupOption1Id: number | null;
  soupOption2Id: number | null;
  principleOption1Id: number | null;
  principleOption2Id: number | null;
  proteinOption1Id: number | null;
  proteinOption2Id: number | null;
  proteinOption3Id: number | null;
  drinkOption1Id: number | null;
  drinkOption2Id: number | null;
  extraOption1Id: number | null;
  extraOption2Id: number | null;
}

const defaultPrices = {
  basePrice: 10000,
  premiumProteinPrice: 11000,
};

// Default category names that should be auto-selected
const DEFAULT_CATEGORY_NAMES = {
  soup: 'Sopas',
  principle: 'Principios',
  protein: 'Proteínas',
  drink: 'Jugos',
  extra: 'Extras',
};

export function DailyMenuConfigForm({ initialData, onSuccess }: DailyMenuConfigFormProps) {
  const updateMenu = useUpdateDailyMenu();
  const { data: categories } = useCategories();

  // Helper to find category ID by name - memoized to avoid ESLint warning
  const findCategoryIdByName = useCallback((name: string): number | null => {
    if (!categories) return null;
    const category = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    return category?.id || null;
  }, [categories]);

  const [formState, setFormState] = useState<FormState>({
    basePrice: initialData?.basePrice || defaultPrices.basePrice,
    premiumProteinPrice: initialData?.premiumProteinPrice || defaultPrices.premiumProteinPrice,
    soupCategoryId: initialData?.soupCategory?.id || null,
    principleCategoryId: initialData?.principleCategory?.id || null,
    proteinCategoryId: initialData?.proteinCategory?.id || null,
    drinkCategoryId: initialData?.drinkCategory?.id || null,
    extraCategoryId: initialData?.extraCategory?.id || null,
    soupOption1Id: initialData?.soupOptions?.[0]?.id || null,
    soupOption2Id: initialData?.soupOptions?.[1]?.id || null,
    principleOption1Id: initialData?.principleOptions?.[0]?.id || null,
    principleOption2Id: initialData?.principleOptions?.[1]?.id || null,
    proteinOption1Id: initialData?.proteinOptions?.[0]?.id || null,
    proteinOption2Id: initialData?.proteinOptions?.[1]?.id || null,
    proteinOption3Id: initialData?.proteinOptions?.[2]?.id || null,
    drinkOption1Id: initialData?.drinkOptions?.[0]?.id || null,
    drinkOption2Id: initialData?.drinkOptions?.[1]?.id || null,
    extraOption1Id: initialData?.extraOptions?.[0]?.id || null,
    extraOption2Id: initialData?.extraOptions?.[1]?.id || null,
  });

  // Auto-set default categories when categories load and no initial data
  useEffect(() => {
    if (categories && !initialData) {
      setFormState(prev => ({
        ...prev,
        soupCategoryId: prev.soupCategoryId || findCategoryIdByName(DEFAULT_CATEGORY_NAMES.soup),
        principleCategoryId: prev.principleCategoryId || findCategoryIdByName(DEFAULT_CATEGORY_NAMES.principle),
        proteinCategoryId: prev.proteinCategoryId || findCategoryIdByName(DEFAULT_CATEGORY_NAMES.protein),
        drinkCategoryId: prev.drinkCategoryId || findCategoryIdByName(DEFAULT_CATEGORY_NAMES.drink),
        extraCategoryId: prev.extraCategoryId || findCategoryIdByName(DEFAULT_CATEGORY_NAMES.extra),
      }));
    }
  }, [categories, initialData, findCategoryIdByName]);

  // Fetch items for each selected category
  const soupItems = useItemsByCategory(formState.soupCategoryId || 0);
  const principleItems = useItemsByCategory(formState.principleCategoryId || 0);
  const proteinItems = useItemsByCategory(formState.proteinCategoryId || 0);
  const drinkItems = useItemsByCategory(formState.drinkCategoryId || 0);
  const extraItems = useItemsByCategory(formState.extraCategoryId || 0);

  useEffect(() => {
    if (initialData) {
      setFormState({
        basePrice: initialData.basePrice || defaultPrices.basePrice,
        premiumProteinPrice: initialData.premiumProteinPrice || defaultPrices.premiumProteinPrice,
        soupCategoryId: initialData.soupCategory?.id || null,
        principleCategoryId: initialData.principleCategory?.id || null,
        proteinCategoryId: initialData.proteinCategory?.id || null,
        drinkCategoryId: initialData.drinkCategory?.id || null,
        extraCategoryId: initialData.extraCategory?.id || null,
        soupOption1Id: initialData.soupOptions?.[0]?.id || null,
        soupOption2Id: initialData.soupOptions?.[1]?.id || null,
        principleOption1Id: initialData.principleOptions?.[0]?.id || null,
        principleOption2Id: initialData.principleOptions?.[1]?.id || null,
        proteinOption1Id: initialData.proteinOptions?.[0]?.id || null,
        proteinOption2Id: initialData.proteinOptions?.[1]?.id || null,
        proteinOption3Id: initialData.proteinOptions?.[2]?.id || null,
        drinkOption1Id: initialData.drinkOptions?.[0]?.id || null,
        drinkOption2Id: initialData.drinkOptions?.[1]?.id || null,
        extraOption1Id: initialData.extraOptions?.[0]?.id || null,
        extraOption2Id: initialData.extraOptions?.[1]?.id || null,
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    try {
      const data: UpdateDailyMenuData = {
        basePrice: formState.basePrice,
        premiumProteinPrice: formState.premiumProteinPrice,
        soupCategoryId: formState.soupCategoryId,
        principleCategoryId: formState.principleCategoryId,
        proteinCategoryId: formState.proteinCategoryId,
        drinkCategoryId: formState.drinkCategoryId,
        extraCategoryId: formState.extraCategoryId,
        soupOptions: {
          option1Id: formState.soupOption1Id,
          option2Id: formState.soupOption2Id,
        },
        principleOptions: {
          option1Id: formState.principleOption1Id,
          option2Id: formState.principleOption2Id,
        },
        proteinOptions: {
          option1Id: formState.proteinOption1Id,
          option2Id: formState.proteinOption2Id,
          option3Id: formState.proteinOption3Id,
        },
        drinkOptions: {
          option1Id: formState.drinkOption1Id,
          option2Id: formState.drinkOption2Id,
        },
        extraOptions: {
          option1Id: formState.extraOption1Id,
          option2Id: formState.extraOption2Id,
        },
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

  const isLoading = soupItems.isLoading || principleItems.isLoading || proteinItems.isLoading || drinkItems.isLoading || extraItems.isLoading;

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
        {/* Prices Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-sage-50 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-carbon-700 mb-1">
              Precio Base (Pollo/Cerdo)
            </label>
            <input
              type="number"
              value={formState.basePrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, basePrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-carbon-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon-700 mb-1">
              Precio Premium (Res/Pescado)
            </label>
            <input
              type="number"
              value={formState.premiumProteinPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, premiumProteinPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-carbon-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
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
                  {categories.find(c => c.id === formState.soupCategoryId)?.name || 'Sopas'}
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
                  onChange={(value: string) => setFormState({ ...formState, soupOption1Id: value ? Number(value) : null })}
                  options={getItemOptions(soupItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.soupOption2Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, soupOption2Id: value ? Number(value) : null })}
                  options={getItemOptions(soupItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría "Sopas". Por favor, créala primero.
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
                  {categories.find(c => c.id === formState.principleCategoryId)?.name || 'Principios'}
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
                  onChange={(value: string) => setFormState({ ...formState, principleOption1Id: value ? Number(value) : null })}
                  options={getItemOptions(principleItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.principleOption2Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, principleOption2Id: value ? Number(value) : null })}
                  options={getItemOptions(principleItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría "Principios". Por favor, créala primero.
              </p>
            )}
          </div>

          {/* Protein Section - Pre-selected category */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-carbon-700">
                Proteínas del Día
              </label>
              <span className="text-xs text-sage-600 bg-sage-100 px-2 py-1 rounded-full">
                Categoría pre-seleccionada
              </span>
            </div>
            {formState.proteinCategoryId && categories && (
              <div className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                <span className="text-sm font-medium text-carbon-800">
                  {categories.find(c => c.id === formState.proteinCategoryId)?.name || 'Proteínas'}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.proteinCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.proteinOption1Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, proteinOption1Id: value ? Number(value) : null })}
                  options={getItemOptions(proteinItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.proteinOption2Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, proteinOption2Id: value ? Number(value) : null })}
                  options={getItemOptions(proteinItems.data || [])}
                  placeholder="Opción 2"
                />
                <FilterSelect
                  value={formState.proteinOption3Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, proteinOption3Id: value ? Number(value) : null })}
                  options={getItemOptions(proteinItems.data || [])}
                  placeholder="Opción 3"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría "Proteínas". Por favor, créala primero.
              </p>
            )}
          </div>

          {/* Drink Section - Pre-selected category */}
          <div className="space-y-3">
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
                  {categories.find(c => c.id === formState.drinkCategoryId)?.name || 'Jugos'}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.drinkCategoryId ? (
              <div className="space-y-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.drinkOption1Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, drinkOption1Id: value ? Number(value) : null })}
                  options={getItemOptions(drinkItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.drinkOption2Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, drinkOption2Id: value ? Number(value) : null })}
                  options={getItemOptions(drinkItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría "Jugos". Por favor, créala primero.
              </p>
            )}
          </div>

          {/* Extra Section - Pre-selected category */}
          <div className="space-y-3 md:col-span-2">
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
                  {categories.find(c => c.id === formState.extraCategoryId)?.name || 'Extras'}
                </span>
                <p className="text-xs text-carbon-500 mt-1">
                  Selecciona las opciones disponibles:
                </p>
              </div>
            )}
            {formState.extraCategoryId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4 border-l-2 border-sage-200">
                <FilterSelect
                  value={formState.extraOption1Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, extraOption1Id: value ? Number(value) : null })}
                  options={getItemOptions(extraItems.data || [])}
                  placeholder="Opción 1"
                />
                <FilterSelect
                  value={formState.extraOption2Id?.toString() || ""}
                  onChange={(value: string) => setFormState({ ...formState, extraOption2Id: value ? Number(value) : null })}
                  options={getItemOptions(extraItems.data || [])}
                  placeholder="Opción 2"
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                No se encontró la categoría "Extras". Por favor, créala primero.
              </p>
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
