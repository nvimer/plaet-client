import { useEffect, useState, useCallback } from "react";
import { Card, Button, Input } from "@/components";
import { FilterSelect } from "@/components/filters/FilterSelect";
import { Save, UtensilsCrossed, Check, Settings2, Lock, ListChecks } from "lucide-react";
import {
  useUpdateDailyMenu,
  useUpdateDailyMenuByDate,
  useItemsByCategory,
} from "@/features/menu/hooks/useDailyMenu";
import {
  type DailyMenu,
  type UpdateDailyMenuData,
} from "@/services/dailyMenuApi";
import { useCategories } from "@/features/menu/categories/hooks";
import { BaseModal } from "@/components/ui/BaseModal/BaseModal";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

interface DailyMenuConfigFormProps {
  initialData?: DailyMenu | null;
  onSuccess?: () => void;
  /** Date to save the menu for (defaults to today if not provided) */
  selectedDate?: string | null;
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
  createdAt: string | null;
}

const defaultPrices = {
  basePrice: 4000,
};

const DEFAULT_CATEGORY_NAMES = {
  soup: "Sopas",
  principle: "Principios",
  protein: "Proteínas",
  drink: "Bebidas",
  extra: "Extras",
  salad: "Ensaladas",
  dessert: "Postres",
};

