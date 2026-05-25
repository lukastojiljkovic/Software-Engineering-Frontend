// ============================================================
// FE3 - Trajni nalozi (DCA) | Developer: Elena Kalajdzic
//
// Stranica za upravljanje trajnim (DCA) nalozima klijenta. Pristup: noAgentOnly
// (samo klijenti). Layout: 2 kolone — leva (1/3) sadrzi formu za kreiranje,
// desna (2/3) tabovani prikaz aktivnih / pauziranih / svih trajnih naloga.
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Repeat,
  PauseCircle,
  PlayCircle,
  Trash2,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  Inbox,
  Calendar,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PageHeader from '@/components/shared/PageHeader';
import { toast } from '@/lib/notify';
import { useDebounce } from '@/hooks/useDebounce';

import { recurringOrderService } from '@/services/recurringOrderService';
import { accountService } from '@/services/accountService';
import listingService from '@/services/listingService';
import type { Account } from '@/types/celina2';
import type { Listing } from '@/types/celina3';
import {
  type RecurringOrderDto,
  type RecurringCadence,
  type RecurringDirection,
  type RecurringMode,
  RECURRING_CADENCE_LABEL_SR,
  RECURRING_MODE_LABEL_SR,
  RECURRING_DIRECTION_LABEL_SR,
} from '@/types/recurringOrder';

// ---------- Zod schema ----------

const formSchema = z.object({
  listingId: z.number({ message: 'Izaberite hartiju' }).int().positive('Izaberite hartiju'),
  direction: z.enum(['BUY', 'SELL']),
  mode: z.enum(['BYAMOUNT', 'BYQUANTITY']),
  value: z.number({ message: 'Unesite vrednost' }).positive('Vrednost mora biti > 0'),
  accountId: z.number({ message: 'Izaberite racun' }).int().positive('Izaberite racun'),
  cadence: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
});

type FormData = z.infer<typeof formSchema>;

type TabKey = 'active' | 'paused' | 'all';

