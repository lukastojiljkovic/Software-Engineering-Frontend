import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { auditService } from './auditService';
import api from './api';

const mockApi = api as unknown as { get: ReturnType<typeof vi.fn> };

const emptyPage = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 20,
};

describe('auditService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.get.mockResolvedValue({ data: emptyPage });
  });

  it('queryAuditLogs() GETs /audit-logs bez params kad filter prazan', async () => {
    await auditService.queryAuditLogs({});

    expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', { params: {} });
  });

  it('queryAuditLogs() prosledjuje sve filter params kad su zadati', async () => {
    await auditService.queryAuditLogs({
      actionType: 'ORDER_APPROVED',
      actorEmail: 'marko@banka.rs',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
      page: 2,
      size: 50,
    });

    expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', {
      params: {
        actionType: 'ORDER_APPROVED',
        actorEmail: 'marko@banka.rs',
        dateFrom: '2026-01-01',
        dateTo: '2026-12-31',
        page: 2,
        size: 50,
      },
    });
  });

  it('queryAuditLogs() ne salje undefined polja', async () => {
    await auditService.queryAuditLogs({
      actionType: 'LIMIT_CHANGED',
      page: 0,
    });

    expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', {
      params: {
        actionType: 'LIMIT_CHANGED',
        page: 0,
      },
    });
    const callArgs = mockApi.get.mock.calls[0]?.[1] as { params: Record<string, unknown> };
    expect(callArgs.params).not.toHaveProperty('actorEmail');
    expect(callArgs.params).not.toHaveProperty('dateFrom');
    expect(callArgs.params).not.toHaveProperty('dateTo');
    expect(callArgs.params).not.toHaveProperty('size');
  });

  it('queryAuditLogs() ne salje prazne string filter vrednosti', async () => {
    await auditService.queryAuditLogs({
      actorEmail: '',
      dateFrom: '',
      dateTo: '',
    });

    expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', { params: {} });
  });

  it('queryAuditLogs() default poziv bez argumenata salje prazne params', async () => {
    await auditService.queryAuditLogs();

    expect(mockApi.get).toHaveBeenCalledWith('/audit-logs', { params: {} });
  });

  it('queryAuditLogs() vraca data property iz axios response-a', async () => {
    const fakePage = {
      content: [
        {
          id: 1,
          actionType: 'ORDER_APPROVED',
          actorId: 42,
          actorEmail: 'marko@banka.rs',
          actorName: 'Marko Petrovic',
          targetType: 'Order',
          targetId: 100,
          oldValue: null,
          newValue: 'APPROVED',
          metadata: null,
          createdAt: '2026-05-25T10:30:00Z',
        },
      ],
      totalElements: 1,
      totalPages: 1,
      number: 0,
      size: 20,
    };
    mockApi.get.mockResolvedValueOnce({ data: fakePage });

    const result = await auditService.queryAuditLogs({});

    expect(result).toEqual(fakePage);
    expect(result.content).toHaveLength(1);
  });

  it('queryAuditLogs() propagira gresku iz api.get', async () => {
    const err = new Error('Network down');
    mockApi.get.mockRejectedValueOnce(err);

    await expect(auditService.queryAuditLogs({})).rejects.toThrow('Network down');
  });
});
