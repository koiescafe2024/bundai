import { useCallback, useEffect, useState, type FC } from 'react';
import { Button, Form, Input, InputNumber, Space, Table, Tag, notification, Row, Col } from 'antd';
import axios from 'axios';
import { createSubAgent, getSubAgents, updateSubAgent } from '@/api/agent.api';
import { Agent, AgentList } from '@/interface/agent/agent.interface';
import { Player, PlayerStat } from '@/interface/player/player.interface';
import { getNewEnteringPlayers, getPlayerStats } from '@/api/player.api';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { RangeValue } from 'rc-picker/lib/interface';

import { useDispatch, useSelector } from 'react-redux';
import { setDashboardDateRange } from '@/stores/dashboard.store';
import { setPlayerDateRange } from '@/stores/player.store';
import { TransactionModal } from './transactionModal';
import AddCreditModal from './addCreditModal';

const { RangePicker } = DatePicker;

interface ColumnType {
    key: number;
    _id: string;
    userName: string;
    agent: string;
    totalDepositAmount: number;
    totalDepositTimes: number;
    totalWithdrawalAmount: number;
    totalWithdrawalTimes:number;
    totalProfitAmount: number;
    winlose: number;
    origin: string;
    date: Date;
    totalDepositTrxIDs: string[];
    totalWithdrawalTrxIDs: string[];
    totalDepositTransactions?: TransactionDetailProps[];
    totalWithdrawalTransactions?: TransactionDetailProps[];
}

interface TotalColumnType {
    totalDepositAmount: number,
    totalDepositTimes: number,
    totalWithdrawalAmount: number,
    totalWithdrawalTimes: number,
    totalProfitAmount: number,
    winlose: number,
}

interface TransactionDetailProps {
    clientCode: string;
    date: Date;
    payAmount: number;
    trxNo: string;
    status: string;
}
 
