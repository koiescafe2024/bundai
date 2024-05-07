import { useState, type FC } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setup2FA } from '@/api/user.api';

const Setting: FC = () => {
    const dispatch = useDispatch();
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const { logged, locale, device, agentid } = useSelector(state => state.user);

    const onSetup2faHandler = async () => {
        const token : string = localStorage.getItem('token') || '';
        const { status, result } = await setup2FA(token, {userId: agentid});

        if (status) {
            setQrCodeUrl(result.qrCodeDataUrl);
        }
    };

    return (
        <>
            <div style={{ display: 'flex', marginBottom: 16, flex: 'none' }}>
                <img src={qrCodeUrl} style={{ width: '200px', height: '200px' }}/>
                <button onClick={() => onSetup2faHandler()}>Setup 2FA</button>
            </div>
        </>

    );
};

export default Setting;