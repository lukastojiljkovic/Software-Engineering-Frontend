import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../services/api';
import { notificationService } from '../services/notificationService';

vi.mock('../services/api');
const mockApi = vi.mocked(api);

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listNotifications GETs /notifications with no params by default', async () => {
    mockApi.get.mockResolvedValue({
      data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 },
    });
    const result = await notificationService.listNotifications();
    expect(mockApi.get).toHaveBeenCalledWith('/notifications', { params: {} });
    expect(result.totalElements).toBe(0);
  });

  it('listNotifications forwards read/page/size params', async () => {
    mockApi.get.mockResolvedValue({
      data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 },
    });
    await notificationService.listNotifications({ read: false, page: 2, size: 10 });
    expect(mockApi.get).toHaveBeenCalledWith('/notifications', {
      params: { read: false, page: 2, size: 10 },
    });
  });

  it('listNotifications passes only read=true filter', async () => {
    mockApi.get.mockResolvedValue({
      data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 },
    });
    await notificationService.listNotifications({ read: true });
    expect(mockApi.get).toHaveBeenCalledWith('/notifications', {
      params: { read: true },
    });
  });

  it('getUnreadCount GETs /notifications/unread-count and returns count', async () => {
    mockApi.get.mockResolvedValue({ data: { count: 5 } });
    const result = await notificationService.getUnreadCount();
    expect(mockApi.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(result.count).toBe(5);
  });

  it('markAsRead PATCHes /notifications/:id/read', async () => {
    mockApi.patch.mockResolvedValue({ data: undefined });
    await notificationService.markAsRead(42);
    expect(mockApi.patch).toHaveBeenCalledWith('/notifications/42/read');
  });

  it('markAllAsRead PATCHes /notifications/read-all', async () => {
    mockApi.patch.mockResolvedValue({ data: undefined });
    await notificationService.markAllAsRead();
    expect(mockApi.patch).toHaveBeenCalledWith('/notifications/read-all');
  });
});
