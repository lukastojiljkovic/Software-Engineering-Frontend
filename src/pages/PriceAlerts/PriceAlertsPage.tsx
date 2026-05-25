// ============================================================
// [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// Stranica "Cenovni alarmi" — pregled i brisanje cenovnih alarma.
//
// Spec: Zadaci_Frontend.pdf, FE2 + task instructions 25.05.2026.
// ============================================================

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BellRing,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  Bell,
} from 'lucide-react';
import { toast } from '@/lib/notify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import PageHeader from '@/components/shared/PageHeader';
import PriceAlertDialog from '@/components/pricealert/PriceAlertDialog';
import { priceAlertService } from '@/services/priceAlertService';
import type { PriceAlertDto } from '@/types/priceAlert';

type FilterTab = 'active' | 'history' | 'all';

function formatThreshold(n: number, currency?: string): string {
  try {
    return (
      new Intl.NumberFormat('sr-RS', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(n) + (currency ? ` ${currency}` : '')
    );
  } catch {
    return `${n.toFixed(2)}${currency ? ` ${currency}` : ''}`;
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('sr-RS');
  } catch {
    return iso;
  }
}

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlertDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('active');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await priceAlertService.listMyAlerts();
      setAlerts(data);
    } catch {
      setError('Neuspeh ucitavanja alarma');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const filtered = useMemo(() => {
    if (filter === 'active') return alerts.filter(a => a.active);
    if (filter === 'history') return alerts.filter(a => !a.active);
    return alerts;
  }, [alerts, filter]);

  const counts = useMemo(
    () => ({
      active: alerts.filter(a => a.active).length,
      history: alerts.filter(a => !a.active).length,
      all: alerts.length,
    }),
    [alerts]
  );

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Da li sigurno zelite da obrisete ovaj alarm?');
    if (!ok) return;
    setDeletingId(id);
    try {
      await priceAlertService.deleteAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      toast.success('Alarm obrisan');
    } catch {
      toast.error('Neuspeh brisanja alarma');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreated = (created: PriceAlertDto) => {
    setAlerts(prev => [created, ...prev]);
    setFilter('active');
  };

  const renderFilterButton = (value: FilterTab, label: string, count: number) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilter(value)}
      data-testid={`price-alerts-filter-${value}`}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        filter === value
          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {label}
      <span
        className={`ml-2 text-xs font-semibold ${
          filter === value ? 'text-white/85' : 'text-muted-foreground'
        }`}
      >
        {count}
      </span>
    </button>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-testid="price-alerts-page">
      <div className="mb-6">
        <PageHeader
          icon={<BellRing className="h-5 w-5" />}
          title="Cenovni alarmi"
          description="Postavi obavestenje kad cena hartije dosegne zadati prag"
          actions={
            <Button
              onClick={() => setDialogOpen(true)}
              data-testid="price-alerts-new-button"
              className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" /> Postavi novi alarm
            </Button>
          }
        />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-4 bg-muted/40 p-1 rounded-lg w-fit">
        {renderFilterButton('active', 'Aktivni', counts.active)}
        {renderFilterButton('history', 'Istorija', counts.history)}
        {renderFilterButton('all', 'Sve', counts.all)}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Greska</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadAlerts}>
              Pokusaj ponovo
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <Card className="p-6">
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="h-12 bg-muted/50 rounded-md animate-pulse"
                data-testid="price-alerts-skeleton"
              />
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <BellRing className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nemate cenovne alarme</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Postavi alarm sa Hartije od vrednosti stranice ili klikni dugme iznad
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" /> Postavi prvi alarm
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Uslov</TableHead>
                <TableHead className="text-right">Prag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Kreiran</TableHead>
                <TableHead className="w-10 text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} data-testid={`price-alert-row-${a.id}`}>
                  <TableCell>
                    <div className="font-mono font-semibold">{a.listingTicker}</div>
                    <div className="text-xs text-muted-foreground">{a.listingType}</div>
                  </TableCell>
                  <TableCell>
                    {a.condition === 'ABOVE' ? (
                      <Badge variant="destructive" className="gap-1">
                        <TrendingUp className="h-3 w-3" /> Iznad praga
                      </Badge>
                    ) : (
                      <Badge variant="success" className="gap-1">
                        <TrendingDown className="h-3 w-3" /> Ispod praga
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {formatThreshold(a.threshold, a.currency)}
                  </TableCell>
                  <TableCell>
                    {a.active ? (
                      <Badge variant="info" className="gap-1">
                        <Bell className="h-3 w-3" /> Aktivan
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        Okidnut
                        {a.triggeredAt ? ` (${formatDate(a.triggeredAt)})` : ''}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(a.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(a.id)}
                      disabled={deletingId === a.id}
                      data-testid={`price-alert-delete-${a.id}`}
                      aria-label="Obrisi alarm"
                      className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <PriceAlertDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={handleCreated}
      />
    </div>
  );
}
