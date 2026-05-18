// ============================================================
// TODO [FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic]
//
// Zvono za notifikacije sa bedz-om broja neprocitanih. Komponenta se
// montira u Header.tsx i pokrece polling na svakih ~30s.
//
// IMPLEMENTIRATI:
//   - Props interfejs NotificationBellProps: nema obaveznih prop-a
//     (sve stanje je interno ili se uzima iz AuthContext-a)
//   - Stanje: unreadCount: number (default 0), pollingInterval: number (30_000 ms)
//   - Polling: useEffect sa setInterval koji zove notificationService.getUnreadCount()
//     svakih 30s dok je korisnik prijavljen (ocisti interval u cleanup). Paritet sa
//     auto-refresh periodom u SecuritiesListPage (30s interval, silent fetch).
//   - Prikaz: Lucide `Bell` ikona u Button variant="ghost" size="icon".
//     Ako unreadCount > 0 — prikazati mali crveni rounded-full bedz sa brojem
//     (pozicionirati apsolutno gornje-desno na dugmetu, tekst "9+" ako > 9).
//   - Klik: navigate('/notifications') (React Router useNavigate)
//   - data-testid="notification-bell" na dugmetu
//   - data-testid="notification-badge" na bedzu (renderovati samo ako count > 0)
//   - aria-label: "Notifikacije, {N} neprocitanih" kad count > 0;
//     "Notifikacije" kad count === 0
//   - Ne prikazivati komponetu ako korisnik nije prijavljen (proveriti useAuth())
//
// Konvencija: koristiti shadcn/ui Button iz '@/components/ui/button',
//   Lucide Bell ikonu iz 'lucide-react', useNavigate iz 'react-router-dom',
//   useAuth iz '@/context/AuthContext'. Videti ThemeToggle.tsx kao primer
//   kompaktnog shared-component obrasca.
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

export default function NotificationBell() {
  return <div data-testid="notification-bell" />;
}
