import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/predictionService', () => ({
  getLatestPrediction: vi.fn(),
}));

import { PredictionWidget } from './PredictionWidget';
import {
  getLatestPrediction,
  type PricePredictionDTO,
} from '@/services/predictionService';

const mockedGet = vi.mocked(getLatestPrediction);

const sample: PricePredictionDTO = {
  symbol: 'AAPL',
  predictionDate: '2026-05-27',
  predictedClose: 195.5,
  lowerBound: 190.0,
  upperBound: 201.0,
  modelVersion: 'lstm-2.1.0',
  computedAt: '2026-05-26T03:00:00Z',
};

describe('PredictionWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prikazuje loading skeleton dok service ne odgovori', () => {
    mockedGet.mockImplementation(() => new Promise(() => {}));
    render(<PredictionWidget symbol="AAPL" />);
    expect(screen.getByTestId('prediction-widget-loading')).toBeInTheDocument();
  });

  it('renderuje predicted close kada service vrati podatke', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget')).toBeInTheDocument();
    });
    expect(screen.getByTestId('prediction-widget-value').textContent).toMatch(/195[.,]50/);
  });

  it('prikazuje confidence interval u formattiranom obliku', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget-interval')).toBeInTheDocument();
    });
    const intervalText = screen.getByTestId('prediction-widget-interval').textContent ?? '';
    expect(intervalText).toMatch(/190[.,]00/);
    expect(intervalText).toMatch(/201[.,]00/);
  });

  it('prikazuje up trend (+) kada je predicted > currentPrice', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" currentPrice={180.0} />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget-trend')).toBeInTheDocument();
    });
    // (195.5 - 180) / 180 * 100 = +8.61%
    const trendText = screen.getByTestId('prediction-widget-trend').textContent ?? '';
    expect(trendText).toMatch(/\+/);
    expect(trendText).toMatch(/8\.61|8\.6/);
  });

  it('prikazuje down trend (negativan %) kada je predicted < currentPrice', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" currentPrice={220.0} />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget-trend')).toBeInTheDocument();
    });
    // (195.5 - 220) / 220 * 100 = -11.14%
    const trendText = screen.getByTestId('prediction-widget-trend').textContent ?? '';
    expect(trendText).toMatch(/-/);
  });

  it('sakriva trend indicator kada nema currentPrice', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('prediction-widget-trend')).not.toBeInTheDocument();
  });

  it('sakriva widget kada service vrati null (404)', async () => {
    mockedGet.mockResolvedValue(null);
    const { container } = render(<PredictionWidget symbol="UNKNOWN" />);

    await waitFor(() => {
      expect(screen.queryByTestId('prediction-widget-loading')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('prediction-widget')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('sakriva widget kada service throw-uje gresku', async () => {
    mockedGet.mockRejectedValue(new Error('network error'));
    render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(screen.queryByTestId('prediction-widget-loading')).not.toBeInTheDocument();
    });
    expect(screen.queryByTestId('prediction-widget')).not.toBeInTheDocument();
  });

  it('prikazuje datum predikcije i model verziju', async () => {
    mockedGet.mockResolvedValue(sample);
    render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(screen.getByTestId('prediction-widget')).toBeInTheDocument();
    });
    expect(screen.getByText(/lstm-2\.1\.0/)).toBeInTheDocument();
    expect(screen.getByText(/2026-05-27/)).toBeInTheDocument();
  });

  it('refetch kada se simbol promeni', async () => {
    mockedGet.mockResolvedValue(sample);
    const { rerender } = render(<PredictionWidget symbol="AAPL" />);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('AAPL');
    });

    rerender(<PredictionWidget symbol="MSFT" />);

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('MSFT');
    });
  });
});
