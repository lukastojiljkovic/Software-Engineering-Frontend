import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SavingsListPage from '../pages/Savings/SavingsListPage';
import { savingsService } from '../services/savingsService';

vi.mock('../services/savingsService', () => ({
  savingsService: {
    listMyDeposits: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockListMy = vi.mocked(savingsService.listMyDeposits);

function renderPage() {
  return render(
    <MemoryRouter>
      <SavingsListPage />
    </MemoryRouter>
  );
}

describe('SavingsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state when no deposits', async () => {
    mockListMy.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Nemate aktivnih depozita/i)).toBeTruthy();
    });
  });

  it('renders deposit cards for active deposits', async () => {
    mockListMy.mockResolvedValue([
      {
        id: 1,
        clientId: 1,
        clientName: 'Test',
        linkedAccountId: 1,
        linkedAccountNumber: '222',
        principalAmount: 200000,
        currencyCode: 'RSD',
        termMonths: 12,
        annualInterestRate: 4,
        startDate: '2026-03-12',
        maturityDate: '2027-03-12',
        nextInterestPaymentDate: '2026-06-12',
        totalInterestPaid: 666,
        autoRenew: true,
        status: 'ACTIVE',
        createdAt: '2026-03-12T00:00:00Z',
        updatedAt: '2026-03-12T00:00:00Z',
      },
    ]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('deposit-card-1')).toBeTruthy();
    });
  });

  it('has "+ Novi depozit" call-to-action', async () => {
    mockListMy.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      const btn = screen.getByTestId('open-new-deposit');
      expect(btn).toBeTruthy();
    });
  });
});
