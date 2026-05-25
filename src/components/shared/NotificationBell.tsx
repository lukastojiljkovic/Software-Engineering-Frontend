// ============================================================
// FE1 - In-app notifikacije + zaglavlje | Developer: Marta Suljagic
//
// Zvono za notifikacije sa bedz-om broja neprocitanih. Montira se u
// sidebar user kartici (ClientSidebar) i radi polling svakih 30s.
// Pauzira polling kad je tab sakriven (document.hidden) — bez WebSocket-a,
// nemamo potrebu da hamamo BE dok user nije na stranici.
//
// Spec: Zadaci_Frontend.pdf, FE1.
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';
import { cn } from '@/lib/utils';

const POLL_INTERVAL_MS = 30_000;

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const { count } = await notificationService.getUnreadCount();
      setUnreadCount(typeof count === 'number' && count >= 0 ? count : 0);
    } catch {
      // Tihi neuspeh — polling nastavlja, ne kvarimo UI.
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      void fetchCount();
    }, POLL_INTERVAL_MS);
  }, [fetchCount]);

  useEffect(() => {
    if (!user) return;

    // Inicijalan fetch + start interval-a.
    void fetchCount();
    if (!document.hidden) {
      startPolling();
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Pri povratku — odmah refresh + restart polling-a.
        void fetchCount();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopPolling();
    };
  }, [user, fetchCount, startPolling, stopPolling]);

  if (!user) return null;

  const displayCount = unreadCount > 9 ? '9+' : String(unreadCount);
  const ariaLabel =
    unreadCount > 0 ? `Notifikacije, ${unreadCount} neprocitanih` : 'Notifikacije';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative h-9 w-9 shrink-0"
      onClick={() => navigate('/notifications')}
      aria-label={ariaLabel}
      data-testid="notification-bell"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span
          data-testid="notification-badge"
          aria-hidden="true"
          className={cn(
            'absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center',
            'rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white',
            'shadow-sm ring-2 ring-background'
          )}
        >
          {displayCount}
        </span>
      )}
    </Button>
  );
}
