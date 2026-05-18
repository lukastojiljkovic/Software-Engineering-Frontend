// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// Horizontalna traka zaglavlja aplikacije (topbar). Montira se u
// MainLayout.tsx iznad <main> bloka — integraciju u MainLayout
// obavlja koordinator, ne ovaj fajl.
//
// IMPLEMENTIRATI:
//   - Fiksiran topbar: `fixed top-0 right-0 z-40 h-14 bg-background/80
//     backdrop-blur-sm border-b` (ne ide ispod sidebar-a — koristiti
//     `md:left-64` da poravna sa main sadrzajem koji je `md:ml-64`)
//   - Leva strana (flex-1): breadcrumb ili naziv trenutne stranice
//     (opciono za prvu implementaciju — moze biti prazno/placeholder)
//   - Desna strana (flex gap-1 items-center):
//       1. <NotificationBell /> (iz '../shared/NotificationBell')
//       2. Placeholder slot za <WatchlistQuickAccess /> koji ce dodati FE2
//          (KOMENTAR u kodu: "// TODO FE2: ovde ide WatchlistQuickAccess")
//       3. ThemeToggle (iz '../shared/ThemeToggle') za brzo menjanje teme
//   - data-testid="app-header" na root elementu
//   - Kad je MainLayout apdejtovan da montira Header, main mora dobiti
//     `pt-14` padding-top kako bi sadrzaj bio ispod header-a —
//     to radi KOORDINATOR, ne ovaj fajl.
//   - Komponenta NE treba vlastito stanje niti efekte — sve delegira
//     komponentama koje hostuje (NotificationBell vec ima sopstveni polling).
//
// Napomena za koordinatora: posle montiranja Header-a u MainLayout,
//   azurirati MainLayout da doda `pt-14` na <main> element.
//
// Konvencija: koristiti shadcn/ui komponente iz '@/components/ui/',
//   cn() iz '@/lib/utils' za uslovne klase. Pratiti AuthPageLayout.tsx
//   i MainLayout.tsx kao primer layout komponenti.
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

import NotificationBell from '../shared/NotificationBell';

export default function Header() {
  return (
    <header
      data-testid="app-header"
      className="fixed top-0 right-0 z-40 h-14 md:left-64 bg-background/80 backdrop-blur-sm border-b flex items-center px-4 gap-2 justify-end"
    >
      <NotificationBell />
      {/* TODO FE2: ovde ide WatchlistQuickAccess */}
    </header>
  );
}
