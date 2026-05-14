import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mockujem api modul pre branch service import-a
vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
  },
}));

import { branchService } from './branchService';
import api from './api';

describe('branchService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('list() bez filtera salje prazan params object', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    await branchService.list();

    expect(api.get).toHaveBeenCalledWith('/branches', { params: {} });
  });

  it('list({type: BRANCH}) prosledjuje type query param', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    await branchService.list({ type: 'BRANCH' });

    expect(api.get).toHaveBeenCalledWith('/branches', { params: { type: 'BRANCH' } });
  });

  it('list sa svim filterima salje sve query params', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    await branchService.list({
      type: 'ATM',
      has24h: true,
      hasDriveThrough: true,
      search: '  Slavija  ',
    });

    expect(api.get).toHaveBeenCalledWith('/branches', {
      params: {
        type: 'ATM',
        has24h: 'true',
        hasDriveThrough: 'true',
        search: 'Slavija',
      },
    });
  });

  it('list({has24h: false}) NE prosledjuje has24h param', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] });

    await branchService.list({ has24h: false });

    expect(api.get).toHaveBeenCalledWith('/branches', { params: {} });
  });

  it('list propagira BE response data', async () => {
    const mockData = [
      { id: 1, name: 'ATM Test', type: 'ATM', address: 'Test 1', latitude: 44.8, longitude: 20.4, openingHours: '00-24', has24h: true, hasDriveThrough: false, createdAt: '2026-05-14' },
    ];
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockData });

    const result = await branchService.list();

    expect(result).toEqual(mockData);
  });
});
