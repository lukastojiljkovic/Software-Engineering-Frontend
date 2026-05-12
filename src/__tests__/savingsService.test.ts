import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../services/api';
import { savingsService } from '../services/savingsService';

vi.mock('../services/api');
const mockApi = vi.mocked(api);

describe('savingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('openDeposit POSTs to /savings/deposits and returns data', async () => {
    const dto = {
      sourceAccountId: 1,
      linkedAccountId: 1,
      principalAmount: 100000,
      termMonths: 12,
      autoRenew: false,
      otpCode: '123456',
    };
    mockApi.post.mockResolvedValue({ data: { id: 99 } });
    const result = await savingsService.openDeposit(dto);
    expect(mockApi.post).toHaveBeenCalledWith('/savings/deposits', dto);
    expect(result.id).toBe(99);
  });

  it('listMyDeposits GETs /savings/deposits/my', async () => {
    mockApi.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    const result = await savingsService.listMyDeposits();
    expect(mockApi.get).toHaveBeenCalledWith('/savings/deposits/my');
    expect(result).toHaveLength(2);
  });

  it('getDeposit GETs /savings/deposits/:id', async () => {
    mockApi.get.mockResolvedValue({ data: { id: 1 } });
    await savingsService.getDeposit(1);
    expect(mockApi.get).toHaveBeenCalledWith('/savings/deposits/1');
  });

  it('getTransactions GETs /savings/deposits/:id/transactions', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await savingsService.getTransactions(5);
    expect(mockApi.get).toHaveBeenCalledWith('/savings/deposits/5/transactions');
  });

  it('toggleAutoRenew PATCHs with body { autoRenew }', async () => {
    mockApi.patch.mockResolvedValue({ data: { id: 1, autoRenew: true } });
    await savingsService.toggleAutoRenew(1, true);
    expect(mockApi.patch).toHaveBeenCalledWith('/savings/deposits/1/auto-renew', { autoRenew: true });
  });

  it('withdrawEarly POSTs with otpCode', async () => {
    mockApi.post.mockResolvedValue({ data: { id: 1, status: 'WITHDRAWN_EARLY' } });
    await savingsService.withdrawEarly(1, '654321');
    expect(mockApi.post).toHaveBeenCalledWith('/savings/deposits/1/withdraw-early', { otpCode: '654321' });
  });

  it('getRates without currency returns all', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await savingsService.getRates();
    expect(mockApi.get).toHaveBeenCalledWith('/savings/rates', { params: {} });
  });

  it('getRates with currency filters', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await savingsService.getRates('RSD');
    expect(mockApi.get).toHaveBeenCalledWith('/savings/rates', { params: { currency: 'RSD' } });
  });

  it('adminListAll passes params', async () => {
    mockApi.get.mockResolvedValue({ data: { content: [], totalElements: 0 } });
    await savingsService.adminListAll({ status: 'ACTIVE', clientId: 1, page: 0, size: 20 });
    expect(mockApi.get).toHaveBeenCalledWith('/admin/savings/deposits', {
      params: { status: 'ACTIVE', clientId: 1, page: 0, size: 20 },
    });
  });

  it('adminListAllRates GETs /admin/savings/rates', async () => {
    mockApi.get.mockResolvedValue({ data: [] });
    await savingsService.adminListAllRates();
    expect(mockApi.get).toHaveBeenCalledWith('/admin/savings/rates');
  });

  it('adminUpsertRate POSTs new rate', async () => {
    const dto = { currencyCode: 'RSD', termMonths: 12, annualRate: 4.5 };
    mockApi.post.mockResolvedValue({
      data: { ...dto, id: 1, active: true, effectiveFrom: '2026-05-12' },
    });
    await savingsService.adminUpsertRate(dto);
    expect(mockApi.post).toHaveBeenCalledWith('/admin/savings/rates', dto);
  });
});
