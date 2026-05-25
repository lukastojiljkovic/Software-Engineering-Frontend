// ============================================================
// FE3 — Audit log tipovi (Developer: Elena Kalajdzic / Jovan)
//
// Tipovi za audit-log portal — sve sto koriste AuditLogPage i auditService.
// Spec: Zadaci_Frontend.pdf, FE3.
// Konvencija: pratiti `savings` feature celinu kao sablon.
// ============================================================

/**
 * Diskretne vrednosti tipova akcija koje BE belezi u revizioni dnevnik.
 * Lista odgovara `AuditActionType` enum-u na BE strani.
 */
export type AuditActionType =
  | 'LIMIT_CHANGED'
  | 'USED_LIMIT_RESET'
  | 'ORDER_APPROVED'
  | 'ORDER_DECLINED'
  | 'PERMISSIONS_CHANGED'
  | 'TAX_RUN_TRIGGERED';

/**
 * Lista svih AuditActionType vrednosti (npr. za render filter dropdown-a).
 */
export const AUDIT_ACTION_TYPES: AuditActionType[] = [
  'LIMIT_CHANGED',
  'USED_LIMIT_RESET',
  'ORDER_APPROVED',
  'ORDER_DECLINED',
  'PERMISSIONS_CHANGED',
  'TAX_RUN_TRIGGERED',
];

/**
 * Srpske labele tipova akcija (za prikaz u UI).
 */
export const AUDIT_ACTION_LABEL_SR: Record<AuditActionType, string> = {
  LIMIT_CHANGED: 'Promena limita',
  USED_LIMIT_RESET: 'Reset iskoriscenog limita',
  ORDER_APPROVED: 'Order odobren',
  ORDER_DECLINED: 'Order odbijen',
  PERMISSIONS_CHANGED: 'Izmena permisija',
  TAX_RUN_TRIGGERED: 'Pokrenut poreski obracun',
};

/**
 * Audit log zapis sa svih BE polja.
 *
 * `metadata` moze biti slobodan JSON objekat ili string (BE moze cuvati
 * razlicite tipove vrednosti — primer: stara/nova limita, lista permisija,
 * razlog odbijanja order-a).
 */
export interface AuditLogDto {
  id: number;
  actionType: AuditActionType;
  actorId: number;
  actorEmail?: string | null;
  actorName?: string | null;
  targetType?: string | null;
  targetId?: number | string | null;
  oldValue?: string | null;
  newValue?: string | null;
  metadata?: string | Record<string, unknown> | null;
  createdAt: string; // ISO 8601
}

/**
 * Filteri za audit-log upite. Sva polja su opciona; servis salje samo
 * non-undefined vrednosti BE-u.
 */
export interface AuditFilterParams {
  actionType?: AuditActionType;
  actorEmail?: string;
  dateFrom?: string; // ISO date YYYY-MM-DD
  dateTo?: string;
  page?: number; // 0-based
  size?: number;
}

/**
 * Paginirani odgovor — paritet sa `savings.PageDto<T>` (Spring Page format).
 */
export interface AuditPageDto<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // trenutna strana (0-based)
  size: number;
}
