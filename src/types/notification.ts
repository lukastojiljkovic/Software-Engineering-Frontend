// ============================================================
// FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic
//
// Tipovi za sistem in-app notifikacija. Koristi se u
// notificationService, NotificationBell i NotificationsPage.
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

export type NotificationType =
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_SENT'
  | 'ORDER_FILLED'
  | 'ORDER_DECLINED'
  | 'OTC_OFFER_RECEIVED'
  | 'OTC_OFFER_ACCEPTED'
  | 'OTC_OFFER_DECLINED'
  | 'OTC_CONTRACT_EXERCISED'
  | 'OTC_CONTRACT_EXPIRED'
  | 'FUND_INTEREST_PAID'
  | 'FUND_DEPOSIT_MATURED'
  | 'LOAN_APPROVED'
  | 'LOAN_DECLINED'
  | 'LOAN_PAYMENT_DUE'
  | 'CARD_BLOCKED'
  | 'CARD_UNBLOCKED'
  | 'ACCOUNT_LOCKED'
  | 'GENERIC';

export interface NotificationDto {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  /** ISO 8601 timestamp */
  createdAt: string;
  /** Opciono: 'PAYMENT' | 'ORDER' | 'OTC_OFFER' | 'OTC_CONTRACT' | 'FUND' | 'LOAN' | 'CARD' | 'ACCOUNT' */
  relatedEntityType?: string;
  relatedEntityId?: number;
}

export interface NotificationPageDto<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface UnreadCountDto {
  count: number;
}

export const NOTIFICATION_TYPE_LABEL_SR: Record<NotificationType, string> = {
  PAYMENT_RECEIVED: 'Primljeno placanje',
  PAYMENT_SENT: 'Poslato placanje',
  ORDER_FILLED: 'Order izvrsen',
  ORDER_DECLINED: 'Order odbijen',
  OTC_OFFER_RECEIVED: 'Primljena OTC ponuda',
  OTC_OFFER_ACCEPTED: 'Prihvacena OTC ponuda',
  OTC_OFFER_DECLINED: 'Odbijena OTC ponuda',
  OTC_CONTRACT_EXERCISED: 'OTC ugovor iskoriscen',
  OTC_CONTRACT_EXPIRED: 'OTC ugovor istekao',
  FUND_INTEREST_PAID: 'Isplacena kamata fonda',
  FUND_DEPOSIT_MATURED: 'Dospelo fond ulaganje',
  LOAN_APPROVED: 'Kredit odobren',
  LOAN_DECLINED: 'Kredit odbijen',
  LOAN_PAYMENT_DUE: 'Dospela rata kredita',
  CARD_BLOCKED: 'Kartica blokirana',
  CARD_UNBLOCKED: 'Kartica odblokirana',
  ACCOUNT_LOCKED: 'Nalog zakljucan',
  GENERIC: 'Obavestenje',
};
