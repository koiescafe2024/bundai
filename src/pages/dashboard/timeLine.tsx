import { useEffect, useState, type FC } from 'react';

import { Badge, Card } from 'antd';
import { Brush, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { LocaleFormatter } from '@/locales';
import { getTimeLineData } from '@/api/dashboard.api';
import { TimelineList } from '@/interface/dashbaord/timeline.interface';
import { useSelector } from 'react-redux';

const CustomTooltip: FC<any> = ({ active, payload, label }) => {
  // Check if tooltip is active and payload exists and is not empty
  if (active && payload && payload.length > 0) {
    const { value: value1, stroke: stroke1 } = payload[0];
    // Check if there's a second item in the payload
    const value2 = payload[1] ? payload[1].value : null;
    const stroke2 = payload[1] ? payload[1].stroke : null;

    return (
      <div className="customTooltip">
        <span className="customTooltip-title">{label}</span>
        <ul className="customTooltip-content">
          <li key="deposit">
            <Badge color={stroke1} />
            <LocaleFormatter id="app.dashboard.timeline.deposit" /> {value1}
          </li>
          {value2 && stroke2 && (
            <li key="withdrawal">
              <Badge color={stroke2} />
              <LocaleFormatter id="app.dashboard.timeline.withdrawl" /> {value2}
            </li>
          )}
        </ul>
      </div>
    );
  }

  return null;
};

const TimeLine: FC<{ loading: boolean }> = ({ loading }) => {
  
  const [timelineData, setTimelineData] = useState<TimelineList>([]);
  const { startDate, endDate } = useSelector(state => state.dashbaord);

  const token : string = localStorage.getItem('token') || '';

  const fetchTimelineTransaction = async () => {
    const { status, result } = await getTimeLineData(token, {startDate, endDate});

    if (status) {
      setTimelineData(result);
    }
  };

  useEffect(() => {
    fetchTimelineTransaction();
  }, [startDate, endDate]);

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <ResponsiveContainer height={400}>
        <LineChart data={timelineData} syncId="anyId">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="deposit" stroke="#3F90F7" />
          <Line type="monotone" dataKey="withdrawl" stroke="#E36E7E" />
          <Brush dataKey="name" fill="#13c2c2" />
          <Legend
            verticalAlign="top"
            height={40}
            formatter={value => <LocaleFormatter id={('app.dashboard.timeline.' + value) as any} />}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TimeLine;
