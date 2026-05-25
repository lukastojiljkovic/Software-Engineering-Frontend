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
