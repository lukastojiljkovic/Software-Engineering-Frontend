// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Servis za CRUD operacije nad listama pracenja i njihovim stavkama.
// Koristiti `api` klijent iz './api' (axios instanca sa JWT interceptorima).
// Importovati sve tipove iz '../types/watchlist'.
//
// IMPLEMENTIRATI (export const watchlistService = { ... }):
//
//   listAll(): Promise<WatchlistDto[]>
//     GET /watchlists
//     Vraca sve liste pracenja trenutno ulogovanog korisnika.
//
//   getById(id: number): Promise<WatchlistDto>
//     GET /watchlists/:id
//     Vraca jednu listu pracenja sa meta-podacima (bez stavki).
//
//   create(dto: CreateWatchlistRequest): Promise<WatchlistDto>
//     POST /watchlists
//     Kreira novu listu sa datim imenom i opcionym opisom.
//
//   rename(id: number, dto: RenameWatchlistRequest): Promise<WatchlistDto>
//     PATCH /watchlists/:id
//     Menja naziv liste.
//
//   remove(id: number): Promise<void>
//     DELETE /watchlists/:id
//     Brise celu listu i sve njene stavke.
//
//   listItems(watchlistId: number): Promise<WatchlistItemDto[]>
//     GET /watchlists/:id/items
//     Vraca sve stavke sa trzisnim podacima (currentPrice, priceChange, volume).
//
//   addItem(watchlistId: number, dto: AddToWatchlistRequest): Promise<WatchlistItemDto>
//     POST /watchlists/:id/items
//     Dodaje hartiju u listu; BE vraca novu stavku sa trzisnim podacima.
//     Baciti grescu ako je hartija vec u listi (BE vraca 409 Conflict).
//
//   removeItem(watchlistId: number, itemId: number): Promise<void>
//     DELETE /watchlists/:id/items/:itemId
//     Uklanja jednu stavku iz liste (ne brise listu).
//
//   moveItem(sourceWatchlistId: number, itemId: number, targetWatchlistId: number): Promise<WatchlistItemDto>
//     POST /watchlists/:id/items/:itemId/move
//     Body: { targetWatchlistId: number }
//     Premesta stavku iz jedne liste u drugu; BE vraca premestenu stavku.
//
//   fetchMarketSnapshot(listingIds: number[]): Promise<WatchlistItemDto[]>
//     POST /watchlists/market-snapshot
//     Body: { listingIds: number[] }
//     Dohvata svezu trzisnu sliku za skup hartija (za WatchlistQuickAccess auto-refresh).
//     Vraca listu WatchlistItemDto bez watchlistId (moze biti null/0).
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

export {};
