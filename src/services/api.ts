import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { AUTH_UNAUTHORIZED_EVENT } from './authEvents';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Re-export za backwards-compat (FE-SHR-01). AuthContext sada importuje
// direktno iz `./authEvents` da se izbegnu test brittleness-i sa api mockom.
export { AUTH_UNAUTHORIZED_EVENT };

function emitUnauthorized() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: dodaj JWT token u svaki zahtev
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// FE-SHR-02: deduplikuj paralelne refresh pozive. Bez ovoga, 5 paralelnih 401
// pucanja pokrene 5 zahteva ka /auth/refresh; samo prvi uspeva (refresh tokens
// su one-shot), ostalih 4 dobijaju 401 → user izbacen iz aplikacije iako je
// jedan refresh prosao.
let refreshPromise: Promise<string> | null = null;

async function doActualRefresh(): Promise<string> {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data;
  sessionStorage.setItem('accessToken', accessToken);
  if (newRefreshToken) {
    sessionStorage.setItem('refreshToken', newRefreshToken);
  }
  return accessToken;
}

async function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = doActualRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Internal flag tip — `_retry` se setuje na originalRequest da spreci infinitu
// petlju ako refresh prodje ali zahtev jos uvek vraca 401.
type RetryableRequest = AxiosRequestConfig & { _retry?: boolean };

// Response interceptor: auto-refresh token na 401 + emit unauthorized event ako refresh padne
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    const isAuthEndpoint =
      typeof originalRequest?.url === 'string' && originalRequest.url.includes('/auth/');

    // Ne diraj 401 sa /auth/* endpoint-a (login/refresh) — prosledi dalje da UI obradi gresku
    if (error.response?.status !== 401 || isAuthEndpoint || !originalRequest) {
      return Promise.reject(error);
    }

    // Ako smo vec pokusali retry, refresh je propao — emit unauthorized event
    if (originalRequest._retry) {
      sessionStorage.clear();
      emitUnauthorized();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      sessionStorage.clear();
      emitUnauthorized();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
