import type { AxiosRequestConfig } from 'axios';
import { request } from './request';
import { Agent, AgentList } from '@/interface/agent/agent.interface';
import { TimelineList } from '@/interface/dashbaord/timeline.interface';

/** 获取菜单列表接口 */
/** Provides the mock menu list to be shown in the navigation sidebar */
export const getSubAgents = (token: string, config: AxiosRequestConfig = {}) => {
    
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
        ...config,
        headers: {
            ...config.headers, // Preserve existing headers
            'x-auth-token': token // Add your x-auth-token here
        }
    };

    return request<AgentList>('post', '/agent/sub-agents', {}, modifiedConfig)
}


// update sub agent
export const updateSubAgent = (updatedAgent: any, config: AxiosRequestConfig = {}) => request<Agent>('put', '/agent', updatedAgent, config)
/** 获取通知列表接口 */
/** Provides the mock notification list to be shown
 * in the notification dropdown
 */
// export const getNoticeList = (config: AxiosRequestConfig = {}) => request<Notice[]>('get', '/user/notice', {}, config);

// export const getTimeLineData = (config: AxiosRequestConfig = {}) => request<TimelineList>('post', '/report/timeline', {}, config)

export const createSubAgent = (newAgent: any, config: AxiosRequestConfig = {}) => request<Agent>('post', '/agent', newAgent, config)