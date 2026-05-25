import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PriceAlertsPage from '../pages/PriceAlerts/PriceAlertsPage';
import { priceAlertService } from '../services/priceAlertService';
import type { PriceAlertDto } from '../types/priceAlert';

vi.mock('../services/priceAlertService', () => ({
  priceAlertService: {
    listMyAlerts: vi.fn(),
    deleteAlert: vi.fn(),
    createAlert: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockList = vi.mocked(priceAlertService.listMyAlerts);
const mockDelete = vi.mocked(priceAlertService.deleteAlert);

function makeAlert(overrides: Partial<PriceAlertDto> = {}): PriceAlertDto {
  return {
    id: 1,
    listingId: 10,
    listingTicker: 'AAPL',
    listingType: 'STOCK',
    condition: 'ABOVE',
    threshold: 175.5,
    active: true,
    createdAt: '2026-05-20T10:00:00Z',
    triggeredAt: null,
    currency: 'USD',
    ...overrides,
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <PriceAlertsPage />
    </MemoryRouter>
  );
}

describe('PriceAlertsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows empty state when no alerts', async () => {
    mockList.mockResolvedValue([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Nemate cenovne alarme/i)).toBeTruthy();
    });
  });

  it('renders header and "Postavi novi alarm" button', async () => {
    mockList.mockResolvedValue([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Cenovni alarmi/i)).toBeTruthy();
    });

    expect(screen.getByTestId('price-alerts-new-button')).toBeTruthy();
  });

  it('renders alert rows for active alerts in Aktivni filter (default)', async () => {
    mockList.mockResolvedValue([
      makeAlert({ id: 1, listingTicker: 'AAPL', active: true }),
      makeAlert({ id: 2, listingTicker: 'MSFT', active: true }),
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
      expect(screen.getByTestId('price-alert-row-2')).toBeTruthy();
    });
  });

  it('filters to history when "Istorija" clicked', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([
      makeAlert({ id: 1, active: true }),
      makeAlert({ id: 2, active: false, triggeredAt: '2026-05-22T00:00:00Z' }),
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
    });

    await user.click(screen.getByTestId('price-alerts-filter-history'));

    await waitFor(() => {
      expect(screen.queryByTestId('price-alert-row-1')).toBeNull();
      expect(screen.getByTestId('price-alert-row-2')).toBeTruthy();
    });
  });

  it('shows all alerts in "Sve" filter', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([
      makeAlert({ id: 1, active: true }),
      makeAlert({ id: 2, active: false }),
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
    });

    await user.click(screen.getByTestId('price-alerts-filter-all'));

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
      expect(screen.getByTestId('price-alert-row-2')).toBeTruthy();
    });
  });

  it('delete flow: confirms, calls service, removes row', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockList.mockResolvedValue([makeAlert({ id: 1 })]);
    mockDelete.mockResolvedValue(undefined);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
    });

    fireEvent.click(screen.getByTestId('price-alert-delete-1'));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('price-alert-row-1')).toBeNull();
    });

    confirmSpy.mockRestore();
  });

  it('delete cancelled when confirm returns false', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    mockList.mockResolvedValue([makeAlert({ id: 1 })]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();
    });

    fireEvent.click(screen.getByTestId('price-alert-delete-1'));

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
    });
    expect(mockDelete).not.toHaveBeenCalled();
    expect(screen.getByTestId('price-alert-row-1')).toBeTruthy();

    confirmSpy.mockRestore();
  });

  it('shows error alert and retry button when load fails', async () => {
    mockList.mockRejectedValue(new Error('network error'));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/Neuspeh ucitavanja/i)).toBeTruthy();
      expect(screen.getByText(/Pokusaj ponovo/i)).toBeTruthy();
    });
  });
});
