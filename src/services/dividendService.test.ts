// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// Testovi za dividendService.
//
// IMPLEMENTIRATI (posle implementacije servisa):
//   - Svaki test mockuje './api' default export sa vi.mock
//   - vi.mocked(api.get).mockResolvedValue({ data: <stub> }) pattern
//   - Posle svakog testa: vi.clearAllMocks()
//
// Planirani test slucajevi:
//   1. 'getMyDividends — poziva GET /dividends/my bez params'
//   2. 'getMyDividends — prosledjuje ticker, fromDate, toDate kao query params'
//   3. 'getMyDividends — prosledjuje page i size kao query params'
//   4. 'getMyDividends — vraca data iz axios odgovora'
//   5. 'getDividendSummary — poziva GET /dividends/my/summary'
//   6. 'getDividendSummary — vraca DividendSummaryDto iz odgovora'
//   7. 'getDividendsByListing — poziva GET /dividends/listings/{listingId}'
//   8. 'getDividendsByListing — prosledjuje fromDate i toDate kao query params'
//   9. 'getDividendsByListing — vraca paginiranu listu iz odgovora'
//  10. 'getMyDividends — baca gresku ako axios odbije (network error)'
//  11. 'getDividendSummary — baca gresku ako axios vrati 403'
// ============================================================

import { describe, it } from 'vitest';

describe('dividendService', () => {
  it.todo('getMyDividends — poziva GET /dividends/my bez params');
  it.todo('getMyDividends — prosledjuje ticker, fromDate, toDate kao query params');
  it.todo('getMyDividends — prosledjuje page i size kao query params');
  it.todo('getMyDividends — vraca data iz axios odgovora');
  it.todo('getDividendSummary — poziva GET /dividends/my/summary');
  it.todo('getDividendSummary — vraca DividendSummaryDto iz odgovora');
  it.todo('getDividendsByListing — poziva GET /dividends/listings/{listingId}');
  it.todo('getDividendsByListing — prosledjuje fromDate i toDate kao query params');
  it.todo('getDividendsByListing — vraca paginiranu listu iz odgovora');
  it.todo('getMyDividends — baca gresku ako axios odbije (network error)');
  it.todo('getDividendSummary — baca gresku ako axios vrati 403');
});
