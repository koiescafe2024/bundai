import type { ColProps } from 'antd/es/col';
import { useEffect, useState, type FC } from 'react';

import { Badge, Card, Col, Row, Button } from 'antd';
import { FileTextOutlined, LineChartOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLocale } from '@/locales';

import { ReactComponent as CaretDownIcon } from './assets/caret-down.svg';
import { ReactComponent as CaretUpIcon } from './assets/caret-up.svg';
import { getOverviewData } from '@/api/dashboard.api';
import { useSelector } from 'react-redux';
import TimeLine from './timeLine';
import PeopleApplyChart from './peopleApplyChart';

import SourceChart from './sourceChart';
import BonusChart from './bonusChart';
import PeopleApplyTable from './peopleApplyTable';
import SourceTable from './sourceTable';
import TimeLineTable from './timeLineTable';

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
  onSwitch: (type: string) => void;
}

const ColCard: FC<ColCardProps> = ({ metaName, body, loading, onSwitch }) => {
  return (
    <Col {...wrapperCol}>
      <Card loading={loading} className="overview" bordered={false}>
        <div className="overview-header">
          <div className="overview-header-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{metaName}</span>
            <Button.Group>
              <Button icon={<LineChartOutlined />} onClick={() => onSwitch('chart')}></Button>
              <Button icon={<FileTextOutlined />} onClick={() => onSwitch('document')}></Button>
            </Button.Group>
          </div>
        </div>
        {body}
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

const SevCharts: FC<{ loading: boolean }> = ({ loading }) => {
  const { startDate, endDate} = useSelector(state => state.dashbaord);

  const { formatMessage } = useLocale();
  const [newEnteringCustomersCount, setNewEnteringCustomersCount] = useState(0);
  const [firstDepositNewCustomersCount, setFirstDepositNewCustomersCount] = useState(0);

  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const [isGraphPeopleApply, setIsGraphPeopleApply] = useState(true);
  const [isGraphSource, setIsGraphSource] = useState(true);
  const [isGraphDepositWithdrawal, setIsGraphDepositWithdrawal] = useState(true);
  const [isGraphBonus, setIsGraphBonus] = useState(true);

  const token : string = localStorage.getItem('token') || '';
  
  const fetchStatisticsData = async () => {
    const { status, result }  = await getOverviewData(token, {
      startDate,
      endDate
    });
  
    if(status) {
      console.log(result);
      setNewEnteringCustomersCount(result.newEnteringCustomersCount);
      setFirstDepositNewCustomersCount(result.firstDepositNewCustomersCount);
      setTotalDeposit(result.totalDeposit);
      setTotalWithdraw(result.totalWithdraw);
      setTotalProfit(result.totalProfit);
    }
  };

  useEffect(() => {
    console.log("overview")
    console.log(startDate, endDate)
    fetchStatisticsData()
  }, [startDate, endDate])

  return (
    <>
      <Row gutter={[12, 12]} style={{ marginTop: '10px', marginBottom: '10px' }}>
        {/* People Apply */}
        <ColCard
            loading={loading}
            metaName={formatMessage({ id: 'app.dashboard.overview.peopleapply' })}
            metaCount={String(newEnteringCustomersCount)}
            body={ isGraphPeopleApply ? <PeopleApplyChart loading={loading} /> : <PeopleApplyTable loading={loading} /> }
            onSwitch = {(type: string) => { 
              if(type == 'chart') 
                setIsGraphPeopleApply(true)
              else
                setIsGraphPeopleApply(false)
              }
            }
            footer={<Field name={formatMessage({ id: 'app.dashboard.overview.firstdepositnewcustomers' })} number={String(firstDepositNewCustomersCount)}/>}
        />

        {/* Source */}
        <ColCard
            loading={loading}
            metaName={formatMessage({ id: 'app.dashboard.overview.source' })}
            metaCount={String(newEnteringCustomersCount)}
            body={ isGraphSource ? <SourceChart loading={loading} /> : <SourceTable loading={loading} /> }
            onSwitch = {(type: string) => { 
              if(type == 'chart') 
                setIsGraphSource(true)
              else
                setIsGraphSource(false)
              }
            }
            footer={<Field name={formatMessage({ id: 'app.dashboard.overview.firstdepositnewcustomers' })} number={String(firstDepositNewCustomersCount)}/>}
        />

        {/* Deposit Withdrawal */}
        <ColCard
            loading={loading}
            metaName={formatMessage({ id: 'app.dashboard.overview.depositwithdrawl' })}
            metaCount={String(newEnteringCustomersCount)}
            body={ isGraphDepositWithdrawal ?  <TimeLine loading={loading} /> : <TimeLineTable loading={loading} /> }
            onSwitch = {(type: string) => { 
              if(type == 'chart') 
                setIsGraphDepositWithdrawal(true)
              else
                setIsGraphDepositWithdrawal(false)
              }
            }
            footer={<Field name={formatMessage({ id: 'app.dashboard.overview.firstdepositnewcustomers' })} number={String(firstDepositNewCustomersCount)}/>}
        />

        {/* Bonus */}
        <ColCard
            loading={loading}
            metaName={formatMessage({ id: 'app.dashboard.overview.bonus' })}
            metaCount={String(newEnteringCustomersCount)}
            body={ isGraphBonus ? <BonusChart loading={loading} /> : <>Bonus</> }
            onSwitch = {(type: string) => { 
              if(type == 'chart') 
                setIsGraphBonus(true)
              else
                setIsGraphBonus(false)
              }
            }
            footer={<Field name={formatMessage({ id: 'app.dashboard.overview.firstdepositnewcustomers' })} number={String(firstDepositNewCustomersCount)}/>}
        />
      </Row>
    </>
  );
};

export default SevCharts;
