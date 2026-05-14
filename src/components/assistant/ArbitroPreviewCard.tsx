/**
 * Plan v3.6 §Task 7 — polished preview card za agentic action.
 *
 * <p>Renderuje se unutar {@link ArbitroActionModal} pre potvrde (POTVRDI / ODBACI).
 * Friendly format: ikona po tool-u, summary u boldovanom title-u, polja u
 * tabularnom prikazu sa amount-em istaknutim, warnings u amber box-u.</p>
 */
import {
  AlertTriangle,
  ArrowLeftRight,
  CreditCard,
  Landmark,
  PiggyBank,
  Send,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export interface PreviewField {
  label: string;
  value: string;
  /**
   * Vizuelna emfaza:
   *  - 'amount' — veca/bold font za primarni iznos
   *  - 'account' — monospace za broj racuna
   *  - 'name' — semi-bold za ime primaoca / aktive
   */
  emphasis?: 'amount' | 'account' | 'name';
}

export interface ArbitroPreviewCardProps {
  /** Tool ime (npr. "create_payment", "create_buy_order"). Bira ikonu i label. */
  toolName: string;
  /** Kratak rekapitulacija sta ce se desiti — npr. "Placanje 100 RSD ka Milici". */
  summary: string;
  /** Polja koja se prikazuju kao key-value tabela. */
  fields: PreviewField[];
  /** Upozorenja (inter-bank, FX, ...). Render se u amber alert-u ispod polja. */
  warnings?: string[];
}

const TOOL_ICONS: Record<string, LucideIcon> = {
  create_payment: Send,
  create_transfer_internal: ArrowLeftRight,
  create_transfer_fx: ArrowLeftRight,
  create_buy_order: TrendingUp,
  create_sell_order: TrendingDown,
  block_card: CreditCard,
  unblock_card: CreditCard,
  invest_in_fund: Landmark,
  withdraw_from_fund: PiggyBank,
  create_otc_offer: ShoppingCart,
  exercise_otc_contract: ShoppingCart,
};

const TOOL_LABELS: Record<string, string> = {
  create_payment: 'Plaćanje',
  create_transfer_internal: 'Transfer izmedju računa',
  create_transfer_fx: 'FX transfer',
  create_buy_order: 'Nalog za kupovinu',
  create_sell_order: 'Nalog za prodaju',
  block_card: 'Blokada kartice',
  unblock_card: 'Odblokiranje kartice',
  invest_in_fund: 'Ulaganje u fond',
  withdraw_from_fund: 'Povlačenje iz fonda',
  create_otc_offer: 'OTC ponuda',
  exercise_otc_contract: 'OTC iskoristi',
};

export function ArbitroPreviewCard({
  toolName,
  summary,
  fields,
  warnings = [],
}: ArbitroPreviewCardProps) {
  const Icon = TOOL_ICONS[toolName] ?? Sparkles;
  const label = TOOL_LABELS[toolName] ?? toolName;

  return (
    <div
      className="arbitro-preview-card rounded-2xl border border-white/30 dark:border-zinc-700/40 bg-white/40 dark:bg-zinc-900/40 p-4 space-y-3"
      data-testid="arbitro-preview-card"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate">
            {summary}
          </p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
            {label}
          </p>
        </div>
      </div>

      <dl
        className="rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40 px-3 py-2.5 space-y-1.5"
        data-testid="arbitro-preview-fields"
      >
        {fields.map((f) => (
          <div
            key={f.label}
            className="flex items-baseline justify-between gap-3 text-sm"
            data-testid={`arbitro-preview-field-${f.label}`}
          >
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {f.label}
            </dt>
            <dd
              className={
                f.emphasis === 'amount'
                  ? 'text-base font-bold text-zinc-900 dark:text-zinc-50 font-mono'
                  : f.emphasis === 'account'
                  ? 'text-sm font-mono text-zinc-800 dark:text-zinc-100'
                  : f.emphasis === 'name'
                  ? 'text-sm font-semibold text-zinc-800 dark:text-zinc-100'
                  : 'text-sm text-zinc-700 dark:text-zinc-200'
              }
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      {warnings.length > 0 && (
        <div
          className="flex items-start gap-2 rounded-xl border border-amber-300/60 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-700/50 px-3 py-2 text-xs text-amber-900 dark:text-amber-200"
          data-testid="arbitro-preview-warnings"
        >
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <ul className="space-y-1 leading-relaxed">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
