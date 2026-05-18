// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// Testovi za NotificationBell komponentu. Pratiti obrazac iz
// ThemeToggle.test.tsx: vi.mock za zavisnosti, render + screen assert.
//
// Pre pisanja testova:
//   - vi.mock('../services/notificationService', ...) sa vi.fn() za getUnreadCount
//   - vi.mock('@/context/AuthContext', ...) koji vraca user sa id-em (prijavljen)
//   - vi.mock('react-router-dom', ...) sa vi.fn() za useNavigate
//   - Koristiti vitest fake timers (vi.useFakeTimers / vi.useRealTimers) da
//     kontrolisete setInterval bez cekanja 30s u testovima
// ============================================================

import { describe, it } from 'vitest';

describe('NotificationBell', () => {
  it.todo('renderuje dugme sa data-testid="notification-bell"');
  it.todo('ne renderuje bedz kad je unreadCount === 0');
  it.todo('renderuje bedz sa brojem kad je unreadCount > 0');
  it.todo('prikazuje "9+" kad je unreadCount > 9');
  it.todo('poziva getUnreadCount pri mount-u i postavlja count');
  it.todo('pokrece polling na svakih 30s i azurira count');
  it.todo('cisti interval pri unmount-u (nema memory leak)');
  it.todo('klik na dugme navigira na /notifications');
  it.todo('aria-label sadrzi broj neprocitanih kad count > 0');
  it.todo('ne renderuje se kad korisnik nije prijavljen');
});
