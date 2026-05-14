import { useEffect, useState } from 'react';
import { Search, MapPin, Building2, Banknote, Clock, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/notify';
import type { BranchType } from '@/types/branches';

interface BranchFiltersProps {
  // Single source of truth — kontrolisano iz parent-a (BranchesPage).
  typeFilter: BranchType | 'ALL';
  has24h: boolean;
  hasDriveThrough: boolean;
  search: string;
  onTypeFilterChange: (val: BranchType | 'ALL') => void;
  onHas24hChange: (val: boolean) => void;
  onHasDriveThroughChange: (val: boolean) => void;
  onSearchChange: (val: string) => void;
  /** Callback kad korisnik klikne "Najblize meni" — prima lat/lon korisnika. */
  onLocateMe: (lat: number, lon: number) => void;
}

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return ((...args: never[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

export function BranchFilters({
  typeFilter,
  has24h,
  hasDriveThrough,
  search,
  onTypeFilterChange,
  onHas24hChange,
  onHasDriveThroughChange,
  onSearchChange,
  onLocateMe,
}: BranchFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const debounced = debounce((val: string) => onSearchChange(val), 300);
    debounced(localSearch as unknown as never);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error('Brauzer ne podrzava geolokaciju.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocateMe(pos.coords.latitude, pos.coords.longitude);
        toast.success('Mapa centrirana na vasu lokaciju.');
        setLocating(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Geolokacija je odbijena. Prikazujemo sve lokacije.');
        } else {
          toast.warning('Lokacija nije dobavljena. Prikazujemo sve lokacije.');
        }
        setLocating(false);
      },
      { timeout: 5000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      {/* Search + Locate me */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Pretraga po imenu ili adresi..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9"
            data-testid="branch-search-input"
          />
        </div>
        <Button
          variant="outline"
          onClick={handleLocateMe}
          disabled={locating}
          data-testid="branch-locate-me"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {locating ? 'Trazi lokaciju...' : 'Najblize meni'}
        </Button>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        <FilterChip active={typeFilter === 'ALL'} onClick={() => onTypeFilterChange('ALL')} testId="filter-all">
          <span>Sve</span>
        </FilterChip>
        <FilterChip active={typeFilter === 'BRANCH'} onClick={() => onTypeFilterChange('BRANCH')} testId="filter-branch">
          <Building2 className="h-3.5 w-3.5" />
          <span>Ekspoziture</span>
        </FilterChip>
        <FilterChip active={typeFilter === 'ATM'} onClick={() => onTypeFilterChange('ATM')} testId="filter-atm">
          <Banknote className="h-3.5 w-3.5" />
          <span>Bankomati</span>
        </FilterChip>
        <FilterChip active={has24h} onClick={() => onHas24hChange(!has24h)} testId="filter-24h">
          <Clock className="h-3.5 w-3.5" />
          <span>Samo 24h</span>
        </FilterChip>
        <FilterChip
          active={hasDriveThrough}
          onClick={() => onHasDriveThroughChange(!hasDriveThrough)}
          testId="filter-drive-through"
        >
          <Car className="h-3.5 w-3.5" />
          <span>Drive-through</span>
        </FilterChip>
      </div>
    </div>
  );
}

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testId?: string;
}

function FilterChip({ active, onClick, children, testId }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white border-transparent shadow-sm'
          : 'bg-background text-muted-foreground border-input hover:border-indigo-400 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export default BranchFilters;
