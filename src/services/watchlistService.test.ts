import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { watchlistService } from './watchlistService';
import type { WatchlistDto, WatchlistItemDto } from '../types/watchlist';

vi.mock('./api');
const mockedApi = vi.mocked(api);

describe('watchlistService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listMyWatchlists', () => {
    it('GET /watchlists/my and returns list', async () => {
      const lists: WatchlistDto[] = [
        {
          id: 1,
          ownerId: 10,
          ownerType: 'CLIENT',
          name: 'Favoriti',
          createdAt: '2026-05-25T10:00:00Z',
        },
      ];
      mockedApi.get.mockResolvedValue({ data: lists });

      const result = await watchlistService.listMyWatchlists();

      expect(mockedApi.get).toHaveBeenCalledWith('/watchlists/my');
      expect(result).toEqual(lists);
    });

    it('propagates errors', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));
      await expect(watchlistService.listMyWatchlists()).rejects.toThrow('Network error');
    });
  });

  describe('createWatchlist', () => {
    it('POST /watchlists with name payload', async () => {
      const created: WatchlistDto = {
        id: 2,
        ownerId: 10,
        ownerType: 'CLIENT',
        name: 'Tech',
        createdAt: '2026-05-25T10:00:00Z',
      };
      mockedApi.post.mockResolvedValue({ data: created });

      const result = await watchlistService.createWatchlist({ name: 'Tech' });

      expect(mockedApi.post).toHaveBeenCalledWith('/watchlists', { name: 'Tech' });
      expect(result).toEqual(created);
    });
  });

  describe('renameWatchlist', () => {
    it('PATCH /watchlists/{id} with new name', async () => {
      const renamed: WatchlistDto = {
        id: 1,
        ownerId: 10,
        ownerType: 'CLIENT',
        name: 'New name',
        createdAt: '2026-05-25T10:00:00Z',
      };
      mockedApi.patch.mockResolvedValue({ data: renamed });

      const result = await watchlistService.renameWatchlist(1, { name: 'New name' });

      expect(mockedApi.patch).toHaveBeenCalledWith('/watchlists/1', { name: 'New name' });
      expect(result).toEqual(renamed);
    });
  });

  describe('deleteWatchlist', () => {
    it('DELETE /watchlists/{id}', async () => {
      mockedApi.delete.mockResolvedValue({ data: undefined });

      await watchlistService.deleteWatchlist(5);

      expect(mockedApi.delete).toHaveBeenCalledWith('/watchlists/5');
    });
  });

  describe('listItems', () => {
    it('GET /watchlists/{id}/items', async () => {
      const items: WatchlistItemDto[] = [
        {
          id: 10,
          watchlistId: 1,
          listingId: 100,
          listingTicker: 'AAPL',
          listingType: 'STOCK',
          currentPrice: 180,
          addedAt: '2026-05-25T10:00:00Z',
        },
      ];
      mockedApi.get.mockResolvedValue({ data: items });

      const result = await watchlistService.listItems(1);

      expect(mockedApi.get).toHaveBeenCalledWith('/watchlists/1/items');
      expect(result).toEqual(items);
    });
  });

  describe('addItem', () => {
    it('POST /watchlists/{id}/items with listingId', async () => {
      const item: WatchlistItemDto = {
        id: 11,
        watchlistId: 1,
        listingId: 101,
        listingTicker: 'MSFT',
        listingType: 'STOCK',
        addedAt: '2026-05-25T10:00:00Z',
      };
      mockedApi.post.mockResolvedValue({ data: item });

      const result = await watchlistService.addItem(1, { listingId: 101 });

      expect(mockedApi.post).toHaveBeenCalledWith('/watchlists/1/items', { listingId: 101 });
      expect(result).toEqual(item);
    });

    it('propagates 409 conflict', async () => {
      mockedApi.post.mockRejectedValue(new Error('Conflict'));
      await expect(watchlistService.addItem(1, { listingId: 1 })).rejects.toThrow('Conflict');
    });
  });

  describe('removeItem', () => {
    it('DELETE /watchlists/{id}/items/{itemId}', async () => {
      mockedApi.delete.mockResolvedValue({ data: undefined });

      await watchlistService.removeItem(1, 10);

      expect(mockedApi.delete).toHaveBeenCalledWith('/watchlists/1/items/10');
    });
  });
});
