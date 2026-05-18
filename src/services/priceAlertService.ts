// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Servis za CRUD operacije nad cenovnim alarmima.
// Koristiti `api` klijent iz './api' (axios instanca sa JWT interceptorima).
// Importovati sve tipove iz '../types/priceAlert'.
//
// IMPLEMENTIRATI (export const priceAlertService = { ... }):
//
//   listMy(): Promise<PriceAlertDto[]>
//     GET /price-alerts/my
//     Vraca sve alarme trenutno ulogovanog korisnika (svi statusi).
//
//   getById(id: number): Promise<PriceAlertDto>
//     GET /price-alerts/:id
//     Vraca jedan alarm. BE vraca 403 ako alarm nije vlasnistvo korisnika.
//
//   create(dto: CreatePriceAlertRequest): Promise<PriceAlertDto>
//     POST /price-alerts
//     Kreira novi alarm. BE vraca 400 ako threshold <= 0.
//
//   update(id: number, dto: UpdatePriceAlertRequest): Promise<PriceAlertDto>
//     PATCH /price-alerts/:id
//     Azurira uslov, prag ili napomenu alarma; takodje sluzi za
//     rucno onemogucavanje (status: 'DISABLED') ili reaktivaciju (status: 'ACTIVE').
//
//   remove(id: number): Promise<void>
//     DELETE /price-alerts/:id
//     Brise alarm.
//
//   listByListing(listingId: number): Promise<PriceAlertDto[]>
//     GET /price-alerts?listingId=:listingId
//     Vraca sve ACTIVE alarme za datu hartiju (korisno za PriceAlertDialog
//     da prikaze vec postavljene alarme pre kreiranja novog).
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

export {};
