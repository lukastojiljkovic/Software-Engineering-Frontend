// ============================================================
// FE2 - Watchlist + cenovni alarmi | Developer: Antonije Ilic
//
// Dropdown dugme za dodavanje hartije u korisnikove watchlist liste.
// Koristi se u SecuritiesListPage (variant='icon') i SecuritiesDetailsPage (variant='full').
//
// Spec: Zadaci_Frontend.pdf, FE2.
// ============================================================

import { useCallback, useEffect, useState } from 'react';
import { Bookmark, BookmarkPlus, Loader2, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/notify';
import { watchlistService } from '@/services/watchlistService';
import type { WatchlistDto } from '@/types/watchlist';

interface AddToWatchlistButtonProps {
  listingId: number;
  listingTicker: string;
  variant?: 'icon' | 'full';
}

export default function AddToWatchlistButton({
  listingId,
  listingTicker,
  variant = 'full',
}: AddToWatchlistButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<WatchlistDto[]>([]);
  const [adding, setAdding] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadLists = useCallback(async () => {
    setLoading(true);
    try {
      const data = await watchlistService.listMyWatchlists();
      setLists(data);
    } catch {
      toast.error('Neuspeh ucitavanja watchlista');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && lists.length === 0 && !loading) {
      void loadLists();
    }
  }, [open, lists.length, loading, loadLists]);

  const handleAddTo = useCallback(
    async (wl: WatchlistDto) => {
      setAdding(wl.id);
      try {
        await watchlistService.addItem(wl.id, { listingId });
        toast.success(`${listingTicker} dodato u "${wl.name}"`);
        setOpen(false);
      } catch (err) {
        const errMessage =
          (err as { response?: { status?: number } })?.response?.status === 409
            ? 'Hartija je vec u listi'
            : 'Neuspeh dodavanja';
        toast.error(errMessage);
      } finally {
        setAdding(null);
      }
    },
    [listingId, listingTicker]
  );

  const handleCreateAndAdd = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = newName.trim();
      if (!name) {
        toast.error('Naziv liste je obavezan');
        return;
      }
      setCreating(true);
      try {
        const created = await watchlistService.createWatchlist({ name });
        await watchlistService.addItem(created.id, { listingId });
        toast.success(`${listingTicker} dodato u "${created.name}"`);
        setLists((prev) => [...prev, created]);
        setNewName('');
        setShowNewForm(false);
        setOpen(false);
      } catch {
        toast.error('Neuspeh kreiranja i dodavanja');
      } finally {
        setCreating(false);
      }
    },
    [newName, listingId, listingTicker]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'icon' ? 'ghost' : 'outline'}
          size={variant === 'icon' ? 'icon' : 'sm'}
          data-testid={`add-to-watchlist-${listingId}`}
          aria-label={`Dodaj ${listingTicker} u watchlist`}
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkPlus className={variant === 'icon' ? 'h-4 w-4' : 'h-4 w-4 mr-2'} />
          {variant === 'full' && <span>Dodaj na watchlist</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64"
        onClick={(e) => e.stopPropagation()}
        data-testid="add-to-watchlist-menu"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Bookmark className="h-4 w-4" />
          <span>Dodaj {listingTicker} u listu</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : lists.length === 0 && !showNewForm ? (
          <div className="px-2 py-3 text-xs text-muted-foreground text-center">
            Nemate watchlist-a. Kreirajte prvu ispod.
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {lists.map((wl) => (
              <DropdownMenuItem
                key={wl.id}
                onSelect={(e) => {
                  e.preventDefault();
                  void handleAddTo(wl);
                }}
                disabled={adding !== null}
                data-testid={`watchlist-option-${wl.id}`}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full gap-2 min-w-0">
                  <span className="truncate">{wl.name}</span>
                  {adding === wl.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {wl.itemCount ?? 0}
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        {showNewForm ? (
          <form
            onSubmit={handleCreateAndAdd}
            className="px-2 py-2 space-y-2"
            data-testid="watchlist-new-form"
          >
            <Input
              autoFocus
              placeholder="Naziv liste"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={64}
              disabled={creating}
              className="h-8 text-sm"
              data-testid="watchlist-new-name-input"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={creating}
                className="flex-1"
                data-testid="watchlist-new-submit"
              >
                {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Kreiraj i dodaj'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewForm(false);
                  setNewName('');
                }}
                disabled={creating}
              >
                Otkazi
              </Button>
            </div>
          </form>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowNewForm(true);
            }}
            data-testid="watchlist-create-new"
            className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-2" />
            Nova lista
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
