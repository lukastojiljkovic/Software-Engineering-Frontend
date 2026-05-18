// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// Stranica za upravljanje trajnim (DCA) nalozima klijenta.
//
// IMPLEMENTIRATI:
//   Forma za kreiranje novog trajnog naloga:
//   - Polje za odabir hartije (ticker/listingId) — pretraga/select
//   - Smer: BUY | SELL (radio ili select)
//   - Mod: BY_QUANTITY (unesi broj hartija) | BY_AMOUNT (unesi iznos u valuti listinga)
//   - Vrednost: numericko polje (labela menja se prema modu)
//   - Racun: select iz `accountService.getMyAccounts()`
//   - Kadenca: DAILY | WEEKLY | MONTHLY (radio ili select)
//   - Submit dugme "Dodaj trajni nalog" -> poziva `recurringOrderService.create()`
//   - Validacija sa react-hook-form + zod (sva polja obavezna; value > 0)
//
//   Lista postojecih trajnih naloga:
//   - Fetch: `recurringOrderService.listMy()` na mount
//   - Prikazati: ticker, smer (BUY/SELL badge), mod + vrednost, kadenca, sledece izvrsavanje, status badge
//   - Akcija "Pauziraj" (samo za ACTIVE) -> `recurringOrderService.pause(id)`
//   - Akcija "Nastavi" (samo za PAUSED) -> `recurringOrderService.resume(id)`
//   - Akcija "Otkazi" (samo za ACTIVE/PAUSED) -> `recurringOrderService.cancel(id)` + Radix confirm dialog
//   - Prazno stanje: ikona + "Nemas nijedan trajni nalog."
//   - Loading: Skeleton redovi
//
//   Ruta: '/orders/recurring' (koordinator registruje u App.tsx)
//   Pristup: noAgentOnly (samo klijenti; agenti vide ordere ali ne DCA)
//
//   Importi koji ce biti potrebni:
//   - PageHeader iz '@/components/shared/PageHeader'
//   - Card, Button, Badge, Select, Input, Label, Skeleton iz '@/components/ui/*'
//   - Dialog (Radix confirm) iz '@/components/ui/dialog'
//   - recurringOrderService iz '@/services/recurringOrderService'
//   - accountService iz '@/services/accountService'
//   - listingService iz '@/services/listingService'  (za pretragu hartija)
//   - toast iz '@/lib/notify'
//   - useForm + zodResolver iz 'react-hook-form' + 'zod'
//   - RefreshCw, Plus, PauseCircle, PlayCircle, Trash2, RepeatIcon iz 'lucide-react'
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

import { RepeatIcon } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function RecurringOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<RepeatIcon className="h-5 w-5" />}
        title="Trajni nalozi"
        description="Automatizovana DCA kupovina i prodaja hartija od vrednosti"
      />
      <p className="text-muted-foreground text-sm">
        Implementacija u toku — vidi TODO blok na vrhu fajla.
      </p>
    </div>
  );
}
