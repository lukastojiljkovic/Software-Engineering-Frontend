import api from './api';
import type { Branch, BranchFilters } from '@/types/branches';

export const branchService = {
  /**
   * Vraca filtrirane lokacije (BRANCH + ATM). Svi filteri su opcionalni.
   * BE endpoint: GET /branches?type=&has24h=&hasDriveThrough=&search=
   */
  list: async (filters: BranchFilters = {}): Promise<Branch[]> => {
    const params: Record<string, string> = {};
    if (filters.type) params.type = filters.type;
    if (filters.has24h) params.has24h = 'true';
    if (filters.hasDriveThrough) params.hasDriveThrough = 'true';
    if (filters.search && filters.search.trim()) params.search = filters.search.trim();
    const response = await api.get<Branch[]>('/branches', { params });
    return response.data;
  },
};
