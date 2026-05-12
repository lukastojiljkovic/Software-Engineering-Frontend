import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/lib/notify';
import { AlertTriangle, PiggyBank, RotateCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import PageHeader from '@/components/shared/PageHeader';
import VerificationModal from '@/components/shared/VerificationModal';
import { savingsService } from '@/services/savingsService';
import type { SavingsDepositDto, SavingsTransactionDto, SavingsDepositStatus } from '@/types/savings';
import { STATUS_LABEL_SR, TRANSACTION_TYPE_LABEL_SR } from '@/types/savings';

const STATUS_VARIANT: Record<SavingsDepositStatus, 'success' | 'secondary' | 'warning' | 'info'> = {
  ACTIVE: 'success',
  MATURED: 'secondary',
  WITHDRAWN_EARLY: 'warning',
  RENEWED: 'info',
};

function fmtAmount(n: number, c: string) {
  try {
    return new Intl.NumberFormat('sr-RS', {
      style: 'currency',
      currency: c,
      minimumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${c}`;
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

interface WithdrawConfirmProps {
  deposit: SavingsDepositDto;
  penalty: number;
  onClose: () => void;
  onConfirm: (otpCode: string) => Promise<void>;
  submitting: boolean;
}

function WithdrawConfirm({ deposit, penalty, onClose, onConfirm, submitting }: WithdrawConfirmProps) {
  const [showOtp, setShowOtp] = useState(false);
  const returned = deposit.principalAmount - penalty;

  if (showOtp) {
    return (
      <VerificationModal
        isOpen={showOtp}
        onVerified={onConfirm}
        onClose={() => {
          setShowOtp(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Raskid pre dospeca</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Glavnica ce biti vracena na povezani racun, ali ostvarujete penal od 1% glavnice. Buduce
          kamate se gube.
        </p>
        <dl className="space-y-2 text-sm mb-4 border rounded-md p-3">
          <Row
            label="Glavnica"
            value={`${deposit.principalAmount.toFixed(2)} ${deposit.currencyCode}`}
          />
          <Row label="Penal (1%)" value={`-${penalty.toFixed(2)} ${deposit.currencyCode}`} />
          <Row label="Vraca se" value={`${returned.toFixed(2)} ${deposit.currencyCode}`} />
        </dl>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={submitting}
          >
            Odustani
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowOtp(true)}
            className="flex-1"
            disabled={submitting}
            data-testid="confirm-withdraw"
          >
            Potvrdi raskid
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function SavingsDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deposit, setDeposit] = useState<SavingsDepositDto | null>(null);
  const [transactions, setTransactions] = useState<SavingsTransactionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const depositId = Number(id);

  const refresh = async () => {
    try {
      const [d, txs] = await Promise.all([
        savingsService.getDeposit(depositId),
        savingsService.getTransactions(depositId),
      ]);
      setDeposit(d);
      setTransactions(txs);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Neuspeh ucitavanja depozita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(depositId) || isNaN(depositId)) {
      navigate('/savings');
      return;
    }
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depositId]);

  const handleToggleAutoRenew = async (autoRenew: boolean) => {
    if (!deposit) return;
    try {
      const updated = await savingsService.toggleAutoRenew(deposit.id, autoRenew);
      setDeposit(updated);
      toast.success(autoRenew ? 'Auto-obnova ukljucena' : 'Auto-obnova iskljucena');
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Promena nije uspela');
    }
  };

  const handleWithdrawConfirmed = async (otpCode: string) => {
    if (!deposit) return;
    setSubmitting(true);
    try {
      const updated = await savingsService.withdrawEarly(deposit.id, otpCode);
      setDeposit(updated);
      await refresh();
      toast.success('Depozit raskinut, glavnica vracena na povezani racun');
      setShowWithdrawDialog(false);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? 'Raskid nije uspeo');
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center text-muted-foreground">Ucitavanje...</div>;
  }
  if (!deposit) {
    return <div className="container mx-auto p-6 text-center text-muted-foreground">Depozit ne postoji.</div>;
  }

  const penalty = deposit.principalAmount * 0.01;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <PageHeader
          icon={<PiggyBank className="h-5 w-5" />}
          title={`Depozit #${deposit.id}`}
          description={`${deposit.termMonths} meseci, ${deposit.annualInterestRate}% p.a.`}
          actions={
            deposit.status === 'ACTIVE' ? (
              <Button
                variant="destructive"
                onClick={() => setShowWithdrawDialog(true)}
                data-testid="open-withdraw"
              >
                <X className="w-4 h-4 mr-2" /> Raskini ranije
              </Button>
            ) : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Details card */}
        <Card className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Detalji</h3>
            <Badge variant={STATUS_VARIANT[deposit.status]}>{STATUS_LABEL_SR[deposit.status]}</Badge>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Glavnica" value={fmtAmount(deposit.principalAmount, deposit.currencyCode)} />
            <Row label="Kamatna stopa" value={`${deposit.annualInterestRate}% p.a.`} />
            <Row label="Rok" value={`${deposit.termMonths} meseci`} />
            <Row
              label="Datum otvaranja"
              value={new Date(deposit.startDate).toLocaleDateString('sr-RS')}
            />
            <Row
              label="Datum dospeca"
              value={new Date(deposit.maturityDate).toLocaleDateString('sr-RS')}
            />
            <Row
              label="Sledeca kamata"
              value={new Date(deposit.nextInterestPaymentDate).toLocaleDateString('sr-RS')}
            />
            <Row label="Povezani racun" value={deposit.linkedAccountNumber} />
            <Row
              label="Isplaceno kamata"
              value={fmtAmount(deposit.totalInterestPaid, deposit.currencyCode)}
            />
          </dl>

          {deposit.status === 'ACTIVE' && (
            <div className="flex items-center justify-between border-t mt-4 pt-4">
              <div>
                <div className="font-medium text-sm">Auto-obnova</div>
                <p className="text-xs text-muted-foreground">Produzi na isti rok po vazecoj stopi</p>
              </div>
              <Switch
                checked={deposit.autoRenew}
                onCheckedChange={handleToggleAutoRenew}
                data-testid="auto-renew-switch"
              />
            </div>
          )}
        </Card>

        {/* Transaction timeline */}
        <Card className="p-6" data-testid="timeline">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RotateCw className="w-5 h-5" /> Istorija transakcija
          </h3>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nema transakcija jos.</p>
          ) : (
            <ul className="space-y-3">
              {transactions.map(tx => (
                <li key={tx.id} className="border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{TRANSACTION_TYPE_LABEL_SR[tx.type]}</span>
                    <span className="tabular-nums">{fmtAmount(tx.amount, tx.currencyCode)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.processedDate).toLocaleDateString('sr-RS')} — {tx.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {showWithdrawDialog && (
        <WithdrawConfirm
          deposit={deposit}
          penalty={penalty}
          onClose={() => setShowWithdrawDialog(false)}
          onConfirm={handleWithdrawConfirmed}
          submitting={submitting}
        />
      )}
    </div>
  );
}