export function DailyMenuConfigForm({
  initialData,
  onSuccess,
  selectedDate,
}: DailyMenuConfigFormProps) {
  const updateMenuToday = useUpdateDailyMenu();
  const updateMenuByDate = useUpdateDailyMenuByDate();
  const { data: categories } = useCategories();

  // Price Modal State
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [showPriceFields, setShowPriceFields] = useState(false);
  const [password, setPassword] = useState("");

  const findCategoryIdByName = useCallback(
    (name: string): number | null => {
      if (!categories) return null;
      
      const normalize = (str: string) => 
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

      const searchName = normalize(name);
      const category = categories.find(
        (c) => normalize(c.name) === searchName
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
    createdAt: initialData?.createdAt || (selectedDate ? new Date(selectedDate).toISOString() : null),
  });

  const [isSaved, setIsSaved] = useState(false);

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
        createdAt: prev.createdAt || (selectedDate ? new Date(selectedDate).toISOString() : null),
      }));
    }
  }, [categories, initialData, findCategoryIdByName, selectedDate]);

  const soupItems = useItemsByCategory(formState.soupCategoryId || 0);
  const principleItems = useItemsByCategory(formState.principleCategoryId || 0);
  const proteinItems = useItemsByCategory(formState.proteinCategoryId || 0);
  const drinkItems = useItemsByCategory(formState.drinkCategoryId || 0);
  const extraItems = useItemsByCategory(formState.extraCategoryId || 0);
  const saladItems = useItemsByCategory(formState.saladCategoryId || 0);
  const dessertItems = useItemsByCategory(formState.dessertCategoryId || 0);

  useEffect(() => {
    setIsSaved(false);
    if (initialData) {
      setFormState({
        basePrice: initialData.basePrice || defaultPrices.basePrice,
        soupCategoryId: initialData.soupCategory?.id || null,
        principleCategoryId: initialData.principleCategory?.id || null,
        proteinCategoryId: initialData.proteinCategory?.id || null,
        drinkCategoryId: initialData.drinkCategory?.id || null,
        extraCategoryId: initialData.extraCategory?.id || null,
        saladCategoryId:
          initialData.saladCategory?.id ||
          (categories
            ? findCategoryIdByName(DEFAULT_CATEGORY_NAMES.salad)
            : null),
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
        createdAt: initialData.createdAt || (selectedDate ? new Date(selectedDate).toISOString() : null),
      });
    }
  }, [initialData, categories, findCategoryIdByName, selectedDate]);

  const handleSubmit = async () => {
    try {
      let submissionDate = formState.createdAt;
      if (!submissionDate) {
        if (selectedDate) {
          submissionDate = `${selectedDate}T12:00:00.000Z`;
        } else {
          submissionDate = new Date().toISOString();
        }
      }

      const payload: UpdateDailyMenuData = {
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
        createdAt: submissionDate,
        allProteinIds:
          formState.selectedProteinIds.length > 0
            ? formState.selectedProteinIds
            : undefined,
      };

      if (selectedDate) {
        await updateMenuByDate.mutateAsync({ date: selectedDate, data: payload });
      } else {
        await updateMenuToday.mutateAsync(payload);
      }
      
      setIsSaved(true);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update daily menu:", error);
      toast.error("Error al guardar el menú del día");
    }
  };

  const getItemOptions = (items: { id: number; name: string }[]) => [
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

  const selectAllProteins = () => {
    if (proteinItems.data) {
      const allIds = proteinItems.data.map(p => p.id);
      setFormState(prev => ({
        ...prev,
        selectedProteinIds: allIds
      }));
      toast.success("Todas las proteínas seleccionadas");
    }
  };

  const handlePriceUnlock = () => {
    // Basic security check - replace with real password validation if needed
    if (password === "1234") {
      setShowPriceFields(true);
      setPassword("");
      toast.success("Configuración de precios desbloqueada");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };

  const isLoading =
    soupItems.isLoading ||
    principleItems.isLoading ||
    proteinItems.isLoading ||
    drinkItems.isLoading ||
    extraItems.isLoading ||
    saladItems.isLoading ||
    (formState.includeDessert && dessertItems.isLoading);

  const isMutationPending = updateMenuToday.isPending || updateMenuByDate.isPending;

  return (
    <Card variant="elevated" className="p-6 rounded-3xl border-none shadow-smooth-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center shadow-inner">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-carbon-900 tracking-tight">
              {selectedDate ? `Menú para ${selectedDate}` : "Menú del Día"}
            </h2>
            <p className="text-sm text-carbon-500 font-medium">
              Gestiona las opciones disponibles para el almuerzo
            </p>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => setIsPriceModalOpen(true)}
          className="rounded-xl border-sage-200 text-sage-700 hover:bg-sage-50"
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Ajustar Precios
        </Button>
      </div>

      <div className="space-y-8">
        {/* Categories and Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Soup Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
              <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Sopas
            </label>

            {formState.soupCategoryId ? (
              <div className="grid grid-cols-1 gap-3">
                <FilterSelect
                  value={formState.soupOption1Id?.toString() || ""}
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      soupOption1Id: value ? Number(value) : null,
                    })
                  }
                  options={getItemOptions(soupItems.data || [])}
                  placeholder="Opción 1 (Desmarcar)"
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
                  placeholder="Opción 2 (Desmarcar)"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      soupCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Principle Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
              <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Principios
            </label>

            {formState.principleCategoryId ? (
              <div className="grid grid-cols-1 gap-3">
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
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      principleCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Salad Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
              <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Ensaladas
            </label>

            {formState.saladCategoryId ? (
              <div className="grid grid-cols-1 gap-3">
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
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      saladCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Extra Section */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
              <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Extras
            </label>

            {formState.extraCategoryId ? (
              <div className="grid grid-cols-1 gap-3">
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
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      extraCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Drink Section */}
          <div className="space-y-4 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
              <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
              Bebidas
            </label>

            {formState.drinkCategoryId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      drinkCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Protein Section */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
                <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
                Proteínas Disponibles
              </label>
              <button
                type="button"
                onClick={selectAllProteins}
                className="text-xs font-bold text-sage-600 hover:text-sage-700 flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 rounded-lg transition-colors"
              >
                <ListChecks className="w-3.5 h-3.5" />
                Añadir todas
              </button>
            </div>

            {formState.proteinCategoryId ? (
              <div className="">
                {proteinItems.isLoading ? (
                  <p className="text-xs text-carbon-400 animate-pulse">Cargando proteínas...</p>
                ) : proteinItems.data && proteinItems.data.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
                            "flex items-center gap-2 p-3 rounded-2xl border-2 text-left transition-all",
                            "active:scale-95",
                            isSelected
                              ? "border-sage-500 bg-sage-50 text-carbon-900 shadow-sm"
                              : "border-carbon-100 bg-white text-carbon-500 hover:border-sage-200",
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-sage-500 border-sage-500"
                                : "border-carbon-200",
                            )}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white stroke-[4px]" />
                            )}
                          </div>
                          <span className="text-[11px] font-bold truncate">
                            {protein.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl">
                    No hay proteínas en esta categoría.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                  Categoría no detectada. Por favor asígnala manualmente:
                </p>
                <FilterSelect
                  value=""
                  onChange={(value: string) =>
                    setFormState({
                      ...formState,
                      proteinCategoryId: value ? Number(value) : null,
                    })
                  }
                  options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                  placeholder="Vincular categoría..."
                />
              </div>
            )}
          </div>

          {/* Dessert Section */}
          <div className="space-y-4 md:col-span-2 pt-4 border-t border-carbon-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-carbon-800 tracking-wide">
                  <span className="w-1.5 h-4 bg-sage-500 rounded-full" />
                  Postres
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
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
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-carbon-200 rounded-full peer peer-checked:bg-sage-500 transition-colors" />
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-xs font-bold text-carbon-500 group-hover:text-carbon-700 transition-colors">
                    Incluir en el menú
                  </span>
                </label>
              </div>
            </div>

            {formState.includeDessert && (
              <>
                {formState.dessertCategoryId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <div className="space-y-2">
                    <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 font-medium">
                      Categoría no detectada. Por favor asígnala manualmente:
                    </p>
                    <FilterSelect
                      value=""
                      onChange={(value: string) =>
                        setFormState({
                          ...formState,
                          dessertCategoryId: value ? Number(value) : null,
                        })
                      }
                      options={categories?.map(c => ({ value: c.id.toString(), label: c.name })) || []}
                      placeholder="Vincular categoría..."
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end pt-6 border-t border-carbon-100">
          <Button
            onClick={handleSubmit}
            isLoading={isMutationPending || isLoading}
            disabled={isSaved}
            className="rounded-2xl px-10 h-14 shadow-smooth-md"
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Menú Guardado
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Publicar Menú
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Price Configuration Modal */}
      <BaseModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false);
          setShowPriceFields(false);
          setPassword("");
        }}
        title="Ajuste de Precios"
        size="md"
      >
        <div className="p-6 space-y-6">
          {!showPriceFields ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center space-y-2 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-carbon-900 text-lg">Zona Restringida</h3>
                <p className="text-sm text-carbon-500">Ingresa la contraseña de administrador para modificar los precios base.</p>
              </div>
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePriceUnlock()}
                className="text-center text-2xl tracking-[1em]"
              />
              <Button onClick={handlePriceUnlock} fullWidth size="lg">
                Desbloquear
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 rounded-2xl bg-sage-50 border-2 border-sage-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-sage-600 tracking-widest">Margen Base</span>
                    <p className="text-2xl font-semibold text-carbon-900">${formState.basePrice.toLocaleString()}</p>
                  </div>
                  <Settings2 className="w-8 h-8 text-sage-300" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[3000, 4000, 5000].map((price) => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setFormState((prev) => ({ ...prev, basePrice: price }))}
                      className={cn(
                        "py-2 rounded-xl text-xs font-bold transition-all",
                        formState.basePrice === price
                          ? "bg-sage-500 text-white shadow-md"
                          : "bg-white border border-carbon-200 text-carbon-600"
                      )}
                    >
                      ${(price / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <Input
                  type="number"
                  value={formState.basePrice}
                  onChange={(e) => setFormState({ ...formState, basePrice: Number(e.target.value) })}
                  placeholder="Precio personalizado"
                  className="bg-white"
                />
              </div>

              <div className="bg-carbon-50 p-4 rounded-xl text-xs text-carbon-600 space-y-1">
                <p className="font-bold text-carbon-800">Fórmula de cálculo:</p>
                <p>Precio Final = ${formState.basePrice.toLocaleString()} (Base) + Precio Proteína</p>
              </div>

              <Button onClick={() => setIsPriceModalOpen(false)} fullWidth variant="primary" size="lg">
                Confirmar y Cerrar
              </Button>
            </div>
          )}
        </div>
      </BaseModal>
    </Card>
  );
}