const PlayerStats: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<ColumnType[]>([]);

    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.player);

    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<TransactionDetailProps[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    const handleDateChange = (values: RangeValue<dayjs.Dayjs>, formatString: [string, string]) => {
        if (values) {
            setDateRange([values[0]!, values[1]!]);
            console.log(values)
        }
    };

    useEffect(() => {
        const startDate = dateRange[0].startOf('day').toISOString();
        const endDate = dateRange[1].endOf('day').toISOString();
        console.log("Start Date:", startDate, "End Date:", endDate);

        dispatch(setPlayerDateRange({ startDate, endDate }));
    }, [dateRange]);

    const token : string = localStorage.getItem('token') || '';

    const fetchPlayerStats = async () => {
        const { status, result } = await getPlayerStats(token, {
            startDate,
            endDate
        });

        if (status) {
            let tempData: ColumnType[] = []
            result.map((item: PlayerStat, index: number) => {
                tempData.push({
                    key: index + 1,
                    _id: item._id,
                    userName: item.userName,
                    agent: item.agent,
                    totalDepositAmount: item.totalDepositAmount,
                    totalDepositTimes: item.totalDepositTimes,
                    totalWithdrawalAmount: item.totalWithdrawalAmount,
                    totalWithdrawalTimes: item.totalWithdrawalTimes,
                    totalProfitAmount: item.totalDepositAmount - item.totalWithdrawalAmount,
                    winlose: item.winlose,
                    origin: item.origin,
                    date: item.date,
                    totalDepositTrxIDs: item.totalDepositTrxIDs,
                    totalWithdrawalTrxIDs: item.totalWithdrawalTrxIDs,
                    totalDepositTransactions: item.totalDepositTransactions,
                    totalWithdrawalTransactions: item.totalWithdrawalTransactions
                });
            });

            const totals: ColumnType = calculateTotals(tempData);
            tempData.length > 0 ? tempData.push(totals) : '';
            console.log("tempData", tempData)

            setData(tempData);
        }
    };

    useEffect(() => {
        if(startDate != "" && endDate != "")
            fetchPlayerStats();
    }, [startDate, endDate]);

    const calculateTotals = (data: ColumnType[]) => {
        return data.reduce((acc, curr) => ({
            // Assuming 'null' for non-total columns or specific fields
            userName: 'Total',
            agent: '', // Assuming agent doesn't need a total
            totalDepositAmount: acc.totalDepositAmount + curr.totalDepositAmount,
            totalDepositTimes: acc.totalDepositTimes + curr.totalDepositTimes,
            totalWithdrawalAmount: acc.totalWithdrawalAmount + curr.totalWithdrawalAmount,
            totalWithdrawalTimes: acc.totalWithdrawalTimes + curr.totalWithdrawalTimes,
            totalProfitAmount: acc.totalProfitAmount + curr.totalProfitAmount,
            winlose: acc.winlose + curr.winlose,
            key: acc.key,
            _id: '-1',
            origin: acc.origin,
            date: acc.date,
            totalDepositTrxIDs: [],
            totalWithdrawalTrxIDs: []
            // Add more fields as necessary
        }), {
            key: -1,
            _id: '-1',
            origin: '', 
            date: new Date(),
            userName: 'Total',
            agent: '',
            totalDepositAmount: 0,
            totalDepositTimes: 0,
            totalWithdrawalAmount: 0,
            totalWithdrawalTimes: 0,
            totalProfitAmount: 0,
            winlose: 0,
            totalDepositTrxIDs: [],
            totalWithdrawalTrxIDs: []
            // Initialize other fields as necessary
        });
    };
 
    interface ColumnDataType {
        userName: string;
        agent: string;
        totalDepositAmount: number;
        totalDepositTimes: number;
        totalWithdrawalAmount: number;
        totalWithdrawalTimes: number;
        totalProfitAmount: number;
        winlose: number;
        date: string; // Assuming date is stored as a string (e.g., ISO 8601 format)
        origin: string;
        totalDepositTrxIDs: string[];
        totalWithdrawalTrxIDs: string[];
        totalDepositTransactions: TransactionDetailProps[];
        totalWithdrawalTransactions: TransactionDetailProps[];
    }
    

    const columns: Array<{
        title: string;
        dataIndex: string;
        key: string;
        sorter?: (a: ColumnDataType, b: ColumnDataType) => number;
        render?: (text: any, record: ColumnDataType) => React.ReactNode;
    }> = [
        {
            title: 'UserName',
            dataIndex: 'userName',
            key: 'userName',
            sorter: (a, b) => a.userName.localeCompare(b.userName),
            render: (text: string) => <Tag color="volcano">{text}</Tag>,
        },
        {
            title: 'Agent',
            dataIndex: 'agent',
            key: 'agent',
            sorter: (a, b) => a.agent.localeCompare(b.agent),
        },
        {
            title: 'Total Deposit Amount',
            dataIndex: 'totalDepositAmount',
            key: 'totalDepositAmount',
            sorter: (a, b) => a.totalDepositAmount - b.totalDepositAmount,
            render: (totalDepositAmount: number) => {
                return totalDepositAmount + 'THB';
            }
        },
        {
            title: 'Total Deposit Times',
            dataIndex: 'totalDepositTimes',
            key: 'totalDepositTimes',
            sorter: (a, b) => a.totalDepositTimes - b.totalDepositTimes,
            render: (totalDepositTimes: number, record: ColumnDataType) => {
                return <a onClick={() => {
                    setSelectedUserId(record.userName);
                    setModalContent(record.totalDepositTransactions); // Mock data
                    setIsModalVisible(true);

                    console.log(record.totalDepositTrxIDs, record.totalWithdrawalTrxIDs)
                  }}>{totalDepositTimes}</a>;
            }
        },
        {
            title: 'Total Withdrawal Amount',
            dataIndex: 'totalWithdrawalAmount',
            key: 'totalWithdrawalAmount',
            sorter: (a, b) => a.totalWithdrawalAmount - b.totalWithdrawalAmount,
            render: (totalWithdrawalAmount: number) => {
                return totalWithdrawalAmount + 'THB';
            }
        },
        {
            title: 'Total Withdrawal Times',
            dataIndex: 'totalWithdrawalTimes',
            key: 'totalWithdrawalTimes',
            sorter: (a, b) => a.totalWithdrawalTimes - b.totalWithdrawalTimes,
            render: (totalWithdrawalTimes: number, record: ColumnDataType) => {
                return <a onClick={() => {
                    setSelectedUserId(record.userName);
                    setModalContent(record.totalWithdrawalTransactions); // Mock data
                    setIsModalVisible(true);
                  }}>{totalWithdrawalTimes}</a>;
            }
        },
        {
            title: 'Total Profit',
            dataIndex: 'totalProfitAmount',
            key: 'totalProfitAmount',
            sorter: (a, b) => a.totalProfitAmount - b.totalProfitAmount,
            render: (totalProfitAmount: number) => {
                return  totalProfitAmount + 'THB';
            }
        },
        {
            title: 'Win/Lose',
            dataIndex: 'winlose',
            key: 'winlose',
            sorter: (a, b) => a.winlose - b.winlose,
            render: (winlose: number) => {
                if(winlose > 0)
                    return <span style={{color: '#0f0'}}>{winlose.toFixed(2)}</span>;
                else
                    return <span style={{color: '#f00'}}>{winlose.toFixed(2)}</span>;
            }
        },
        // {
        //     title: 'CreatedAt',
        //     dataIndex: 'date',
        //     key: 'date',
        //     sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        //     render: (date: string) => {
        //         return new Date(date).toLocaleDateString('en-US', {
        //             weekday: 'long',
        //             year: 'numeric',
        //             month: 'long',
        //             day: 'numeric',
        //             hour: '2-digit',
        //             minute: '2-digit',
        //             second: '2-digit',
        //         });
        //     },
        // },
        {
            title: 'Origin',
            dataIndex: 'origin',
            key: 'origin',
            sorter: (a, b) => a.origin.localeCompare(b.origin),
        },

    ];
    
    return (
        <>
            <div style={{ display: 'flex', marginBottom: 16, flex: 'none' }}>
                <RangePicker value={dateRange} onChange={handleDateChange} />
            </div>
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={data}
                    rowKey="key"
                    columns={columns as any}
                    rowClassName="editable-row"
                //   pagination={{
                //     onChange: () => setEditingKey(''),
                //   }}            
                />
            </Form>
            <TransactionModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                content={modalContent}
                userid={selectedUserId}
            />
        </>

    );
};

export default PlayerStats;