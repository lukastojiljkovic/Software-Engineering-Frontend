// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// Tipovi za istoriju isplacenih dividendi po poziciji u portfoliju.
//
// IMPLEMENTIRATI:
//   - DividendPayoutDto: {
//       id: number,
//       listingId: number,
//       ticker: string,
//       listingName: string,
//       accountId: number,
//       accountNumber: string,
//       amountPerShare: number,
//       quantity: number,
//       totalAmount: number,
//       currencyCode: string,
//       exDate: string,       // ISO date — dan kada je vlasnik registrovan za dividendu
//       paymentDate: string,  // ISO date — dan kada je iznos prenet na racun
//       createdAt: string,
//     }
//   - DividendSummaryDto: {
//       totalReceivedRsd: number,   // sve dividende konvertovane u RSD
//       totalReceivedByTicker: Record<string, number>,  // ticker -> ukupni iznos u originalnoj valuti
//       lastPaymentDate: string | null,
//     }
//   - DividendFilterParams: {
//       ticker?: string,
//       fromDate?: string,   // ISO date
//       toDate?: string,     // ISO date
//       page?: number,
//       size?: number,
//     }
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE4.
// ============================================================

export {};
