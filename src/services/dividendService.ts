// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// HTTP wrapper za dividendne endpoint-e. Sve metode koriste `api` klijent
// iz './api' (axios instanca sa JWT interceptorom).
//
// IMPLEMENTIRATI (uvezi tipove iz '../types/dividend' kada ih definises):
//   - getMyDividends(params: DividendFilterParams): Promise<PageDto<DividendPayoutDto>>
//       GET /dividends/my
//       Query params: ticker, fromDate, toDate, page, size
//       Vraca paginiranu listu primljenih dividendi za prijavljenog klijenta.
//
//   - getDividendSummary(): Promise<DividendSummaryDto>
//       GET /dividends/my/summary
//       Vraca agregirane metrike: ukupno primljeno u RSD, po ticker-u, datum zadnje isplate.
//
//   - getDividendsByListing(listingId: number, params?: DividendFilterParams): Promise<PageDto<DividendPayoutDto>>
//       GET /dividends/listings/{listingId}
//       Vraca istoriju dividendi za specificnu hartiju (korisno za admin/supervisor pregled).
//
// Pattern:
//   import api from './api';
//   export const dividendService = { ... };
//   Svaka metoda destrukturira { data } iz api.get/post poziva i vraca data.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE4.
// ============================================================

export {};
