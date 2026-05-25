import api from './api';
import type { FundDividendHistoryDto } from '@/types/fundDividend';

/**
 * Fund-level dividend service — TODO_final C4 #14 (FE4, Jovan Krunic).
 *
 * BE napomena (25.05.2026): u trenutku pisanja gap-a, BE NEMA javni endpoint
 * koji vraca istoriju dividendi po fondu. B11 `FundDividendService` interno
 * knjizi dividende ka fondu, ali to nije izlozeno kroz REST.
 *
 * Strategija:
 *  1. Pokusava `GET /funds/{fundId}/dividends` (preferred path).
 *  2. Ako vrati 404/501/405 → graceful fallback na prazan niz +
 *     `console.warn` (UI prikazuje empty state).
 *  3. Sve ostale greske se propagiraju (UI prikazuje error alert).
 *
 * Kad BE doda endpoint, ostavlja se fallback radi backwards-compat.
 */
const fundDividendService = {
  getFundDividendHistory: async (fundId: number): Promise<FundDividendHistoryDto[]> => {
    try {
      const { data } = await api.get<FundDividendHistoryDto[]>(`/funds/${fundId}/dividends`);
      return Array.isArray(data) ? data : [];
    } catch (err: unknown) {
      const httpErr = err as { response?: { status?: number } };
      const status = httpErr?.response?.status;
      if (status === 404 || status === 501 || status === 405) {
        // TODO: ukloniti kad BE doda GET /funds/{id}/dividends endpoint.
        console.warn(
          `fundDividendService: BE endpoint /funds/${fundId}/dividends jos nije dostupan (status ${status}); prikazujem prazan niz.`,
        );
        return [];
      }
      throw err;
    }
  },
};

export default fundDividendService;
