// ============================================================
// FE3 - Trajni nalozi (DCA) | Developer: Elena Kalajdzic
//
// HTTP klijent za trajne (DCA) naloge. Trading-service izlaze rute pod
// /recurring-orders (api-gateway path-routing). Spec: Zadaci_Frontend.pdf, FE3.
// ============================================================

import api from './api';
import type {
  RecurringOrderDto,
  CreateRecurringOrderRequest,
} from '../types/recurringOrder';

export const recurringOrderService = {
  /**
   * GET /recurring-orders?active=true|false
   * `activeOnly` opcioni filter — bez parametra vraca sve naloge korisnika
   * (i aktivne i pauzirane); BE filtrira po `ownerId`/`ownerType` iz JWT-a.
   */
  listMyRecurringOrders: async (activeOnly?: boolean): Promise<RecurringOrderDto[]> => {
    const params: Record<string, unknown> = {};
    if (typeof activeOnly === 'boolean') params.active = activeOnly;
    const { data } = await api.get<RecurringOrderDto[]>('/recurring-orders', { params });
    return data;
  },

  /**
   * POST /recurring-orders
   * Kreira novi trajni nalog. BE validira vlasnistvo `accountId` i
   * postojanje `listingId`; vraca persistovan DTO sa popunjenim `nextRun`.
   */
  createRecurringOrder: async (
    request: CreateRecurringOrderRequest
  ): Promise<RecurringOrderDto> => {
    const { data } = await api.post<RecurringOrderDto>('/recurring-orders', request);
    return data;
  },

  /**
   * PATCH /recurring-orders/{id}/pause
   * ACTIVE -> PAUSED (idempotent ako je vec pauziran). Vraca azuriran DTO.
   */
  pauseRecurringOrder: async (id: number): Promise<RecurringOrderDto> => {
    const { data } = await api.patch<RecurringOrderDto>(`/recurring-orders/${id}/pause`);
    return data;
  },

  /**
   * PATCH /recurring-orders/{id}/resume
   * PAUSED -> ACTIVE. Vraca azuriran DTO sa novim `nextRun`.
   */
  resumeRecurringOrder: async (id: number): Promise<RecurringOrderDto> => {
    const { data } = await api.patch<RecurringOrderDto>(`/recurring-orders/${id}/resume`);
    return data;
  },

  /**
   * DELETE /recurring-orders/{id}
   * Trajno otkazuje nalog. BE vraca 204 No Content.
   */
  cancelRecurringOrder: async (id: number): Promise<void> => {
    await api.delete<void>(`/recurring-orders/${id}`);
  },
};
