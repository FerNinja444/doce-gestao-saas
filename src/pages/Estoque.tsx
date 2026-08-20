import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CircleArrowDown,
  CircleArrowUp,
  Boxes,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { useMobileMenu } from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { useAppData } from "../context/AppDataContext";
import { Ingredient, Unit } from "../types";
import { formatCurrency } from "../lib/calculations";

const UNITS: Unit[] = ["g", "kg", "ml", "l", "unidade"];

interface IngredientFormState {
  name: string;
  unit: Unit;
  unitCost: string;
  currentStock: string;
  minStock: string;
}

const EMPTY_FORM: IngredientFormState = {
  name: "",
  unit: "g",
  unitCost: "",
  currentStock: "",
  minStock: "",
};

export default function Estoque() {
  const { openMobile } = useMobileMenu();
  const { ingredients, addIngredient, updateIngredient, deleteIngredient, registerStockMovement } =
    useAppData();

  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<IngredientFormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movementTarget, setMovementTarget] = useState<Ingredient | null>(null);
  const [movementType, setMovementType] = useState<"entrada" | "saida">("entrada");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementReason, setMovementReason] = useState("");

  const filteredIngredients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return ingredients;
    return ingredients.filter((i) => i.name.toLowerCase().includes(query));
  }, [ingredients, search]);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(ingredient: Ingredient) {
    setEditingId(ingredient.id);
    setForm({
      name: ingredient.name,
      unit: ingredient.unit,
      unitCost: String(ingredient.unitCost),
      currentStock: String(ingredient.currentStock),
      minStock: String(ingredient.minStock),
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name: form.name.trim(),
      unit: form.unit,
      unitCost: Number(form.unitCost) || 0,
      currentStock: Number(form.currentStock) || 0,
      minStock: Number(form.minStock) || 0,
    };

    if (!data.name) return;

    if (editingId) {
      updateIngredient(editingId, data);
    } else {
      addIngredient(data);
    }

    setFormOpen(false);
  }

  function openMovementModal(ingredient: Ingredient, type: "entrada" | "saida") {
    setMovementTarget(ingredient);
    setMovementType(type);
    setMovementQuantity("");
    setMovementReason(type === "entrada" ? "Compra de insumos" : "Uso em produção");
  }

  function handleMovementSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!movementTarget) return;
    const quantity = Number(movementQuantity);
    if (!quantity || quantity <= 0) return;

    registerStockMovement(movementTarget.id, movementType, quantity, movementReason.trim());
    setMovementTarget(null);
  }

  return (
    <>
      <Topbar
        title="Estoque"
        subtitle="Controle a quantidade e o custo de cada ingrediente"
        onOpenMobile={openMobile}
        action={
          <button type="button" onClick={openCreateForm} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo ingrediente</span>
          </button>
        }
      />

      <main className="app-shell space-y-5 p-5 sm:p-8">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ingrediente..."
            className="input-field pl-10"
            aria-label="Buscar ingrediente"
          />
        </div>

        {filteredIngredients.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title={ingredients.length === 0 ? "Nenhum ingrediente cadastrado" : "Nada encontrado"}
            description={
              ingredients.length === 0
                ? "Cadastre os ingredientes que você usa nas receitas para acompanhar o estoque."
                : "Tente buscar por outro nome."
            }
            action={
              ingredients.length === 0 ? (
                <button type="button" onClick={openCreateForm} className="btn-primary mt-2">
                  <Plus className="h-4 w-4" />
                  Novo ingrediente
                </button>
              ) : undefined
            }
          />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-cocoa/8 bg-surface-sunken/50 text-xs uppercase tracking-wide text-cocoa/55">
                    <th className="px-5 py-3 font-semibold">Ingrediente</th>
                    <th className="px-5 py-3 font-semibold">Custo unitário</th>
                    <th className="px-5 py-3 font-semibold">Estoque atual</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient) => {
                    const isLow = ingredient.currentStock <= ingredient.minStock;
                    return (
                      <tr key={ingredient.id} className="border-b border-cocoa/6 last:border-0">
                        <td className="px-5 py-3.5 font-medium text-cocoa">{ingredient.name}</td>
                        <td className="px-5 py-3.5 text-cocoa/75">
                          {formatCurrency(ingredient.unitCost)}
                          <span className="text-cocoa/40"> / {ingredient.unit}</span>
                        </td>
                        <td className="px-5 py-3.5 text-cocoa/75">
                          {ingredient.currentStock} {ingredient.unit}
                          <span className="text-cocoa/40"> (mín. {ingredient.minStock})</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {isLow ? (
                            <Badge tone="danger">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Estoque baixo
                            </Badge>
                          ) : (
                            <Badge tone="success">Ok</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openMovementModal(ingredient, "entrada")}
                              aria-label={`Registrar entrada de estoque para ${ingredient.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-success hover:bg-success/10"
                              title="Registrar entrada"
                            >
                              <CircleArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openMovementModal(ingredient, "saida")}
                              aria-label={`Registrar saída de estoque para ${ingredient.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-warn hover:bg-warn/10"
                              title="Registrar saída"
                            >
                              <CircleArrowDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditForm(ingredient)}
                              aria-label={`Editar ${ingredient.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-cocoa/60 hover:bg-cocoa/5"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(ingredient.id)}
                              aria-label={`Excluir ${ingredient.name}`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Formulário de criação/edição */}
      <Modal
        title={editingId ? "Editar ingrediente" : "Novo ingrediente"}
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ing-name" className="label-field">
              Nome *
            </label>
            <input
              id="ing-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input-field"
              placeholder="Ex: Farinha de trigo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ing-unit" className="label-field">
                Unidade de medida
              </label>
              <select
                id="ing-unit"
                value={form.unit}
                onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value as Unit }))}
                className="input-field"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ing-cost" className="label-field">
                Custo por {form.unit} (R$) *
              </label>
              <input
                id="ing-cost"
                type="number"
                step="0.001"
                min="0"
                required
                value={form.unitCost}
                onChange={(e) => setForm((f) => ({ ...f, unitCost: e.target.value }))}
                className="input-field"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="ing-stock" className="label-field">
                Estoque atual
              </label>
              <input
                id="ing-stock"
                type="number"
                step="0.01"
                min="0"
                value={form.currentStock}
                onChange={(e) => setForm((f) => ({ ...f, currentStock: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="ing-min" className="label-field">
                Estoque mínimo
              </label>
              <input
                id="ing-min"
                type="number"
                step="0.01"
                min="0"
                value={form.minStock}
                onChange={(e) => setForm((f) => ({ ...f, minStock: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? "Salvar alterações" : "Adicionar ingrediente"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Movimentação de estoque */}
      <Modal
        title={movementType === "entrada" ? "Registrar entrada" : "Registrar saída"}
        isOpen={Boolean(movementTarget)}
        onClose={() => setMovementTarget(null)}
        maxWidth="max-w-sm"
      >
        {movementTarget && (
          <form onSubmit={handleMovementSubmit} className="space-y-4">
            <p className="text-sm text-cocoa/70">
              Ingrediente: <span className="font-semibold text-cocoa">{movementTarget.name}</span>
            </p>
            <div>
              <label htmlFor="mov-qty" className="label-field">
                Quantidade ({movementTarget.unit}) *
              </label>
              <input
                id="mov-qty"
                type="number"
                step="0.01"
                min="0"
                required
                value={movementQuantity}
                onChange={(e) => setMovementQuantity(e.target.value)}
                className="input-field"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="mov-reason" className="label-field">
                Motivo
              </label>
              <input
                id="mov-reason"
                type="text"
                value={movementReason}
                onChange={(e) => setMovementReason(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setMovementTarget(null)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Confirmar
              </button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Excluir ingrediente"
        description="Essa ação não pode ser desfeita. Receitas que usam este ingrediente ficarão com o custo incompleto."
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteIngredient(deletingId);
          setDeletingId(null);
        }}
      />
    </>
  );
}
