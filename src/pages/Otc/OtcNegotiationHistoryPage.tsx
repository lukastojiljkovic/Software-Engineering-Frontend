// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// Stranica istorije OTC pregovora — prikazuje sve pregovore korisnika
// (aktivne, prihvacene, odbijene) sa kompletnom istorijom kontraponuda
// i filterima po statusu, datumu i drugoj strani.
//
// IMPLEMENTIRATI:
//   - Fetchovati listu pregovora sa BE endpoint-a GET /otc/offers/history
//     (ili GET /otc/offers?includeAll=true) koristeci otcService ili zaseban
//     poziv u ovom fajlu. BE treba da vraca i DECLINED/ACCEPTED, ne samo ACTIVE.
//   - Filter state:
//       statusFilter: 'ALL' | 'ACTIVE' | 'ACCEPTED' | 'DECLINED'
//       counterpartySearch: string  (ime/ticker slobodna pretraga)
//       fromDate: string | null
//       toDate: string | null
//   - Za svaki pregovor prikazati "Kontraponude" expand/collapse sekciju koja
//     prikazuje chain: originalna ponuda -> kontraponuda 1 -> kontraponuda 2...
//     Svaki korak sa: datum, ko je napravio, kolicina, cena, premija, dospece.
//   - Tabela pregleda (kolone): Ticker / Druga strana (kupac ili prodavac) /
//     Kolicina / Finalna cena / Premija / Dospece / Status / Broj kontraponuda / Akcije (Detalji)
//   - Paginacija (opciono: beskonacno skrolovanje ili standardni paginator)
//   - Prazno stanje: ilustracija + "Nema pregovora" poruka
//   - Loading stanje: Skeleton redovi (kao u OtcNegotiationsPage)
//   - Badge boje po statusu: ACTIVE=warning, ACCEPTED=success, DECLINED=secondary
//   - Koristiti shadcn/ui Table, Badge, Card, Button, Input (za search)
//   - Koristiti OtcSubHero sa History ikonom (Clock ili Archive iz lucide-react)
//     i gradijentom from-slate-500 to-gray-600
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE4.
// ============================================================

import { Clock } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function OtcNegotiationHistoryPage() {
  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-up">
      <PageHeader
        icon={<Clock className="h-5 w-5" />}
        title="Istorija OTC pregovora"
        description="Svi vasi OTC pregovori — aktivni, prihvaceni i odbijeni, sa lancima kontraponuda"
      />
      <p className="text-muted-foreground text-sm">
        Implementacija u toku. Vidi TODO blok na vrhu fajla.
      </p>
    </div>
  );
}
