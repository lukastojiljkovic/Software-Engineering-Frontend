// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Tipovi za Price Alert feature: alarmi zasnovani na cenovnom uslovu.
//
// IMPLEMENTIRATI:
//
//   PriceAlertCondition — enum/union za tip uslova alarma:
//     'ABOVE' | 'BELOW'
//
//   PriceAlertStatus — enum/union za status alarma:
//     'ACTIVE' | 'TRIGGERED' | 'DISABLED'
//
//   PriceAlertDto — jedan alarm:
//     id: number
//     listingId: number
//     ticker: string
//     listingName: string           // puno ime hartije
//     condition: PriceAlertCondition
//     threshold: number             // cena okidanja
//     currency: string              // valuta hartije
//     currentPrice: number | null   // poslednja poznata cena (za prikaz udaljenosti)
//     status: PriceAlertStatus
//     note?: string                 // opcioni korisnicki komentar
//     createdAt: string             // ISO-8601
//     triggeredAt: string | null    // ISO-8601, null dok nije okidan
//
//   CreatePriceAlertRequest — payload za POST /price-alerts:
//     listingId: number
//     condition: PriceAlertCondition
//     threshold: number
//     note?: string
//
//   UpdatePriceAlertRequest — payload za PATCH /price-alerts/:id:
//     condition?: PriceAlertCondition
//     threshold?: number
//     note?: string
//     status?: PriceAlertStatus     // za rucno onemogucavanje/reaktivaciju
//
//   PRICE_ALERT_CONDITION_LABELS — Record<PriceAlertCondition, string>
//     npr. { ABOVE: 'Cena iznad', BELOW: 'Cena ispod' }
//
//   PRICE_ALERT_STATUS_LABELS — Record<PriceAlertStatus, string>
//     npr. { ACTIVE: 'Aktivan', TRIGGERED: 'Okidan', DISABLED: 'Onemogucen' }
//
//   PRICE_ALERT_STATUS_VARIANT — Record<PriceAlertStatus, 'success' | 'warning' | 'secondary'>
//     za Badge variant prop, npr. { ACTIVE: 'success', TRIGGERED: 'warning', DISABLED: 'secondary' }
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

export {};
