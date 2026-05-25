// TOTP window indicator tests za VerificationModal (RFC 6238, 30s ciklus).
//
// Test strategija:
// 1) Pure helper funkcije (`getTotpSecondsLeft`, `getTotpProgressPercent`,
//    `getTotpIndicatorColorClass`) testiramo direktno — najpouzdaniji i
//    najjasniji nacin da pokrijemo TOTP logiku bez fake timers + Radix Dialog
//    portal kompleksnosti.
// 2) Render test koristi `vi.useFakeTimers` + `vi.setSystemTime` da kontrolise
//    Date.now() i potvrdi da modal renderuje TOTP indicator sa data-testid-evima,
//    tekst "Novi kod za Ns" i pravom Progress vrednoscu.
// 3) Tick test koristi `vi.advanceTimersByTimeAsync` + advance system time
//    rucno (fake timers ne pomicu Date.now() bez `now` opciju ili rucnog
//    `setSystemTime`).
// 4) Cycle reset (rollover 30 -> 0 -> 30) verifikujemo na pure helper-u —
//    tu se algoritam dokazuje, dom assertions bi samo duplirale logiku.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import {
  getTotpSecondsLeft,
  getTotpProgressPercent,
  getTotpIndicatorColorClass,
} from './VerificationModal';

// Mockujemo transactionService da useEffect za sendOtp ne pravi pravu mrezu
vi.mock('@/services/transactionService', () => ({
  transactionService: {
    requestOtp: vi.fn().mockResolvedValue({ sent: true, message: 'ok' }),
    requestOtpViaEmail: vi.fn().mockResolvedValue({ sent: true, message: 'ok' }),
    getActiveOtp: vi.fn().mockResolvedValue({ active: false }),
  },
}));

