import { useMemo, useState } from "react";
import { Filter, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Topbar from "../components/layout/Topbar";
import { useMobileMenu } from "../components/layout/AppLayout";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { useAppData } from "../context/AppDataContext";
import { SaleChannel } from "../types";
import { formatCurrency, getPricingBreakdown } from "../lib/calculations";

const CHANNEL_LABELS: Record<SaleChannel, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  loja: "Loja física",
  encomenda: "Encomenda",
  outro: "Outro",
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface SaleFormState {
  productId: string;
  quantity: string;
  unitPrice: string;
  date: string;
  channel: SaleChannel;
}

export default function Vendas() {
  const { openMobile } = useMobileMenu();
  const { sales, products, productsById, ingredientsById, addSale, deleteSale } = useAppData();

  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<SaleChannel | "todos">("todos");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [form, setForm] = useState<SaleFormState>({
    productId: products[0]?.id ?? "",
    quantity: "1",
    unitPrice: "",
    date: todayIso(),
    channel: "whatsapp",
  });

  function openCreateForm() {
    const firstProduct = products[0];
    const suggestedPrice = firstProduct
      ? getPricingBreakdown(firstProduct, ingredientsById).sellingPrice
      : 0;
    setForm({
      productId: firstProduct?.id ?? "",
      quantity: "1",
      unitPrice: suggestedPrice ? suggestedPrice.toFixed(2) : "",
      date: todayIso(),
      channel: "whatsapp",
    });
    setFormOpen(true);
  }

  function handleProductChange(productId: string) {
    const product = productsById.get(productId);
    const suggestedPrice = product
      ? getPricingBreakdown(product, ingredientsById).sellingPrice
      : 0;
    setForm((f) => ({
      ...f,
      productId,
      unitPrice: suggestedPrice ? suggestedPrice.toFixed(2) : f.unitPrice,
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.productId) return;

    addSale({
      productId: form.productId,
      quantity: Math.max(1, Number(form.quantity) || 1),
      unitPrice: Number(form.unitPrice) || 0,
      date: form.date || todayIso(),
      channel: form.channel,
    });

    setFormOpen(false);
  }

  const filteredSales = useMemo(() => {
    return sales
      .filter((s) => channelFilter === "todos" || s.channel === channelFilter)
      .filter((s) => !dateFilter || s.date === dateFilter)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [sales, channelFilter, dateFilter]);

  const totalFiltered = filteredSales.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);

  return (
    <>
      <Topbar
        title="Vendas"
        subtitle="Registre e acompanhe suas vendas diárias"
        onOpenMobile={openMobile}
        action={
          <button
            type="button"
            onClick={openCreateForm}
            disabled={products.length === 0}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Registrar venda</span>
          </button>
        }
      />

      <main className="app-shell space-y-5 p-5 sm:p-8">
        {products.length === 0 && (
          <div className="card border-warn/30 bg-warn/5 p-4 text-sm text-cocoa/75">
            Cadastre uma receita em <span className="font-semibold">Precificação</span> antes de
            registrar vendas.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cocoa/50">
            <Filter className="h-3.5 w-3.5" />
            Filtros
          </div>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as SaleChannel | "todos")}
            className="input-field w-auto"
            aria-label="Filtrar por canal"
          >
            <option value="todos">Todos os canais</option>
            {(Object.keys(CHANNEL_LABELS) as SaleChannel[]).map((channel) => (
              <option key={channel} value={channel}>
                {CHANNEL_LABELS[channel]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field w-auto"
            aria-label="Filtrar por data"
          />
          {(channelFilter !== "todos" || dateFilter) && (
            <button
              type="button"
              onClick={() => {
                setChannelFilter("todos");
                setDateFilter("");
              }}
              className="text-xs font-semibold text-rose-deep hover:underline"
            >
              Limpar filtros
            </button>
          )}
          <span className="ml-auto text-sm text-cocoa/60">
            Total no período:{" "}
            <span className="font-semibold text-cocoa">{formatCurrency(totalFiltered)}</span>
          </span>
        </div>

        {filteredSales.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Nenhuma venda encontrada"
            description={
              sales.length === 0
                ? "Registre sua primeira venda para começar a acompanhar o faturamento."
                : "Tente ajustar os filtros."
            }
            action={
              sales.length === 0 && products.length > 0 ? (
                <button type="button" onClick={openCreateForm} className="btn-primary mt-2">
                  <Plus className="h-4 w-4" />
                  Registrar venda
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
                    <th className="px-5 py-3 font-semibold">Data</th>
                    <th className="px-5 py-3 font-semibold">Produto</th>
                    <th className="px-5 py-3 font-semibold">Qtd.</th>
                    <th className="px-5 py-3 font-semibold">Preço un.</th>
                    <th className="px-5 py-3 font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Canal</th>
                    <th className="px-5 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => {
                    const product = productsById.get(sale.productId);
                    return (
                      <tr key={sale.id} className="border-b border-cocoa/6 last:border-0">
                        <td className="px-5 py-3.5 text-cocoa/75">
                          {new Date(`${sale.date}T12:00:00`).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-cocoa">
                          {product?.name ?? "Produto removido"}
                        </td>
                        <td className="px-5 py-3.5 text-cocoa/75">{sale.quantity}</td>
                        <td className="px-5 py-3.5 text-cocoa/75">
                          {formatCurrency(sale.unitPrice)}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-rose-deep">
                          {formatCurrency(sale.quantity * sale.unitPrice)}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge tone="neutral">{CHANNEL_LABELS[sale.channel]}</Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => setDeletingId(sale.id)}
                            aria-label="Excluir venda"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-danger/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      <Modal title="Registrar venda" isOpen={formOpen} onClose={() => setFormOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="sale-product" className="label-field">
              Produto *
            </label>
            <select
              id="sale-product"
              required
              value={form.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="input-field"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sale-qty" className="label-field">
                Quantidade
              </label>
              <input
                id="sale-qty"
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="sale-price" className="label-field">
                Preço unitário (R$)
              </label>
              <input
                id="sale-price"
                type="number"
                min="0"
                step="0.01"
                value={form.unitPrice}
                onChange={(e) => setForm((f) => ({ ...f, unitPrice: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sale-date" className="label-field">
                Data
              </label>
              <input
                id="sale-date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="sale-channel" className="label-field">
                Canal de venda
              </label>
              <select
                id="sale-channel"
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as SaleChannel }))}
                className="input-field"
              >
                {(Object.keys(CHANNEL_LABELS) as SaleChannel[]).map((channel) => (
                  <option key={channel} value={channel}>
                    {CHANNEL_LABELS[channel]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setFormOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Registrar venda
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Excluir venda"
        description="Essa ação não pode ser desfeita."
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteSale(deletingId);
          setDeletingId(null);
        }}
      />
    </>
  );
}
