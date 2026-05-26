import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import { getAnalyticsDaily, type AnalyticsDailyDTO } from './analyticsService';
import api from './api';

const mockGet = api.get as ReturnType<typeof vi.fn>;

const sample: AnalyticsDailyDTO = {
  metricDate: '2026-05-25',
  metricName: 'top_movers',
  dimensions: { symbol: 'AAPL' },
  value: 12.5,
};

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAnalyticsDaily', () => {
    it('salje GET /admin/analytics/daily sa date params', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getAnalyticsDaily('2026-05-25');

      expect(mockGet).toHaveBeenCalledWith('/admin/analytics/daily', {
        params: { date: '2026-05-25' },
      });
    });

    it('dodaje metric_name param kada je zadat', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getAnalyticsDaily('2026-05-25', 'top_movers');

      expect(mockGet).toHaveBeenCalledWith('/admin/analytics/daily', {
        params: { date: '2026-05-25', metric_name: 'top_movers' },
      });
    });

    it('ne dodaje metric_name param kada je undefined', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getAnalyticsDaily('2026-05-25');

      const call = mockGet.mock.calls[0];
      expect(call?.[1]).toEqual({ params: { date: '2026-05-25' } });
      expect(call?.[1]?.params).not.toHaveProperty('metric_name');
    });

    it('vraca listu iz BE odgovora', async () => {
      mockGet.mockResolvedValue({ data: [sample] });

      const result = await getAnalyticsDaily('2026-05-25');

      expect(result).toEqual([sample]);
    });

    it('propagira gresku ako api odbije zahtev', async () => {
      mockGet.mockRejectedValue(new Error('403 forbidden'));

      await expect(getAnalyticsDaily('2026-05-25')).rejects.toThrow('403 forbidden');
    });
  });
});
