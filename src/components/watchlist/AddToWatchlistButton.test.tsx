import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToWatchlistButton from './AddToWatchlistButton';
import { watchlistService } from '../../services/watchlistService';
import type { WatchlistDto } from '../../types/watchlist';

vi.mock('../../services/watchlistService', () => ({
  watchlistService: {
    listMyWatchlists: vi.fn(),
    createWatchlist: vi.fn(),
    addItem: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockList = vi.mocked(watchlistService.listMyWatchlists);
const mockCreate = vi.mocked(watchlistService.createWatchlist);
const mockAdd = vi.mocked(watchlistService.addItem);

const wl1: WatchlistDto = {
  id: 1,
  ownerId: 10,
  ownerType: 'CLIENT',
  name: 'Favoriti',
  createdAt: '2026-05-25T10:00:00Z',
  itemCount: 3,
};

const wl2: WatchlistDto = {
  id: 2,
  ownerId: 10,
  ownerType: 'CLIENT',
  name: 'Tech',
  createdAt: '2026-05-25T10:00:00Z',
  itemCount: 5,
};

describe('AddToWatchlistButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockList.mockResolvedValue([]);
  });

  it('renderuje dugme sa testId-em na osnovu listingId', () => {
    render(<AddToWatchlistButton listingId={42} listingTicker="AAPL" />);
    expect(screen.getByTestId('add-to-watchlist-42')).toBeTruthy();
  });

  it('icon variant prikazuje samo ikonu (bez teksta)', () => {
    render(<AddToWatchlistButton listingId={1} listingTicker="MSFT" variant="icon" />);
    const btn = screen.getByTestId('add-to-watchlist-1');
    expect(btn.textContent).toBe('');
  });

  it('full variant prikazuje tekst "Dodaj na watchlist"', () => {
    render(<AddToWatchlistButton listingId={1} listingTicker="MSFT" variant="full" />);
    expect(screen.getByText(/Dodaj na watchlist/i)).toBeTruthy();
  });

  it('klik otvara dropdown i ucitava watchlist-e', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([wl1, wl2]);
    render(<AddToWatchlistButton listingId={1} listingTicker="MSFT" />);
    await user.click(screen.getByTestId('add-to-watchlist-1'));
    await waitFor(() => {
      expect(mockList).toHaveBeenCalled();
      expect(screen.getByTestId('watchlist-option-1')).toBeTruthy();
      expect(screen.getByTestId('watchlist-option-2')).toBeTruthy();
    });
  });

  it('klik na watchlist option dodaje stavku', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([wl1]);
    mockAdd.mockResolvedValue({
      id: 99,
      watchlistId: 1,
      listingId: 1,
      listingTicker: 'MSFT',
      listingType: 'STOCK',
      addedAt: '2026-05-25T10:00:00Z',
    });
    render(<AddToWatchlistButton listingId={1} listingTicker="MSFT" />);
    await user.click(screen.getByTestId('add-to-watchlist-1'));
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-option-1')).toBeTruthy();
    });
    await user.click(screen.getByTestId('watchlist-option-1'));
    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledWith(1, { listingId: 1 });
    });
  });

  it('klik na "Nova lista" pokazuje inline formu', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([]);
    render(<AddToWatchlistButton listingId={1} listingTicker="MSFT" />);
    await user.click(screen.getByTestId('add-to-watchlist-1'));
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-create-new')).toBeTruthy();
    });
    await user.click(screen.getByTestId('watchlist-create-new'));
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-new-form')).toBeTruthy();
      expect(screen.getByTestId('watchlist-new-name-input')).toBeTruthy();
    });
  });

  it('inline forma kreira novu listu i dodaje stavku', async () => {
    const user = userEvent.setup();
    mockList.mockResolvedValue([]);
    const created: WatchlistDto = {
      id: 7,
      ownerId: 10,
      ownerType: 'CLIENT',
      name: 'Nova',
      createdAt: '2026-05-25T10:00:00Z',
    };
    mockCreate.mockResolvedValue(created);
    mockAdd.mockResolvedValue({
      id: 200,
      watchlistId: 7,
      listingId: 42,
      listingTicker: 'AAPL',
      listingType: 'STOCK',
      addedAt: '2026-05-25T10:00:00Z',
    });
    render(<AddToWatchlistButton listingId={42} listingTicker="AAPL" />);
    await user.click(screen.getByTestId('add-to-watchlist-42'));
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-create-new')).toBeTruthy();
    });
    await user.click(screen.getByTestId('watchlist-create-new'));
    await user.type(screen.getByTestId('watchlist-new-name-input'), 'Nova');
    await user.click(screen.getByTestId('watchlist-new-submit'));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Nova' });
      expect(mockAdd).toHaveBeenCalledWith(7, { listingId: 42 });
    });
  });
});
