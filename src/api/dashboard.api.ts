import type { AxiosRequestConfig } from 'axios';
import { request } from './request';
import { Overview, PlayerApplyDataList } from '@/interface/dashbaord/overview.interface';
import { TimelineList } from '@/interface/dashbaord/timeline.interface';
/** 获取菜单列表接口 */
/** Provides the mock menu list to be shown in the navigation sidebar */
export const getOverviewData = (token: string, params: any, config: AxiosRequestConfig = {}) =>
{
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
        ...config,
        headers: {
            ...config.headers, // Preserve existing headers
            'x-auth-token': token // Add your x-auth-token here
        }
        };

    return request<Overview>('post', '/report/overview', params, modifiedConfig)
}

/** 获取通知列表接口 */
/** Provides the mock notification list to be shown
 * in the notification dropdown
 */
// export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', '/user/notice', {}, config);

export const getTimeLineData = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<PlayerApplyDataList>('post', '/report/timeline', params, modifiedConfig);
}

/** Fetches player statistics */
export const getPeopleApplyData = (token: string, params: any, config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<PlayerApplyDataList>('post', '/report/player-apply', params, modifiedConfig);
}

/** Fetches player statistics */
export const getSourceByRegisteredData = (token: string, params: any,  config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<PlayerApplyDataList>('post', '/report/source-by-registered', params, modifiedConfig);
  }