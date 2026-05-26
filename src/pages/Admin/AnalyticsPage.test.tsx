import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/analyticsService', () => ({
  getAnalyticsDaily: vi.fn(),
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

import AnalyticsPage from './AnalyticsPage';
import { getAnalyticsDaily, type AnalyticsDailyDTO } from '@/services/analyticsService';
import { toast } from '@/lib/notify';

const mockedGet = vi.mocked(getAnalyticsDaily);
const mockedToast = vi.mocked(toast);

const sample1: AnalyticsDailyDTO = {
  metricDate: '2026-05-25',
  metricName: 'top_movers',
  dimensions: { symbol: 'AAPL', direction: 'UP' },
  value: 12.5,
};

const sample2: AnalyticsDailyDTO = {
  metricDate: '2026-05-25',
  metricName: 'order_count',
  dimensions: { listingType: 'STOCK' },
  value: 1547,
};

const sample3: AnalyticsDailyDTO = {
  metricDate: '2026-05-25',
  metricName: 'total_notional',
  dimensions: { currency: 'USD' },
  value: 1250000.75,
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/analytics']}>
      <AnalyticsPage />
    </MemoryRouter>,
  );
}

describe('AnalyticsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue([sample1, sample2, sample3]);
  });

  it('renderuje page header sa naslovom "Analitike"', async () => {
    renderPage();
    expect(await screen.findByText('Analitike')).toBeInTheDocument();
    expect(screen.getByText(/dnevni spark agregati/i)).toBeInTheDocument();
  });

  it('inicijalan fetch poziva getAnalyticsDaily sa default datumom (juce)', async () => {
    renderPage();
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    // Default datum je juce — proveri da je prosledjen ISO date format
    const firstCall = mockedGet.mock.calls[0];
    expect(firstCall?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('prikazuje loading skeleton dok BE ne odgovori', () => {
    mockedGet.mockImplementation(() => new Promise(() => {}));
    renderPage();
    expect(screen.getByTestId('analytics-loading')).toBeInTheDocument();
  });

  it('prikazuje metric kartice kada BE vrati podatke', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('analytics-metric-card-0')).toBeInTheDocument();
    });
    expect(screen.getByTestId('analytics-metric-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-metric-card-2')).toBeInTheDocument();
    // Card title prikazuje ime metrike — bar jednom u DOM-u (groupBy ga
    // duplira u "Pregled po metrici" sekciji, sto je ocekivano).
    expect(screen.getAllByText('top_movers').length).toBeGreaterThan(0);
    expect(screen.getAllByText('order_count').length).toBeGreaterThan(0);
    expect(screen.getAllByText('total_notional').length).toBeGreaterThan(0);
  });

  it('prikazuje formattiranu vrednost metrike', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('analytics-metric-card-1')).toBeInTheDocument();
    });
    // order_count = 1547 -> formatted broj
    expect(screen.getByText(/1[\s.,]547/)).toBeInTheDocument();
  });

  it('promena datuma trigger-uje novi fetch', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    mockedGet.mockClear();

    const dateInput = screen.getByTestId('analytics-date') as HTMLInputElement;
    await user.clear(dateInput);
    await user.type(dateInput, '2026-05-01');

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    expect(mockedGet.mock.calls.some((c) => c[0] === '2026-05-01')).toBe(true);
  });

  it('klik na metric filter dropdown poziva fetch sa metric_name parametrom', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    mockedGet.mockClear();

    const metricSelect = screen.getByTestId('analytics-metric-filter');
    await user.selectOptions(metricSelect, 'top_movers');

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    const lastCall = mockedGet.mock.calls[mockedGet.mock.calls.length - 1];
    expect(lastCall?.[1]).toBe('top_movers');
  });

  it('prikazuje empty state kada BE vrati praznu listu', async () => {
    mockedGet.mockResolvedValueOnce([]);
    renderPage();
    expect(await screen.findByTestId('analytics-empty')).toBeInTheDocument();
    expect(screen.getByText(/nema podataka za ovaj datum/i)).toBeInTheDocument();
  });

  it('toast.error se prikazuje kada getAnalyticsDaily reject-uje', async () => {
    mockedGet.mockRejectedValueOnce({
      response: { data: { message: 'Forbidden — admin only' } },
    });
    renderPage();

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalled();
    });
  });

  it('prikazuje dimensions kao formatirani JSON u kartici', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('analytics-metric-card-0')).toBeInTheDocument();
    });
    // AAPL je u dimensions.symbol prve metrike
    expect(screen.getByText(/AAPL/)).toBeInTheDocument();
  });
});
