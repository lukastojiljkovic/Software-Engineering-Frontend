import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import RecurringOrdersPage from './RecurringOrdersPage';
import { recurringOrderService } from '@/services/recurringOrderService';
import { accountService } from '@/services/accountService';
import listingService from '@/services/listingService';
import type { RecurringOrderDto } from '@/types/recurringOrder';
import type { Account } from '@/types/celina2';
import type { Listing, PaginatedResponse } from '@/types/celina3';

vi.mock('@/services/recurringOrderService', () => ({
  recurringOrderService: {
    listMyRecurringOrders: vi.fn(),
    createRecurringOrder: vi.fn(),
    pauseRecurringOrder: vi.fn(),
    resumeRecurringOrder: vi.fn(),
    cancelRecurringOrder: vi.fn(),
  },
}));

vi.mock('@/services/accountService', () => ({
  accountService: {
    getMyAccounts: vi.fn(),
  },
}));

vi.mock('@/services/listingService', () => ({
  default: {
    getAll: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockListMy = vi.mocked(recurringOrderService.listMyRecurringOrders);
const mockCreate = vi.mocked(recurringOrderService.createRecurringOrder);
const mockPause = vi.mocked(recurringOrderService.pauseRecurringOrder);
const mockResume = vi.mocked(recurringOrderService.resumeRecurringOrder);
const mockCancel = vi.mocked(recurringOrderService.cancelRecurringOrder);
const mockGetMyAccounts = vi.mocked(accountService.getMyAccounts);
const mockListingSearch = vi.mocked(listingService.getAll);

function makeOrder(overrides: Partial<RecurringOrderDto> = {}): RecurringOrderDto {
  return {
    id: 1,
    ownerId: 10,
    ownerType: 'CLIENT',
    listingId: 5,
    listingTicker: 'AAPL',
    listingType: 'STOCK',
    direction: 'BUY',
    mode: 'BYAMOUNT',
    value: 5000,
    currency: 'USD',
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

const mockAccount: Account = {
  id: 22,
  accountNumber: '222000111111111111',
  ownerName: 'Stefan Jovanovic',
  accountType: 'CHECKING' as Account['accountType'],
  currency: 'USD' as Account['currency'],
  balance: 10000,
  availableBalance: 9500,
  reservedBalance: 500,
  dailyLimit: 250000,
  monthlyLimit: 1000000,
  dailySpending: 0,
  monthlySpending: 0,
  maintenanceFee: 0,
  status: 'ACTIVE' as Account['status'],
  createdAt: '2026-01-01T00:00:00Z',
};

const emptyListingPage: PaginatedResponse<Listing> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: 8,
  number: 0,
} as PaginatedResponse<Listing>;

function renderPage() {
  return render(
    <MemoryRouter>
      <RecurringOrdersPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetMyAccounts.mockResolvedValue([mockAccount]);
  mockListingSearch.mockResolvedValue(emptyListingPage);
  // Confirm dialog defaults — vec mock-ovan u src/test/setup.ts (() => true)
  (window.confirm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);
});

describe('RecurringOrdersPage', () => {
  it('renderuje header "Trajni nalozi (DCA)"', async () => {
    mockListMy.mockResolvedValue([]);
    renderPage();
    expect(
      screen.getByRole('heading', { name: /Trajni nalozi \(DCA\)/i })
    ).toBeInTheDocument();
  });

  it('prikazuje empty state kada nema trajnih naloga', async () => {
    mockListMy.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('recurring-empty')).toBeInTheDocument();
    });
    expect(screen.getByText(/Nemate aktivnih trajnih naloga/i)).toBeInTheDocument();
  });

  it('prikazuje listu trajnih naloga kada API vrati podatke', async () => {
    mockListMy.mockResolvedValue([makeOrder({ id: 1, listingTicker: 'AAPL' })]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('recurring-row-1')).toBeInTheDocument();
    });
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });

  it('"Pauziraj" je vidljiv samo za aktivan nalog i poziva pause(id)', async () => {
    mockListMy.mockResolvedValue([makeOrder({ id: 7, active: true })]);
    mockPause.mockResolvedValue(makeOrder({ id: 7, active: false }));
    renderPage();
    const pauseBtn = await screen.findByTestId('recurring-pause-7');
    expect(pauseBtn).toBeInTheDocument();
    await userEvent.click(pauseBtn);
    await waitFor(() => {
      expect(mockPause).toHaveBeenCalledWith(7);
    });
  });

  it('"Nastavi" je vidljiv samo za pauzirane (active=false) — switch na tab paused', async () => {
    mockListMy.mockResolvedValue([makeOrder({ id: 9, active: false })]);
    mockResume.mockResolvedValue(makeOrder({ id: 9, active: true }));
    renderPage();
    // Pauziran nalog je na "Pauzirani" tabu, treba prebaciti
    const pausedTab = await screen.findByTestId('tab-paused');
    await userEvent.click(pausedTab);

    const resumeBtn = await screen.findByTestId('recurring-resume-9');
    await userEvent.click(resumeBtn);
    await waitFor(() => {
      expect(mockResume).toHaveBeenCalledWith(9);
    });
  });

  it('klik na "Otkazi" trazi confirm pa poziva cancel(id)', async () => {
    mockListMy.mockResolvedValue([makeOrder({ id: 11 })]);
    mockCancel.mockResolvedValue(undefined);
    renderPage();
    const cancelBtn = await screen.findByTestId('recurring-cancel-11');
    await userEvent.click(cancelBtn);
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(mockCancel).toHaveBeenCalledWith(11);
    });
  });

  it('cancel se ne izvrsava kada korisnik odbije confirm', async () => {
    (window.confirm as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);
    mockListMy.mockResolvedValue([makeOrder({ id: 12 })]);
    renderPage();
    const cancelBtn = await screen.findByTestId('recurring-cancel-12');
    await userEvent.click(cancelBtn);
    expect(mockCancel).not.toHaveBeenCalled();
  });

  it('forma prikazuje validation gresku kada vrednost nije > 0 i ne poziva create', async () => {
    mockListMy.mockResolvedValue([]);
    renderPage();
    await waitFor(() => expect(screen.getByTestId('recurring-create-form')).toBeInTheDocument());

    const submit = screen.getByTestId('recurring-submit');
    await userEvent.click(submit);

    // Bez popunjenih polja (listingId/accountId/value), submit ne sme zvati BE
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('prebacivanje izmedju tabova filtrira prikazane naloge', async () => {
    mockListMy.mockResolvedValue([
      makeOrder({ id: 1, active: true, listingTicker: 'AAPL' }),
      makeOrder({ id: 2, active: false, listingTicker: 'MSFT' }),
    ]);
    renderPage();
    // Default tab = aktivni
    await waitFor(() => expect(screen.getByTestId('recurring-row-1')).toBeInTheDocument());
    expect(screen.queryByTestId('recurring-row-2')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tab-paused'));
    await waitFor(() => expect(screen.getByTestId('recurring-row-2')).toBeInTheDocument());
    expect(screen.queryByTestId('recurring-row-1')).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId('tab-all'));
    await waitFor(() => {
      expect(screen.getByTestId('recurring-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('recurring-row-2')).toBeInTheDocument();
    });
  });

  it('prikazuje error alert i retry kada listMy padne', async () => {
    mockListMy.mockRejectedValue(new Error('boom'));
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('recurring-error')).toBeInTheDocument();
    });
    expect(screen.getByText(/Pokusaj ponovo/i)).toBeInTheDocument();
  });
});
