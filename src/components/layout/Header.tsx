// ============================================================
// FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic
//
// NAPOMENA (25.05.2026): Po Lukinoj direktivi, NotificationBell je
// premesten direktno u sidebar user karticu (ClientSidebar.tsx) umesto
// u Header topbar. Ova komponenta NIJE montirana u MainLayout.tsx —
// ostavljena je kao skeleton za buduce prosirenje (npr. WatchlistQuickAccess
// + breadcrumbs) ako FE2/FE3 odluci da uvedu zaseban topbar.
//
// Za sada Header NE renderuje NotificationBell — bell se nalazi u sidebaru.
// Kad/ako se Header bude uveo, MainLayout treba da dobije pt-14 padding.
// ============================================================

import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header
      data-testid="app-header"
      className={cn(
        'fixed top-0 right-0 z-40 h-14 md:left-64 bg-background/80 backdrop-blur-sm border-b',
        'flex items-center px-4 gap-2 justify-end',
        className
      )}
    >
      {/* TODO FE2: ovde ide WatchlistQuickAccess */}
      {/* NotificationBell je premesten u ClientSidebar user karticu. */}
    </header>
  );
}
