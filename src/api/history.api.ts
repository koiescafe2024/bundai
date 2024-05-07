import type { AxiosRequestConfig } from 'axios';
import { request } from './request';
import { BetList } from '@/interface/history/bet.interface';


/** Fetches betting history */
export const getHistoryBets = (token: string, params: any, config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<BetList>('post', '/report/history/bets', params, modifiedConfig);
}
