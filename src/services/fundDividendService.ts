import api from './api';
import type { FundDividendHistoryDto } from '@/types/fundDividend';

const fundDividendService = {
  getFundDividendHistory: async (fundId: number): Promise<FundDividendHistoryDto[]> => {
    const { data } = await api.get<FundDividendHistoryDto[]>(`/funds/${fundId}/dividends`);
    return Array.isArray(data) ? data : [];
  },
};

export default fundDividendService;
