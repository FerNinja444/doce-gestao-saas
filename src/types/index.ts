export type Unit = "g" | "kg" | "ml" | "l" | "unidade";

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  /** Custo pago pela unidade de medida (ex: custo por grama, por ml, por unidade) */
  unitCost: number;
  currentStock: number;
  minStock: number;
  updatedAt: string; // ISO date
}

export interface RecipeItem {
  ingredientId: string;
  /** Quantidade do ingrediente usada na receita, na mesma unidade do ingrediente */
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  items: RecipeItem[];
  /** Rendimento: quantas unidades a receita produz (ex: 1 bolo, 20 docinhos) */
  yield: number;
  /** Outros custos fixos da receita (embalagem, mão de obra, gás etc.) */
  otherCosts: number;
  /** Margem de lucro desejada, em % sobre o preço de venda */
  targetMarginPercent: number;
  /** Preço de venda definido manualmente (se vazio, usa o preço sugerido) */
  manualPrice: number | null;
  createdAt: string;
}

export type StockMovementType = "entrada" | "saida";

export interface StockMovement {
  id: string;
  ingredientId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  date: string; // ISO date
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  date: string; // ISO date (yyyy-mm-dd)
  channel: SaleChannel;
}

export type SaleChannel = "whatsapp" | "instagram" | "loja" | "encomenda" | "outro";

export interface AuthUser {
  name: string;
  email: string;
}
