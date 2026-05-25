// ============================================================
// FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic
// Vitest unit testovi za WatchlistPage.
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import WatchlistPage from './WatchlistPage';
import { watchlistService } from '../../services/watchlistService';
import type { WatchlistDto, WatchlistItemDto } from '../../types/watchlist';

vi.mock('../../services/watchlistService', () => ({
  watchlistService: {
    listMyWatchlists: vi.fn(),
    createWatchlist: vi.fn(),
    renameWatchlist: vi.fn(),
    deleteWatchlist: vi.fn(),
    listItems: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

const mockListAll = vi.mocked(watchlistService.listMyWatchlists);
const mockListItems = vi.mocked(watchlistService.listItems);
const mockCreate = vi.mocked(watchlistService.createWatchlist);
const mockRename = vi.mocked(watchlistService.renameWatchlist);
const mockDelete = vi.mocked(watchlistService.deleteWatchlist);
const mockRemoveItem = vi.mocked(watchlistService.removeItem);

const sampleList: WatchlistDto = {
  id: 1,
  ownerId: 10,
  ownerType: 'CLIENT',
  name: 'Favoriti',
  createdAt: '2026-05-25T10:00:00Z',
  itemCount: 1,
};

const sampleItemStock: WatchlistItemDto = {
  id: 10,
  watchlistId: 1,
  listingId: 100,
  listingTicker: 'AAPL',
  listingType: 'STOCK',
  currentPrice: 180,
  dailyChangePercent: 1.25,
  volume: 1_000_000,
  addedAt: '2026-05-25T10:00:00Z',
};

const sampleItemFutures: WatchlistItemDto = {
  id: 11,
  watchlistId: 1,
  listingId: 101,
  listingTicker: 'CL_F',
  listingType: 'FUTURES',
  currentPrice: 75,
  addedAt: '2026-05-25T10:00:00Z',
};

function renderPage() {
  return render(
    <MemoryRouter>
      <WatchlistPage />
    </MemoryRouter>
  );
}

describe('WatchlistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListItems.mockResolvedValue([]);
  });

  it('prikazuje empty state kada korisnik nema lista', async () => {
    mockListAll.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/Nemate watchlist-a/i)).toBeTruthy();
    });
  });

  it('prikazuje kartice za svaku watchlistu', async () => {
    mockListAll.mockResolvedValue([sampleList]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-card-1')).toBeTruthy();
      expect(screen.getAllByText('Favoriti').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('klik na "Nova lista" otvara dialog', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('create-watchlist-btn')).toBeTruthy();
    });
    await user.click(screen.getByTestId('create-watchlist-btn'));
    expect(screen.getByTestId('create-watchlist-dialog')).toBeTruthy();
  });

  it('kreira novu listu', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValueOnce([]);
    mockCreate.mockResolvedValue({ ...sampleList, id: 2, name: 'Nova' });
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('create-watchlist-btn')).toBeTruthy();
    });
    await user.click(screen.getByTestId('create-watchlist-btn'));
    await user.type(screen.getByTestId('create-watchlist-input'), 'Nova');
    await user.click(screen.getByTestId('create-watchlist-submit'));
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Nova' });
    });
  });

  it('preimenuj otvara dialog sa trenutnim imenom', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([sampleList]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('rename-watchlist-1')).toBeTruthy();
    });
    await user.click(screen.getByTestId('rename-watchlist-1'));
    const input = screen.getByTestId('rename-watchlist-input') as HTMLInputElement;
    expect(input.value).toBe('Favoriti');
  });

  it('brisanje liste poziva delete i uklanja karticu', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([sampleList]);
    mockDelete.mockResolvedValue(undefined);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('delete-watchlist-1')).toBeTruthy();
    });
    await user.click(screen.getByTestId('delete-watchlist-1'));
    await waitFor(() => {
      expect(screen.getByTestId('confirm-delete-watchlist')).toBeTruthy();
    });
    await user.click(screen.getByTestId('confirm-delete-watchlist'));
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });

  it('prikazuje stavke izabrane liste', async () => {
    mockListAll.mockResolvedValue([sampleList]);
    mockListItems.mockResolvedValue([sampleItemStock]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('watchlist-item-row-10')).toBeTruthy();
      expect(screen.getByText('AAPL')).toBeTruthy();
    });
  });

  it('uklanjanje stavke poziva removeItem', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([sampleList]);
    mockListItems.mockResolvedValue([sampleItemStock]);
    mockRemoveItem.mockResolvedValue(undefined);
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('remove-item-10')).toBeTruthy();
    });
    await user.click(screen.getByTestId('remove-item-10'));
    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith(1, 10);
    });
  });

  it('filter po tipu hartije prikazuje samo odgovarajuce stavke', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([sampleList]);
    mockListItems.mockResolvedValue([sampleItemStock, sampleItemFutures]);
    renderPage();
    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeTruthy();
      expect(screen.getByText('CL_F')).toBeTruthy();
    });
    await user.click(screen.getByTestId('watchlist-filter-stock'));
    await waitFor(() => {
      expect(screen.queryByText('CL_F')).toBeNull();
      expect(screen.getByText('AAPL')).toBeTruthy();
    });
  });

  it('rename salje patch sa novim imenom', async () => {
    const user = userEvent.setup();
    mockListAll.mockResolvedValue([sampleList]);
    mockRename.mockResolvedValue({ ...sampleList, name: 'Novo ime' });
    renderPage();
    await waitFor(() => {
      expect(screen.getByTestId('rename-watchlist-1')).toBeTruthy();
    });
    await user.click(screen.getByTestId('rename-watchlist-1'));
    const input = screen.getByTestId('rename-watchlist-input') as HTMLInputElement;
    await user.clear(input);
    await user.type(input, 'Novo ime');
    // Find the save button in rename dialog
    const dialog = screen.getByTestId('rename-watchlist-dialog');
    const saveBtn = Array.from(dialog.querySelectorAll('button')).find(
      (b) => b.textContent === 'Sacuvaj'
    );
    expect(saveBtn).toBeTruthy();
    await user.click(saveBtn!);
    await waitFor(() => {
      expect(mockRename).toHaveBeenCalledWith(1, { name: 'Novo ime' });
    });
  });
});
