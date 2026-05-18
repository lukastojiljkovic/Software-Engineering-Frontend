// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// Admin/supervisor portal za pregled audit-log zapisa sa filterima.
//
// IMPLEMENTIRATI:
//   Filter panel (horizontalni toolbar iznad tabele):
//   - "Tip akcije" — Input ili Select (slobodan unos ili enum lista iz types/audit.ts)
//   - "Korisnik (ID)" — Input type number, opciono
//   - "Od datuma" — Input type date
//   - "Do datuma" — Input type date
//   - Dugme "Primeni filtere" -> re-fetch sa novim params
//   - Dugme "Resetuj" -> ocistiti sve filtere i re-fetch
//
//   Tabela audit log-a:
//   - Fetch: `auditService.list(params)` na mount i na svaku promenu filtera
//   - Kolone: ID | Akcija (Badge) | Korisnik (email) | Tip resursa | Resurs ID | Detalji | IP adresa | Datum i vreme
//   - Paginacija: prethodni/sledeci + prikaz "Strana N od M" + select za velicinu strane (10/25/50)
//   - Loading: Skeleton redovi tokom fetcha
//   - Prazno stanje: "Nema audit zapisa za zadate filtere."
//   - Greska: toast.error + alert komponent
//
//   Ruta: '/admin/audit' (koordinator registruje u App.tsx)
//   Pristup: supervisorOnly (ADMIN + SUPERVISOR; agenti i klijenti dobijaju 403)
//
//   Importi koji ce biti potrebni:
//   - PageHeader iz '@/components/shared/PageHeader'
//   - Card, Button, Badge, Input, Label, Skeleton, Select iz '@/components/ui/*'
//   - auditService iz '@/services/auditService'
//   - toast iz '@/lib/notify'
//   - useState, useEffect, useCallback iz 'react'
//   - ClipboardList, Filter, RefreshCw iz 'lucide-react'
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

import { ClipboardList } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ClipboardList className="h-5 w-5" />}
        title="Audit log"
        description="Pregled svih akcija korisnika u sistemu"
      />
      <p className="text-muted-foreground text-sm">
        Implementacija u toku — vidi TODO blok na vrhu fajla.
      </p>
    </div>
  );
}
