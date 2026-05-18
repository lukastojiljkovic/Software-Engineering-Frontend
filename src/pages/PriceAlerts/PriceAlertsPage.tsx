// ============================================================
// TODO [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Stranica "Moji alarmi" — pregled, uredjivanje i brisanje cenovnih alarma.
//
// IMPLEMENTIRATI:
//   - Ucitati sve alarme korisnika (priceAlertService.listMy) pri mount-u;
//     prikazati skeleton loading dok traje fetch.
//   - Tabela alarma sa kolonama: Hartija (ticker + ime) / Uslov (ABOVE/BELOW sa
//     pragom i valutom) / Trenutna cena / Udaljenost% od praga / Status Badge /
//     Kreiran / Akcije.
//   - Status Badge: koristiti PRICE_ALERT_STATUS_VARIANT i PRICE_ALERT_STATUS_LABELS
//     iz types/priceAlert.ts.
//   - Udaljenost%: ((currentPrice - threshold) / threshold * 100).toFixed(2) sa
//     bojom: blizu okidanja (abs < 2%) = amber, daleko = muted-foreground.
//   - Filter tabs iznad tabele: "Svi" / "Aktivni" / "Okidani" / "Onemoguceni"
//     (FE-strana filtracija, nije query param).
//   - "Uredi" akcija po redu: otvara PriceAlertDialog u edit modu sa popunjenim
//     vrednostima; po submit-u poziva priceAlertService.update.
//   - "Obrisi" akcija po redu (Trash2 ikona): Radix AlertDialog potvrda,
//     priceAlertService.remove, refresh liste.
//   - "Onemogci" / "Reaktivuj" toggle dugme po redu: priceAlertService.update
//     sa { status: 'DISABLED' } ili { status: 'ACTIVE' }.
//   - Empty state sa Bell ikonicom i opisom + uputstvo za kreiranje alarma
//     putem PriceAlertDialog na SecuritiesDetailsPage.
//   - Toast za sve uspesne/neuspesne operacije (import { toast } from '@/lib/notify').
//   - data-testid: 'price-alerts-page', 'alert-row-{id}', 'edit-alert-{id}',
//     'delete-alert-{id}', 'toggle-alert-{id}'.
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { Bell } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function PriceAlertsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl" data-testid="price-alerts-page">
      <div className="mb-6">
        <PageHeader
          icon={<Bell className="h-5 w-5" />}
          title="Moji alarmi"
          description="Pratite cenovne alarme za hartije od vrednosti"
        />
      </div>
      <p className="text-muted-foreground">Implementacija u toku — videti TODO blok iznad.</p>
    </div>
  );
}
