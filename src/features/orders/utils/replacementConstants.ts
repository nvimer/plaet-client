import { Soup, Salad, CupSoda, IceCream, Utensils, PackageCheck, type LucideIcon } from "lucide-react";

export type ReplacementCategory = "soup" | "principle" | "salad" | "drink" | "extra" | "rice";

export const CATEGORY_NAMES: Record<ReplacementCategory, string> = {
  soup: "Sopa",
  principle: "Principio",
  salad: "Ensalada",
  drink: "Bebida",
  extra: "Extra",
  rice: "Arroz",
};

export const CATEGORY_ICONS: Record<ReplacementCategory, LucideIcon> = {
  soup: Soup,
  principle: Utensils,
  salad: Salad,
  drink: CupSoda,
  extra: IceCream,
  rice: PackageCheck,
};

export interface CategoryInfo {
  key: ReplacementCategory;
  name: string;
  icon: LucideIcon;
  hasItems: boolean;
}

export function getReplaceableCategories(
  availableItems: Record<string, { length: number }>
): CategoryInfo[] {
  const categories: CategoryInfo[] = [
    { key: "soup", name: CATEGORY_NAMES.soup, icon: CATEGORY_ICONS.soup, hasItems: availableItems.soup?.length > 0 },
    { key: "principle", name: CATEGORY_NAMES.principle, icon: CATEGORY_ICONS.principle, hasItems: availableItems.principle?.length > 0 },
    { key: "salad", name: CATEGORY_NAMES.salad, icon: CATEGORY_ICONS.salad, hasItems: availableItems.salad?.length > 0 },
    { key: "drink", name: CATEGORY_NAMES.drink, icon: CATEGORY_ICONS.drink, hasItems: availableItems.drink?.length > 0 },
    { key: "extra", name: CATEGORY_NAMES.extra, icon: CATEGORY_ICONS.extra, hasItems: availableItems.extra?.length > 0 },
    { key: "rice", name: CATEGORY_NAMES.rice, icon: CATEGORY_ICONS.rice, hasItems: (availableItems.rice?.length || 0) > 0 },
  ];
  return categories.filter((c) => c.hasItems);
}
