/** user's role */
export type Role = 'guest' | 'admin';

export interface LoginParams {
  /** 用户名 */
  username: string;
  /** 用户密码 */
  password: string;
  token2fa? : string;
}

export interface LoginResult {
  /** auth token */
  token: string;
  username: string;
  role: Role;
  id: string;
  agentid: string;
  platform: string;
  percentage: number;
  parent: string;
  twoFactorEnabled: boolean;
}

export interface LogoutParams {
  token: string;
}

export interface LogoutResult {}


export interface Verify2FAParams {
  userid?: string;
  agentid?: string;
  token: string;
}

export interface Verify2FAResult {
  token: string;
  username: string;
  role: Role;
  agentid: string;
  platform: string;
}
