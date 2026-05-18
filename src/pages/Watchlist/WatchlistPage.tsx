// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Stranica za upravljanje listama pracenja hartija od vrednosti.
//
// IMPLEMENTIRATI:
//   - Ucitati sve liste korisnika (watchlistService.listAll) pri mount-u;
//     prikazati skeleton loading dok traje fetch.
//   - Leva kolona: lista WatchlistDto kartica sa imenom, brojem stavki i
//     "Preimenuj" / "Obrisi" akcijama (Radix Dialog za potvrdu brisanja).
//   - "Nova lista" dugme (Plus ikona) otvara inline Radix Dialog sa name inputom;
//     po submit-u poziva watchlistService.create i osvezava listu.
//   - Preimenuj: watchlistService.rename, isto Dialog pattern.
//   - Brisanje: watchlistService.remove, Radix AlertDialog za destruktivne akcije.
//   - Desna kolona (ili donji panel): stavke izabrane liste (watchlistService.listItems).
//     Tabela: Ticker / Ime / Berza / Tip / Cena / Promena% / Volumen / Akcije.
//     Promena%: zelena boja za pozitivno (text-emerald-600), crvena za negativno (text-red-600).
//   - Filter chip WatchlistFilterType (ALL/STOCK/FUTURE/OPTION/FOREX) iznad tabele.
//   - "Ukloni" dugme po redu (Trash2 ikona, watchlistService.removeItem).
//   - Empty state kad lista nema stavki: placeholder sa opisom i uputstvom za
//     dodavanje hartije putem AddToWatchlistButton na SecuritiesListPage/SecuritiesDetailsPage.
//   - Toast za sve uspesne/neuspesne operacije (import { toast } from '@/lib/notify').
//   - data-testid: 'watchlist-page', 'create-watchlist-btn', 'watchlist-card-{id}',
//     'rename-watchlist-{id}', 'delete-watchlist-{id}', 'watchlist-item-row-{id}',
//     'remove-item-{id}'.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { Bookmark } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function WatchlistPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl" data-testid="watchlist-page">
      <div className="mb-6">
        <PageHeader
          icon={<Bookmark className="h-5 w-5" />}
          title="Watchliste"
          description="Upravljajte listama pracenja hartija od vrednosti"
        />
      </div>
      <p className="text-muted-foreground">Implementacija u toku — videti TODO blok iznad.</p>
    </div>
  );
}
