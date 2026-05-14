/**
 * Vitest za ArbitroSettingsDropdown.
 *
 * Plan v3.6 §Task 6 — agentic toggle premesten u panel header (ArbitroPanel).
 * Dropdown sad sadrzi samo TTS toggle + voice picker. Stari testovi za
 * "Agentic mode" toggle u dropdown-u uklonjeni (vidi ArbitroPanel.test.tsx
 * za hero toggle testove).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArbitroSettingsDropdown } from './ArbitroSettingsDropdown';

const setTtsEnabledMock = vi.fn();
let ttsEnabledMock = false;

vi.mock('../../context/useArbitro', () => ({
  useArbitro: () => ({
    ttsEnabled: ttsEnabledMock,
    setTtsEnabled: setTtsEnabledMock,
    ttsVoice: 'af_bella',
    setTtsVoice: vi.fn(),
  }),
}));

describe('ArbitroSettingsDropdown', () => {
  beforeEach(() => {
    setTtsEnabledMock.mockClear();
    ttsEnabledMock = false;
  });

  it('prikazuje gear ikonicu po default-u (zatvoren dropdown)', () => {
    render(<ArbitroSettingsDropdown />);
    expect(screen.getByLabelText('Podesavanja')).toBeInTheDocument();
    // Dropdown zatvoren — sadrzaj NIJE vidljiv
    expect(screen.queryByText(/Glas asistenta/i)).not.toBeInTheDocument();
  });

  it('otvara dropdown na klik gear-a i prikazuje TTS toggle', () => {
    render(<ArbitroSettingsDropdown />);
    fireEvent.click(screen.getByLabelText('Podesavanja'));
    expect(screen.getByText(/Glas asistenta/i)).toBeInTheDocument();
  });

  it('NE prikazuje agentic toggle u dropdown-u (premesten u hero)', () => {
    render(<ArbitroSettingsDropdown />);
    fireEvent.click(screen.getByLabelText('Podesavanja'));
    expect(screen.queryByText(/Agentic mode/i)).not.toBeInTheDocument();
  });

  it('TTS toggle aktivira setTtsEnabled', () => {
    render(<ArbitroSettingsDropdown />);
    fireEvent.click(screen.getByLabelText('Podesavanja'));
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(setTtsEnabledMock).toHaveBeenCalledWith(true);
  });
});
