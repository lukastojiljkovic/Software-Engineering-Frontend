import { describe, it, expect } from 'vitest';
import {
  AUDIT_ACTION_TYPES,
  AUDIT_ACTION_LABEL_SR,
  type AuditActionType,
} from './audit';

describe('audit types', () => {
  it('AUDIT_ACTION_TYPES sadrzi svih 6 ocekivanih action type-ova', () => {
    expect(AUDIT_ACTION_TYPES).toEqual([
      'LIMIT_CHANGED',
      'USED_LIMIT_RESET',
      'ORDER_APPROVED',
      'ORDER_DECLINED',
      'PERMISSIONS_CHANGED',
      'TAX_RUN_TRIGGERED',
    ]);
  });

  it('AUDIT_ACTION_LABEL_SR mapira svaki AuditActionType na srpsku labelu', () => {
    for (const type of AUDIT_ACTION_TYPES) {
      expect(AUDIT_ACTION_LABEL_SR[type]).toBeDefined();
      expect(AUDIT_ACTION_LABEL_SR[type].length).toBeGreaterThan(0);
    }
  });

  it('AUDIT_ACTION_LABEL_SR koristi konkretne srpske labele', () => {
    expect(AUDIT_ACTION_LABEL_SR.LIMIT_CHANGED).toMatch(/limit/i);
    expect(AUDIT_ACTION_LABEL_SR.USED_LIMIT_RESET).toMatch(/reset/i);
    expect(AUDIT_ACTION_LABEL_SR.ORDER_APPROVED).toMatch(/odobr/i);
    expect(AUDIT_ACTION_LABEL_SR.ORDER_DECLINED).toMatch(/odbij/i);
    expect(AUDIT_ACTION_LABEL_SR.PERMISSIONS_CHANGED).toMatch(/permis/i);
    expect(AUDIT_ACTION_LABEL_SR.TAX_RUN_TRIGGERED).toMatch(/pores|porez|tax/i);
  });

  it('svi AuditActionType iz AUDIT_ACTION_TYPES su validne string vrednosti', () => {
    const expected: AuditActionType[] = [
      'LIMIT_CHANGED',
      'USED_LIMIT_RESET',
      'ORDER_APPROVED',
      'ORDER_DECLINED',
      'PERMISSIONS_CHANGED',
      'TAX_RUN_TRIGGERED',
    ];
    expect(AUDIT_ACTION_TYPES).toHaveLength(expected.length);
    expected.forEach((t) => expect(AUDIT_ACTION_TYPES).toContain(t));
  });
});
