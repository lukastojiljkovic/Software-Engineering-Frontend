// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// Tipovi za trajne (DCA) naloge — sve sto koriste RecurringOrdersPage i recurringOrderService.
//
// IMPLEMENTIRATI:
//   - RecurringOrderDirection: 'BUY' | 'SELL'
//   - RecurringOrderMode: 'BY_QUANTITY' | 'BY_AMOUNT'
//   - RecurringOrderCadence: 'DAILY' | 'WEEKLY' | 'MONTHLY'
//   - RecurringOrderStatus: 'ACTIVE' | 'PAUSED' | 'CANCELLED'
//   - RecurringOrderDto {
//       id: number;
//       clientId: number;
//       clientName: string;
//       listingId: number;
//       ticker: string;
//       direction: RecurringOrderDirection;
//       mode: RecurringOrderMode;
//       value: number;          // kolicina (BY_QUANTITY) ili iznos u valuti listinga (BY_AMOUNT)
//       accountId: number;
//       accountNumber: string;
//       cadence: RecurringOrderCadence;
//       nextExecutionDate: string;   // ISO date
//       status: RecurringOrderStatus;
//       createdAt: string;
//       updatedAt: string;
//     }
//   - CreateRecurringOrderRequest {
//       listingId: number;
//       direction: RecurringOrderDirection;
//       mode: RecurringOrderMode;
//       value: number;
//       accountId: number;
//       cadence: RecurringOrderCadence;
//     }
//   - RECURRING_ORDER_STATUS_LABEL_SR: Record<RecurringOrderStatus, string>
//       vrednosti: ACTIVE->'Aktivan', PAUSED->'Pauziran', CANCELLED->'Otkazan'
//   - CADENCE_LABEL_SR: Record<RecurringOrderCadence, string>
//       vrednosti: DAILY->'Dnevno', WEEKLY->'Nedeljno', MONTHLY->'Mesecno'
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

export {};
