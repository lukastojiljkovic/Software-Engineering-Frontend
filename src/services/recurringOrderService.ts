// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// HTTP klijent za trajne (DCA) naloge, oslanja se na `api` axios instancu iz './api'.
//
// IMPLEMENTIRATI (objekat `recurringOrderService`):
//   - listMy(): Promise<RecurringOrderDto[]>
//       GET /recurring-orders/my
//       Vraca sve trajne naloge trenutno ulogovanog klijenta.
//
//   - create(dto: CreateRecurringOrderRequest): Promise<RecurringOrderDto>
//       POST /recurring-orders
//       Kreira novi trajni nalog; BE validira vlasnistvo racuna i listing.
//
//   - pause(id: number): Promise<RecurringOrderDto>
//       PATCH /recurring-orders/{id}/pause
//       Menja status ACTIVE -> PAUSED; idempotent ako je vec PAUSED.
//
//   - resume(id: number): Promise<RecurringOrderDto>
//       PATCH /recurring-orders/{id}/resume
//       Menja status PAUSED -> ACTIVE.
//
//   - cancel(id: number): Promise<void>
//       DELETE /recurring-orders/{id}
//       Trajno otkazuje nalog; BE vraca 204 No Content.
//
// Uvoz tipova iz '../types/recurringOrder':
//   RecurringOrderDto, CreateRecurringOrderRequest
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon
//   (import api from './api', named export `recurringOrderService`).
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

export {};
