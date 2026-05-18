// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// HTTP klijent za rad sa /notifications endpoint-ima na BE-u.
// Izvozi named export `notificationService` (objekat sa metodama),
// isti pattern kao savingsService u src/services/savingsService.ts.
//
// IMPLEMENTIRATI (sve metode koriste `import api from './api'`):
//
//   listNotifications(params: { read?: boolean; page?: number; size?: number })
//     : Promise<NotificationPageDto<NotificationDto>>
//     — GET /notifications
//     — params: { read?: boolean, page?: number (default 0), size?: number (default 20) }
//     — vraca stranicu notifikacija; BE sortira po createdAt DESC
//
//   getUnreadCount(): Promise<UnreadCountDto>
//     — GET /notifications/unread-count
//     — vraca { count: number }; koristi se za polling u NotificationBell
//
//   markAsRead(id: number): Promise<void>
//     — PATCH /notifications/{id}/read
//     — oznacava jednu notifikaciju kao procitanu; nema tela zahteva
//
//   markAllAsRead(): Promise<void>
//     — PATCH /notifications/read-all
//     — oznacava SVE neprocitane notifikacije korisnika kao procitane
//
// Tipove (NotificationDto, NotificationPageDto, UnreadCountDto) uvesti iz
// '../types/notification' (kada developer implementira types/notification.ts).
//
// Konvencija: pratiti src/services/savingsService.ts — named export,
//   const objekt sa async arrow funkcijama, destrukturisanje `{ data }` iz
//   axios odgovora, nikakav try/catch (greske propagiraju ka pozivaocu).
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

export {};
