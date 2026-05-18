// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// Tipovi za statistike i metrike performansi investicionih fondova.
//
// IMPLEMENTIRATI:
//   - FundMetricsDto: {
//       fundId: number,
//       fundName: string,
//       currencyCode: string,
//       annualizedReturnPct: number,         // godisnji prinos u %
//       rewardToVariabilityRatio: number,    // Sharpe-like ratio: (prinos - rf) / std
//       maxDrawdownPct: number,              // maksimalni pad od vrha, negativna vrednost
//       volatilityPct: number,               // godisnja volatilnost (std devijacija prinosa)
//       totalReturnPct: number,              // ukupni prinos od osnivanja fonda u %
//       calculatedAt: string,               // ISO datetime kada su metrike izracunate
//     }
//   - FundComparisonItemDto: {
//       fundId: number,
//       fundName: string,
//       annualizedReturnPct: number,
//       volatilityPct: number,
//       rewardToVariabilityRatio: number,
//       maxDrawdownPct: number,
//       currentNav: number,                 // neto vrednost imovine fonda (net asset value)
//       currencyCode: string,
//     }
//   - FundStatisticsFilterParams: {
//       fromDate?: string,   // ISO date — pocetak perioda za obracun
//       toDate?: string,     // ISO date — kraj perioda za obracun
//     }
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE4.
// ============================================================

export {};
