// Shared event ime za auth unauthorized notifikaciju izmedju api.ts (emitter
// pri refresh failure) i AuthContext-a (listener koji radi logout + navigate).
// Izdvojeno iz `api.ts` da se izbegne brittle dependency u testovima koji
// mock-uju ceo `services/api` modul (FE-SHR-01, 25.05.2026).
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';
