// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Kompaktna komponenta za header aplikacije: prikazuje pracene hartije sa
// trenutnom cenom, dnevnom promenom i volumenom u horizontalnom scrollu ili
// dropdown-u.
//
// IMPLEMENTIRATI:
//   Props interfejs WatchlistQuickAccessProps:
//     maxItems?: number     — maksimalan broj prikazanih stavki, default 8
//                             (prekoracenje: "+ N vise" link ka /watchlists)
//
//   Logika:
//   1. Pri mount-u dohvata sve liste (watchlistService.listAll); uzima stavke
//      prve liste ili "default" liste (ako BE podrzava oznacavanje default-a).
//      Ako nema lista, prikazuje prazan fragment (nema fallback UI u headeru).
//   2. Auto-refresh trzisnih podataka svakih 30s putem
//      watchlistService.fetchMarketSnapshot(listingIds) — ne re-fetcha celu listu,
//      samo cene. Cisti interval u cleanup-u useEffect-a.
//   3. Svaka stavka: ticker + cena + priceChangePct sa bojom
//      (emerald za pozitivno, red za negativno, muted za 0/null).
//      Format cene: Intl.NumberFormat('sr-RS') sa valutom hartije.
//   4. Klik na stavku: navigate('/securities') + filter na taj ticker
//      (ili navigate('/securities/:listingId') ako BE ima detalj rutu).
//   5. Skeleton loading (animate-pulse traka) dok traje inicijalni fetch.
//   6. Tooltip (Radix Tooltip) po stavci: ime hartije + berza + volumen.
//   7. data-testid: 'watchlist-quick-access', 'quick-access-item-{ticker}',
//      'quick-access-price-{ticker}'.
//
//   Napomena: Koordinisati sa osobom koja integruje u Header komponentu
//   (ClientSidebar.tsx / layout) — ova komponenta ne menja sidebar niti App.tsx sama.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

export default function WatchlistQuickAccess({ maxItems = 8 }: { maxItems?: number }) {
  void maxItems;

  return (
    <div data-testid="watchlist-quick-access" className="hidden lg:flex items-center gap-1">
      {/* Implementacija u toku — videti TODO blok iznad */}
    </div>
  );
}
