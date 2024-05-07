import type { LoginParams } from '../interface/user/login';
import type { Dispatch } from '@reduxjs/toolkit';

import { apiLogin, apiLogout, apiVerify2FA } from '../api/user.api';
import { setUserItem } from './user.store';
import { createAsyncAction } from './utils';

const doVerify2FA = async (dispatch: Dispatch, payload: any) => {
  try {
    // const {status, result} = await apiVerify2FA({ agentid: payload.username, token: payload.token2fa ? payload.token2fa: '' });
    const { status, result, message} = await apiVerify2FA({ userid: payload.userid, token: payload.token2fa ? payload.token2fa: '' });

    if (status) {
      dispatch(setUserItem({
        logged: true,
        userid: payload.username,
        agentid: payload.agentid
      }));

      // Debugger
      // Process normal login
      localStorage.setItem('token', result.token);

      // Set other local storage and dispatch user details
      dispatch(setUserItem({
        logged: true,
        ...result
      }));
      
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('2FA Verification failed:', error);
    return false;
  }
}

// typed wrapper async thunk function demo, no extra feature, just for powerful typings
export const loginAsync = createAsyncAction<LoginParams, boolean>(payload => {
  return async (dispatch: Dispatch) => {
    const { status, result } = await apiLogin(payload);
    debugger
    if (status) {
      if (result && result.twoFactorEnabled) {
        dispatch(setUserItem({  
          requires2FA: true, // Set requires2FA based on server response
        }));
        
        return await doVerify2FA(dispatch, payload);
        
      } else {
        // Process normal login
        localStorage.setItem('token', result.token);
        // Set other local storage and dispatch user details
        dispatch(setUserItem({
          logged: true,
          ...result
        }));
      }
      return true;
    }

    return false;
  };
});


export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const { status } = await apiLogout({ token: localStorage.getItem('token')! });

    if (status) {
      localStorage.clear();
      dispatch(
        setUserItem({
          logged: false,
        }),
      );

      return true;
    }

    return false;
  };
};

export const verify2FAAsync = ({ agentid, code }: { agentid: string; code: string }) => {
  return async (dispatch: Dispatch) => {
    try {
      const { status, message } = await apiVerify2FA({ agentid, token: code });
      if (status) {
        dispatch(setUserItem({
          logged: true,
          agentid: agentid,
        }));
        return { success: true };
      } else {
        return { success: false, message };
      }
    } catch (error) {
      console.error('2FA Verification failed:', error);
      return { success: false, message: 'Failed to communicate with the server.' };
    }
  };
};
