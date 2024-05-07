// BarChartComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Card } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getPeopleApplyData, getSourceByRegisteredData } from '@/api/dashboard.api';
import { PlayerApplyDataList } from '@/interface/dashbaord/overview.interface';
import { useSelector } from 'react-redux';

const SourceChart: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [data, setData] = useState<PlayerApplyDataList>([]);
  const { startDate, endDate} = useSelector(state => state.dashbaord);

  const token : string = localStorage.getItem('token') || '';

  const fetchData = async () => {
    const { status, result } = await getSourceByRegisteredData(token, {startDate, endDate});

    if (status) {
      setData(result);
    }
  }

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <ResponsiveContainer height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="web" fill="#E36E7E" />
          <Bar dataKey="app" fill="#3F90F7" />
          <Bar dataKey="affiliate" fill="#EF20F7" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SourceChart;
