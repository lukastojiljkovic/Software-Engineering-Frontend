// ============================================================
// FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic
//
// HTTP klijent za rad sa /notifications endpoint-ima na BE-u.
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

import api from './api';
import type {
  NotificationDto,
  NotificationPageDto,
  UnreadCountDto,
} from '../types/notification';

interface ListParams {
  read?: boolean;
  page?: number;
  size?: number;
}

export const notificationService = {
  listNotifications: async (
    params: ListParams = {}
  ): Promise<NotificationPageDto<NotificationDto>> => {
    const query: Record<string, unknown> = {};
    if (typeof params.read === 'boolean') query.read = params.read;
    if (typeof params.page === 'number') query.page = params.page;
    if (typeof params.size === 'number') query.size = params.size;
    const { data } = await api.get<NotificationPageDto<NotificationDto>>(
      '/notifications',
      { params: query }
    );
    return data;
  },

  getUnreadCount: async (): Promise<UnreadCountDto> => {
    const { data } = await api.get<UnreadCountDto>('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.patch<void>(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch<void>('/notifications/read-all');
  },
};
