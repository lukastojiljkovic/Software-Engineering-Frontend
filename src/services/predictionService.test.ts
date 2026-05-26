import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import { getLatestPrediction, type PricePredictionDTO } from './predictionService';
import api from './api';

const mockGet = api.get as ReturnType<typeof vi.fn>;

const sample: PricePredictionDTO = {
  symbol: 'AAPL',
  predictionDate: '2026-05-27',
  predictedClose: 195.5,
  lowerBound: 190.0,
  upperBound: 201.0,
  modelVersion: 'lstm-2.1.0',
  computedAt: '2026-05-26T03:00:00Z',
};

describe('predictionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLatestPrediction', () => {
    it('salje GET /listings/{symbol}/prediction', async () => {
      mockGet.mockResolvedValue({ data: sample });

      await getLatestPrediction('AAPL');

      expect(mockGet).toHaveBeenCalledWith('/listings/AAPL/prediction');
    });

    it('vraca predikciju iz BE odgovora', async () => {
      mockGet.mockResolvedValue({ data: sample });

      const result = await getLatestPrediction('AAPL');

      expect(result).toEqual(sample);
    });

    it('vraca null kada BE vrati 404 (nema modela za simbol)', async () => {
      mockGet.mockRejectedValue({ response: { status: 404 } });

      const result = await getLatestPrediction('UNKNOWN');

      expect(result).toBeNull();
    });

    it('propagira non-404 greske', async () => {
      mockGet.mockRejectedValue({ response: { status: 500 }, message: 'server error' });

      await expect(getLatestPrediction('AAPL')).rejects.toMatchObject({
        response: { status: 500 },
      });
    });

    it('propagira generic gresku bez response objekta', async () => {
      mockGet.mockRejectedValue(new Error('network error'));

      await expect(getLatestPrediction('AAPL')).rejects.toThrow('network error');
    });
  });
});
