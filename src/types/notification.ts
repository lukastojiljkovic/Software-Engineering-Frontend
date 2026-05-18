// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// Tipovi za sistem in-app notifikacija. Ovaj fajl definise sve
// TS interfejse i union tipove koji se koriste u notificationService,
// NotificationBell i NotificationsPage.
//
// IMPLEMENTIRATI:
//   - NotificationType — union string literal svih mogucih tipova:
//       'PAYMENT_RECEIVED' | 'PAYMENT_SENT' | 'ORDER_FILLED' |
//       'ORDER_DECLINED' | 'OTC_OFFER_RECEIVED' | 'OTC_OFFER_ACCEPTED' |
//       'OTC_OFFER_DECLINED' | 'OTC_CONTRACT_EXERCISED' |
//       'OTC_CONTRACT_EXPIRED' | 'FUND_INTEREST_PAID' |
//       'FUND_DEPOSIT_MATURED' | 'LOAN_APPROVED' | 'LOAN_DECLINED' |
//       'LOAN_PAYMENT_DUE' | 'CARD_BLOCKED' | 'CARD_UNBLOCKED' |
//       'ACCOUNT_LOCKED' | 'GENERIC'
//   - NotificationDto — interfejs koji odgovara BE odgovoru:
//       id: number
//       type: NotificationType
//       title: string           — kratki naslov (max ~80 znakova)
//       message: string         — duzi opis dogadjaja
//       read: boolean
//       createdAt: string       — ISO 8601
//       relatedEntityType?: string   — opciono: 'PAYMENT' | 'ORDER' | 'OTC_OFFER' | ...
//       relatedEntityId?: number     — opciono: ID povezanog entiteta
//   - NotificationPageDto<T> — paginiran wrapper (paritet sa PageDto u savings.ts):
//       content: T[]
//       totalElements: number
//       totalPages: number
//       number: number
//       size: number
//   - UnreadCountDto — { count: number } (odgovor na GET /notifications/unread-count)
//   - NOTIFICATION_TYPE_LABEL_SR: Record<NotificationType, string> — mapa srpskih labela
//       npr. PAYMENT_RECEIVED: 'Primljeno placanje', ORDER_FILLED: 'Order izvrsit', itd.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon
//   (videti src/types/savings.ts — union tipovi, const mape labela, interfejsi).
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

export {};
