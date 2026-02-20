/**
 * Kitchen Category Configuration
 *
 * Defines which category IDs are considered "preparable" items
 * in the kitchen view. These items will show checkboxes and
 * affect order status transitions.
 *
 * NOTE: These IDs should match the database category IDs.
 * Configure these values based on your menu setup.
 */

export interface KitchenCategoryConfig {
  /** Category IDs for proteins (pollo, res, cerdo, pescado) */
  proteinCategoryIds: number[];
  /** Category IDs for extras (adicionales) */
  extraCategoryIds: number[];
}

export const DEFAULT_KITCHEN_CATEGORIES: KitchenCategoryConfig = {
  proteinCategoryIds: [2], // TODO: Adjust to match your protein category ID
  extraCategoryIds: [6], // TODO: Adjust to match your extras category ID
};

/**
 * Checks if a category ID is a preparable category
 */
export function isPreparableCategory(
  categoryId: number | undefined,
  config: KitchenCategoryConfig = DEFAULT_KITCHEN_CATEGORIES,
): boolean {
  if (!categoryId) return false;
  return (
    config.proteinCategoryIds.includes(categoryId) ||
    config.extraCategoryIds.includes(categoryId)
  );
}

/**
 * Checks if a category ID is a protein category
 */
export function isProteinCategory(
  categoryId: number | undefined,
  config: KitchenCategoryConfig = DEFAULT_KITCHEN_CATEGORIES,
): boolean {
  if (!categoryId) return false;
  return config.proteinCategoryIds.includes(categoryId);
}

/**
 * Checks if a category ID is an extra category
 */
export function isExtraCategory(
  categoryId: number | undefined,
  config: KitchenCategoryConfig = DEFAULT_KITCHEN_CATEGORIES,
): boolean {
  if (!categoryId) return false;
  return config.extraCategoryIds.includes(categoryId);
}
