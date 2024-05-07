// AreaChartComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Card } from 'antd';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getTimeLineData } from '@/api/dashboard.api';
import { TimelineList } from '@/interface/dashbaord/timeline.interface';
import { useSelector } from 'react-redux';

const CustomAreaChart: React.FC<{ loading: boolean }> = ({ loading }) => {
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
        <AreaChart data={data}>
          {/* <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend /> */}
          {/* <Area type="monotone" dataKey="deposit" stroke="#3F90F7" fillOpacity={1} fill="url(#colorUv)" />
          <Area type="monotone" dataKey="withdrawl" stroke="#E36E7E" fillOpacity={1} fill="url(#colorPv)" /> */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="deposit" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="withdrawl" stroke="#E36E7E" fillOpacity={1} fill="#E36E7E" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CustomAreaChart;
