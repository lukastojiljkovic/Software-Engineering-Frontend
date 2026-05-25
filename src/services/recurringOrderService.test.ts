import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { recurringOrderService } from './recurringOrderService';
import type {
  RecurringOrderDto,
  CreateRecurringOrderRequest,
} from '../types/recurringOrder';

vi.mock('./api');
const mockApi = vi.mocked(api);

function makeDto(overrides: Partial<RecurringOrderDto> = {}): RecurringOrderDto {
  return {
    id: 1,
    ownerId: 10,
    ownerType: 'CLIENT',
    listingId: 5,
    listingTicker: 'AAPL',
    direction: 'BUY',
    mode: 'BYAMOUNT',
    value: 5000,
    accountId: 22,
    accountNumber: '222000111111111111',
    cadence: 'MONTHLY',
    nextRun: '2026-06-25T09:00:00',
    active: true,
    createdAt: '2026-05-25T09:00:00',
    lastRunAt: null,
    ...overrides,
  };
}

describe('recurringOrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listMyRecurringOrders', () => {
    it('GETs /recurring-orders/my without active filter', async () => {
      mockApi.get.mockResolvedValue({ data: [makeDto({ id: 1 }), makeDto({ id: 2 })] });
      const result = await recurringOrderService.listMyRecurringOrders();
      expect(mockApi.get).toHaveBeenCalledWith('/recurring-orders/my', { params: {} });
      expect(result).toHaveLength(2);
    });

    it('passes active=true as query param', async () => {
      mockApi.get.mockResolvedValue({ data: [] });
      await recurringOrderService.listMyRecurringOrders(true);
      expect(mockApi.get).toHaveBeenCalledWith('/recurring-orders/my', {
        params: { active: true },
      });
    });

    it('passes active=false as query param', async () => {
      mockApi.get.mockResolvedValue({ data: [] });
      await recurringOrderService.listMyRecurringOrders(false);
      expect(mockApi.get).toHaveBeenCalledWith('/recurring-orders/my', {
        params: { active: false },
      });
    });
  });

  describe('createRecurringOrder', () => {
    it('POSTs to /recurring-orders with request body', async () => {
      const request: CreateRecurringOrderRequest = {
        listingId: 5,
        direction: 'BUY',
        mode: 'BYAMOUNT',
        value: 5000,
        accountId: 22,
        cadence: 'MONTHLY',
      };
      mockApi.post.mockResolvedValue({ data: makeDto() });
      const result = await recurringOrderService.createRecurringOrder(request);
      expect(mockApi.post).toHaveBeenCalledWith('/recurring-orders', request);
      expect(result.id).toBe(1);
    });
  });

  describe('pauseRecurringOrder', () => {
    it('PATCHes /recurring-orders/{id}/pause', async () => {
      mockApi.patch.mockResolvedValue({ data: makeDto({ id: 7, active: false }) });
      const result = await recurringOrderService.pauseRecurringOrder(7);
      expect(mockApi.patch).toHaveBeenCalledWith('/recurring-orders/7/pause');
      expect(result.active).toBe(false);
    });
  });

  describe('resumeRecurringOrder', () => {
    it('PATCHes /recurring-orders/{id}/resume', async () => {
      mockApi.patch.mockResolvedValue({ data: makeDto({ id: 9, active: true }) });
      const result = await recurringOrderService.resumeRecurringOrder(9);
      expect(mockApi.patch).toHaveBeenCalledWith('/recurring-orders/9/resume');
      expect(result.active).toBe(true);
    });
  });

  describe('cancelRecurringOrder', () => {
    it('DELETEs /recurring-orders/{id}', async () => {
      mockApi.delete.mockResolvedValue({ data: undefined });
      await recurringOrderService.cancelRecurringOrder(42);
      expect(mockApi.delete).toHaveBeenCalledWith('/recurring-orders/42');
    });
  });
});
