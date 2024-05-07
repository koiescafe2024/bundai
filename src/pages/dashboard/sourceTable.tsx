// BarChartComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getPeopleApplyData, getSourceByRegisteredData } from '@/api/dashboard.api';
import { PlayerApplyDataList } from '@/interface/dashbaord/overview.interface';
import { useSelector } from 'react-redux';

const SourceTable: React.FC<{ loading: boolean }> = ({ loading }) => {
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

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date', // The field in the data to retrieve the values from
      key: 'date', // Unique key for each column
    },
    {
      title: 'Web',
      dataIndex: 'web',
      key: 'web',
    },
    {
      title: 'App',
      dataIndex: 'app',
      key: 'app',
    },
    {
      title: 'Affiliate',
      dataIndex: 'affiliate',
      key: 'affiliate',
    },
  ];

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <Table dataSource={data} columns={columns} rowKey="date" />
    </Card>
  );
};

export default SourceTable;
