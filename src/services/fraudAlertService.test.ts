import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import {
  getFraudAlerts,
  reviewFraudAlert,
  type FraudAlertDTO,
} from './fraudAlertService';
import api from './api';

const mockGet = api.get as ReturnType<typeof vi.fn>;
const mockPost = api.post as ReturnType<typeof vi.fn>;

const sample: FraudAlertDTO = {
  id: 1,
  transactionId: 1001,
  riskScore: 0.97,
  features: { amount: 500000 },
  modelVersion: 'fraud-1.2.0',
  computedAt: '2026-05-25T10:30:00Z',
};

describe('fraudAlertService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getFraudAlerts', () => {
    it('salje GET /admin/fraud-alerts sa since + min_risk', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getFraudAlerts('2026-05-18', 0.85);

      expect(mockGet).toHaveBeenCalledWith('/admin/fraud-alerts', {
        params: { since: '2026-05-18', min_risk: 0.85 },
      });
    });

    it('koristi default min_risk=0.8 kada nije zadat', async () => {
      mockGet.mockResolvedValue({ data: [] });

      await getFraudAlerts('2026-05-18');

      expect(mockGet).toHaveBeenCalledWith('/admin/fraud-alerts', {
        params: { since: '2026-05-18', min_risk: 0.8 },
      });
    });

    it('vraca listu alert-ova iz BE odgovora', async () => {
      mockGet.mockResolvedValue({ data: [sample] });

      const result = await getFraudAlerts('2026-05-18');

      expect(result).toEqual([sample]);
    });

    it('propagira gresku ako api odbije zahtev', async () => {
      mockGet.mockRejectedValue(new Error('500 server error'));

      await expect(getFraudAlerts('2026-05-18')).rejects.toThrow('500 server error');
    });
  });

  describe('reviewFraudAlert', () => {
    it('salje POST /admin/fraud-alerts/{id}/review sa statusom i note-om', async () => {
      mockPost.mockResolvedValue({ data: undefined });

      await reviewFraudAlert(42, 'APPROVED', 'Looks legit');

      expect(mockPost).toHaveBeenCalledWith('/admin/fraud-alerts/42/review', {
        status: 'APPROVED',
        note: 'Looks legit',
      });
    });

    it('salje POST bez note kada nije zadat', async () => {
      mockPost.mockResolvedValue({ data: undefined });

      await reviewFraudAlert(99, 'REJECTED');

      expect(mockPost).toHaveBeenCalledWith('/admin/fraud-alerts/99/review', {
        status: 'REJECTED',
        note: undefined,
      });
    });

    it('propagira gresku ako api odbije zahtev', async () => {
      mockPost.mockRejectedValue(new Error('400 invalid status'));

      await expect(reviewFraudAlert(1, 'BAD')).rejects.toThrow('400 invalid status');
    });
  });
});
