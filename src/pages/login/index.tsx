import type { LoginParams } from '@/interface/user/login';
import { useEffect, type FC } from 'react';

import './index.less';

import { Button, Checkbox, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { LocaleFormatter, useLocale } from '@/locales';
import { formatSearch } from '@/utils/formatSearch';

import { loginAsync } from '../../stores/user.action';

const initialValues: LoginParams = {
  username: '',
  password: '',
  // remember: true
};

const LoginForm: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { formatMessage } = useLocale();
  const { theme } = useSelector(state => state.global);

  const logged  = useSelector(state => state.user.logged)

  useEffect(() => {
    if(logged) {
      const search = formatSearch(location.search);
      const from = search.from || { pathname: '/' };
      navigate(from);
    }
  }, [logged])

  const onFinished = async (form: LoginParams) => {
    const res = dispatch(await loginAsync(form));
    // if (!!res) {
    //   const search = formatSearch(location.search);
    //   const from = search.from || { pathname: '/' };

    //   navigate(from);
    // }
  };

  return (
    <div className="login-page" style={{ backgroundColor: theme === 'dark' ? 'black' : 'white' }}>
      <Form<LoginParams> onFinish={onFinished} className="login-page-form" initialValues={initialValues}>
        <h2>BANDAI</h2>
        <Form.Item
          name="userid"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterUsernameMessage',
              }),
            },
          ]}
        >
          <Input
            placeholder={formatMessage({
              id: 'gloabal.tips.username',
            })}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'gloabal.tips.enterPasswordMessage',
              }),
            },
          ]}
        >
          <Input
            type="password"
            placeholder={formatMessage({
              id: 'gloabal.tips.password',
            })}
          />
        </Form.Item>
        {/* <Form.Item
          name="token2fa"
          rules={[
            {
              message: formatMessage({
                id: 'gloabal.tips.enterToken2fa',
              }),
            },
          ]}                               
        >
          <Input
            placeholder={formatMessage({
              id: 'gloabal.tips.token2fa',
            })}
          />
        </Form.Item> */}
        <Form.Item
          name="token2fa"
          rules={[
            {
              message: 'Enter your 2FA code',
            },
          ]}                               
        >
          <Input
            placeholder='2FA'
          />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>
            <LocaleFormatter id="gloabal.tips.rememberUser" />
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" className="login-page-form_button">
            <LocaleFormatter id="gloabal.tips.login" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
