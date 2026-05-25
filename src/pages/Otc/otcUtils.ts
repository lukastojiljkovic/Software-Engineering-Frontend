// FIX FE-OTC-03: shared "isMe" pattern za OtcContractsPage + OtcNegotiationsPage.
// Klijent JWT cesto nema pouzdan `id` claim, a `clientService.getAll` je za
// CLIENT-a cesto 403. BE vec filtrira na "moje" ponude/ugovore, pa identitet
// unutar tog skupa razresavamo i preko normalizovanog imena (NFD + skidanje
// diakritike).

const normalizeName = (s: string | undefined) =>
  // NFD razbija "ć" → "c" + U+0301, sl., pa skidamo sve combining diacritice
  // (U+0300–U+036F).
  (s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

export interface IsMeUser {
  id?: number | null;
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Vraca matcher koji proverava da li (partyId, partyName) pripada trenutnom
 * korisniku. Prvo proba JWT id, pa pada na normalizovano poredjenje imena
 * (ako su oba name-a nepuna ili user-id == 0).
 */
export function createIsMeMatcher(user: IsMeUser | null | undefined) {
  const userId = user?.id ?? 0;
  const myFullName = normalizeName(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`);

  return (partyId: number, partyName: string): boolean => {
    if (userId > 0 && userId === partyId) return true;
    if (myFullName.length === 0) return false;
    return normalizeName(partyName) === myFullName;
  };
}
