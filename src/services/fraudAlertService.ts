// ============================================================
// W3-T3 — Fraud alert service (Spark anomaly detection exposure)
//
// HTTP klijent za /admin/fraud-alerts endpoint koji izlaze rezultate
// Spark fraud-detection joba (risk_score po transakciji). Dostupno
// samo ADMIN i SUPERVISOR rolama (BE vraca 403 inace).
//
// Spec: 2026-05-26-k8s-readiness-deploy-plan.md, Task W3-T3.
// ============================================================
import api from './api';

export type FraudAlertDTO = {
  id: number;
  transactionId: number;
  /** Risk score iz 0.0-1.0 (Spark MLlib model output). */
  riskScore: number;
  /** Feature vector koji je doveo do alert-a (free-form, model-specific). */
  features: Record<string, unknown>;
  /** Verzija ML modela (semver, npr. "fraud-1.2.0"). */
  modelVersion: string;
  /** ISO timestamp kada je Spark batch izracunao alert. */
  computedAt: string;
  /** Email supervizora koji je pregledao alert. */
  reviewedBy?: string;
  /** Status pregleda: APPROVED, REJECTED, ESCALATED, IN_REVIEW. */
  reviewStatus?: string;
  /** ISO timestamp kada je pregled obavljen. */
  reviewedAt?: string;
};

/**
 * Lista alert-ova od zadatog datuma sa minimum risk score-om.
 * @param since ISO date format (YYYY-MM-DD)
 * @param minRisk Default 0.8 — samo vraca alert-e iznad praga
 */
export async function getFraudAlerts(since: string, minRisk = 0.8): Promise<FraudAlertDTO[]> {
  const response = await api.get<FraudAlertDTO[]>('/admin/fraud-alerts', {
    params: { since, min_risk: minRisk },
  });
  return response.data;
}

/**
 * Marker alert-a kao pregledan sa statusom + opcionim komentarom.
 */
export async function reviewFraudAlert(id: number, status: string, note?: string): Promise<void> {
  await api.post(`/admin/fraud-alerts/${id}/review`, { status, note });
}
