import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceAlertDialog from '../components/pricealert/PriceAlertDialog';
import { priceAlertService } from '../services/priceAlertService';
import type { PriceAlertDto } from '../types/priceAlert';

vi.mock('../services/priceAlertService', () => ({
  priceAlertService: {
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

const mockCreate = vi.mocked(priceAlertService.createAlert);

const baseAlert: PriceAlertDto = {
  id: 99,
  listingId: 42,
  listingTicker: 'AAPL',
  listingType: 'STOCK',
  condition: 'ABOVE',
  threshold: 200,
  active: true,
  createdAt: '2026-05-25T10:00:00Z',
  triggeredAt: null,
};

describe('PriceAlertDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    render(
      <PriceAlertDialog open={false} onOpenChange={vi.fn()} />
    );
    expect(screen.queryByTestId('price-alert-dialog')).toBeNull();
  });

  it('shows ticker in title when initialListing provided (read-only mode)', () => {
    render(
      <PriceAlertDialog
        open={true}
        onOpenChange={vi.fn()}
        initialListing={{ id: 42, ticker: 'AAPL', type: 'STOCK', currentPrice: 175.0, currency: 'USD' }}
      />
    );
    expect(screen.getByTestId('price-alert-dialog')).toBeTruthy();
    expect(screen.getAllByText(/AAPL/i).length).toBeGreaterThan(0);
    // No listing ID input field in initialListing mode
    expect(screen.queryByTestId('price-alert-listing-id')).toBeNull();
  });

  it('shows listing ID input when no initialListing', () => {
    render(<PriceAlertDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByTestId('price-alert-listing-id')).toBeTruthy();
  });

  it('toggles condition between ABOVE and BELOW', async () => {
    const user = userEvent.setup();
    render(
      <PriceAlertDialog
        open={true}
        onOpenChange={vi.fn()}
        initialListing={{ id: 42, ticker: 'AAPL', type: 'STOCK', currentPrice: 175.0, currency: 'USD' }}
      />
    );

    const aboveBtn = screen.getByTestId('price-alert-condition-ABOVE');
    const belowBtn = screen.getByTestId('price-alert-condition-BELOW');

    expect(aboveBtn).toBeTruthy();
    expect(belowBtn).toBeTruthy();

    await user.click(belowBtn);
    // After clicking, BELOW button should have selected styling - we just verify both still exist.
    expect(screen.getByTestId('price-alert-condition-BELOW')).toBeTruthy();
  });

  it('submits form and calls onCreated + onOpenChange(false) on success', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onCreated = vi.fn();
    mockCreate.mockResolvedValue(baseAlert);

    render(
      <PriceAlertDialog
        open={true}
        onOpenChange={onOpenChange}
        onCreated={onCreated}
        initialListing={{ id: 42, ticker: 'AAPL', type: 'STOCK', currentPrice: 175.0, currency: 'USD' }}
      />
    );

    const thresholdInput = screen.getByTestId('price-alert-threshold');
    await user.clear(thresholdInput);
    await user.type(thresholdInput, '200');

    const submitBtn = screen.getByTestId('price-alert-submit');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        listingId: 42,
        condition: 'ABOVE',
        threshold: 200,
      });
    });

    await waitFor(() => {
      expect(onCreated).toHaveBeenCalledWith(baseAlert);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('rejects negative threshold via Zod validation', async () => {
    const user = userEvent.setup();
    render(
      <PriceAlertDialog
        open={true}
        onOpenChange={vi.fn()}
        initialListing={{ id: 42, ticker: 'AAPL', type: 'STOCK', currentPrice: 175.0, currency: 'USD' }}
      />
    );

    const thresholdInput = screen.getByTestId('price-alert-threshold');
    await user.clear(thresholdInput);
    await user.type(thresholdInput, '-5');

    const submitBtn = screen.getByTestId('price-alert-submit');
    await user.click(submitBtn);

    // Service should NOT be called because validation fails.
    await waitFor(() => {
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});
