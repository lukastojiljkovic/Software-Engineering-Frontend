import { describe, expect, it } from 'vitest';
import {
  NOTIFICATION_TYPE_LABEL_SR,
  type NotificationType,
} from '../types/notification';

describe('NOTIFICATION_TYPE_LABEL_SR', () => {
  const allTypes: NotificationType[] = [
    'PAYMENT_RECEIVED',
    'PAYMENT_SENT',
    'ORDER_FILLED',
    'ORDER_DECLINED',
    'OTC_OFFER_RECEIVED',
    'OTC_OFFER_ACCEPTED',
    'OTC_OFFER_DECLINED',
    'OTC_CONTRACT_EXERCISED',
    'OTC_CONTRACT_EXPIRED',
    'FUND_INTEREST_PAID',
    'FUND_DEPOSIT_MATURED',
    'LOAN_APPROVED',
    'LOAN_DECLINED',
    'LOAN_PAYMENT_DUE',
    'CARD_BLOCKED',
    'CARD_UNBLOCKED',
    'ACCOUNT_LOCKED',
    'GENERIC',
  ];

  it('contains a Serbian label for every NotificationType (18 vrednosti)', () => {
    expect(Object.keys(NOTIFICATION_TYPE_LABEL_SR)).toHaveLength(18);
    for (const t of allTypes) {
      expect(NOTIFICATION_TYPE_LABEL_SR[t]).toBeTruthy();
      expect(typeof NOTIFICATION_TYPE_LABEL_SR[t]).toBe('string');
    }
  });

  it('PAYMENT_RECEIVED label is human-readable Serbian', () => {
    expect(NOTIFICATION_TYPE_LABEL_SR.PAYMENT_RECEIVED).toMatch(/placanje/i);
  });

  it('ORDER_FILLED label mentions order', () => {
    expect(NOTIFICATION_TYPE_LABEL_SR.ORDER_FILLED.toLowerCase()).toContain('order');
  });

  it('ACCOUNT_LOCKED label mentions locking', () => {
    expect(NOTIFICATION_TYPE_LABEL_SR.ACCOUNT_LOCKED.toLowerCase()).toMatch(/zaklju/);
  });

  it('GENERIC label is a fallback string', () => {
    expect(NOTIFICATION_TYPE_LABEL_SR.GENERIC).toBeTruthy();
  });
});
