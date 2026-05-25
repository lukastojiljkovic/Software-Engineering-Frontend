// ============================================================
// FE3 — Audit log servis (Developer: Elena Kalajdzic / Jovan)
//
// HTTP klijent za audit-log portal, oslanja se na `api` axios instancu.
// Dostupno samo ADMIN + SUPERVISOR rolama (BE vraca 403 inace).
//
// Spec: Zadaci_Frontend.pdf, FE3 / TODO_final C3 #9.
// ============================================================

import api from './api';
import type {
  AuditFilterParams,
  AuditLogDto,
  AuditPageDto,
} from '../types/audit';

/**
 * Builds query params, dropping undefined / empty string fields tako da
 * BE ne dobije prazne filtere koji nisu rezolvabilni.
 */
function buildParams(filter: AuditFilterParams): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (filter.actionType !== undefined) params.actionType = filter.actionType;
  if (filter.actorEmail !== undefined && filter.actorEmail !== '') {
    params.actorEmail = filter.actorEmail;
  }
  if (filter.dateFrom !== undefined && filter.dateFrom !== '') {
    params.dateFrom = filter.dateFrom;
  }
  if (filter.dateTo !== undefined && filter.dateTo !== '') {
    params.dateTo = filter.dateTo;
  }
  if (filter.page !== undefined) params.page = filter.page;
  if (filter.size !== undefined) params.size = filter.size;
  return params;
}

export const auditService = {
  /**
   * GET /audit-logs — paginirani upit revizionog dnevnika sa filterima.
   */
  queryAuditLogs: async (
    params: AuditFilterParams = {}
  ): Promise<AuditPageDto<AuditLogDto>> => {
    const { data } = await api.get<AuditPageDto<AuditLogDto>>('/audit-logs', {
      params: buildParams(params),
    });
    return data;
  },
};
