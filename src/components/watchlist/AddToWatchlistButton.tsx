// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Dugme za dodavanje hartije u watchlistu; predvidjeno za SecuritiesListPage
// (po redu u tabeli) i SecuritiesDetailsPage (u header akcijama).
//
// IMPLEMENTIRATI:
//   Props interfejs AddToWatchlistButtonProps:
//     listingId: number       — ID hartije koja se dodaje
//     ticker: string          — za toast poruku (npr. "AAPL dodato u 'Moja lista'")
//     variant?: 'icon' | 'full'  — 'icon' = samo Bookmark ikona (za tabele),
//                                  'full' = ikona + "Dodaj u watchlistu" tekst (za detail page)
//                               default: 'icon'
//
//   Logika:
//   1. Pri mount-u fetchuje sve liste korisnika (watchlistService.listAll) i
//      cuva u lokalnom state-u; prikazuje loading spinner dok traje fetch.
//   2. Klik otvara Radix Popover sa listom watchlista:
//      - Po redu: checkbox (da li je hartija vec u toj listi) + naziv liste + badge sa brojem stavki.
//      - Checkbox checked = hartija je u listi; unchecked = nije.
//        Za checked state: pozovi watchlistService.listItems i proveri listingId pre prikazivanja.
//        Optimisticno: odmah postavi checkbox state, pa rollback na grescu.
//   3. Klik na checked red: poziva watchlistService.removeItem (trazi itemId —
//      dohvata se iz prethodno fetchovanih stavki ili iz posebnog GET /watchlists/:id/items).
//   4. Klik na unchecked red: poziva watchlistService.addItem({ listingId }).
//   5. "Nova lista" link na dnu Popover-a: navigira na /watchlists ili otvara inline mini-form.
//   6. Toast za greske (import { toast } from '@/lib/notify'); gresku 409 (vec u listi)
//      tretirati gracefully bez toast-a (samo vizualni feedback).
//   7. data-testid: 'add-to-watchlist-btn-{listingId}', 'watchlist-popover',
//      'watchlist-option-{watchlistId}'.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToWatchlistButtonProps {
  listingId: number;
  ticker: string;
  variant?: 'icon' | 'full';
}

export default function AddToWatchlistButton({ listingId, ticker, variant = 'icon' }: AddToWatchlistButtonProps) {
  void listingId;
  void ticker;

  return (
    <Button
      variant="ghost"
      size={variant === 'icon' ? 'icon' : 'sm'}
      data-testid={`add-to-watchlist-btn-${listingId}`}
      aria-label="Dodaj u watchlistu"
    >
      <Bookmark className="h-4 w-4" />
      {variant === 'full' && <span className="ml-2">Dodaj u watchlistu</span>}
    </Button>
  );
}
