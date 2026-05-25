// ============================================================
// FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic
//
// Servis za CRUD operacije nad listama pracenja i njihovim stavkama.
// Koristi `api` klijent (axios instanca sa JWT interceptorima).
//
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import api from './api';
import type {
  WatchlistDto,
  WatchlistItemDto,
  CreateWatchlistRequest,
  RenameWatchlistRequest,
  AddWatchlistItemRequest,
} from '../types/watchlist';

export const watchlistService = {
  listMyWatchlists: async (): Promise<WatchlistDto[]> => {
    const { data } = await api.get<WatchlistDto[]>('/watchlists/my');
    return data;
  },

  createWatchlist: async (request: CreateWatchlistRequest): Promise<WatchlistDto> => {
    const { data } = await api.post<WatchlistDto>('/watchlists', request);
    return data;
  },

  renameWatchlist: async (id: number, request: RenameWatchlistRequest): Promise<WatchlistDto> => {
    const { data } = await api.patch<WatchlistDto>(`/watchlists/${id}`, request);
    return data;
  },

  deleteWatchlist: async (id: number): Promise<void> => {
    await api.delete(`/watchlists/${id}`);
  },

  listItems: async (watchlistId: number): Promise<WatchlistItemDto[]> => {
    const { data } = await api.get<WatchlistItemDto[]>(`/watchlists/${watchlistId}/items`);
    return data;
  },

  addItem: async (
    watchlistId: number,
    request: AddWatchlistItemRequest
  ): Promise<WatchlistItemDto> => {
    const { data } = await api.post<WatchlistItemDto>(
      `/watchlists/${watchlistId}/items`,
      request
    );
    return data;
  },

  removeItem: async (watchlistId: number, itemId: number): Promise<void> => {
    await api.delete(`/watchlists/${watchlistId}/items/${itemId}`);
  },
};

export default watchlistService;
