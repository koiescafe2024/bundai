// BarChartComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Table, Card } from 'antd';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getPeopleApplyData } from '@/api/dashboard.api';
import { PlayerApplyDataList } from '@/interface/dashbaord/overview.interface';
import { useSelector } from 'react-redux';

const PeopleApplyTable: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [data, setData] = useState<PlayerApplyDataList>([]);
  const { startDate, endDate} = useSelector(state => state.dashbaord);

  const token : string = localStorage.getItem('token') || '';

  const fetchData = async () => {
    const { status, result } = await getPeopleApplyData(token, {startDate, endDate} );

    console.log("people-apply-result", result)
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
      title: 'Registered',
      dataIndex: 'Registered',
      key: 'registered',
    },
    {
      title: 'First Deposit',
      dataIndex: 'First Deposit',
      key: 'First Deposit',
    },
  ];

  return (
    <Card loading={loading} style={{ marginTop: 12 }}>
      <Table dataSource={data} columns={columns} rowKey="date" />
    </Card>
  );
};

export default PeopleApplyTable;
