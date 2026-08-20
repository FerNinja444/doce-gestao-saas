import { useMemo } from "react";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Topbar from "../components/layout/Topbar";
import { useMobileMenu } from "../components/layout/AppLayout";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, getPricingBreakdown } from "../lib/calculations";

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export default function Dashboard() {
  const { openMobile } = useMobileMenu();
  const { sales, ingredients, products, productsById, ingredientsById } = useAppData();

  const today = isoDaysAgo(0);

  const salesToday = useMemo(() => sales.filter((s) => s.date === today), [sales, today]);
  const revenueToday = salesToday.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);

  const last7Days = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => isoDaysAgo(6 - i));
    return days.map((date) => {
      const daySales = sales.filter((s) => s.date === date);
      const revenue = daySales.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
      const weekday = WEEKDAY_LABELS[new Date(`${date}T12:00:00`).getDay()];
      return { date, label: weekday, revenue };
    });
  }, [sales]);

  const revenue7Days = last7Days.reduce((sum, d) => sum + d.revenue, 0);

  const totalOrdersLast7Days = useMemo(
    () => sales.filter((s) => last7Days.some((d) => d.date === s.date)).length,
    [sales, last7Days]
  );
  const averageTicket = totalOrdersLast7Days > 0 ? revenue7Days / totalOrdersLast7Days : 0;

  const lowStockIngredients = useMemo(
    () => ingredients.filter((i) => i.currentStock <= i.minStock),
    [ingredients]
  );

  const topProducts = useMemo(() => {
    const totals = new Map<string, number>();
    sales
      .filter((s) => last7Days.some((d) => d.date === s.date))
      .forEach((s) => {
        totals.set(s.productId, (totals.get(s.productId) ?? 0) + s.quantity * s.unitPrice);
      });
    return Array.from(totals.entries())
      .map(([productId, total]) => ({ product: productsById.get(productId), total }))
      .filter((entry) => entry.product)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [sales, last7Days, productsById]);

  const mostProfitableProduct = useMemo(() => {
    if (products.length === 0) return null;
    return products
      .map((product) => ({
        product,
        breakdown: getPricingBreakdown(product, ingredientsById),
      }))
      .sort((a, b) => b.breakdown.realMarginPercent - a.breakdown.realMarginPercent)[0];
  }, [products, ingredientsById]);

  return (
    <>
      <Topbar
        title="Visão geral"
        subtitle="Acompanhe o desempenho da sua confeitaria em tempo real"
        onOpenMobile={openMobile}
      />

      <main className="app-shell space-y-6 p-5 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Vendas hoje"
            value={formatCurrency(revenueToday)}
            icon={DollarSign}
            tone="rose"
          />
          <StatCard
            label="Faturamento (7 dias)"
            value={formatCurrency(revenue7Days)}
            icon={Wallet}
            tone="gold"
          />
          <StatCard
            label="Ticket médio (7 dias)"
            value={formatCurrency(averageTicket)}
            icon={ShoppingCart}
            tone="cocoa"
          />
          <StatCard
            label="Ingredientes em alerta"
            value={String(lowStockIngredients.length)}
            icon={AlertTriangle}
            tone={lowStockIngredients.length > 0 ? "danger" : "success"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="card p-5 xl:col-span-2">
            <h2 className="font-display text-base font-semibold text-cocoa">
              Faturamento dos últimos 7 dias
            </h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#4A2E2314" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#4A2E2399", fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#4A2E2399", fontSize: 12 }}
                    tickFormatter={(v: number) => `R$${v}`}
                    width={56}
                  />
                  <Tooltip
                    cursor={{ fill: "#4A2E2308" }}
                    formatter={(value: number) => [formatCurrency(value), "Faturamento"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #4A2E2314",
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="revenue" fill="#C08573" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-display text-base font-semibold text-cocoa">
              Mais vendidos (7 dias)
            </h2>
            {topProducts.length === 0 ? (
              <p className="mt-8 text-center text-sm text-cocoa/50">
                Ainda não há vendas registradas neste período.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {topProducts.map((entry, index) => (
                  <li key={entry.product!.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cocoa/8 text-xs font-semibold text-cocoa">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-cocoa">{entry.product!.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-rose-deep">
                      {formatCurrency(entry.total)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Boxes className="h-4 w-4 text-rose-deep" />
              <h2 className="font-display text-base font-semibold text-cocoa">
                Estoque baixo
              </h2>
            </div>
            {lowStockIngredients.length === 0 ? (
              <EmptyState
                icon={Boxes}
                title="Tudo em dia"
                description="Nenhum ingrediente está abaixo do estoque mínimo."
              />
            ) : (
              <ul className="space-y-2.5">
                {lowStockIngredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center justify-between rounded-lg bg-danger/5 px-3.5 py-2.5"
                  >
                    <span className="text-sm font-medium text-cocoa">{ingredient.name}</span>
                    <span className="text-xs font-semibold text-danger">
                      {ingredient.currentStock} / mín. {ingredient.minStock} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-display text-base font-semibold text-cocoa">
              Produto mais rentável
            </h2>
            {mostProfitableProduct ? (
              <div className="mt-4">
                <p className="font-display text-lg font-semibold text-cocoa">
                  {mostProfitableProduct.product.name}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-cocoa/50">Margem real</p>
                    <p className="font-semibold text-success">
                      {mostProfitableProduct.breakdown.realMarginPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cocoa/50">Lucro por unidade</p>
                    <p className="font-semibold text-cocoa">
                      {formatCurrency(mostProfitableProduct.breakdown.profitPerUnit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cocoa/50">Preço de venda</p>
                    <p className="font-semibold text-cocoa">
                      {formatCurrency(mostProfitableProduct.breakdown.sellingPrice)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={DollarSign}
                title="Nenhum produto cadastrado"
                description="Cadastre uma receita em Precificação para ver esta análise."
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
