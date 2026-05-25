import { describe, expect, it } from 'vitest';
import {
  PRICE_ALERT_CONDITION_LABEL_SR,
  type PriceAlertCondition,
} from '../types/priceAlert';

describe('priceAlert types', () => {
  it('PRICE_ALERT_CONDITION_LABEL_SR has labels for both conditions', () => {
    const conditions: PriceAlertCondition[] = ['ABOVE', 'BELOW'];
    for (const c of conditions) {
      expect(PRICE_ALERT_CONDITION_LABEL_SR[c]).toBeTruthy();
      expect(typeof PRICE_ALERT_CONDITION_LABEL_SR[c]).toBe('string');
      expect(PRICE_ALERT_CONDITION_LABEL_SR[c].length).toBeGreaterThan(0);
    }
  });

  it('ABOVE label mentions "iznad"', () => {
    expect(PRICE_ALERT_CONDITION_LABEL_SR.ABOVE.toLowerCase()).toContain('iznad');
  });

  it('BELOW label mentions "ispod"', () => {
    expect(PRICE_ALERT_CONDITION_LABEL_SR.BELOW.toLowerCase()).toContain('ispod');
  });
});
