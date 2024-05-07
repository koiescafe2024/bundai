import type { ColProps } from 'antd/es/col';
import { useCallback, useEffect, useState, type FC } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Card, Col, Progress, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip as RTooltip, XAxis } from 'recharts';

import { useLocale } from '@/locales';

import { ReactComponent as CaretDownIcon } from './assets/caret-down.svg';
import { ReactComponent as CaretUpIcon } from './assets/caret-up.svg';
import { getOverviewData } from '@/api/dashboard.api';
import { useSelector } from 'react-redux';
import { history } from '@/routes/history';

const data = new Array(14).fill(null).map((_, index) => ({
  name: dayjs().add(index, 'day').format('YYYY-MM-DD'),
  number: Math.floor(Math.random() * 8 + 1),
}));

const wrapperCol: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 6,
};

interface ColCardProps {
  metaName: string;
  metaCount: string;
  body: React.ReactNode;
  footer: React.ReactNode;
  loading: boolean;
}

const ColCard: FC<ColCardProps> = ({ metaName, metaCount, body, footer, loading }) => {
  return (
    <Col {...wrapperCol}>
      <Card loading={loading} className="overview" bordered={false}>
        <div className="overview-header">
          <div className="overview-header-meta">{metaName}</div>
          <div className="overview-header-count">{metaCount}</div>
          <Tooltip title="Introduce">
            <InfoCircleOutlined className="overview-header-action" />
          </Tooltip>
        </div>
        <div className="overview-body">{body}</div>
        <div className="overview-footer">{footer}</div>
      </Card>
    </Col>
  );
};

interface TrendProps {
  wow: string;
  dod: string;
  style?: React.CSSProperties;
}

const Trend: FC<TrendProps> = ({ wow, dod, style = {} }) => {
  const { formatMessage } = useLocale();

  return (
    <div className="trend" style={style}>
      <div className="trend-item">
        <span className="trend-item-label">{formatMessage({ id: 'app.dashboard.overview.wowChange' })}</span>
        <span className="trend-item-text">{wow}</span>
        <CaretUpIcon color="#f5222d" />
      </div>
      <div className="trend-item">
        <span className="trend-item-label">{formatMessage({ id: 'app.dashboard.overview.dodChange' })}</span>
        <span className="trend-item-text">{dod}</span>
        <CaretDownIcon color="#52c41a" />
      </div>
    </div>
  );
};

const CustomTooltip: FC<any> = ({ active, payload, label }) =>
  active && (
    <div className="customTooltip">
      <span className="customTooltip-title">
        <Badge color={payload[0].fill} /> {label} : {payload[0].value}
      </span>
    </div>
  );

interface FieldProps {
  name: string;
  number: string;
}

const Field: FC<FieldProps> = ({ name, number }) => (
  <div className="field">
    <span className="field-label">{name}</span>
    <span className="field-number">{number} </span>
  </div>
);

const Overview: FC<{ loading: boolean }> = ({ loading }) => {
  const { startDate, endDate} = useSelector(state => state.dashbaord);

  const { formatMessage } = useLocale();
  const [newEnteringCustomersCount, setNewEnteringCustomersCount] = useState(0);
  const [firstDepositNewCustomersCount, setFirstDepositNewCustomersCount] = useState(0);

  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  // const [totalAgentCount, setTotalAgentCount] = useState(0);
  // const [totalPlayerCount, setTotalPlayerCount] = useState(0);

  // const fetchStatisticsData = useCallback(async () => {
  //   const { status, result }  = await getOverviewData({
  //     agentid: 'master',
  //     startDate,
  //     endDate
  //   });
  
  //   if(status) {
  //     console.log(result)
  //     setNewEnteringCustomersCount(result.newEnteringCustomersCount);
  //     setFirstDepositNewCustomersCount(result.firstDepositNewCustomersCount);
  //     setTotalDeposit(result.totalDeposit);
  //     setTotalWithdraw(result.totalWithdraw);
  //     setTotalProfit(result.totalProfit);
  //   }
  // }, []);

  const token : string = localStorage.getItem('token') || '';

  const fetchStatisticsData = async () => {
    const { status, result }  = await getOverviewData(token, {
      startDate,
      endDate
    });
  
    if(status) {
      console.log(result)
      setNewEnteringCustomersCount(result.newEnteringCustomersCount);
      setFirstDepositNewCustomersCount(result.firstDepositNewCustomersCount);
      setTotalDeposit(result.totalDeposit);
      setTotalWithdraw(result.totalWithdraw);
      setTotalProfit(result.totalProfit);
    }
  };

  useEffect(() => {
    console.log("overview");
    console.log(startDate, endDate);
    fetchStatisticsData();
  }, [startDate, endDate])

  return (
    <Row gutter={[12, 12]} style={{ marginTop: '10px', marginBottom: '10px' }}>
      <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.newenteringcustomerscount' })}
        metaCount={String(newEnteringCustomersCount)}
        body={<Trend wow="12%" dod="12%" />}
        footer={<Field name={formatMessage({ id: 'app.dashboard.overview.firstdepositnewcustomers' })} number={String(firstDepositNewCustomersCount)}/>}
      />
      {/* <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.totalagentcount' })}
        metaCount={String(totalAgentCount)}
        body={
          <ResponsiveContainer>
            <AreaChart data={data}>
              <XAxis dataKey="name" hide />
              <RTooltip content={<CustomTooltip />} />
              <Area strokeOpacity={0} type="monotone" dataKey="number" fill="#8E65D3" />
            </AreaChart>
          </ResponsiveContainer>
        }
        footer={<Field name={formatMessage({ id: 'app.dashboard.overview.dailySales' })} number="1234" />}
      /> */}

      {/* <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.todaywithdraw' })}
        metaCount={String(todayWithdraw) + ' THB'}
        body={<Progress strokeColor="#58BFC1" percent={85} />}
        footer={<Trend style={{ position: 'inherit' }} wow="12%" dod="12%" />}
      /> */}
     <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.totaldeposit' })}
        metaCount={String(totalDeposit) + ' THB'}
        body={
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <RTooltip content={<CustomTooltip />} />
              <Bar strokeOpacity={0} barSize={10} dataKey="number" stroke="#092354" fill="#092354" />
            </BarChart>
          </ResponsiveContainer>
        }
        footer={<Field name={formatMessage({ id: 'app.dashboard.overview.conversionRate' })} number="60%" />}
      />
      <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.totalwithdraw' })}
        metaCount={String(totalWithdraw) + ' THB'}
        body={<Progress strokeColor="#EF0934" percent={85} />}
        footer={<Trend style={{ position: 'inherit' }} wow="12%" dod="12%" />}
      />
      <ColCard
        loading={loading}
        metaName={formatMessage({ id: 'app.dashboard.overview.totalprofit' })}
        metaCount={String(totalProfit) + ' THB'}
        body={
          <ResponsiveContainer>
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <RTooltip content={<CustomTooltip />} />
              <Bar strokeOpacity={0} barSize={10} dataKey="number" stroke="#3B80D9" fill="#3B80D9" />
            </BarChart>
          </ResponsiveContainer>
        }
        footer={<Field name={formatMessage({ id: 'app.dashboard.overview.conversionRate' })} number="60%" />}
      />
    </Row>
  );
};

export default Overview;
