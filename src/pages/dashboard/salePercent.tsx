import type { ColProps } from 'antd/es/col';
import type { FC } from 'react';

import { Badge, Card, Col, List, Radio, Row } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useLocale } from '@/locales';
import { getOverviewData } from '@/api/dashboard.api';

// type DataType = 'all' | 'online' | 'offline';
type DataType = 'Total';

interface Values {
  name: {
    zh_CN: string;
    en_US: string;
    th_TH: string;
  };
  value: number;
}

interface Data {
  Total: Values[];
  // Today: Values[];
  // online: Values[];
  // offline: Values[];
}

// const data: Data = {
//   all: [
//     { name: { zh_CN: '家用电器', en_US: 'appliances' }, value: 4544 },
//     { name: { zh_CN: '食用酒水', en_US: 'drinks' }, value: 3321 },
//     { name: { zh_CN: '个护健康', en_US: 'health' }, value: 3113 },
//     { name: { zh_CN: '服饰箱包', en_US: 'clothing' }, value: 2341 },
//     { name: { zh_CN: '母婴产品', en_US: 'baby' }, value: 1231 },
//     { name: { zh_CN: '其他', en_US: 'others' }, value: 132 },
//   ],
//   // online: [
//   //   { name: { zh_CN: '家用电器', en_US: 'appliances' }, value: 244 },
//   //   { name: { zh_CN: '食用酒水', en_US: 'drinks' }, value: 231 },
//   //   { name: { zh_CN: '个护健康', en_US: 'health' }, value: 311 },
//   //   { name: { zh_CN: '服饰箱包', en_US: 'clothing' }, value: 41 },
//   //   { name: { zh_CN: '母婴产品', en_US: 'baby' }, value: 121 },
//   //   { name: { zh_CN: '其他', en_US: 'others' }, value: 111 },
//   // ],
//   // offline: [
//   //   { name: { zh_CN: '家用电器', en_US: 'appliances' }, value: 99 },
//   //   { name: { zh_CN: '食用酒水', en_US: 'drinks' }, value: 188 },
//   //   { name: { zh_CN: '个护健康', en_US: 'health' }, value: 344 },
//   //   { name: { zh_CN: '服饰箱包', en_US: 'clothing' }, value: 255 },
//   //   { name: { zh_CN: '其他', en_US: 'others' }, value: 65 },
//   // ],
// };

// const data: Data = {
//   Total: [
//     { name: { zh_CN: '订金', en_US: 'Deposit' }, value: 400 },
//     { name: { zh_CN: '退出', en_US: 'WithDraw' }, value: 200 },
//   ],
//   Today: [
//     { name: { zh_CN: '订金', en_US: 'Deposit' }, value: 200 },
//     { name: { zh_CN: '退出', en_US: 'WithDraw' }, value: 0 },
//   ],
// }

const COLORS = ['#0088FE', '#E36E7E', '#FF8042', '#FFBB28', '#00C49F','#8F66DE'];

const wrapperCol: ColProps = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};

const SalePercent: FC<{ loading: boolean }> = ({ loading }) => {
  const [dataType, setDataType] = useState<DataType>('Total');

  const { startDate, endDate } = useSelector(state => state.dashbaord)
  const { locale } = useSelector(state => state.user);
  
  const { formatMessage } = useLocale();
  const [data, setData] = useState({
    Total: [
      { name: { zh_CN: '订金', en_US: 'Deposit', th_TH: 'เงินฝาก' }, value: 0 },
      { name: { zh_CN: '退出', en_US: 'WithDraw', th_TH: 'ถอน' }, value: 0 },
    ],
    // Today: [
    //   { name: { zh_CN: '订金', en_US: 'Deposit' }, value: 0 },
    //   { name: { zh_CN: '退出', en_US: 'WithDraw' }, value: 0 },
    // ],
  });

  const token : string = localStorage.getItem('token') || '';

  const fetchStatisticsData = useCallback(async () => {
    const { status, result }  = await getOverviewData(token, {
      startDate,
      endDate
    });
  
    if(status) {
      console.log(result)
      setData({
        Total: [
          { name: { zh_CN: '订金', en_US: 'Deposit', th_TH: 'เงินฝาก' }, value: result.totalDeposit },
          { name: { zh_CN: '退出', en_US: 'WithDraw', th_TH: 'ถอน' }, value: result.totalWithdraw },
        ],
        // Today: [
        //   { name: { zh_CN: '订金', en_US: 'Deposit' }, value: result.totalDeposit },
        //   { name: { zh_CN: '退出', en_US: 'WithDraw' }, value: result.todayWithdraw },
        // ],
      })

    }
  }, []);

  useEffect(() => {
    fetchStatisticsData();
  }, [fetchStatisticsData])

  return (
    <Card
      className="salePercent"
      title={formatMessage({ id: 'app.dashboard.salePercent.depositwithdraw' })}
      loading={loading}
      extra={
        <Radio.Group value={dataType} onChange={e => setDataType(e.target.value)} buttonStyle="solid">
          <Radio.Button value="Total">{formatMessage({ id: 'app.dashboard.salePercent.total' })}</Radio.Button>
          <Radio.Button value="Today">{formatMessage({ id: 'app.dashboard.salePercent.today' })}</Radio.Button>
          {/*<Radio.Button value="offline">{formatMessage({ id: 'app.dashboard.salePercent.offline' })}</Radio.Button> */}
        </Radio.Group>
      }
    >
      <Row gutter={20}>
        <Col {...wrapperCol}>
          <ResponsiveContainer height={250}>
            <PieChart>
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active) {
                    const { name, value } = payload[0];
                    const total = data[dataType].map(d => d.value).reduce((a, b) => a + b);
                    const percent = ((value / total) * 100).toFixed(2) + '%';

                    return (
                      <span className="customTooltip">
                        {name[locale]} : {percent}
                      </span>
                    );
                  }

                  return null;
                }}
              />
              <Pie
                strokeOpacity={0}
                data={data[dataType]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data[dataType].map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col {...wrapperCol}>
          <List<Values>
            bordered
            dataSource={data[dataType]}
            renderItem={(item, index) => {
              const total = data[dataType].map(d => d.value).reduce((a, b) => a + b);
              const percent = ((item.value / total) * 100).toFixed(2) + '%';

              return (
                <List.Item>
                  <Badge color={COLORS[index]} />
                  <span>{item.name[locale]}</span> | <span>{item.value}</span><span>THB {percent}</span>
                </List.Item>
              );
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default SalePercent;
