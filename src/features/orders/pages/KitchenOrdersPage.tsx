import { KitchenKanban } from "../components/kitchen";
import { useDailyMenuToday } from "@/features/menu/hooks/useDailyMenu";

export function KitchenOrdersPage() {
  const { data: dailyMenu } = useDailyMenuToday();

  const proteinId = dailyMenu?.proteinCategory?.id;
  const extraId = dailyMenu?.extraCategory?.id;

  return (
    <KitchenKanban 
      proteinCategoryIds={proteinId ? [proteinId] : undefined}
      extraCategoryIds={extraId ? [extraId] : undefined}
    />
  );
}
