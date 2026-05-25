import { describe, it, expect } from 'vitest';
import { WATCHLIST_FILTER_LABELS } from './watchlist';
import type {
  WatchlistDto,
  WatchlistItemDto,
  CreateWatchlistRequest,
  RenameWatchlistRequest,
  AddWatchlistItemRequest,
  WatchlistFilterType,
  WatchlistOwnerType,
} from './watchlist';

describe('watchlist types', () => {
  it('WATCHLIST_FILTER_LABELS contains 5 filter options', () => {
    expect(Object.keys(WATCHLIST_FILTER_LABELS).length).toBe(5);
    expect(WATCHLIST_FILTER_LABELS.ALL).toBe('Sve');
    expect(WATCHLIST_FILTER_LABELS.STOCK).toBe('Akcije');
    expect(WATCHLIST_FILTER_LABELS.FUTURES).toBe('Fjucersi');
    expect(WATCHLIST_FILTER_LABELS.FOREX).toBe('Valute');
    expect(WATCHLIST_FILTER_LABELS.OPTION).toBe('Opcije');
  });

  it('WatchlistDto shape is correct', () => {
    const w: WatchlistDto = {
      id: 1,
      ownerId: 10,
      ownerType: 'CLIENT',
      name: 'Test',
      createdAt: '2026-05-25T00:00:00Z',
    };
    expect(w.id).toBe(1);
    expect(w.ownerType satisfies WatchlistOwnerType).toBe('CLIENT');
  });

  it('WatchlistItemDto allows optional market fields', () => {
    const item: WatchlistItemDto = {
      id: 1,
      watchlistId: 1,
      listingId: 100,
      listingTicker: 'AAPL',
      listingType: 'STOCK',
      addedAt: '2026-05-25T00:00:00Z',
    };
    expect(item.currentPrice).toBeUndefined();
  });

  it('Request shapes accept correct fields', () => {
    const c: CreateWatchlistRequest = { name: 'X' };
    const r: RenameWatchlistRequest = { name: 'Y' };
    const a: AddWatchlistItemRequest = { listingId: 1 };
    expect(c.name).toBe('X');
    expect(r.name).toBe('Y');
    expect(a.listingId).toBe(1);
  });

  it('WatchlistFilterType is union of 5 values', () => {
    const filters: WatchlistFilterType[] = ['ALL', 'STOCK', 'FUTURES', 'FOREX', 'OPTION'];
    expect(filters.length).toBe(5);
  });
});
