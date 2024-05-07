import { useEffect, useState, type FC } from 'react';
import { Form, Table, Tag, Input, Row, Col } from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { RangeValue } from 'rc-picker/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { setBetsDateRange } from '@/stores/bets.store';
import { getHistoryBets } from '@/api/history.api';
import { Bet } from '@/interface/history/bet.interface';

const { RangePicker } = DatePicker;

interface ColumnType {
    key: number;
    userId: string;
    gameType: string;
    gameCode: string;
    gameName: string;
    platform: string;
    currency: string;
    betTime: Date;
    txTime: Date;
    betAmount: number;
    turnover: number;
    winAmount: number;
    action: string;
    refPlatformTxId: string;
    settleType: string;
}

interface SearchTerms {
    userId: string;
    gameType: string;
    gameName: string;
    gameCode: string;
    platform: string;
    action: string;
}


const BetsHistory: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<ColumnType[]>([]);

    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.bets);

    // State hooks for search terms
    const [searchTerms, setSearchTerms] = useState<SearchTerms>({
        userId: '',
        gameType: '',
        gameName: '',
        gameCode: '',
        platform: '',
        action: '',
    });

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
        dispatch(setBetsDateRange({ startDate, endDate }));
    }, [dateRange]);

    const token : string = localStorage.getItem('token') || '';

    const fetchPlayerStats = async () => {
        const { status, result } = await getHistoryBets(token, {
            startDate,
            endDate
        });

        if (status) {
            let tempData: ColumnType[] = []
            result.map((item: Bet, index: number) => {
                tempData.push({
                    key: index + 1,
                    userId: item.userId,
                    gameType: item.gameType,
                    gameName: item.gameName,
                    gameCode: item.gameCode,
                    platform: item.platform,
                    currency: item.currency,
                    betTime: item.betTime,
                    txTime: item.txTime,
                    betAmount: item.betAmount,
                    turnover: item.turnover,
                    winAmount: item.winAmount,
                    action: item.action,
                    refPlatformTxId: item.refPlatformTxId,
                    settleType: item.settleType
                });
            });

            // const totals: ColumnType = calculateTotals(tempData);
            // tempData.length > 0 ? tempData.push(totals) : '';
            // console.log("tempData", tempData);

            setData(tempData);
        }
    };

    useEffect(() => {
        if(startDate != "" && endDate != "")
            fetchPlayerStats();
    }, [startDate, endDate]);

    const filteredData = data.filter(item => {
        return (
            (item.userId?.toLowerCase() ?? '').includes(searchTerms.userId.toLowerCase()) &&
            (item.gameType?.toLowerCase() ?? '').includes(searchTerms.gameType.toLowerCase()) &&
            (item.gameName?.toLowerCase() ?? '').includes(searchTerms.gameName.toLowerCase()) &&
            (item.gameCode?.toLowerCase() ?? '').includes(searchTerms.gameCode.toLowerCase()) &&
            (item.platform?.toLowerCase() ?? '').includes(searchTerms.platform.toLowerCase()) &&
            (item.action?.toLowerCase() ?? '').includes(searchTerms.action.toLowerCase())
        );
    });
    
    // Define the onChange handler
    const handleSearchChange = (key: keyof SearchTerms) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerms({
            ...searchTerms,
            [key]: e.target.value,
        });
    };

    const columns: Array<{
        title: string;
        dataIndex: string;
        key: string;
        sorter?: (a: ColumnType, b: ColumnType) => number;
        render?: (text: any, record: ColumnType) => React.ReactNode;
    }> = [
        {
            title: 'UserId',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId.localeCompare(b.userId),
            render: (text: string) => <Tag color="volcano">{text}</Tag>,
        },
        {
            title: 'GameType',
            dataIndex: 'gameType',
            key: 'gameType',
            sorter: (a, b) => a.gameType.localeCompare(b.gameType),
        },
        {
            title: 'GameName',
            dataIndex: 'gameName',
            key: 'gameName',
            sorter: (a, b) => a.gameName.localeCompare(b.gameName),
        },
        {
            title: 'GameCode',
            dataIndex: 'gameCode',
            key: 'gameCode',
            sorter: (a, b) => a.gameCode.localeCompare(b.gameCode),
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
            sorter: (a, b) => a.platform.localeCompare(b.platform),
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
            sorter: (a, b) => a.currency.localeCompare(b.currency),
        },
        {
            title: 'BetAmount',
            dataIndex: 'betAmount',
            key: 'betAmount',
            sorter: (a, b) => a.betAmount - b.betAmount,
            render: (betAmount: number) => {
                return betAmount;
            }
        },
        {
            title: 'TurnOver',
            dataIndex: 'turnover',
            key: 'turnover',
            sorter: (a, b) => a.turnover - b.turnover,
            render: (turnover: number) => {
                return turnover;
            }
        },
        {
            title: 'WinAmount',
            dataIndex: 'winAmount',
            key: 'winAmount',
            sorter: (a, b) => a.winAmount - b.winAmount,
            render: (winAmount: number) => {
                return winAmount;
            }
        },
        {
            title: 'RefPlatformTxId',
            dataIndex: 'refPlatformTxId',
            key: 'refPlatformTxId',
            sorter: (a, b) => a.refPlatformTxId.localeCompare(b.refPlatformTxId),
        },
        {
            title: 'SettleType',
            dataIndex: 'settleType',
            key: 'settleType',
            sorter: (a, b) => a.settleType.localeCompare(b.settleType),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            sorter: (a, b) => a.action.localeCompare(b.action),
        },
        {
            title: 'BetTime',
            dataIndex: 'betTime',
            key: 'betTime',
            sorter: (a, b) => new Date(a.betTime).getTime() - new Date(b.betTime).getTime(),
            render: (betTime: string) => {
                return new Date(betTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            },
        },
        {
            title: 'TxTime',
            dataIndex: 'txTime',
            key: 'txTime',
            sorter: (a, b) => new Date(a.txTime).getTime() - new Date(b.txTime).getTime(),
            render: (txTime: string) => {
                return new Date(txTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            },
        }
    ];
    
    return (
        <>
            <div style={{ display: 'flex', marginBottom: 16, flex: 'none' }}>
                <RangePicker value={dateRange} onChange={handleDateChange} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, flex: 'none' }}>
                <Row gutter={16} style={{ marginTop: 16 }}>
                    {Object.keys(searchTerms).map((key) => (
                        <Col key={key} span={4}>
                            <Input
                                placeholder={`Search by ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                value={searchTerms[key as keyof SearchTerms]}
                                onChange={handleSearchChange(key as keyof SearchTerms)}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={filteredData}
                    rowKey="key"
                    columns={columns}
                    rowClassName="editable-row"
                />
            </Form>
        </>
    );
};

export default BetsHistory;