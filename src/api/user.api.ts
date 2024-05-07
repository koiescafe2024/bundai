import type { LoginParams, LoginResult, LogoutParams, LogoutResult, Verify2FAResult, Verify2FAParams } from '../interface/user/login';

import { request } from './request';
import type { AxiosRequestConfig } from 'axios';

/** 登录接口 */
export const apiLogin = (data: LoginParams) => request<LoginResult>('post', '/auth/signin', data);

/** 登出接口 */
export const apiLogout = (data: LogoutParams) => request<LogoutResult>('post', '/auth/signout', data);

/** 2FA 验证接口 */
export const apiVerify2FA = (data: Verify2FAParams) => request<Verify2FAResult>('post', '/auth/verify-2fa', data);

export const setup2FA = (token: string, data: {userId: String}, config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request('post', '/auth/setup2fa', data, modifiedConfig);
}
