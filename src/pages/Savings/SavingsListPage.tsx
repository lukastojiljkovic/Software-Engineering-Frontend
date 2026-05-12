import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiggyBank, Plus, Calendar, Percent, TrendingUp, Vault } from 'lucide-react';
import { toast } from '@/lib/notify';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/shared/PageHeader';
import { savingsService } from '@/services/savingsService';
import type { SavingsDepositDto, SavingsDepositStatus } from '@/types/savings';
import { STATUS_LABEL_SR } from '@/types/savings';

const STATUS_VARIANT: Record<SavingsDepositStatus, 'success' | 'secondary' | 'warning' | 'info'> = {
  ACTIVE: 'success',
  MATURED: 'secondary',
  WITHDRAWN_EARLY: 'warning',
  RENEWED: 'info',
};

function formatAmount(n: number, code: string): string {
  try {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: code,
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${code}`;
  }
}

function daysUntil(dateIso: string): number {
  const d = new Date(dateIso);
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function KpiChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border rounded-lg p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}

export default function SavingsListPage() {
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState<SavingsDepositDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    savingsService
      .listMyDeposits()
      .then(setDeposits)
      .catch(() => toast.error('Neuspeh ucitavanja stednje'))
      .finally(() => setLoading(false));
  }, []);

  const active = useMemo(() => deposits.filter(d => d.status === 'ACTIVE'), [deposits]);

  const totalPrincipal = useMemo(
    () => active.reduce((sum, d) => sum + d.principalAmount, 0),
    [active]
  );
  const totalInterest = useMemo(
    () => deposits.reduce((sum, d) => sum + d.totalInterestPaid, 0),
    [deposits]
  );
  const nextMaturityDays = useMemo(() => {
    if (active.length === 0) return null;
    return Math.min(...active.map(d => daysUntil(d.maturityDate)));
  }, [active]);

  const defaultCurrency = deposits[0]?.currencyCode ?? 'RSD';

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <PageHeader
          icon={<PiggyBank className="h-5 w-5" />}
          title="Stednja"
          description="Vasi orocni depoziti — pratite stanje, kamatu i dospece"
          actions={
            <Button onClick={() => navigate('/savings/new')} data-testid="open-new-deposit">
              <Plus className="w-4 h-4 mr-2" /> Novi depozit
            </Button>
          }
        />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KpiChip
          icon={<Vault className="w-5 h-5" />}
          label="Ukupno orocno"
          value={formatAmount(totalPrincipal, defaultCurrency)}
        />
        <KpiChip
          icon={<TrendingUp className="w-5 h-5" />}
          label="Ukupno kamata"
          value={formatAmount(totalInterest, defaultCurrency)}
        />
        <KpiChip
          icon={<Calendar className="w-5 h-5" />}
          label="Sledeci dospece"
          value={nextMaturityDays !== null ? `za ${nextMaturityDays} dana` : '-'}
        />
        <KpiChip
          icon={<Percent className="w-5 h-5" />}
          label="Aktivnih depozita"
          value={`${active.length}`}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Ucitavanje...</div>
      ) : deposits.length === 0 ? (
        <Card className="p-12 text-center">
          <PiggyBank className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Nemate aktivnih depozita</h3>
          <p className="text-muted-foreground mb-4">
            Otvorite svoj prvi oroceni depozit da pocnete da zaradjujete kamatu na svoju ustedu.
          </p>
          <Button onClick={() => navigate('/savings/new')}>
            <Plus className="w-4 h-4 mr-2" /> Otvori prvi depozit
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deposits.map(d => (
            <Card
              key={d.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/savings/${d.id}`)}
              data-testid={`deposit-card-${d.id}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">Depozit #{d.id}</div>
                  <div className="text-2xl font-bold tabular-nums">
                    {formatAmount(d.principalAmount, d.currencyCode)}
                  </div>
                </div>
                <Badge variant={STATUS_VARIANT[d.status]}>{STATUS_LABEL_SR[d.status]}</Badge>
              </div>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stopa</dt>
                  <dd>{d.annualInterestRate}% p.a.</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Rok</dt>
                  <dd>{d.termMonths} meseci</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Dospece</dt>
                  <dd>{new Date(d.maturityDate).toLocaleDateString('sr-RS')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Isplaceno kamata</dt>
                  <dd className="tabular-nums">{formatAmount(d.totalInterestPaid, d.currencyCode)}</dd>
                </div>
                {d.autoRenew && (
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                    Auto-obnova aktivna
                  </div>
                )}
              </dl>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
