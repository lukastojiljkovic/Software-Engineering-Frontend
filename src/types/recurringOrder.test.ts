import { describe, it, expect } from 'vitest';
import {
  RECURRING_CADENCE_LABEL_SR,
  RECURRING_MODE_LABEL_SR,
  RECURRING_DIRECTION_LABEL_SR,
} from './recurringOrder';

describe('recurringOrder label maps', () => {
  it('RECURRING_CADENCE_LABEL_SR ima srpske labele za sve kadence', () => {
    expect(RECURRING_CADENCE_LABEL_SR.DAILY).toBe('Dnevno');
    expect(RECURRING_CADENCE_LABEL_SR.WEEKLY).toBe('Sedmicno');
    expect(RECURRING_CADENCE_LABEL_SR.MONTHLY).toBe('Mesecno');
  });

  it('RECURRING_MODE_LABEL_SR ima srpske labele za oba moda', () => {
    expect(RECURRING_MODE_LABEL_SR.BYAMOUNT).toBe('Po iznosu');
    expect(RECURRING_MODE_LABEL_SR.BYQUANTITY).toBe('Po kolicini');
  });

  it('RECURRING_DIRECTION_LABEL_SR ima srpske labele za BUY/SELL', () => {
    expect(RECURRING_DIRECTION_LABEL_SR.BUY).toBe('Kupovina');
    expect(RECURRING_DIRECTION_LABEL_SR.SELL).toBe('Prodaja');
  });
});
