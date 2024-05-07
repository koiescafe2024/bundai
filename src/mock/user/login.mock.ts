import type { LoginResult, Role } from '@/interface/user/login';

import { intercepter, mock } from '../config';

mock.mock('/user/login', 'post', (config: any) => {
  const body: LoginResult = JSON.parse(config?.body);
  return 1;
});
