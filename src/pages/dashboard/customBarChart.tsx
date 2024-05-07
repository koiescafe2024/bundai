// BarChartComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Card } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getTimeLineData } from '@/api/dashboard.api';
import { TimelineList } from '@/interface/dashbaord/timeline.interface';
import { useSelector } from 'react-redux';

const CustomBarChart: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [data, setData] = useState<TimelineList>([]);
  const { startDate, endDate} = useSelector(state => state.dashbaord);

  const token : string = localStorage.getItem('token') || '';

  const fetchData = useCallback(async () => {
    const { status, result } = await getTimeLineData(token, {startDate, endDate});

    if (status) {
      setData(result);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <ResponsiveContainer height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="deposit" fill="#3F90F7" />
          <Bar dataKey="withdrawl" fill="#E36E7E" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CustomBarChart;
