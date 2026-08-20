interface PricingBarProps {
  costPercent: number;
  profitPercent: number;
}

/**
 * Elemento assinatura do produto: uma barra que reparte visualmente
 * o preço de venda entre "custo da receita" e "seu lucro" — a
 * materialização direta da proposta "transforme receitas em lucro".
 */
export default function PricingBar({ costPercent, profitPercent }: PricingBarProps) {
  const cost = Math.max(0, Math.min(100, costPercent));
  const profit = Math.max(0, Math.min(100, profitPercent));

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-cocoa/8">
        <div
          className="h-full bg-cocoa/40 transition-all duration-500"
          style={{ width: `${cost}%` }}
        />
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${profit}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-cocoa/55">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cocoa/40" />
          Custo da receita ({cost.toFixed(0)}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-gold" />
          Seu lucro ({profit.toFixed(0)}%)
        </span>
      </div>
    </div>
  );
}
