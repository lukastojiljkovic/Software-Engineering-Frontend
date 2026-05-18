// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// Tipovi za audit-log portal — sve sto koriste AuditLogPage i auditService.
//
// IMPLEMENTIRATI:
//   - AuditLogAction: string union najcescih tipova akcija, npr.:
//       'LOGIN' | 'LOGOUT' | 'CREATE_ORDER' | 'CANCEL_ORDER' | 'CREATE_PAYMENT'
//       | 'CREATE_ACCOUNT' | 'UPDATE_EMPLOYEE' | 'CHANGE_PERMISSION' | string
//       (koristiti siroki string tip jer BE moze prosirivati listu)
//   - AuditLogEntryDto {
//       id: number;
//       action: string;               // tip akcije (vidi gore)
//       performedByUserId: number;
//       performedByEmail: string;
//       targetResourceType: string;   // npr. 'ORDER', 'PAYMENT', 'EMPLOYEE'
//       targetResourceId: number | null;
//       details: string | null;       // JSON string ili opis
//       ipAddress: string | null;
//       createdAt: string;            // ISO datetime
//     }
//   - AuditLogFilterParams {
//       action?: string;
//       userId?: number;
//       dateFrom?: string;   // ISO date npr. '2026-01-01'
//       dateTo?: string;     // ISO date
//       page?: number;
//       size?: number;
//     }
//   - AuditLogPageDto<T> — genericki paginirani odgovor sa poljima:
//       content: T[];
//       totalElements: number;
//       totalPages: number;
//       number: number;       // trenutna strana (0-based)
//       size: number;
//     (alternativno reuse PageDto iz savings.ts ako se koordinator odluci za zajednicki tip)
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon.
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

export {};
