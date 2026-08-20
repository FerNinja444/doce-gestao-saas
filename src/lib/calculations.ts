import { Ingredient, Product, RecipeItem } from "../types";

/** Custo total dos ingredientes usados em uma receita. */
export function calculateIngredientsCost(
  items: RecipeItem[],
  ingredientsById: Map<string, Ingredient>
): number {
  return items.reduce((total, item) => {
    const ingredient = ingredientsById.get(item.ingredientId);
    if (!ingredient) return total;
    return total + ingredient.unitCost * item.quantity;
  }, 0);
}

/** Custo total da receita (ingredientes + outros custos). */
export function calculateTotalRecipeCost(
  product: Product,
  ingredientsById: Map<string, Ingredient>
): number {
  const ingredientsCost = calculateIngredientsCost(product.items, ingredientsById);
  return ingredientsCost + product.otherCosts;
}

/** Custo por unidade produzida (considerando o rendimento da receita). */
export function calculateCostPerUnit(
  product: Product,
  ingredientsById: Map<string, Ingredient>
): number {
  const total = calculateTotalRecipeCost(product, ingredientsById);
  if (product.yield <= 0) return total;
  return total / product.yield;
}

/**
 * Preço sugerido para atingir a margem de lucro desejada.
 * Margem sobre o preço de venda (não sobre o custo): price = cost / (1 - margin%)
 */
export function calculateSuggestedPrice(costPerUnit: number, marginPercent: number): number {
  const margin = Math.min(Math.max(marginPercent, 0), 95) / 100;
  if (margin >= 1) return costPerUnit;
  return costPerUnit / (1 - margin);
}

/** Preço final: manual se definido, senão o sugerido pela margem. */
export function resolveSellingPrice(product: Product, costPerUnit: number): number {
  if (product.manualPrice !== null && product.manualPrice > 0) {
    return product.manualPrice;
  }
  return calculateSuggestedPrice(costPerUnit, product.targetMarginPercent);
}

export interface PricingBreakdown {
  costPerUnit: number;
  sellingPrice: number;
  profitPerUnit: number;
  realMarginPercent: number;
}

export function getPricingBreakdown(
  product: Product,
  ingredientsById: Map<string, Ingredient>
): PricingBreakdown {
  const costPerUnit = calculateCostPerUnit(product, ingredientsById);
  const sellingPrice = resolveSellingPrice(product, costPerUnit);
  const profitPerUnit = sellingPrice - costPerUnit;
  const realMarginPercent = sellingPrice > 0 ? (profitPerUnit / sellingPrice) * 100 : 0;

  return { costPerUnit, sellingPrice, profitPerUnit, realMarginPercent };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatPercent(value: number): string {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}
