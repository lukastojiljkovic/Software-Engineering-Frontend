// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Vitest unit testovi za WatchlistPage komponentu.
//
// IMPLEMENTIRATI (svaki it.todo postaje pravi test):
//
//   Setup:
//   - vi.mock('../../../services/watchlistService', ...) — mockuj listAll, listItems,
//     create, rename, remove, addItem, removeItem.
//   - vi.mock('@/lib/notify', ...) — mockuj toast.success, toast.error.
//   - renderPage() helper: render(<MemoryRouter><WatchlistPage /></MemoryRouter>).
//   - Svaki beforeEach: vi.clearAllMocks(); mockListAll.mockResolvedValue([]).
//
//   Planirani testovi:
//
//   1. 'prikazuje loading skeleton dok traju fetchovi'
//      mockListAll.mockImplementation(() => new Promise(() => {}))  — nikad ne resolve
//      renderPage(); expect(screen.getByRole('status') ili animate-pulse element).toBeTruthy()
//
//   2. 'prikazuje empty state kada korisnik nema lista'
//      mockListAll.mockResolvedValue([])
//      waitFor => expect(screen.getByText(/nemate lista/i)).toBeTruthy()
//
//   3. 'prikazuje karticuse za svaku watchlistu'
//      mockListAll.mockResolvedValue([{ id: 1, name: 'Favoriti', itemCount: 3, ... }])
//      waitFor => expect(screen.getByTestId('watchlist-card-1')).toBeTruthy()
//
//   4. 'klik na "Nova lista" dugme otvara dialog'
//      mockListAll.mockResolvedValue([])
//      userEvent.click(screen.getByTestId('create-watchlist-btn'))
//      expect(screen.getByRole('dialog')).toBeTruthy()
//
//   5. 'kreira novu listu i osvezava prikaz'
//      mockListAll.mockResolvedValueOnce([]).mockResolvedValue([{ id: 2, name: 'Nova', ... }])
//      mockCreate.mockResolvedValue({ id: 2, name: 'Nova', ... })
//      otvoriti dialog, uneti ime, submit
//      waitFor => expect(mockCreate).toHaveBeenCalledWith({ name: 'Nova' })
//      waitFor => expect(screen.getByTestId('watchlist-card-2')).toBeTruthy()
//
//   6. 'klik na "Preimenuj" otvara dialog sa trenutnim imenom'
//      mockListAll.mockResolvedValue([{ id: 1, name: 'Staro ime', itemCount: 0, ... }])
//      waitFor => userEvent.click(screen.getByTestId('rename-watchlist-1'))
//      expect input value toBe('Staro ime')
//
//   7. 'brisanje liste poziva remove i uklanja karticu'
//      mockListAll.mockResolvedValueOnce([{ id: 1, name: 'Brisi', ... }]).mockResolvedValue([])
//      mockRemove.mockResolvedValue(undefined)
//      click delete-watchlist-1 => confirm dialog => click confirm
//      waitFor => expect(mockRemove).toHaveBeenCalledWith(1)
//      waitFor => expect(screen.queryByTestId('watchlist-card-1')).toBeNull()
//
//   8. 'prikazuje stavke izabrane liste'
//      mockListAll.mockResolvedValue([{ id: 1, name: 'Lista', ... }])
//      mockListItems.mockResolvedValue([{ id: 10, ticker: 'AAPL', currentPrice: 180, ... }])
//      kliknuti na listu da je selektuje
//      waitFor => expect(screen.getByTestId('watchlist-item-row-10')).toBeTruthy()
//
//   9. 'uklanjanje stavke poziva removeItem i osvezava tabelu'
//      setup kao iznad, pa click 'remove-item-10'
//      waitFor => expect(mockRemoveItem).toHaveBeenCalledWith(1, 10)
//
//   10. 'filter po tipu hartije prikazuje samo odgovarajuce stavke'
//       mockListItems vraca STOCK + FUTURE stavku
//       click na STOCK filter chip
//       expect(screen.queryByText('FUTURE_TICKER')).toBeNull()
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { describe, it } from 'vitest';

describe('WatchlistPage', () => {
  it.todo('prikazuje loading skeleton dok traju fetchovi');
  it.todo('prikazuje empty state kada korisnik nema lista');
  it.todo('prikazuje kartice za svaku watchlistu');
  it.todo('klik na "Nova lista" dugme otvara dialog');
  it.todo('kreira novu listu i osvezava prikaz');
  it.todo('klik na "Preimenuj" otvara dialog sa trenutnim imenom');
  it.todo('brisanje liste poziva remove i uklanja karticu');
  it.todo('prikazuje stavke izabrane liste');
  it.todo('uklanjanje stavke poziva removeItem i osvezava tabelu');
  it.todo('filter po tipu hartije prikazuje samo odgovarajuce stavke');
});
