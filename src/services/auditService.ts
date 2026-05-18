// ============================================================
// TODO [FE3 - Trajni nalozi + Audit log + filteri ordera | Developer: Elena Kalajdzic]
//
// HTTP klijent za audit-log portal, oslanja se na `api` axios instancu iz './api'.
//
// IMPLEMENTIRATI (objekat `auditService`):
//   - list(params: AuditLogFilterParams): Promise<AuditLogPageDto<AuditLogEntryDto>>
//       GET /audit
//       Query params: action?, userId?, dateFrom?, dateTo?, page?, size?
//       Dostupno samo ADMIN + SUPERVISOR rolama (BE vraca 403 inace).
//
// Uvoz tipova iz '../types/audit':
//   AuditLogEntryDto, AuditLogFilterParams, AuditLogPageDto
//
// Konvencija: pratiti postojecu `Savings` feature celinu kao sablon
//   (import api from './api', named export `auditService`).
// Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

export {};
