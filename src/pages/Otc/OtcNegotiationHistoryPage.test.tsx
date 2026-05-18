// ============================================================
// TODO [FE4 - Dividende + statistika fondova + istorija OTC | Developer: Jovan Krunic]
//
// Testovi za OtcNegotiationHistoryPage.
//
// IMPLEMENTIRATI (posle implementacije komponente):
//   - Mock otcService metode za istoriju pregovora (lista sa ACTIVE, ACCEPTED, DECLINED)
//   - Mock useAuth hook (CLIENT rola, user.id = 1)
//   - Svaki test koristi MemoryRouter wrapper (kao u OtcNegotiationsPage.test.tsx)
//
// Planirani test slucajevi:
//   1. 'renderuje page header sa naslovom "Istorija OTC pregovora"'
//   2. 'prikazuje skeleton dok se ucitava'
//   3. 'prikazuje tabelu pregovora posle uspesnog fetch-a'
//   4. 'prikazuje prazno stanje kad nema pregovora'
//   5. 'filter po statusu ACCEPTED sakriva ACTIVE i DECLINED redove'
//   6. 'filter po statusu DECLINED sakriva ACTIVE i ACCEPTED redove'
//   7. 'pretraga po ticker-u filtrira redove koji ne sadrze uneti ticker'
//   8. 'badge status ACCEPTED prikazuje se zeleno (variant success)'
//   9. 'badge status DECLINED prikazuje se sivo (variant secondary)'
//  10. 'expand/collapse kontraponuda sekcije prikazuje lanac promena cene'
//  11. 'VI badge se prikazuje pored kupca kad je current user kupac'
//  12. 'greska pri fetch-u prikazuje toast error'
// ============================================================

import { describe, it } from 'vitest';

describe('OtcNegotiationHistoryPage', () => {
  it.todo('renderuje page header sa naslovom "Istorija OTC pregovora"');
  it.todo('prikazuje skeleton dok se ucitava');
  it.todo('prikazuje tabelu pregovora posle uspesnog fetch-a');
  it.todo('prikazuje prazno stanje kad nema pregovora');
  it.todo('filter po statusu ACCEPTED sakriva ACTIVE i DECLINED redove');
  it.todo('filter po statusu DECLINED sakriva ACTIVE i ACCEPTED redove');
  it.todo('pretraga po ticker-u filtrira redove koji ne sadrze uneti ticker');
  it.todo('badge status ACCEPTED prikazuje se zeleno (variant success)');
  it.todo('badge status DECLINED prikazuje se sivo (variant secondary)');
  it.todo('expand/collapse kontraponuda sekcije prikazuje lanac promena cene');
  it.todo('VI badge se prikazuje pored kupca kad je current user kupac');
  it.todo('greska pri fetch-u prikazuje toast error');
});
