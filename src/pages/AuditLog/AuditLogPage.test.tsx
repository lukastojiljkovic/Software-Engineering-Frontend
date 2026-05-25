import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuditLogDto, AuditPageDto } from '@/types/audit';

vi.mock('@/services/auditService', () => ({
  auditService: {
    queryAuditLogs: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

import AuditLogPage from './AuditLogPage';
import { auditService } from '@/services/auditService';
import { toast } from '@/lib/notify';

const mockedQuery = vi.mocked(auditService.queryAuditLogs);
const mockedToast = vi.mocked(toast);

function makePage(entries: AuditLogDto[], overrides: Partial<AuditPageDto<AuditLogDto>> = {}): AuditPageDto<AuditLogDto> {
  return {
    content: entries,
    totalElements: entries.length,
    totalPages: Math.max(1, Math.ceil(entries.length / 20)),
    number: 0,
    size: 20,
    ...overrides,
  };
}

const entry1: AuditLogDto = {
  id: 1,
  actionType: 'ORDER_APPROVED',
  actorId: 42,
  actorEmail: 'marko.petrovic@banka.rs',
  actorName: 'Marko Petrovic',
  targetType: 'Order',
  targetId: 100,
  oldValue: 'PENDING',
  newValue: 'APPROVED',
  metadata: { reason: 'auto' },
  createdAt: '2026-05-25T10:30:00Z',
};

const entry2: AuditLogDto = {
  id: 2,
  actionType: 'LIMIT_CHANGED',
  actorId: 7,
  actorEmail: 'jelena.djordjevic@banka.rs',
  actorName: 'Jelena Djordjevic',
  targetType: 'Actuary',
  targetId: 33,
  oldValue: '100000',
  newValue: '150000',
  metadata: null,
  createdAt: '2026-05-25T11:00:00Z',
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/audit-log']}>
      <AuditLogPage />
    </MemoryRouter>
  );
}

describe('AuditLogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedQuery.mockResolvedValue(makePage([entry1, entry2]));
  });

  it('renderuje page header sa naslovom "Audit log"', async () => {
    renderPage();
    expect(await screen.findByText('Audit log')).toBeInTheDocument();
    expect(
      screen.getByText(/istorija svih bitnih sistemskih akcija/i)
    ).toBeInTheDocument();
  });

  it('renderuje 4 filter polja sa data-testid-evima', async () => {
    renderPage();
    expect(await screen.findByTestId('audit-filter-action')).toBeInTheDocument();
    expect(screen.getByTestId('audit-filter-actor')).toBeInTheDocument();
    expect(screen.getByTestId('audit-filter-from')).toBeInTheDocument();
    expect(screen.getByTestId('audit-filter-to')).toBeInTheDocument();
    expect(screen.getByTestId('audit-filter-apply')).toBeInTheDocument();
    expect(screen.getByTestId('audit-filter-reset')).toBeInTheDocument();
  });

  it('prikazuje loading state pre nego sto BE odgovori', () => {
    mockedQuery.mockImplementation(() => new Promise(() => {})); // never resolves
    renderPage();
    expect(screen.getByTestId('audit-loading')).toBeInTheDocument();
  });

  it('prikazuje audit zapise kada queryAuditLogs vrati sadrzaj', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('audit-row-1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('audit-row-2')).toBeInTheDocument();
    expect(screen.getByText('Marko Petrovic')).toBeInTheDocument();
    expect(screen.getByText('Jelena Djordjevic')).toBeInTheDocument();
  });

  it('prikazuje srpsku labelu tipa akcije u Badge-u', async () => {
    renderPage();
    const badge1 = await screen.findByTestId('audit-action-badge-1');
    expect(badge1.textContent).toMatch(/odobr/i);
    const badge2 = screen.getByTestId('audit-action-badge-2');
    expect(badge2.textContent).toMatch(/limit/i);
  });

  it('prikazuje empty state kada nema rezultata', async () => {
    mockedQuery.mockResolvedValueOnce(makePage([]));
    renderPage();
    expect(await screen.findByTestId('audit-empty')).toBeInTheDocument();
    expect(
      screen.getByText(/nema audit zapisa za zadate filtere/i)
    ).toBeInTheDocument();
  });

  it('klik na "Filtriraj" poziva queryAuditLogs sa unetim parametrima', async () => {
    const user = userEvent.setup();
    renderPage();

    // Sacekaj inicijalan fetch
    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalledTimes(1);
    });
    mockedQuery.mockClear();

    await user.selectOptions(screen.getByTestId('audit-filter-action'), 'ORDER_APPROVED');
    await user.type(screen.getByTestId('audit-filter-actor'), 'marko@banka.rs');
    await user.click(screen.getByTestId('audit-filter-apply'));

    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalled();
    });
    const lastCall = mockedQuery.mock.calls[mockedQuery.mock.calls.length - 1]?.[0];
    expect(lastCall).toMatchObject({
      actionType: 'ORDER_APPROVED',
      actorEmail: 'marko@banka.rs',
      page: 0,
    });
  });

  it('klik na "Resetuj filtere" cisti polja i ponovo poziva queryAuditLogs', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalledTimes(1);
    });

    const actorInput = screen.getByTestId('audit-filter-actor') as HTMLInputElement;
    await user.type(actorInput, 'test@banka.rs');
    expect(actorInput.value).toBe('test@banka.rs');

    mockedQuery.mockClear();
    await user.click(screen.getByTestId('audit-filter-reset'));

    expect(actorInput.value).toBe('');
    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalled();
    });
    const lastCall = mockedQuery.mock.calls[mockedQuery.mock.calls.length - 1]?.[0];
    expect(lastCall).toMatchObject({ page: 0 });
    expect(lastCall).not.toHaveProperty('actorEmail');
  });

  it('paginacija: klik "Sledeca" inkrementira page parametar', async () => {
    const user = userEvent.setup();
    mockedQuery.mockResolvedValue(
      makePage([entry1, entry2], { totalElements: 50, totalPages: 3, number: 0 })
    );
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('audit-page-next')).toBeInTheDocument();
    });

    mockedQuery.mockClear();
    mockedQuery.mockResolvedValue(
      makePage([entry1], { totalElements: 50, totalPages: 3, number: 1 })
    );
    await user.click(screen.getByTestId('audit-page-next'));

    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalled();
    });
    const lastCall = mockedQuery.mock.calls[mockedQuery.mock.calls.length - 1]?.[0];
    expect(lastCall).toMatchObject({ page: 1 });
  });

  it('paginacija: "Prethodna" je disabled na strani 0', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('audit-page-prev')).toBeInTheDocument();
    });
    expect(screen.getByTestId('audit-page-prev')).toBeDisabled();
  });

  it('toast.error i error alert se prikazuju kada queryAuditLogs reject-uje', async () => {
    mockedQuery.mockRejectedValueOnce({
      response: { data: { message: 'Forbidden — supervisor only' } },
    });
    renderPage();

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalledWith('Forbidden — supervisor only');
    });
    expect(await screen.findByTestId('audit-error')).toHaveTextContent(
      /forbidden/i
    );
  });

  it('inicijalan fetch poziva queryAuditLogs sa page=0 i size=20', async () => {
    renderPage();
    await waitFor(() => {
      expect(mockedQuery).toHaveBeenCalled();
    });
    expect(mockedQuery).toHaveBeenCalledWith({ page: 0, size: 20 });
  });
});