// ---------- Format helpers ----------

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatValue(mode: RecurringMode, value: number, currency?: string): string {
  if (mode === 'BYAMOUNT') {
    const ccy = currency ?? 'RSD';
    try {
      return new Intl.NumberFormat('sr-RS', {
        style: 'currency',
        currency: ccy,
        minimumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${ccy}`;
    }
  }
  return `${value} akcija`;
}

// ============================================================

export default function RecurringOrdersPage() {
  const [orders, setOrders] = useState<RecurringOrderDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('active');

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Listing search
  const [listingQuery, setListingQuery] = useState('');
  const debouncedQuery = useDebounce(listingQuery, 350);
  const [listingResults, setListingResults] = useState<Listing[]>([]);
  const [listingSearching, setListingSearching] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Per-row action state
  const [busyId, setBusyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // FIX FE-TRD-02: `onChange` mode tako da `formState.isValid` reactive odgovara
    // na trenutne vrednosti polja (Zod schema zahteva listingId/accountId/value
    // positive). Bez ovog mode-a isValid se osvezavja tek na submit, pa dugme
    // ostaje "klikatelno" za invalid form-u.
    mode: 'onChange',
    defaultValues: {
      direction: 'BUY',
      mode: 'BYAMOUNT',
      cadence: 'MONTHLY',
      // listingId/accountId/value se postavljaju kad korisnik izabere
    },
  });

  const direction = form.watch('direction');
  const mode = form.watch('mode');
  const cadence = form.watch('cadence');

  // ---------- Loaders ----------

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await recurringOrderService.listMyRecurringOrders();
      setOrders(data);
    } catch {
      setLoadError('Nije moguce ucitati trajne naloge. Pokusajte ponovo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    accountService
      .getMyAccounts()
      .then((all) => setAccounts(all.filter((a) => a.status === 'ACTIVE')))
      .catch(() => toast.error('Nije moguce ucitati racune'))
      .finally(() => setAccountsLoading(false));
  }, []);

  // Live search nad listinzima (debounce 350ms)
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setListingResults([]);
      return;
    }
    let cancelled = false;
    setListingSearching(true);
    listingService
      .getAll('STOCK', q, 0, 8)
      .then((page) => {
        if (!cancelled) setListingResults(page.content ?? []);
      })
      .catch(() => {
        if (!cancelled) setListingResults([]);
      })
      .finally(() => {
        if (!cancelled) setListingSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // ---------- Form actions ----------

  const onPickListing = (listing: Listing) => {
    setSelectedListing(listing);
    setListingQuery(`${listing.ticker} — ${listing.name}`);
    setListingResults([]);
    form.setValue('listingId', listing.id, { shouldValidate: true });
  };

  const onClearListing = () => {
    setSelectedListing(null);
    setListingQuery('');
    form.setValue('listingId', 0 as unknown as number, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await recurringOrderService.createRecurringOrder({
        listingId: data.listingId,
        direction: data.direction,
        mode: data.mode,
        value: data.value,
        accountId: data.accountId,
        cadence: data.cadence,
      });
      toast.success('Trajni nalog kreiran');
      form.reset({
        direction: 'BUY',
        mode: 'BYAMOUNT',
        cadence: 'MONTHLY',
      });
      setSelectedListing(null);
      setListingQuery('');
      reload();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Kreiranje trajnog naloga nije uspelo');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Lifecycle actions ----------

  const handlePause = async (order: RecurringOrderDto) => {
    setBusyId(order.id);
    try {
      const updated = await recurringOrderService.pauseRecurringOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success('Trajni nalog pauziran');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Pauziranje nije uspelo');
    } finally {
      setBusyId(null);
    }
  };

  const handleResume = async (order: RecurringOrderDto) => {
    setBusyId(order.id);
    try {
      const updated = await recurringOrderService.resumeRecurringOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      toast.success('Trajni nalog ponovo aktivan');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Aktiviranje nije uspelo');
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (order: RecurringOrderDto) => {
    const label = order.listingTicker ?? `nalog #${order.id}`;
    const confirmed = window.confirm(
      `Da li ste sigurni da zelite da otkazete trajni nalog za ${label}? Ova akcija je trajna.`
    );
    if (!confirmed) return;

    setBusyId(order.id);
    try {
      await recurringOrderService.cancelRecurringOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success('Trajni nalog otkazan');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Otkazivanje nije uspelo');
    } finally {
      setBusyId(null);
    }
  };

  // ---------- Filter for tabs ----------

  const filtered = useMemo(() => {
    if (activeTab === 'active') return orders.filter((o) => o.active);
    if (activeTab === 'paused') return orders.filter((o) => !o.active);
    return orders;
  }, [orders, activeTab]);

  const activeCount = useMemo(() => orders.filter((o) => o.active).length, [orders]);
  const pausedCount = useMemo(() => orders.filter((o) => !o.active).length, [orders]);

  // Iznos / kolicina input — labela zavisi od mode-a
  const valueLabel =
    mode === 'BYAMOUNT'
      ? 'Iznos po izvrsavanju (valuta racuna)'
      : 'Kolicina akcija po izvrsavanju';

  const valueHelp =
    mode === 'BYAMOUNT'
      ? 'Npr. 5000 — sistem ce po toj vrednosti kupiti onoliko akcija koliko stane.'
      : 'Npr. 5 — sistem ce kupiti tacno toliko akcija po trenutnoj ceni.';

  // ============================================================
  // Render
  // ============================================================

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <PageHeader
        icon={<Repeat className="h-5 w-5" />}
        title="Trajni nalozi (DCA)"
        description="Automatska kupovina ili prodaja hartija u zadatim intervalima"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={reload}
            disabled={loading}
            data-testid="recurring-reload"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Osvezi
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============================================================
             Leva kolona: forma za kreiranje
           ============================================================ */}
        <Card className="lg:col-span-1 p-6 space-y-4 self-start">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold leading-tight">Novi trajni nalog</h2>
              <p className="text-xs text-muted-foreground">
                Kreirajte DCA plan u 3 koraka
              </p>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="recurring-create-form"
          >
            {/* Hartija / listing autocomplete */}
            <div className="space-y-1">
              <Label htmlFor="listingSearch">Hartija</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="listingSearch"
                  type="text"
                  placeholder="Pretraga po tikeru ili imenu"
                  className="pl-9"
                  value={listingQuery}
                  onChange={(e) => {
                    setListingQuery(e.target.value);
                    if (selectedListing) {
                      setSelectedListing(null);
                      form.setValue('listingId', 0 as unknown as number);
                    }
                  }}
                  data-testid="recurring-listing-search"
                />
              </div>
              {selectedListing && (
                <div
                  className="mt-1 flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900 px-3 py-2 text-sm"
                  data-testid="recurring-listing-selected"
                >
                  <span className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-mono font-semibold">{selectedListing.ticker}</span>
                    <span className="text-muted-foreground truncate">
                      {selectedListing.name}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={onClearListing}
                  >
                    Promeni
                  </button>
                </div>
              )}
              {!selectedListing && listingResults.length > 0 && (
                <ul
                  className="mt-1 max-h-56 overflow-y-auto rounded-md border bg-popover shadow-md"
                  data-testid="recurring-listing-results"
                >
                  {listingResults.map((l) => (
                    <li key={l.id}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-muted text-sm flex items-center justify-between gap-2"
                        onClick={() => onPickListing(l)}
                      >
                        <span className="truncate">
                          <span className="font-mono font-semibold">{l.ticker}</span>
                          <span className="text-muted-foreground"> — {l.name}</span>
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                          {l.price?.toFixed?.(2)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {!selectedListing && listingSearching && (
                <p className="text-xs text-muted-foreground">Pretraga...</p>
              )}
              {form.formState.errors.listingId && (
                <p className="text-xs text-red-500">{form.formState.errors.listingId.message}</p>
              )}
            </div>

            {/* Smer (BUY/SELL) */}
            <div className="space-y-1">
              <Label>Smer</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['BUY', 'SELL'] as RecurringDirection[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => form.setValue('direction', d)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      direction === d
                        ? d === 'BUY'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        : 'bg-background hover:bg-muted'
                    }`}
                    data-testid={`recurring-direction-${d}`}
                  >
                    {RECURRING_DIRECTION_LABEL_SR[d]}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode (BYAMOUNT/BYQUANTITY) */}
            <div className="space-y-1">
              <Label>Rezim</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['BYAMOUNT', 'BYQUANTITY'] as RecurringMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => form.setValue('mode', m)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      mode === m
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                        : 'bg-background hover:bg-muted'
                    }`}
                    data-testid={`recurring-mode-${m}`}
                  >
                    {RECURRING_MODE_LABEL_SR[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <Label htmlFor="value">{valueLabel}</Label>
              <Input
                id="value"
                type="number"
                step={mode === 'BYAMOUNT' ? '0.01' : '1'}
                min="0"
                placeholder={mode === 'BYAMOUNT' ? '5000.00' : '5'}
                {...form.register('value', { valueAsNumber: true })}
                data-testid="recurring-value-input"
              />
              <p className="text-xs text-muted-foreground">{valueHelp}</p>
              {form.formState.errors.value && (
                <p className="text-xs text-red-500">{form.formState.errors.value.message}</p>
              )}
            </div>

            {/* Account */}
            <div className="space-y-1">
              <Label htmlFor="accountId">Racun (sa kog ce ici sredstva)</Label>
              <select
                id="accountId"
                aria-label="Racun za trajni nalog"
                title="Izaberite racun sa kog ce ici sredstva"
                className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-sm"
                disabled={accountsLoading}
                value={form.watch('accountId') ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  form.setValue('accountId', v ? Number(v) : (0 as unknown as number), {
                    shouldValidate: true,
                  });
                }}
                data-testid="recurring-account-select"
              >
                <option value="">-- Izaberi racun --</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.accountNumber} ({a.currency}) — {a.availableBalance.toFixed(2)}
                  </option>
                ))}
              </select>
              {form.formState.errors.accountId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.accountId.message}
                </p>
              )}
            </div>

            {/* Cadence */}
            <div className="space-y-1">
              <Label>Ucestalost</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['DAILY', 'WEEKLY', 'MONTHLY'] as RecurringCadence[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => form.setValue('cadence', c)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
                      cadence === c
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                        : 'bg-background hover:bg-muted'
                    }`}
                    data-testid={`recurring-cadence-${c}`}
                  >
                    {RECURRING_CADENCE_LABEL_SR[c]}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              // FIX FE-TRD-02: disable submit kad form nije validan (Zod schema
              // zahteva pozitivne listingId/accountId/value). Bez ovog dugme bi
              // bilo klikatelno sa listingId=0 (placeholder iz onClearListing),
              // sto pravi BE 400 round-trip.
              disabled={submitting || !form.formState.isValid}
              data-testid="recurring-submit"
            >
              {submitting ? 'Kreiram...' : 'Kreiraj trajni nalog'}
            </Button>
          </form>
        </Card>

        {/* ============================================================
             Desna kolona: tabovi sa listom naloga
           ============================================================ */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold leading-tight">Moji trajni nalozi</h2>
              <p className="text-xs text-muted-foreground">
                Ukupno: {orders.length} · Aktivnih: {activeCount} · Pauziranih: {pausedCount}
              </p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabKey)}>
            <TabsList>
              <TabsTrigger value="active" data-testid="tab-active">
                Aktivni
                <Badge
                  variant={activeTab === 'active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {activeCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="paused" data-testid="tab-paused">
                Pauzirani
                <Badge
                  variant={activeTab === 'paused' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {pausedCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">
                Svi
                <Badge
                  variant={activeTab === 'all' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {orders.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {(['active', 'paused', 'all'] as TabKey[]).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                {loadError ? (
                  <Alert variant="destructive" data-testid="recurring-error">
                    <AlertTitle>Greska pri ucitavanju</AlertTitle>
                    <AlertDescription>
                      {loadError}{' '}
                      <button
                        type="button"
                        className="underline"
                        onClick={reload}
                      >
                        Pokusaj ponovo
                      </button>
                    </AlertDescription>
                  </Alert>
                ) : loading ? (
                  <LoadingTableSkeleton />
                ) : filtered.length === 0 ? (
                  <EmptyState
                    title={
                      tab === 'active'
                        ? 'Nemate aktivnih trajnih naloga'
                        : tab === 'paused'
                          ? 'Nemate pauziranih trajnih naloga'
                          : 'Nemate trajnih naloga'
                    }
                    subtitle="Kreirajte prvi DCA plan koristeci formu sa leve strane."
                  />
                ) : (
                  <RecurringOrdersTable
                    orders={filtered}
                    busyId={busyId}
                    onPause={handlePause}
                    onResume={handleResume}
                    onCancel={handleCancel}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Sub-components
// ============================================================

function LoadingTableSkeleton() {
  return (
    <div className="space-y-2" data-testid="recurring-loading">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-md border bg-muted/40 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/20 p-10 text-center" data-testid="recurring-empty">
      <Inbox className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

interface RecurringOrdersTableProps {
  orders: RecurringOrderDto[];
  busyId: number | null;
  onPause: (o: RecurringOrderDto) => void;
  onResume: (o: RecurringOrderDto) => void;
  onCancel: (o: RecurringOrderDto) => void;
}

function RecurringOrdersTable({
  orders,
  busyId,
  onPause,
  onResume,
  onCancel,
}: RecurringOrdersTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hartija</TableHead>
            <TableHead>Smer</TableHead>
            <TableHead>Iznos/Kolicina</TableHead>
            <TableHead>Ucestalost</TableHead>
            <TableHead>Sledece izvrsavanje</TableHead>
            <TableHead>Poslednje</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Akcije</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id} data-testid={`recurring-row-${o.id}`}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-mono font-semibold">
                    {o.listingTicker ?? `#${o.listingId}`}
                  </span>
                  {o.listingType && (
                    <span className="text-xs text-muted-foreground">{o.listingType}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={o.direction === 'BUY' ? 'success' : 'warning'}>
                  {RECURRING_DIRECTION_LABEL_SR[o.direction]}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">
                {formatValue(o.mode, o.value, o.currency)}
                <div className="text-xs text-muted-foreground">
                  {RECURRING_MODE_LABEL_SR[o.mode]}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="info">{RECURRING_CADENCE_LABEL_SR[o.cadence]}</Badge>
              </TableCell>
              <TableCell className="text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatDateTime(o.nextRun)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(o.lastRunAt)}
              </TableCell>
              <TableCell>
                {o.active ? (
                  <Badge variant="success">Aktivan</Badge>
                ) : (
                  <Badge variant="secondary">Pauziran</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="inline-flex gap-1">
                  {o.active ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPause(o)}
                      disabled={busyId === o.id}
                      data-testid={`recurring-pause-${o.id}`}
                    >
                      <PauseCircle className="mr-1 h-3.5 w-3.5" />
                      Pauziraj
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onResume(o)}
                      disabled={busyId === o.id}
                      data-testid={`recurring-resume-${o.id}`}
                    >
                      <PlayCircle className="mr-1 h-3.5 w-3.5 text-emerald-600" />
                      Nastavi
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onCancel(o)}
                    disabled={busyId === o.id}
                    data-testid={`recurring-cancel-${o.id}`}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Otkazi
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
