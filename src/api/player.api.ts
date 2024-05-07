import type { AxiosRequestConfig } from 'axios';
import { request } from './request';
import { Admin, AdminList, Permission, PermissionList, Player, PlayerList, PlayerStatList, PlayerWinLossList, Role } from '@/interface/player/player.interface';

/** 获取菜单列表接口 */
/** Provides the mock menu list to be shown in the navigation sidebar */
export const getNewEnteringPlayers = (token: string, params: any, config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<PlayerList>('post', '/player/new-player', params, modifiedConfig);
}

/** Fetches player statistics */
export const getPlayerStats = (token: string, params: any, config: AxiosRequestConfig = {}) => {
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<PlayerStatList>('post', '/player/player-stats', params, modifiedConfig);
}

export const getWinLoss = (token: string, params: any, config: AxiosRequestConfig = {}) => {
     // Add x-auth-token to the headers of the request
     const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };
  
    return request<PlayerWinLossList>('post', '/report/win-loss', params, modifiedConfig);
}

export const getMembers = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<PlayerList>('post', '/player/members', params, modifiedConfig);
}



export const getAdmins = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<AdminList>('post', '/player/admins', params, modifiedConfig);
}

export const createAdmin = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<Admin>('post', '/player/admin', params, modifiedConfig);
}


export const getUserRoles = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<Role>('get', '/player/admin', params, modifiedConfig);
}

export const updateRolePermission = (token: string, params: any, config: AxiosRequestConfig = {}) => {
 
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request('post', '/player/admin/permission', params, modifiedConfig) ;
}


export const updatePassword = (token: string, params: any, config: AxiosRequestConfig = {}) => {
 
    // Add x-auth-token to the headers of the request
    const modifiedConfig = {
      ...config,
      headers: {
        ...config.headers, // Preserve existing headers
        'x-auth-token': token // Add your x-auth-token here
      }
    };

    return request('post', '/player/change-password', params, modifiedConfig) ;
}

export const updateAccess = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request('post', '/player/update-access', params, modifiedConfig);
}

// update player
export const updatePlayer = (token: string, params: any, config: AxiosRequestConfig = {}) => {
  // Add x-auth-token to the headers of the request
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers, // Preserve existing headers
      'x-auth-token': token // Add your x-auth-token here
    }
  };

  return request<Player>('put', '/player', params, modifiedConfig);
}