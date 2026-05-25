import { describe, it } from 'vitest';

describe('notificationService', () => {
  it.todo('listNotifications GETs /notifications bez filtera');
  it.todo('listNotifications prosledjuje read=false filter kao query param');
  it.todo('listNotifications prosledjuje page i size kao query param-e');
  it.todo('getUnreadCount GETs /notifications/unread-count i vraca { count }');
  it.todo('markAsRead PATCHuje /notifications/{id}/read bez tela zahteva');
  it.todo('markAllAsRead PATCHuje /notifications/read-all bez tela zahteva');
});