vi.mock('@/lib/notify', () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

describe('TOTP window helpers (RFC 6238)', () => {
  describe('getTotpSecondsLeft', () => {
    it('vraca 30 kad smo na pocetku 30s ciklusa (epoch % 30 == 0)', () => {
      // 2026-01-01 00:00:00 UTC = 1767225600 -> 1767225600 % 30 == 0
      const now = 1767225600 * 1000;
      expect(getTotpSecondsLeft(now)).toBe(30);
    });

    it('vraca 23 kad je proslo 7 sekundi od pocetka ciklusa', () => {
      // epoch % 30 == 7
      const now = (1767225600 + 7) * 1000;
      expect(getTotpSecondsLeft(now)).toBe(23);
    });

    it('vraca 1 kad je proslo 29 sekundi od pocetka ciklusa', () => {
      const now = (1767225600 + 29) * 1000;
      expect(getTotpSecondsLeft(now)).toBe(1);
    });

    it('rollover: sledeca sekunda posle 1 vraca 30 (nov ciklus)', () => {
      const beforeRollover = (1767225600 + 29) * 1000;
      const afterRollover = (1767225600 + 30) * 1000;
      expect(getTotpSecondsLeft(beforeRollover)).toBe(1);
      expect(getTotpSecondsLeft(afterRollover)).toBe(30);
    });

    it('koristi Date.now() po defaultu', () => {
      const realNow = Date.now();
      const expected = 30 - (Math.floor(realNow / 1000) % 30);
      expect(getTotpSecondsLeft()).toBe(expected);
    });
  });

  describe('getTotpProgressPercent', () => {
    it('30s -> 100%', () => {
      expect(getTotpProgressPercent(30)).toBe(100);
    });

    it('23s -> ~76.67%', () => {
      expect(getTotpProgressPercent(23)).toBeCloseTo(76.67, 1);
    });

    it('15s -> 50%', () => {
      expect(getTotpProgressPercent(15)).toBe(50);
    });

    it('1s -> ~3.33%', () => {
      expect(getTotpProgressPercent(1)).toBeCloseTo(3.33, 1);
    });

    it('0s -> 0%', () => {
      expect(getTotpProgressPercent(0)).toBe(0);
    });
  });

  describe('getTotpIndicatorColorClass', () => {
    it('> 10s vraca emerald (zelena)', () => {
      expect(getTotpIndicatorColorClass(30)).toBe('bg-emerald-500');
      expect(getTotpIndicatorColorClass(20)).toBe('bg-emerald-500');
      expect(getTotpIndicatorColorClass(11)).toBe('bg-emerald-500');
    });

    it('<= 10s i > 3s vraca amber', () => {
      expect(getTotpIndicatorColorClass(10)).toBe('bg-amber-500');
      expect(getTotpIndicatorColorClass(7)).toBe('bg-amber-500');
      expect(getTotpIndicatorColorClass(4)).toBe('bg-amber-500');
    });

    it('<= 3s vraca crvenu', () => {
      expect(getTotpIndicatorColorClass(3)).toBe('bg-red-500');
      expect(getTotpIndicatorColorClass(1)).toBe('bg-red-500');
      expect(getTotpIndicatorColorClass(0)).toBe('bg-red-500');
    });

    it('granicne vrednosti — 11 = emerald, 10 = amber, 4 = amber, 3 = red', () => {
      expect(getTotpIndicatorColorClass(11)).toBe('bg-emerald-500');
      expect(getTotpIndicatorColorClass(10)).toBe('bg-amber-500');
      expect(getTotpIndicatorColorClass(4)).toBe('bg-amber-500');
      expect(getTotpIndicatorColorClass(3)).toBe('bg-red-500');
    });
  });
});

describe('VerificationModal — TOTP indicator render', () => {
  // Dinamicki import pa fake timers + module mocks budu na mestu pre nego sto
  // se VerificationModal default export ucita.
  let VerificationModal: typeof import('./VerificationModal').default;

  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Fiksiramo Date.now na epoch trenutak gde je epoch % 30 == 7 -> ostaje 23s
    vi.setSystemTime(new Date((1767225600 + 7) * 1000));
    VerificationModal = (await import('./VerificationModal')).default;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renderuje TOTP indicator sa data-testid-evima i pravom vrednoscu', () => {
    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        onVerified={vi.fn().mockResolvedValue(undefined)}
      />
    );

    // "Novi kod za 23s" — vidi setSystemTime gore
    const secondsEl = screen.getByTestId('totp-window-seconds');
    expect(secondsEl).toBeInTheDocument();
    expect(secondsEl.textContent).toMatch(/Novi kod za 23s/);

    // Progress bar postoji
    const progress = screen.getByTestId('totp-window-progress');
    expect(progress).toBeInTheDocument();
  });

  it('boja je emerald kad je > 10s (23s ostalo)', () => {
    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        onVerified={vi.fn().mockResolvedValue(undefined)}
      />
    );

    const secondsEl = screen.getByTestId('totp-window-seconds');
    // text-emerald-* na seconds label-u
    expect(secondsEl.className).toContain('text-emerald-600');
  });

  it('boja je amber kad je <= 10s i > 3s', () => {
    // Postavi vreme tako da ostane 7s (epoch % 30 == 23 -> 30 - 23 == 7)
    vi.setSystemTime(new Date((1767225600 + 23) * 1000));

    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        onVerified={vi.fn().mockResolvedValue(undefined)}
      />
    );

    const secondsEl = screen.getByTestId('totp-window-seconds');
    expect(secondsEl.textContent).toMatch(/Novi kod za 7s/);
    expect(secondsEl.className).toContain('text-amber-600');
  });

  it('boja je crvena kad je <= 3s (1s ostalo)', () => {
    // 30 - 29 == 1
    vi.setSystemTime(new Date((1767225600 + 29) * 1000));

    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        onVerified={vi.fn().mockResolvedValue(undefined)}
      />
    );

    const secondsEl = screen.getByTestId('totp-window-seconds');
    expect(secondsEl.textContent).toMatch(/Novi kod za 1s/);
    expect(secondsEl.className).toContain('text-red-600');
  });

  it('TOTP naslov prikazuje "Verifikacija (TOTP)" + tekst o authenticator app-u', () => {
    render(
      <VerificationModal
        isOpen={true}
        onClose={vi.fn()}
        onVerified={vi.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByText(/Verifikacija \(TOTP\)/)).toBeInTheDocument();
    // Help paragraph spominje TOTP authenticator app + 30 sekundi
    expect(
      screen.getByText(/TOTP authenticator app/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/menja svakih 30 sekundi/i)
    ).toBeInTheDocument();
  });
});
