// Tipovi za mapu lokacija (ekspoziture + bankomati) — dodato 14.05.2026 vece-4.
// Spec: Info o predmetu/2026-05-14-branches-map-design.md

export type BranchType = 'BRANCH' | 'ATM';

export interface Branch {
  id: number;
  name: string;
  type: BranchType;
  address: string;
  /** WGS84 latitude, npr. 44.787123 (centar Beograda) */
  latitude: number;
  /** WGS84 longitude, npr. 20.456789 */
  longitude: number;
  /** Free-text radno vreme (npr. "08-16 radnim danima", "00-24") */
  openingHours: string;
  /** Samo ATM moze imati 24h. */
  has24h: boolean;
  /** Samo ATM moze imati drive-through. */
  hasDriveThrough: boolean;
  createdAt: string;
}

export interface BranchFilters {
  type?: BranchType;
  has24h?: boolean;
  hasDriveThrough?: boolean;
  search?: string;
}
