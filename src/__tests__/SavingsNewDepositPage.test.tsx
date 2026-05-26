import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SavingsNewDepositPage from '../pages/Savings/SavingsNewDepositPage';
import { savingsService } from '../services/savingsService';
import { accountService } from '../services/accountService';
import { mockAccount } from '../test/helpers';

// Mock-ujemo navigate jer ga page koristi posle uspesnog openDeposit.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../services/savingsService', () => ({
  savingsService: {
    getRates: vi.fn(),
    openDeposit: vi.fn(),
  },
}));

vi.mock('../services/accountService', () => ({
  accountService: {
    getMyAccounts: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

// VerificationModal je puna komponenta sa OTP timer / 3 attempts logikom.
// Za ove testove ga zamenjujemo light stubom koji eksponira `onVerified` callback
// kroz data-testid-ovan button (klikom forsiramo OTP "succeeded" sa hardcoded kodom).
vi.mock('@/components/shared/VerificationModal', () => ({
  default: ({
    isOpen,
    onVerified,
  }: {
    isOpen: boolean;
    onVerified: (code: string) => Promise<void> | void;
  }) =>
    isOpen ? (
      <div data-testid="otp-modal">
        <button data-testid="otp-verify-button" onClick={() => void onVerified('123456')}>
          Verify
        </button>
      </div>
    ) : null,
}));

// SavingsCalculator je puna komponenta — sidebarski compute KPI-a. Stubujemo da
// izbegnemo formatter/computation render-render-render-i u svakom testu.
vi.mock('@/components/savings/SavingsCalculator', () => ({
  SavingsCalculator: ({ principal }: { principal: number }) => (
    <div data-testid="savings-calculator">Calc:{principal}</div>
  ),
}));

const mockGetRates = vi.mocked(savingsService.getRates);
const mockOpenDeposit = vi.mocked(savingsService.openDeposit);
const mockGetMyAccounts = vi.mocked(accountService.getMyAccounts);

const rsdAccount = mockAccount({
  id: 1,
  accountNumber: '265000000000000001',
  currency: 'RSD',
  availableBalance: 500000,
  status: 'ACTIVE',
});

const eurAccount = mockAccount({
  id: 2,
  accountNumber: '265000000000000002',
  currency: 'EUR',
  availableBalance: 1500,
  status: 'ACTIVE',
});

const rsdRate = {
  id: 1,
  currencyCode: 'RSD',
  termMonths: 12,
  annualRate: 4.5,
  isActive: true,
  validFrom: '2026-01-01T00:00:00Z',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
} as unknown as Awaited<ReturnType<typeof savingsService.getRates>>[number];

function renderPage() {
  return render(
    <MemoryRouter>
      <SavingsNewDepositPage />
    </MemoryRouter>
  );
}

describe('SavingsNewDepositPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockGetMyAccounts.mockResolvedValue([rsdAccount, eurAccount]);
    mockGetRates.mockResolvedValue([rsdRate]);
  });

  it('renders header and form sections', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Novi oroceni depozit/i)).toBeTruthy();
    });

    expect(screen.getByTestId('source-account')).toBeTruthy();
    expect(screen.getByTestId('principal-input')).toBeTruthy();
    expect(screen.getByTestId('submit-deposit')).toBeTruthy();
    expect(screen.getByTestId('auto-renew-toggle')).toBeTruthy();
  });

  it('populates source account select with only ACTIVE accounts', async () => {
    mockGetMyAccounts.mockResolvedValue([
      rsdAccount,
      mockAccount({ id: 99, accountNumber: 'X', currency: 'RSD', status: 'CLOSED' }),
    ]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('source-account')).toBeTruthy();
    });

    const select = screen.getByTestId('source-account') as HTMLSelectElement;
    // 1 placeholder option + 1 active = 2 ukupno (CLOSED filter-iran iz set-State-a)
    expect(select.options.length).toBe(2);
  });

  it('renders 5 term buttons (3/6/12/24/36) and switches active on click', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('term-12')).toBeTruthy();
    });

    expect(screen.getByTestId('term-3')).toBeTruthy();
    expect(screen.getByTestId('term-6')).toBeTruthy();
    expect(screen.getByTestId('term-24')).toBeTruthy();
    expect(screen.getByTestId('term-36')).toBeTruthy();

    // Default je 12 — klik na 24 menja
    await user.click(screen.getByTestId('term-24'));
    // Posle klika 24 dobija indigo bg klasu
    const term24 = screen.getByTestId('term-24');
    expect(term24.className).toMatch(/bg-indigo-600/);
  });

  it('opens OTP modal only after submit sa validnim podacima', async () => {
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('source-account')).toBeTruthy();
    });

    // Bira RSD account
    await user.selectOptions(screen.getByTestId('source-account'), '1');

    // Unesi iznos iznad min (RSD min je 10000, prema MIN_DEPOSIT_AMOUNT)
    const principalInput = screen.getByTestId('principal-input') as HTMLInputElement;
    await user.clear(principalInput);
    await user.type(principalInput, '50000');

    await user.click(screen.getByTestId('submit-deposit'));

    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeTruthy();
    });

    // openDeposit ne sme da bude pozvan dok OTP ne verify
    expect(mockOpenDeposit).not.toHaveBeenCalled();
  });

  it('poziva openDeposit sa snapshot podacima posle OTP verify (FE-FND-01 anti-stale)', async () => {
    const user = userEvent.setup();
    mockOpenDeposit.mockResolvedValue({ id: 42 } as unknown as Awaited<
      ReturnType<typeof savingsService.openDeposit>
    >);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('source-account')).toBeTruthy();
    });

    await user.selectOptions(screen.getByTestId('source-account'), '1');
    const principalInput = screen.getByTestId('principal-input') as HTMLInputElement;
    await user.clear(principalInput);
    await user.type(principalInput, '100000');

    await user.click(screen.getByTestId('submit-deposit'));

    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeTruthy();
    });

    // Klik na verify forsira onVerified('123456')
    fireEvent.click(screen.getByTestId('otp-verify-button'));

    await waitFor(() => {
      expect(mockOpenDeposit).toHaveBeenCalledTimes(1);
    });

    const call = mockOpenDeposit.mock.calls[0][0];
    expect(call.sourceAccountId).toBe(1);
    expect(call.linkedAccountId).toBe(1); // default linked = source
    expect(call.principalAmount).toBe(100000);
    expect(call.termMonths).toBe(12);
    expect(call.autoRenew).toBe(false);
    expect(call.otpCode).toBe('123456');
  });

  it('navigates na /savings/:id posle uspesnog openDeposit', async () => {
    const user = userEvent.setup();
    mockOpenDeposit.mockResolvedValue({ id: 77 } as unknown as Awaited<
      ReturnType<typeof savingsService.openDeposit>
    >);

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('source-account')).toBeTruthy();
    });

    await user.selectOptions(screen.getByTestId('source-account'), '1');
    const principalInput = screen.getByTestId('principal-input') as HTMLInputElement;
    await user.clear(principalInput);
    await user.type(principalInput, '200000');

    await user.click(screen.getByTestId('submit-deposit'));

    await waitFor(() => {
      expect(screen.getByTestId('otp-modal')).toBeTruthy();
    });

    fireEvent.click(screen.getByTestId('otp-verify-button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/savings/77');
    });
  });
});
