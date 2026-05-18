// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// Stranica sa listom in-app notifikacija za prijavljenog korisnika.
// Dostupna na ruti /notifications (svi prijavljeni korisnici).
//
// IMPLEMENTIRATI:
//   - Ucitavanje: useEffect na mount-u poziva notificationService.listNotifications()
//     sa page=0, size=20. Lazy load sledecih strana kroz "Ucitaj jos" dugme
//     (append, ne zamena) ili infinite scroll.
//   - Filter: dve opcije u SegmentedControl ili Tabs komponentama shadcn/ui:
//       "Sve" (bez filtera) i "Neprocitane" (read=false)
//     Menjanje filtera resetuje na prvu stranu.
//   - Prikaz svake notifikacije kao Card:
//       - Ikona tipa (Lucide ikona po NotificationType — npr. DollarSign za
//         PAYMENT_*, TrendingUp za ORDER_*, Handshake za OTC_*, PiggyBank za
//         FUND_*, CreditCard za CARD_*, Lock za ACCOUNT_*)
//       - Naslov (bold ako nije procitana)
//       - Poruka (text-muted-foreground, clampovano na 2 reda)
//       - Vreme (relativno — npr. "pre 5 min"; koristiti date-fns ili rucno)
//       - Desno: ako read=false, plava tacka indikator + dugme "Oznaci procitanom"
//         (klik zove notificationService.markAsRead(id) + azurira lokalni state)
//   - Header akcija: dugme "Oznaci sve procitanim" (disabled ako nema neprocitanih)
//     — zove notificationService.markAllAsRead() + refetch
//   - Loading state: Skeleton sa animate-pulse (isti obrazac kao SavingsListPage)
//   - Empty state: Bell ikona + "Nemate notifikacija" poruka
//   - Error handling: toast.error('Greska pri ucitavanju notifikacija')
//   - data-testid="notifications-page" na root div
//   - data-testid="notification-item-{id}" na svakom Card-u
//   - data-testid="mark-all-read-btn" na "Oznaci sve" dugmetu
//   - data-testid="mark-read-btn-{id}" na per-notifikacija dugmetu
//
// Konvencija: pratiti SavingsListPage.tsx kao sablon — PageHeader sa ikonom
//   i title-om, useEffect + useState, toast.error iz '@/lib/notify',
//   Card/Badge/Button iz '@/components/ui/', Skeleton za loading stanje.
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

import { Bell } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="notifications-page">
      <div className="mb-6">
        <PageHeader
          icon={<Bell className="h-5 w-5" />}
          title="Notifikacije"
          description="Vasa obavestenja o aktivnostima na nalogu"
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Implementacija na cekanju — videti TODO blok na vrhu fajla.
      </p>
    </div>
  );
}
