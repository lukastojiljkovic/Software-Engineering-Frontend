// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Vitest unit testovi za watchlistService — po jedan test po javnoj metodi servisa.
//
// IMPLEMENTIRATI:
//
//   Setup:
//   - vi.mock('../api') => mockApi = vi.mocked(api)
//   - beforeEach: vi.clearAllMocks()
//
//   Planirani testovi (obrazac: mockApi.get/post/patch/delete.mockResolvedValue({ data: ... })):
//
//   1. 'listAll salje GET /watchlists i vraca niz lista'
//      mockApi.get.mockResolvedValue({ data: [{ id: 1, name: 'Favoriti' }] })
//      const result = await watchlistService.listAll()
//      expect(mockApi.get).toHaveBeenCalledWith('/watchlists')
//      expect(result).toHaveLength(1)
//
//   2. 'getById salje GET /watchlists/:id'
//      mockApi.get.mockResolvedValue({ data: { id: 5 } })
//      await watchlistService.getById(5)
//      expect(mockApi.get).toHaveBeenCalledWith('/watchlists/5')
//
//   3. 'create salje POST /watchlists sa name i description'
//      const dto = { name: 'Nova', description: 'Opis' }
//      mockApi.post.mockResolvedValue({ data: { id: 3, ...dto } })
//      await watchlistService.create(dto)
//      expect(mockApi.post).toHaveBeenCalledWith('/watchlists', dto)
//
//   4. 'rename salje PATCH /watchlists/:id sa novim imenom'
//      mockApi.patch.mockResolvedValue({ data: { id: 1, name: 'Novo ime' } })
//      await watchlistService.rename(1, { name: 'Novo ime' })
//      expect(mockApi.patch).toHaveBeenCalledWith('/watchlists/1', { name: 'Novo ime' })
//
//   5. 'remove salje DELETE /watchlists/:id'
//      mockApi.delete.mockResolvedValue({ data: undefined })
//      await watchlistService.remove(2)
//      expect(mockApi.delete).toHaveBeenCalledWith('/watchlists/2')
//
//   6. 'listItems salje GET /watchlists/:id/items'
//      mockApi.get.mockResolvedValue({ data: [] })
//      await watchlistService.listItems(7)
//      expect(mockApi.get).toHaveBeenCalledWith('/watchlists/7/items')
//
//   7. 'addItem salje POST /watchlists/:id/items sa listingId'
//      const dto = { listingId: 42 }
//      mockApi.post.mockResolvedValue({ data: { id: 100, ...dto } })
//      await watchlistService.addItem(7, dto)
//      expect(mockApi.post).toHaveBeenCalledWith('/watchlists/7/items', dto)
//
//   8. 'removeItem salje DELETE /watchlists/:id/items/:itemId'
//      mockApi.delete.mockResolvedValue({ data: undefined })
//      await watchlistService.removeItem(7, 100)
//      expect(mockApi.delete).toHaveBeenCalledWith('/watchlists/7/items/100')
//
//   9. 'moveItem salje POST /watchlists/:id/items/:itemId/move sa targetWatchlistId'
//      mockApi.post.mockResolvedValue({ data: { id: 100, watchlistId: 9 } })
//      await watchlistService.moveItem(7, 100, 9)
//      expect(mockApi.post).toHaveBeenCalledWith('/watchlists/7/items/100/move', { targetWatchlistId: 9 })
//
//   10. 'fetchMarketSnapshot salje POST /watchlists/market-snapshot sa nizom listingIds'
//       mockApi.post.mockResolvedValue({ data: [{ listingId: 1, currentPrice: 150 }] })
//       await watchlistService.fetchMarketSnapshot([1, 2, 3])
//       expect(mockApi.post).toHaveBeenCalledWith('/watchlists/market-snapshot', { listingIds: [1, 2, 3] })
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { describe, it } from 'vitest';

describe('watchlistService', () => {
  it.todo('listAll salje GET /watchlists i vraca niz lista');
  it.todo('getById salje GET /watchlists/:id');
  it.todo('create salje POST /watchlists sa name i description');
  it.todo('rename salje PATCH /watchlists/:id sa novim imenom');
  it.todo('remove salje DELETE /watchlists/:id');
  it.todo('listItems salje GET /watchlists/:id/items');
  it.todo('addItem salje POST /watchlists/:id/items sa listingId');
  it.todo('removeItem salje DELETE /watchlists/:id/items/:itemId');
  it.todo('moveItem salje POST /watchlists/:id/items/:itemId/move sa targetWatchlistId');
  it.todo('fetchMarketSnapshot salje POST /watchlists/market-snapshot sa nizom listingIds');
});
