// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Tipovi za Watchlist feature: liste pracenja i njihove stavke sa trzisnim podacima.
//
// IMPLEMENTIRATI:
//
//   WatchlistDto — lista pracenja:
//     id: number
//     name: string                  // korisnicki naziv liste
//     description?: string
//     createdAt: string             // ISO-8601
//     updatedAt: string
//     itemCount: number             // ukupan broj hartija u listi
//
//   WatchlistItemDto — jedna stavka u listi (hartija + trzisni podaci):
//     id: number
//     watchlistId: number
//     listingId: number
//     ticker: string
//     name: string                  // puno ime hartije
//     exchange: string              // akronim berze
//     listingType: string           // 'STOCK' | 'FUTURE' | 'OPTION' | 'FOREX'
//     currentPrice: number | null
//     priceChange: number | null    // apsolutna promena u odnosu na prethodni dan
//     priceChangePct: number | null // % promena
//     volume: number | null
//     currency: string
//     addedAt: string               // ISO-8601
//
//   CreateWatchlistRequest — payload za POST /watchlists:
//     name: string
//     description?: string
//
//   RenameWatchlistRequest — payload za PATCH /watchlists/:id:
//     name: string
//
//   AddToWatchlistRequest — payload za POST /watchlists/:id/items:
//     listingId: number
//
//   WatchlistFilterType — union za filter dropdowns:
//     'ALL' | 'STOCK' | 'FUTURE' | 'OPTION' | 'FOREX'
//
//   WATCHLIST_FILTER_LABELS — Record<WatchlistFilterType, string> mapa srpskih naziva
//     npr. { ALL: 'Sve', STOCK: 'Akcije', FUTURE: 'Fjucersi', OPTION: 'Opcije', FOREX: 'Valute' }
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

export {};
