// ============================================================
// W3-T3 — Analytics service (Spark daily aggregates exposure)
//
// HTTP klijent za /admin/analytics/daily endpoint koji izlaze
// rezultate dnevnih Spark batch poslova (top_movers, order_count,
// total_notional, ...). Dostupno samo ADMIN i SUPERVISOR rolama
// (BE vraca 403 inace).
//
// Spec: 2026-05-26-k8s-readiness-deploy-plan.md, Task W3-T3.
// ============================================================
import api from './api';

export type AnalyticsDailyDTO = {
  /** ISO date format (YYYY-MM-DD), npr. "2026-05-26". */
  metricDate: string;
  /** Naziv metrike, npr. "top_movers", "order_count", "total_notional". */
  metricName: string;
  /** Dimenzije (npr. { symbol: "AAPL", direction: "BUY" }) — Spark output je free-form. */
  dimensions: Record<string, unknown>;
  /** Numericka vrednost metrike. */
  value: number;
};

/**
 * Vraca sve dnevne agregate za zadati datum.
 * @param date ISO date format (YYYY-MM-DD)
 * @param metricName Opciono — filtriraj po imenu metrike
 */
export async function getAnalyticsDaily(
  date: string,
  metricName?: string,
): Promise<AnalyticsDailyDTO[]> {
  const params: Record<string, string> = { date };
  if (metricName) params.metric_name = metricName;
  const response = await api.get<AnalyticsDailyDTO[]>('/admin/analytics/daily', { params });
  return response.data;
}
