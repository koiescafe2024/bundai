import type { FC } from 'react';
import './index.less';

import { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';

import Overview from './overview';
import SalePercent from './salePercent';
import TimeLine from './timeLine';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardDateRange } from '@/stores/dashboard.store';
import CustomBarChart from './customBarChart';
import CustomAreaChart from './customAreaChart';
import SevCharts from './sevCharts';

const { RangePicker } = DatePicker;

const DashBoardPage: FC = () => {
  const dispatch = useDispatch();
  const { startDate, endDate } = useSelector(state => state.dashbaord);
  const [loading, setLoading] = useState(true);

  const today = dayjs();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);

  const handleDateChange = (values: RangeValue<dayjs.Dayjs>, formatString: [string, string]) => {
    if (values) {
      setDateRange([values[0]!, values[1]!]);
      console.log(values)
    }
  };

  // mock timer to mimic dashboard data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(undefined as any);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const startDate = dateRange[0].startOf('day').toISOString();
    const endDate = dateRange[1].endOf('day').toISOString();
    console.log("Start Date:", startDate, "End Date:", endDate);

    dispatch(setDashboardDateRange({ startDate, endDate }))
  }, [dateRange]);

  // useEffect(() => {
  //   console.log(startDate, endDate)
  //   debugger

  // }, [startDate, endDate])

  return (
    <div>
      <div>
        <RangePicker value={dateRange} onChange={handleDateChange} />
      </div>
      {
        startDate != "" && endDate != "" &&
        <>
          <Overview loading={loading} />
          {/* <SalePercent loading={loading} /> */}

          {/* <CustomBarChart loading={loading} />
          <CustomAreaChart loading={loading} /> */}
          {/* <TimeLine loading={loading} /> */}

          <SevCharts loading={loading} />
        </>
      }
    </div>
  );
};

export default DashBoardPage;
