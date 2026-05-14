/**
 * Vitest za ArbitroActionModal — testira preview UI + confirm/reject flow.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ArbitroActionModal } from './ArbitroActionModal';
import type { AgentActionPreview, AgentActionResult } from '../../types/arbitro';

const confirmActionMock = vi.fn<(otpCode?: string, edited?: Record<string, unknown>) => Promise<AgentActionResult>>();
const rejectActionMock = vi.fn<() => Promise<void>>();
let pendingActionMock: AgentActionPreview | null = null;

vi.mock('../../context/useArbitro', () => ({
  useArbitro: () => ({
    pendingAction: pendingActionMock,
    confirmAction: confirmActionMock,
    rejectAction: rejectActionMock,
  }),
}));

vi.mock('../shared/VerificationModal', () => ({
  default: ({ isOpen, onVerified }: { isOpen: boolean; onVerified: (code: string) => Promise<void> }) =>
    isOpen ? (
      <div data-testid="verification-modal">
        <button type="button" onClick={() => void onVerified('123456')}>
          MOCK VERIFY
        </button>
      </div>
    ) : null,
}));

vi.mock('@/lib/notify', () => ({
  toast: { success: vi.fn(), info: vi.fn(), error: vi.fn() },
}));

describe('ArbitroActionModal', () => {
  beforeEach(() => {
    confirmActionMock.mockReset();
    rejectActionMock.mockReset();
    pendingActionMock = null;
  });

  it('ne renderuje se kad nema pending akcije', () => {
    pendingActionMock = null;
    const { container } = render(<ArbitroActionModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renderuje preview kad postoji pending akcija', () => {
    pendingActionMock = {
      actionUuid: 'uuid-1',
      tool: 'create_payment',
      summary: 'Placanje 5000 RSD Stefanu',
      parameters: { 'Sa racuna': '222****3456', Iznos: '5000 RSD' },
      warnings: [],
      requiresOtp: true,
      expiresAt: '',
    };
    render(<ArbitroActionModal />);
    // Plan v3.6 §Task 7 — summary se renderuje 2x (PreviewCard + Dialog.Description).
    // Koristimo getAllByText (oba treba da postoje).
    expect(screen.getAllByText('Placanje 5000 RSD Stefanu').length).toBeGreaterThanOrEqual(1);
    // "Sa racuna" se isto pojavljuje 2x — u PreviewCard fields i u editable dl.
    expect(screen.getAllByText('Sa racuna').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('222****3456').length).toBeGreaterThanOrEqual(1);
  });

  it('prikazuje warnings ako postoje', () => {
    pendingActionMock = {
      actionUuid: 'uuid-2',
      tool: 'create_payment',
      summary: 'Placanje',
      parameters: {},
      warnings: ['Inter-bank placanje moze trajati 5 min'],
      requiresOtp: false,
      expiresAt: '',
    };
    render(<ArbitroActionModal />);
    // Plan v3.6 §Task 7 — warnings renderuju i u PreviewCard i u inline alert-u.
    expect(screen.getAllByText(/Inter-bank/).length).toBeGreaterThanOrEqual(1);
  });

  it('klik POTVRDI bez OTP-a poziva confirmAction direktno', async () => {
    pendingActionMock = {
      actionUuid: 'uuid-3',
      tool: 'cancel_order',
      summary: 'Otkazivanje order-a',
      parameters: {},
      warnings: [],
      requiresOtp: false,
      expiresAt: '',
    };
    confirmActionMock.mockResolvedValue({ status: 'EXECUTED' });
    render(<ArbitroActionModal />);
    fireEvent.click(screen.getByRole('button', { name: /POTVRDI/i }));
    await waitFor(() => {
      // Phase 5 polish — confirmAction sad prima drugi argument
      // (editedParameters), null/undefined ako nema inline edit-a.
      expect(confirmActionMock).toHaveBeenCalled();
      expect(confirmActionMock.mock.calls[0][0]).toBeUndefined();
    });
  });

  it('klik POTVRDI sa OTP-om otvara VerificationModal', () => {
    pendingActionMock = {
      actionUuid: 'uuid-4',
      tool: 'create_payment',
      summary: 'Placanje',
      parameters: {},
      warnings: [],
      requiresOtp: true,
      expiresAt: '',
    };
    render(<ArbitroActionModal />);
    fireEvent.click(screen.getByRole('button', { name: /POTVRDI/i }));
    expect(screen.getByTestId('verification-modal')).toBeInTheDocument();
  });

  it('klik ODBACI poziva rejectAction', async () => {
    pendingActionMock = {
      actionUuid: 'uuid-5',
      tool: 'create_payment',
      summary: 'X',
      parameters: {},
      warnings: [],
      requiresOtp: false,
      expiresAt: '',
    };
    rejectActionMock.mockResolvedValue();
    render(<ArbitroActionModal />);
    fireEvent.click(screen.getByText('ODBACI'));
    await waitFor(() => {
      expect(rejectActionMock).toHaveBeenCalled();
    });
  });
});
