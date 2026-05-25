import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Hoisted mocks — vi.hoisted garantuje da postoje pre vi.mock factory-ja.
const mocks = vi.hoisted(() => {
  type ResponseHandler = (config: Record<string, unknown>) => Promise<unknown>;
  type ErrorHandler = (error: unknown) => Promise<unknown>;

  interface InterceptorState {
    responseFulfilled: ResponseHandler | undefined;
    responseRejected: ErrorHandler | undefined;
    requestFulfilled: ResponseHandler | undefined;
    requestRejected: ErrorHandler | undefined;
  }

  const state: InterceptorState = {
    responseFulfilled: undefined,
    responseRejected: undefined,
    requestFulfilled: undefined,
    requestRejected: undefined,
  };

  const responseUse = vi.fn((onFulfilled?: ResponseHandler, onRejected?: ErrorHandler) => {
    state.responseFulfilled = onFulfilled;
    state.responseRejected = onRejected;
    return 0;
  });

  const requestUse = vi.fn((onFulfilled?: ResponseHandler, onRejected?: ErrorHandler) => {
    state.requestFulfilled = onFulfilled;
    state.requestRejected = onRejected;
    return 0;
  });

  const apiCallable = vi.fn((config: Record<string, unknown>) =>
    Promise.resolve({ data: { retried: true, headers: config.headers }, status: 200, config })
  );

  const axiosPost = vi.fn();

  return { state, responseUse, requestUse, apiCallable, axiosPost };
});

vi.mock('axios', () => {
  const factory = () =>
    Object.assign(mocks.apiCallable, {
      interceptors: {
        request: { use: mocks.requestUse },
        response: { use: mocks.responseUse },
      },
    });
  return {
    default: {
      create: vi.fn(factory),
      post: mocks.axiosPost,
    },
    isAxiosError: () => true,
  };
});

// Import POSLE mocka da modul izvrsi `axios.create` sa nasim stubom.
import '../services/api';
import { AUTH_UNAUTHORIZED_EVENT } from '../services/authEvents';

// Helper: konstruise 401 error sa originalRequest config-om.
function build401Error(url: string, retry = false) {
  return {
    response: { status: 401, data: { message: 'Unauthorized' } },
    config: {
      url,
      headers: {},
      _retry: retry,
    },
  };
}

describe('api.ts interceptor', () => {
  beforeEach(() => {
    sessionStorage.clear();
    mocks.axiosPost.mockReset();
    mocks.apiCallable.mockClear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('passes 401 from /auth/ endpoint without retry', async () => {
    const onReject = mocks.state.responseRejected;
    expect(onReject).toBeDefined();

    const err = build401Error('/auth/login');
    await expect(onReject!(err)).rejects.toBe(err);
    expect(mocks.axiosPost).not.toHaveBeenCalled();
  });

  it('passes through non-401 errors', async () => {
    const onReject = mocks.state.responseRejected!;
    const err = {
      response: { status: 500, data: {} },
      config: { url: '/orders' },
    };
    await expect(onReject(err)).rejects.toBe(err);
    expect(mocks.axiosPost).not.toHaveBeenCalled();
  });

  it('emits AUTH_UNAUTHORIZED_EVENT and clears session when retry already attempted', async () => {
    sessionStorage.setItem('accessToken', 'old');
    sessionStorage.setItem('refreshToken', 'rt');

    const listener = vi.fn();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);

    const onReject = mocks.state.responseRejected!;
    const err = build401Error('/orders', /* retry */ true);

    await expect(onReject(err)).rejects.toBe(err);
    expect(sessionStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('refreshToken')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
  });

  it('emits AUTH_UNAUTHORIZED_EVENT when no refresh token present', async () => {
    // No refreshToken — doActualRefresh baca, catch grana emit-uje event
    sessionStorage.setItem('accessToken', 'old');

    const listener = vi.fn();
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, listener);

    const onReject = mocks.state.responseRejected!;
    const err = build401Error('/orders');

    await expect(onReject(err)).rejects.toBeDefined();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('accessToken')).toBeNull();

    window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, listener);
  });

  it('refreshes token and retries original request on 401', async () => {
    sessionStorage.setItem('accessToken', 'old');
    sessionStorage.setItem('refreshToken', 'rt');
    mocks.axiosPost.mockResolvedValue({
      data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
    });

    const onReject = mocks.state.responseRejected!;
    const err = build401Error('/orders');

    const result = await onReject(err);

    expect(mocks.axiosPost).toHaveBeenCalledOnce();
    expect(sessionStorage.getItem('accessToken')).toBe('new-access');
    expect(sessionStorage.getItem('refreshToken')).toBe('new-refresh');
    expect(mocks.apiCallable).toHaveBeenCalledOnce();
    expect((result as { data: { retried: boolean } }).data.retried).toBe(true);
  });

  // FE-SHR-02: dedup paralelnih refresh poziva
  it('deduplicates parallel refresh calls (5 paralelnih 401 -> 1 refresh call)', async () => {
    sessionStorage.setItem('accessToken', 'old');
    sessionStorage.setItem('refreshToken', 'rt');

    let resolveRefresh: ((value: { data: { accessToken: string } }) => void) | undefined;
    mocks.axiosPost.mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      })
    );

    const onReject = mocks.state.responseRejected!;

    // 5 paralelnih 401 zahteva (svaki ima svoj originalRequest)
    const errors = Array.from({ length: 5 }, (_, i) => build401Error(`/orders/${i}`));
    const promises = errors.map((e) => onReject(e));

    // Sacekaj microtask-ove da svi se ulancaju u refreshAccessToken
    await Promise.resolve();
    await Promise.resolve();

    // Samo JEDAN poziv ka /auth/refresh
    expect(mocks.axiosPost).toHaveBeenCalledTimes(1);

    // Resolve refresh + pusti sve original retries da prodju
    resolveRefresh!({ data: { accessToken: 'fresh-token' } });
    await Promise.all(promises);

    expect(sessionStorage.getItem('accessToken')).toBe('fresh-token');
    // apiCallable je pozvan 5 puta (jedan po originalRequest-u)
    expect(mocks.apiCallable).toHaveBeenCalledTimes(5);
    // Ali refresh — i dalje samo jedan
    expect(mocks.axiosPost).toHaveBeenCalledTimes(1);
  });
});
