// ============================================================
// W3-T3 — PredictionWidget (Spark ML next-day close predikcija)
//
// Kompaktan widget koji prikazuje najnoviju dostupnu predikciju za
// hartiju (predicted close + confidence interval). Mount-uje se u
// SecuritiesDetailsPage pored cene/chart-a. Tiho se sakriva ako nema
// modela za simbol (BE vraca 404 → service vraca null).
//
// Spec: 2026-05-26-k8s-readiness-deploy-plan.md, Task W3-T3.
// ============================================================
import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  getLatestPrediction,
  type PricePredictionDTO,
} from '@/services/predictionService';

interface Props {
  /** Ticker (npr. "AAPL") — koristi se za /listings/{symbol}/prediction. */
  symbol: string;
  /** Trenutna trzisna cena — koristi se za "+x% od trenutne" indikator. Opciono. */
  currentPrice?: number;
}

function formatPrice(n: number): string {
  try {
    return new Intl.NumberFormat('sr-RS', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return n.toFixed(2);
  }
}

export function PredictionWidget({ symbol, currentPrice }: Props) {
  const [pred, setPred] = useState<PricePredictionDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getLatestPrediction(symbol)
      .then((p) => {
        if (!cancelled) {
          setPred(p);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (loading) {
    return (
      <div
        className="border rounded-lg p-3 bg-card animate-pulse"
        data-testid="prediction-widget-loading"
      >
        <div className="h-4 w-24 bg-muted rounded mb-2" />
        <div className="h-6 w-32 bg-muted rounded" />
      </div>
    );
  }

  if (!pred) return null;

  // Compute trend vs current price (if available)
  let trend: 'up' | 'down' | 'flat' = 'flat';
  let trendPct = 0;
  if (currentPrice != null && currentPrice > 0) {
    trendPct = ((pred.predictedClose - currentPrice) / currentPrice) * 100;
    if (trendPct > 0.5) trend = 'up';
    else if (trendPct < -0.5) trend = 'down';
  }

  const trendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const TrendIcon = trendIcon;
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
        ? 'text-red-600 dark:text-red-400'
        : 'text-muted-foreground';

  return (
    <div
      className="border rounded-lg p-3.5 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10"
      data-testid="prediction-widget"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
        <span>Predikcija (Spark ML)</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div
          className="text-2xl font-bold font-mono tabular-nums"
          data-testid="prediction-widget-value"
        >
          {formatPrice(pred.predictedClose)}
        </div>
        {trend !== 'flat' && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold font-mono ${trendColor}`}
            data-testid="prediction-widget-trend"
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {trendPct >= 0 ? '+' : ''}
            {trendPct.toFixed(2)}%
          </div>
        )}
      </div>
      <div
        className="text-[11px] text-muted-foreground mt-1 font-mono"
        data-testid="prediction-widget-interval"
      >
        Interval: {formatPrice(pred.lowerBound)} – {formatPrice(pred.upperBound)}
      </div>
      <div className="text-[10px] text-muted-foreground/70 mt-0.5">
        Datum: {pred.predictionDate} · Model: {pred.modelVersion}
      </div>
    </div>
  );
}

export default PredictionWidget;
