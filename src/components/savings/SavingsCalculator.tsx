import { useMemo } from 'react';
import { Card } from '@/components/ui/card';

interface Props {
  principal: number;
  annualRate: number;
  termMonths: number;
  currencyCode: string;
}

function formatNumber(n: number, currencyCode: string): string {
  if (!Number.isFinite(n)) return '-';
  try {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currencyCode}`;
  }
}

export function SavingsCalculator({ principal, annualRate, termMonths, currencyCode }: Props) {
  const monthlyInterest = useMemo(
    () => (principal && annualRate ? (principal * annualRate) / 1200 : 0),
    [principal, annualRate]
  );
  const totalInterest = useMemo(() => monthlyInterest * termMonths, [monthlyInterest, termMonths]);
  const penalty = useMemo(() => principal * 0.01, [principal]);

  return (
    <Card className="p-6 sticky top-24" data-testid="savings-calculator">
      <h3 className="text-lg font-semibold mb-4">Pregled depozita</h3>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Mesecna kamata</dt>
          <dd className="font-medium tabular-nums" data-testid="calc-monthly">
            {formatNumber(monthlyInterest, currencyCode)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Ukupno kamata u roku ({termMonths}m)</dt>
          <dd className="font-medium tabular-nums" data-testid="calc-total">
            {formatNumber(totalInterest, currencyCode)}
          </dd>
        </div>
        <div className="flex justify-between border-t pt-3">
          <dt className="text-muted-foreground">Iznos na dospece (bez auto-obnove)</dt>
          <dd className="font-medium tabular-nums" data-testid="calc-payout">
            {formatNumber(principal + totalInterest, currencyCode)}
          </dd>
        </div>
        <div className="flex justify-between text-amber-600 dark:text-amber-400">
          <dt>Penal pri raskidu (1%)</dt>
          <dd className="font-medium tabular-nums" data-testid="calc-penalty">
            -{formatNumber(penalty, currencyCode)}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default SavingsCalculator;
