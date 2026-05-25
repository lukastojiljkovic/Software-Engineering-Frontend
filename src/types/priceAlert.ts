// ============================================================
// [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Tipovi za Price Alert feature.
// Spec: Zadaci_Frontend.pdf, FE2 + task instructions 25.05.2026.
// ============================================================

export type PriceAlertCondition = 'ABOVE' | 'BELOW';

export interface PriceAlertDto {
  id: number;
  listingId: number;
  listingTicker: string;
  listingType: string;
  condition: PriceAlertCondition;
  threshold: number;
  active: boolean;
  createdAt: string;
  triggeredAt: string | null;
  currency?: string;
  currentPrice?: number | null;
}

export interface CreatePriceAlertRequest {
  listingId: number;
  condition: PriceAlertCondition;
  threshold: number;
}

export const PRICE_ALERT_CONDITION_LABEL_SR: Record<PriceAlertCondition, string> = {
  ABOVE: 'Iznad praga',
  BELOW: 'Ispod praga',
};
