// ============================================================
// [FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic]
//
// HTTP klijent za Price Alert feature.
// Spec: Zadaci_Frontend.pdf, FE2 + task instructions 25.05.2026.
// ============================================================

import api from './api';
import type { CreatePriceAlertRequest, PriceAlertDto } from '../types/priceAlert';

export const priceAlertService = {
  createAlert: async (request: CreatePriceAlertRequest): Promise<PriceAlertDto> => {
    const { data } = await api.post<PriceAlertDto>('/price-alerts', request);
    return data;
  },

  listMyAlerts: async (activeOnly?: boolean): Promise<PriceAlertDto[]> => {
    const params: Record<string, boolean> = {};
    if (activeOnly !== undefined) {
      params.active = activeOnly;
    }
    const { data } = await api.get<PriceAlertDto[]>('/price-alerts/my', { params });
    return data;
  },

  deleteAlert: async (id: number): Promise<void> => {
    await api.delete(`/price-alerts/${id}`);
  },
};
