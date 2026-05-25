import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../services/api';
import { priceAlertService } from '../services/priceAlertService';
import type { CreatePriceAlertRequest } from '../types/priceAlert';

vi.mock('../services/api');
const mockApi = vi.mocked(api);

describe('priceAlertService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createAlert POSTs to /price-alerts with the request body', async () => {
    const dto: CreatePriceAlertRequest = {
      listingId: 42,
      condition: 'ABOVE',
      threshold: 175.5,
    };
    mockApi.post.mockResolvedValue({
      data: {
        id: 99,
        listingId: 42,
        listingTicker: 'AAPL',
        listingType: 'STOCK',
        condition: 'ABOVE',
        threshold: 175.5,
        active: true,
        createdAt: '2026-05-25T10:00:00Z',
        triggeredAt: null,
      },
    });

    const result = await priceAlertService.createAlert(dto);

    expect(mockApi.post).toHaveBeenCalledWith('/price-alerts', dto);
    expect(result.id).toBe(99);
    expect(result.condition).toBe('ABOVE');
  });

  it('listMyAlerts without activeOnly param hits /price-alerts/my without filter', async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    await priceAlertService.listMyAlerts();

    expect(mockApi.get).toHaveBeenCalledWith('/price-alerts/my', { params: {} });
  });

  it('listMyAlerts with activeOnly=true passes active=true query param', async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    await priceAlertService.listMyAlerts(true);

    expect(mockApi.get).toHaveBeenCalledWith('/price-alerts/my', { params: { active: true } });
  });

  it('listMyAlerts with activeOnly=false passes active=false query param', async () => {
    mockApi.get.mockResolvedValue({ data: [] });

    await priceAlertService.listMyAlerts(false);

    expect(mockApi.get).toHaveBeenCalledWith('/price-alerts/my', { params: { active: false } });
  });

  it('deleteAlert DELETEs /price-alerts/:id', async () => {
    mockApi.delete.mockResolvedValue({ data: undefined });

    await priceAlertService.deleteAlert(123);

    expect(mockApi.delete).toHaveBeenCalledWith('/price-alerts/123');
  });
});
