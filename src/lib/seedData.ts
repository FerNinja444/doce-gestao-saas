import { Ingredient, Product, Sale } from "../types";

const now = new Date().toISOString();

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Dados de demonstração para que o dashboard não comece vazio.
 * TODO (empresa real): apagar estes dados em "Configurações" antes do uso real.
 */
export const seedIngredients: Ingredient[] = [
  { id: "ing_farinha", name: "Farinha de trigo", unit: "g", unitCost: 0.008, currentStock: 8000, minStock: 2000, updatedAt: now },
  { id: "ing_acucar", name: "Açúcar refinado", unit: "g", unitCost: 0.006, currentStock: 6000, minStock: 1500, updatedAt: now },
  { id: "ing_ovos", name: "Ovos", unit: "unidade", unitCost: 0.9, currentStock: 36, minStock: 12, updatedAt: now },
  { id: "ing_manteiga", name: "Manteiga", unit: "g", unitCost: 0.045, currentStock: 2000, minStock: 500, updatedAt: now },
  { id: "ing_chocolate", name: "Chocolate 70% belga", unit: "g", unitCost: 0.09, currentStock: 1500, minStock: 1000, updatedAt: now },
  { id: "ing_leite_condensado", name: "Leite condensado", unit: "g", unitCost: 0.02, currentStock: 1200, minStock: 800, updatedAt: now },
  { id: "ing_creme_leite", name: "Creme de leite", unit: "g", unitCost: 0.018, currentStock: 900, minStock: 600, updatedAt: now },
  { id: "ing_coco", name: "Coco ralado fresco", unit: "g", unitCost: 0.03, currentStock: 400, minStock: 500, updatedAt: now },
];

export const seedProducts: Product[] = [
  {
    id: "prod_brownie",
    name: "Brownie Tradicional (assadeira)",
    category: "Sobremesas",
    yield: 20,
    otherCosts: 8,
    targetMarginPercent: 45,
    manualPrice: null,
    createdAt: now,
    items: [
      { ingredientId: "ing_chocolate", quantity: 400 },
      { ingredientId: "ing_manteiga", quantity: 200 },
      { ingredientId: "ing_acucar", quantity: 300 },
      { ingredientId: "ing_farinha", quantity: 150 },
      { ingredientId: "ing_ovos", quantity: 4 },
    ],
  },
  {
    id: "prod_bolo_chocolate",
    name: "Bolo de Chocolate (unidade)",
    category: "Bolos",
    yield: 1,
    otherCosts: 6,
    targetMarginPercent: 50,
    manualPrice: null,
    createdAt: now,
    items: [
      { ingredientId: "ing_chocolate", quantity: 250 },
      { ingredientId: "ing_farinha", quantity: 300 },
      { ingredientId: "ing_acucar", quantity: 250 },
      { ingredientId: "ing_ovos", quantity: 4 },
      { ingredientId: "ing_manteiga", quantity: 150 },
    ],
  },
  {
    id: "prod_brigadeiro",
    name: "Brigadeiro Gourmet (caixa 12un)",
    category: "Docinhos",
    yield: 12,
    otherCosts: 4,
    targetMarginPercent: 55,
    manualPrice: null,
    createdAt: now,
    items: [
      { ingredientId: "ing_leite_condensado", quantity: 395 },
      { ingredientId: "ing_chocolate", quantity: 100 },
      { ingredientId: "ing_manteiga", quantity: 20 },
    ],
  },
  {
    id: "prod_beijinho",
    name: "Beijinho Especial (caixa 12un)",
    category: "Docinhos",
    yield: 12,
    otherCosts: 4,
    targetMarginPercent: 55,
    manualPrice: null,
    createdAt: now,
    items: [
      { ingredientId: "ing_leite_condensado", quantity: 395 },
      { ingredientId: "ing_coco", quantity: 80 },
      { ingredientId: "ing_manteiga", quantity: 15 },
    ],
  },
];

export const seedSales: Sale[] = [
  { id: "sale_1", productId: "prod_brownie", quantity: 6, unitPrice: 12, date: isoDaysAgo(0), channel: "whatsapp" },
  { id: "sale_2", productId: "prod_bolo_chocolate", quantity: 1, unitPrice: 95, date: isoDaysAgo(0), channel: "instagram" },
  { id: "sale_3", productId: "prod_brigadeiro", quantity: 3, unitPrice: 42, date: isoDaysAgo(1), channel: "whatsapp" },
  { id: "sale_4", productId: "prod_beijinho", quantity: 2, unitPrice: 38, date: isoDaysAgo(1), channel: "loja" },
  { id: "sale_5", productId: "prod_brownie", quantity: 10, unitPrice: 12, date: isoDaysAgo(2), channel: "encomenda" },
  { id: "sale_6", productId: "prod_bolo_chocolate", quantity: 2, unitPrice: 95, date: isoDaysAgo(3), channel: "whatsapp" },
  { id: "sale_7", productId: "prod_brigadeiro", quantity: 5, unitPrice: 42, date: isoDaysAgo(4), channel: "instagram" },
  { id: "sale_8", productId: "prod_brownie", quantity: 8, unitPrice: 12, date: isoDaysAgo(5), channel: "loja" },
  { id: "sale_9", productId: "prod_beijinho", quantity: 4, unitPrice: 38, date: isoDaysAgo(6), channel: "whatsapp" },
];
