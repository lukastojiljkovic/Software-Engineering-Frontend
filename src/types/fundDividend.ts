// ============================================================
// TODO_final C4 #14 — Fund-level dividend history (Developer: Jovan Krunic)
//
// Tipovi opisuju istoriju dividendi koje fond prima na svoje pozicije,
// sa naznakom da li su reinvestirane ili distribuirane klijentima
// (proporcionalno udelu). Mapira se na BE B11 FundDividendService.
//
// BE napomena: u trenutku pisanja gap-a, BE NEMA javni endpoint koji
// vraca istoriju dividendi fonda — `fundDividendService` ima fallback
// na prazan niz uz `console.warn`. Kad se endpoint pojavi (npr.
// `GET /funds/{fundId}/dividends`), brisem fallback i koristim direktan poziv.
// ============================================================

/**
 * Jedna primljena dividenda na nivou fonda — agregat po listingu i datumu.
 *
 * Razlika u odnosu na `DividendPayoutDto` (per-position klijent):
 *  - `fundId` polje (vlasnik dividende je fond, ne klijent),
 *  - `reinvestedAmount` (deo koji se reinvestira nazad u akcije fonda),
 *  - `distributedToClients` (proporcionalna distribucija klijentima po udelu).
 */
export interface FundDividendHistoryDto {
  fundId: number;
  listingId: number;
  listingTicker: string;
  /** ISO datum isplate (YYYY-MM-DD). */
  paymentDate: string;
  /** Bruto iznos primljen na fond. */
  grossAmount: number;
  /** Iznos koji je reinvestiran (kupljene dodatne akcije iste hartije). */
  reinvestedAmount?: number;
  /** Iznos proporcionalno raspoređen klijentima po udelu u fondu. */
  distributedToClients?: number;
  /** Valuta isplate. */
  currency: string;
}
