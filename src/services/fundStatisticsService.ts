// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// HTTP wrapper za metrike i statistike investicionih fondova. Sve metode
// koriste `api` klijent iz './api' (axios instanca sa JWT interceptorom).
//
// IMPLEMENTIRATI (uvezi tipove iz '../types/fundStatistics' kada ih definises):
//   - getFundMetrics(fundId: number, params?: FundStatisticsFilterParams): Promise<FundMetricsDto>
//       GET /funds/{fundId}/statistics
//       Query params: fromDate, toDate
//       Vraca izracunate metrike (godisnji prinos, Sharpe ratio, max drawdown,
//       volatilnost, ukupni prinos) za konkretni fond u zadatom periodu.
//
//   - getAllFundsComparison(params?: FundStatisticsFilterParams): Promise<FundComparisonItemDto[]>
//       GET /funds/statistics/comparison
//       Query params: fromDate, toDate
//       Vraca listu svih fondova sa kljucnim metrikama — namenjeno tabeli
//       za poredjenje fondova na FundsDiscoveryPage / FundDetailsPage.
//
// Pattern:
//   import api from './api';
//   export const fundStatisticsService = { ... };
//   Svaka metoda destrukturira { data } iz api.get poziva i vraca data.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE4.
// ============================================================

export {};
