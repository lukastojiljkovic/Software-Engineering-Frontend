// ============================================================
// FE3 - Trajni nalozi (DCA) | Developer: Elena Kalajdzic
//
// Tipovi za trajne (DCA) naloge — koristi RecurringOrdersPage i recurringOrderService.
// BE: trading-service `RecurringOrder` entitet (ownerId, ownerType, listingId,
// direction BUY/SELL, mode BYAMOUNT/BYQUANTITY, value, cadence DAILY/WEEKLY/MONTHLY,
// nextRun, active).
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

export type RecurringCadence = 'DAILY' | 'WEEKLY' | 'MONTHLY';
export type RecurringMode = 'BYAMOUNT' | 'BYQUANTITY';
export type RecurringDirection = 'BUY' | 'SELL';
export type RecurringOwnerType = 'CLIENT' | 'EMPLOYEE';

/**
 * BE trading-service vraca polja iz `RecurringOrder` entiteta + denormalizovane
 * pomocne kolone (`listingTicker`, `accountNumber`) koje su jeftin lookup u
 * trenutku kreacije. `active` je boolean — UI mapira na ACTIVE/PAUSED status badge.
 */
export interface RecurringOrderDto {
  id: number;
  ownerId: number;
  ownerType: RecurringOwnerType;
  listingId: number;
  listingTicker?: string;
  /** Tip hartije ("STOCK" / "FUTURES" / ...) ako BE vraca. */
  listingType?: string;
  direction: RecurringDirection;
  mode: RecurringMode;
  /** BYAMOUNT: novcani iznos (valuta racuna); BYQUANTITY: broj akcija. */
  value: number;
  /** Valuta listinga / racuna (informativna). */
  currency?: string;
  accountId: number;
  accountNumber?: string;
  cadence: RecurringCadence;
  /** Sledeci put kad ce scheduler okinuti — ISO `LocalDateTime`. */
  nextRun: string;
  active: boolean;
  createdAt: string;
  /** Poslednji put kad je scheduler izvrsio (null pre prvog run-a). */
  lastRunAt?: string | null;
}

export interface CreateRecurringOrderRequest {
  listingId: number;
  direction: RecurringDirection;
  mode: RecurringMode;
  value: number;
  accountId: number;
  cadence: RecurringCadence;
}

export const RECURRING_CADENCE_LABEL_SR: Record<RecurringCadence, string> = {
  DAILY: 'Dnevno',
  WEEKLY: 'Sedmicno',
  MONTHLY: 'Mesecno',
};

export const RECURRING_MODE_LABEL_SR: Record<RecurringMode, string> = {
  BYAMOUNT: 'Po iznosu',
  BYQUANTITY: 'Po kolicini',
};

export const RECURRING_DIRECTION_LABEL_SR: Record<RecurringDirection, string> = {
  BUY: 'Kupovina',
  SELL: 'Prodaja',
};
