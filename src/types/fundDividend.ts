/**
 * Jedna primljena dividenda na nivou fonda — mapira `FundDividendHistoryDto`
 * iz BE `trading-service/investmentfund` modula. Vraca `GET /funds/{id}/dividends`.
 *
 * Razlika u odnosu na `DividendPayoutDto` (per-position klijent):
 *  - `fundId` polje (vlasnik dividende je fond, ne klijent),
 *  - `reinvestedAmount` (deo koji se reinvestira nazad u akcije fonda),
 *  - `distributedToClients` (proporcionalna distribucija klijentima po udelu).
 */
export interface FundDividendHistoryDto {
  id: number;
  fundId: number;
  listingId: number;
  listingTicker: string;
  /** ISO datum isplate (YYYY-MM-DD). */
  paymentDate: string;
  /** ISO timestamp kreiranja zapisa u DB. */
  createdAt?: string;
  /** ISO timestamp zavrsetka obrade (reinvest + distribucija). */
  completedAt?: string;
  /** Bruto iznos primljen na fond. */
  grossAmount: number;
  /** Iznos koji je reinvestiran (kupljene dodatne akcije iste hartije). */
  reinvestedAmount?: number;
  /** Iznos proporcionalno raspoređen klijentima po udelu u fondu. */
  distributedToClients?: number;
  /** Status obrade na BE-u (DIVIDEND_INFLOW / DIVIDEND_REINVESTED / DIVIDEND_DISTRIBUTED). */
  status?: string;
  /** Valuta isplate. */
  currency: string;
  /** Opciona belesa BE-a (npr. transaction marker). */
  note?: string;
}
