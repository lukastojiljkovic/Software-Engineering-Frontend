import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/fraudAlertService', () => ({
  getFraudAlerts: vi.fn(),
  reviewFraudAlert: vi.fn(),
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

import FraudAlertsPage from './FraudAlertsPage';
import {
  getFraudAlerts,
  reviewFraudAlert,
  type FraudAlertDTO,
} from '@/services/fraudAlertService';
import { toast } from '@/lib/notify';

const mockedGet = vi.mocked(getFraudAlerts);
const mockedReview = vi.mocked(reviewFraudAlert);
const mockedToast = vi.mocked(toast);

const high: FraudAlertDTO = {
  id: 1,
  transactionId: 1001,
  riskScore: 0.97,
  features: { amount: 500000, hourOfDay: 3 },
  modelVersion: 'fraud-1.2.0',
  computedAt: '2026-05-25T10:30:00Z',
};

const medium: FraudAlertDTO = {
  id: 2,
  transactionId: 1002,
  riskScore: 0.88,
  features: { amount: 100000, country: 'NG' },
  modelVersion: 'fraud-1.2.0',
  computedAt: '2026-05-25T11:00:00Z',
};

const low: FraudAlertDTO = {
  id: 3,
  transactionId: 1003,
  riskScore: 0.82,
  features: { amount: 50000 },
  modelVersion: 'fraud-1.2.0',
  computedAt: '2026-05-25T11:30:00Z',
  reviewedBy: 'marko.petrovic@banka.rs',
  reviewStatus: 'APPROVED',
  reviewedAt: '2026-05-25T12:00:00Z',
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin/fraud-alerts']}>
      <FraudAlertsPage />
    </MemoryRouter>,
  );
}

describe('FraudAlertsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGet.mockResolvedValue([high, medium, low]);
    mockedReview.mockResolvedValue();
  });

  it('renderuje page header sa naslovom "Fraud alerts"', async () => {
    renderPage();
    expect(await screen.findByText('Fraud alerts')).toBeInTheDocument();
    expect(screen.getByText(/anomalije detektovane spark modelom/i)).toBeInTheDocument();
  });

  it('inicijalan fetch poziva getFraudAlerts sa default since (7d) i minRisk=0.8', async () => {
    renderPage();
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    const firstCall = mockedGet.mock.calls[0];
    expect(firstCall?.[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(firstCall?.[1]).toBe(0.8);
  });

  it('prikazuje sve alerts u tabeli', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('fraud-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('fraud-row-3')).toBeInTheDocument();
  });

  it('prikazuje risk_score badge sa color-coding (red >0.95, orange >0.85, yellow >0.8)', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-1')).toBeInTheDocument();
    });
    // 0.97 -> destructive (red)
    expect(screen.getByTestId('fraud-risk-badge-1')).toHaveAttribute('data-risk-tier', 'high');
    // 0.88 -> warning (orange)
    expect(screen.getByTestId('fraud-risk-badge-2')).toHaveAttribute('data-risk-tier', 'medium');
    // 0.82 -> info/yellow (low)
    expect(screen.getByTestId('fraud-risk-badge-3')).toHaveAttribute('data-risk-tier', 'low');
  });

  it('prikazuje reviewed status za vec pregledan alert', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-3')).toBeInTheDocument();
    });
    expect(screen.getByText('marko.petrovic@banka.rs')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('Pregledaj button otvara dialog za nepregledan alert', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-1')).toBeInTheDocument();
    });
    const reviewButton = screen.getByTestId('fraud-review-btn-1');
    await user.click(reviewButton);

    await waitFor(() => {
      expect(screen.getByTestId('fraud-review-dialog')).toBeInTheDocument();
    });
  });

  it('submit review dialog poziva reviewFraudAlert sa statusom i note-om', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-1')).toBeInTheDocument();
    });
    await user.click(screen.getByTestId('fraud-review-btn-1'));
    await waitFor(() => {
      expect(screen.getByTestId('fraud-review-dialog')).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByTestId('fraud-review-status'), 'REJECTED');
    await user.type(screen.getByTestId('fraud-review-note'), 'Legitimna transakcija');
    await user.click(screen.getByTestId('fraud-review-submit'));

    await waitFor(() => {
      expect(mockedReview).toHaveBeenCalledWith(1, 'REJECTED', 'Legitimna transakcija');
    });
  });

  it('expand features prikazuje JSON detalje', async () => {
    const user = userEvent.setup();
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('fraud-row-1')).toBeInTheDocument();
    });
    const expandBtn = screen.getByTestId('fraud-features-toggle-1');
    await user.click(expandBtn);

    await waitFor(() => {
      expect(screen.getByTestId('fraud-features-detail-1')).toBeInTheDocument();
    });
    expect(screen.getByTestId('fraud-features-detail-1').textContent).toMatch(/amount/);
  });

  it('promena min_risk slider trigger-uje novi fetch', async () => {
    renderPage();
    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    mockedGet.mockClear();

    const slider = screen.getByTestId('fraud-min-risk-slider') as HTMLInputElement;
    // Range input promena: fireEvent.change postavlja value pa emit-uje change
    fireEvent.change(slider, { target: { value: '0.95' } });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
    });
    const lastCall = mockedGet.mock.calls[mockedGet.mock.calls.length - 1];
    expect(lastCall?.[1]).toBe(0.95);
  });

  it('prikazuje empty state kada nema alert-ova', async () => {
    mockedGet.mockResolvedValueOnce([]);
    renderPage();
    expect(await screen.findByTestId('fraud-empty')).toBeInTheDocument();
    expect(screen.getByText(/nema alerts iznad praga/i)).toBeInTheDocument();
  });

  it('toast.error se prikazuje kada getFraudAlerts reject-uje', async () => {
    mockedGet.mockRejectedValueOnce({
      response: { data: { message: 'Forbidden — supervisor only' } },
    });
    renderPage();

    await waitFor(() => {
      expect(mockedToast.error).toHaveBeenCalled();
    });
  });
});
