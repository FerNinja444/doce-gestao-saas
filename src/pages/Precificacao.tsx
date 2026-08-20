import { useMemo, useState } from "react";
import { ClipboardList, Pencil, Plus, Trash2, X } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { useMobileMenu } from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import PricingBar from "../components/PricingBar";
import { useAppData } from "../context/AppDataContext";
import { Product, RecipeItem } from "../types";
import { formatCurrency, getPricingBreakdown } from "../lib/calculations";

interface ProductFormState {
  name: string;
  category: string;
  yieldValue: string;
  otherCosts: string;
  targetMarginPercent: string;
  manualPrice: string;
  items: RecipeItem[];
}

function emptyForm(): ProductFormState {
  return {
    name: "",
    category: "",
    yieldValue: "1",
    otherCosts: "0",
    targetMarginPercent: "40",
    manualPrice: "",
    items: [],
  };
}

export default function Precificacao() {
  const { openMobile } = useMobileMenu();
  const { products, ingredients, ingredientsById, addProduct, updateProduct, deleteProduct } =
    useAppData();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productBreakdowns = useMemo(
    () =>
      products.map((product) => ({
        product,
        breakdown: getPricingBreakdown(product, ingredientsById),
      })),
    [products, ingredientsById]
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm());
    setFormOpen(true);
  }

  function openEditForm(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      yieldValue: String(product.yield),
      otherCosts: String(product.otherCosts),
      targetMarginPercent: String(product.targetMarginPercent),
      manualPrice: product.manualPrice !== null ? String(product.manualPrice) : "",
      items: product.items,
    });
    setFormOpen(true);
  }

  function addRecipeItem() {
    if (ingredients.length === 0) return;
    setForm((f) => ({
      ...f,
      items: [...f.items, { ingredientId: ingredients[0].id, quantity: 0 }],
    }));
  }

  function updateRecipeItem(index: number, patch: Partial<RecipeItem>) {
    setForm((f) => ({
      ...f,
      items: f.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  }

  function removeRecipeItem(index: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name: form.name.trim(),
      category: form.category.trim() || "Geral",
      yield: Math.max(1, Number(form.yieldValue) || 1),
      otherCosts: Number(form.otherCosts) || 0,
      targetMarginPercent: Number(form.targetMarginPercent) || 0,
      manualPrice: form.manualPrice.trim() ? Number(form.manualPrice) : null,
      items: form.items.filter((item) => item.quantity > 0),
    };

    if (!data.name) return;

    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }

    setFormOpen(false);
  }

  return (
    <>
      <Topbar
        title="Precificação"
        subtitle="Monte suas receitas e descubra o preço ideal para lucrar de verdade"
        onOpenMobile={openMobile}
        action={
          <button type="button" onClick={openCreateForm} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova receita</span>
          </button>
        }
      />

      <main className="app-shell space-y-5 p-5 sm:p-8">
        {ingredients.length === 0 && (
          <div className="card border-warn/30 bg-warn/5 p-4 text-sm text-cocoa/75">
            Cadastre ingredientes em <span className="font-semibold">Estoque</span> antes de
            montar suas receitas — o custo de cada produto depende deles.
          </div>
        )}

        {productBreakdowns.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma receita cadastrada"
            description="Crie sua primeira receita para calcular custo e preço de venda automaticamente."
            action={
              <button type="button" onClick={openCreateForm} className="btn-primary mt-2">
                <Plus className="h-4 w-4" />
                Nova receita
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {productBreakdowns.map(({ product, breakdown }) => {
              const costPercent =
                breakdown.sellingPrice > 0 ? (breakdown.costPerUnit / breakdown.sellingPrice) * 100 : 0;
              const profitPercent = 100 - costPercent;

              return (
                <div key={product.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-cocoa/45">
                        {product.category}
                      </p>
                      <h3 className="font-display text-lg font-semibold text-cocoa">
                        {product.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-cocoa/50">
                        Rende {product.yield} {product.yield === 1 ? "unidade" : "unidades"}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        aria-label={`Editar ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa/60 hover:bg-cocoa/5"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(product.id)}
                        aria-label={`Excluir ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-surface-sunken/60 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-cocoa/45">Custo/un.</p>
                      <p className="mt-1 font-display text-base font-semibold text-cocoa">
                        {formatCurrency(breakdown.costPerUnit)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-sunken/60 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-cocoa/45">Preço venda</p>
                      <p className="mt-1 font-display text-base font-semibold text-rose-deep">
                        {formatCurrency(breakdown.sellingPrice)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-sunken/60 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-cocoa/45">Lucro/un.</p>
                      <p className="mt-1 font-display text-base font-semibold text-success">
                        {formatCurrency(breakdown.profitPerUnit)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <PricingBar costPercent={costPercent} profitPercent={profitPercent} />
                  </div>

                  {product.manualPrice !== null && (
                    <p className="mt-3 text-xs text-cocoa/45">
                      Preço definido manualmente. Margem alvo era {product.targetMarginPercent}%.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Modal
        title={editingId ? "Editar receita" : "Nova receita"}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prod-name" className="label-field">
                Nome da receita *
              </label>
              <input
                id="prod-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="input-field"
                placeholder="Ex: Bolo de Chocolate"
              />
            </div>
            <div>
              <label htmlFor="prod-category" className="label-field">
                Categoria
              </label>
              <input
                id="prod-category"
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="input-field"
                placeholder="Ex: Bolos, Docinhos..."
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="label-field mb-0">Ingredientes da receita</span>
              <button
                type="button"
                onClick={addRecipeItem}
                disabled={ingredients.length === 0}
                className="flex items-center gap-1 text-xs font-semibold text-rose-deep hover:underline disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar ingrediente
              </button>
            </div>

            {form.items.length === 0 ? (
              <p className="rounded-lg border border-dashed border-cocoa/15 px-4 py-6 text-center text-xs text-cocoa/45">
                Nenhum ingrediente adicionado ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {form.items.map((item, index) => {
                  const ingredient = ingredientsById.get(item.ingredientId);
                  return (
                    <div key={`${item.ingredientId}-${index}`} className="flex items-center gap-2">
                      <select
                        value={item.ingredientId}
                        onChange={(e) => updateRecipeItem(index, { ingredientId: e.target.value })}
                        className="input-field flex-1"
                        aria-label="Ingrediente"
                      >
                        {ingredients.map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateRecipeItem(index, { quantity: Number(e.target.value) || 0 })
                        }
                        className="input-field w-28"
                        placeholder="Qtd."
                        aria-label="Quantidade"
                      />
                      <span className="w-14 shrink-0 text-xs text-cocoa/50">
                        {ingredient?.unit ?? ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeRecipeItem(index)}
                        aria-label="Remover ingrediente"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-cocoa/40 hover:bg-danger/10 hover:text-danger"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label htmlFor="prod-yield" className="label-field">
                Rendimento
              </label>
              <input
                id="prod-yield"
                type="number"
                min="1"
                value={form.yieldValue}
                onChange={(e) => setForm((f) => ({ ...f, yieldValue: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="prod-other" className="label-field">
                Outros custos (R$)
              </label>
              <input
                id="prod-other"
                type="number"
                min="0"
                step="0.01"
                value={form.otherCosts}
                onChange={(e) => setForm((f) => ({ ...f, otherCosts: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="prod-margin" className="label-field">
                Margem alvo (%)
              </label>
              <input
                id="prod-margin"
                type="number"
                min="0"
                max="95"
                value={form.targetMarginPercent}
                onChange={(e) => setForm((f) => ({ ...f, targetMarginPercent: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="prod-manual" className="label-field">
                Preço manual (R$)
              </label>
              <input
                id="prod-manual"
                type="number"
                min="0"
                step="0.01"
                value={form.manualPrice}
                onChange={(e) => setForm((f) => ({ ...f, manualPrice: e.target.value }))}
                className="input-field"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? "Salvar alterações" : "Criar receita"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Excluir receita"
        description="Essa ação não pode ser desfeita. Vendas antigas deste produto continuam no histórico."
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteProduct(deletingId);
          setDeletingId(null);
        }}
      />
    </>
  );
}
