import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// ─── Runtime config defaults za sve testove ────────────────────────────────
// W1-T1: simuliraj `/config.js` injection u test okruzenju. window._env_ je
// primarni izvor runtime config-a (vidi src/config/runtime.ts); fallback ka
// import.meta.env.VITE_* je za local `npm run dev` (Vite mode === 'development').
// U test mode-u Vite ne ucitava .env.development pa stub-ujemo VITE_API_URL
// rucno da bi runtime.test.ts mogao da verifikuje fallback chain.
if (typeof window !== 'undefined') {
  window._env_ = {
    API_URL: '/api',
    OUR_BANK_CODE: 'RN-222',
    ENV: 'test',
  };
}
vi.stubEnv('VITE_API_URL', 'http://localhost:8080');
vi.stubEnv('VITE_OUR_BANK_CODE', 'RN-222');
// Namerno NE stub-ujemo VITE_ENV jer runtime.test.ts treba 'unknown' fallback
// kad je window._env_ undefined — to verifikuje da getEnv() chain ne curi
// vrednost iz import.meta.env kada nema setovan.

// Mock window.matchMedia for components that use it (dark mode, etc.)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Mock URL.createObjectURL / revokeObjectURL (used for PDF downloads)
if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:mock-url');
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = vi.fn();
}

// Mock window.confirm
window.confirm = vi.fn(() => true);

// Mock pointer capture methods required by Radix UI in jsdom
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}

// Mock scrollIntoView (not implemented in jsdom)
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
