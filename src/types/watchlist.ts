// ============================================================
// FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic
//
// Tipovi za Watchlist feature: liste pracenja i njihove stavke sa trzisnim podacima.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import type { ListingType } from './celina3';

export type WatchlistOwnerType = 'CLIENT' | 'EMPLOYEE';

/** Jedna lista pracenja (Watchlist) korisnika. */
export interface WatchlistDto {
  id: number;
  ownerId: number;
  ownerType: WatchlistOwnerType;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  itemCount?: number;
}

/** Stavka u listi pracenja (hartija + trzisni podaci). */
export interface WatchlistItemDto {
  id: number;
  watchlistId: number;
  listingId: number;
  listingTicker: string;
  listingType: ListingType | string;
  listingName?: string;
  exchange?: string;
  currentPrice?: number | null;
  dailyChange?: number | null;
  dailyChangePercent?: number | null;
  volume?: number | null;
  currency?: string;
  addedAt: string;
}

/** Payload za POST /watchlists. */
export interface CreateWatchlistRequest {
  name: string;
}

/** Payload za PATCH /watchlists/{id}. */
export interface RenameWatchlistRequest {
  name: string;
}

/** Payload za POST /watchlists/{id}/items. */
export interface AddWatchlistItemRequest {
  listingId: number;
}

/** Union za filter dropdown na WatchlistPage tabeli. */
export type WatchlistFilterType = 'ALL' | 'STOCK' | 'FUTURES' | 'FOREX' | 'OPTION';

/** Srpske labele za filter dropdown. */
export const WATCHLIST_FILTER_LABELS: Record<WatchlistFilterType, string> = {
  ALL: 'Sve',
  STOCK: 'Akcije',
  FUTURES: 'Fjucersi',
  FOREX: 'Valute',
  OPTION: 'Opcije',
};
