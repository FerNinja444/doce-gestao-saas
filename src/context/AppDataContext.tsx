import { createContext, ReactNode, useContext, useMemo } from "react";
import { Ingredient, Product, Sale, StockMovement } from "../types";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { generateId } from "../lib/id";
import { seedIngredients, seedProducts, seedSales } from "../lib/seedData";

interface AppDataContextValue {
  ingredients: Ingredient[];
  products: Product[];
  sales: Sale[];
  stockMovements: StockMovement[];
  ingredientsById: Map<string, Ingredient>;
  productsById: Map<string, Product>;

  addIngredient: (data: Omit<Ingredient, "id" | "updatedAt">) => void;
  updateIngredient: (id: string, data: Omit<Ingredient, "id" | "updatedAt">) => void;
  deleteIngredient: (id: string) => void;
  registerStockMovement: (ingredientId: string, type: "entrada" | "saida", quantity: number, reason: string) => void;

  addProduct: (data: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, data: Omit<Product, "id" | "createdAt">) => void;
  deleteProduct: (id: string) => void;

  addSale: (data: Omit<Sale, "id">) => void;
  deleteSale: (id: string) => void;

  resetDemoData: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useLocalStorageState<Ingredient[]>(
    "doce-gestao:ingredients",
    seedIngredients
  );
  const [products, setProducts] = useLocalStorageState<Product[]>(
    "doce-gestao:products",
    seedProducts
  );
  const [sales, setSales] = useLocalStorageState<Sale[]>("doce-gestao:sales", seedSales);
  const [stockMovements, setStockMovements] = useLocalStorageState<StockMovement[]>(
    "doce-gestao:stock-movements",
    []
  );

  const ingredientsById = useMemo(
    () => new Map(ingredients.map((i) => [i.id, i])),
    [ingredients]
  );
  const productsById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  function addIngredient(data: Omit<Ingredient, "id" | "updatedAt">) {
    const ingredient: Ingredient = {
      ...data,
      id: generateId("ing"),
      updatedAt: new Date().toISOString(),
    };
    setIngredients((prev) => [...prev, ingredient]);
  }

  function updateIngredient(id: string, data: Omit<Ingredient, "id" | "updatedAt">) {
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...data, id, updatedAt: new Date().toISOString() } : i))
    );
  }

  function deleteIngredient(id: string) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  }

  function registerStockMovement(
    ingredientId: string,
    type: "entrada" | "saida",
    quantity: number,
    reason: string
  ) {
    const movement: StockMovement = {
      id: generateId("mov"),
      ingredientId,
      type,
      quantity,
      reason,
      date: new Date().toISOString(),
    };
    setStockMovements((prev) => [movement, ...prev]);

    setIngredients((prev) =>
      prev.map((ingredient) => {
        if (ingredient.id !== ingredientId) return ingredient;
        const delta = type === "entrada" ? quantity : -quantity;
        const nextStock = Math.max(0, ingredient.currentStock + delta);
        return { ...ingredient, currentStock: nextStock, updatedAt: new Date().toISOString() };
      })
    );
  }

  function addProduct(data: Omit<Product, "id" | "createdAt">) {
    const product: Product = { ...data, id: generateId("prod"), createdAt: new Date().toISOString() };
    setProducts((prev) => [...prev, product]);
  }

  function updateProduct(id: string, data: Omit<Product, "id" | "createdAt">) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...data, id, createdAt: p.createdAt } : p))
    );
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function addSale(data: Omit<Sale, "id">) {
    const sale: Sale = { ...data, id: generateId("sale") };
    setSales((prev) => [sale, ...prev]);
  }

  function deleteSale(id: string) {
    setSales((prev) => prev.filter((s) => s.id !== id));
  }

  function resetDemoData() {
    setIngredients(seedIngredients);
    setProducts(seedProducts);
    setSales(seedSales);
    setStockMovements([]);
  }

  const value: AppDataContextValue = {
    ingredients,
    products,
    sales,
    stockMovements,
    ingredientsById,
    productsById,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    registerStockMovement,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    deleteSale,
    resetDemoData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData deve ser usado dentro de AppDataProvider");
  return ctx;
}
