import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotificationBell from '../components/shared/NotificationBell';
import { notificationService } from '../services/notificationService';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockNavigate = vi.fn();
let mockUser: Record<string, unknown> | null = null;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAdmin: false,
    isSupervisor: false,
    isAgent: false,
    logout: vi.fn(),
    hasPermission: () => false,
  }),
}));

vi.mock('../services/notificationService', () => ({
  notificationService: {
    getUnreadCount: vi.fn(),
  },
}));

const mockGetUnreadCount = vi.mocked(notificationService.getUnreadCount);

function renderBell() {
  return render(
    <MemoryRouter>
      <NotificationBell />
    </MemoryRouter>
  );
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: hidden,
  });
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { id: 1, email: 'c@b.rs', firstName: 'A', lastName: 'B', role: 'CLIENT' };
    mockGetUnreadCount.mockResolvedValue({ count: 0 });
    setHidden(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render when user is null', () => {
    mockUser = null;
    const { container } = renderBell();
    expect(container.querySelector('[data-testid="notification-bell"]')).toBeNull();
  });

  it('renders bell button when user is logged in', async () => {
    renderBell();
    expect(await screen.findByTestId('notification-bell')).toBeTruthy();
  });

  it('shows no badge when unread count is 0', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 0 });
    renderBell();
    await waitFor(() => expect(mockGetUnreadCount).toHaveBeenCalled());
    expect(screen.queryByTestId('notification-badge')).toBeNull();
  });

  it('shows badge with count when unread > 0', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 3 });
    renderBell();
    const badge = await screen.findByTestId('notification-badge');
    expect(badge.textContent).toBe('3');
  });

  it('shows "9+" when unread count is greater than 9', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 25 });
    renderBell();
    const badge = await screen.findByTestId('notification-badge');
    expect(badge.textContent).toBe('9+');
  });

  it('sets aria-label with count when unread > 0', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 4 });
    renderBell();
    await waitFor(() => {
      const btn = screen.getByTestId('notification-bell');
      expect(btn.getAttribute('aria-label')).toBe('Notifikacije, 4 neprocitanih');
    });
  });

  it('sets neutral aria-label when no unread', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 0 });
    renderBell();
    await waitFor(() => {
      const btn = screen.getByTestId('notification-bell');
      expect(btn.getAttribute('aria-label')).toBe('Notifikacije');
    });
  });

  it('navigates to /notifications on click', async () => {
    mockGetUnreadCount.mockResolvedValue({ count: 0 });
    renderBell();
    const btn = await screen.findByTestId('notification-bell');
    const user = userEvent.setup();
    await user.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/notifications');
  });

  it('polls getUnreadCount every 30 seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockGetUnreadCount.mockResolvedValue({ count: 1 });
    renderBell();
    // Initial fetch
    await vi.waitFor(() => expect(mockGetUnreadCount).toHaveBeenCalledTimes(1));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(mockGetUnreadCount.mock.calls.length).toBeGreaterThanOrEqual(2);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(mockGetUnreadCount.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  it('pauses polling when document is hidden and resumes on visible', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockGetUnreadCount.mockResolvedValue({ count: 0 });
    renderBell();
    await vi.waitFor(() => expect(mockGetUnreadCount).toHaveBeenCalledTimes(1));

    // Hide tab — stop polling
    act(() => {
      setHidden(true);
    });
    const callsAfterHide = mockGetUnreadCount.mock.calls.length;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000);
    });
    expect(mockGetUnreadCount.mock.calls.length).toBe(callsAfterHide);

    // Show tab — immediate fetch + restart polling
    act(() => {
      setHidden(false);
    });
    await vi.waitFor(() =>
      expect(mockGetUnreadCount.mock.calls.length).toBeGreaterThan(callsAfterHide)
    );
  });
});
