// ============================================================
// W3-T3 — Price prediction service (Spark ML model exposure)
//
// HTTP klijent za /listings/{symbol}/prediction endpoint koji izlaze
// rezultate Spark MLlib price-prediction modela (next-day close +
// confidence interval). Dostupno svim ulogovanim korisnicima koji
// imaju pristup hartiji.
//
// Spec: 2026-05-26-k8s-readiness-deploy-plan.md, Task W3-T3.
// ============================================================
import api from './api';

export type PricePredictionDTO = {
  symbol: string;
  /** ISO date — datum za koji se predvidja cena (najcesce sledeci trading day). */
  predictionDate: string;
  /** Predvidjena close cena. */
  predictedClose: number;
  /** Donja granica confidence interval-a. */
  lowerBound: number;
  /** Gornja granica confidence interval-a. */
  upperBound: number;
  /** Verzija ML modela (semver). */
  modelVersion: string;
  /** ISO timestamp kada je Spark batch izracunao predikciju. */
  computedAt: string;
};

/**
 * Vraca najnoviju dostupnu predikciju za simbol, ili `null` ako BE
 * vrati 404 (npr. nema modela za simbol, ili Spark jos nije izracunao).
 * Sve ostale greske se propagiraju do caller-a.
 */
export async function getLatestPrediction(symbol: string): Promise<PricePredictionDTO | null> {
  try {
    const response = await api.get<PricePredictionDTO>(`/listings/${symbol}/prediction`);
    return response.data;
  } catch (err) {
    if ((err as { response?: { status?: number } })?.response?.status === 404) {
      return null;
    }
    throw err;
  }
}
