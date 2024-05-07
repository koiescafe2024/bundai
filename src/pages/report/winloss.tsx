import React, { useEffect, useState, useMemo } from 'react';
import { Form, Table, Tag, DatePicker, Row, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setWinLossDateRange } from '@/stores/winloss.store';
import { getWinLoss } from '@/api/player.api';
import dayjs from 'dayjs';
import type { RangeValue } from 'rc-picker/lib/interface';

const { RangePicker } = DatePicker;

interface ColumnType {
    key: number;
    userid: string;
    username: string;
    platform: string;
    type: string;
    location: string;
    betCount: number;
    validTurnover: number;
    betAmount: number;
    totalBet: number;
    playerWinLoss: number;
    playerAdjustment: number;
    playerTotalPL: number;
    playerMargin: number;
    agentPTWinLoss: number;
    agentAdjustment: number;
    agentTotalPL: number;
    masterAgentPTWinLoss: number;
    masterAgentAdjustment: number;
    masterAgentTotalPL: number;
    companyTotalPL: number;
}

interface SearchTerms {
    userid: string;
    platform: string;
    type: string;
}

const pageSize = 10; // Set the number of items per page

const WinLossReport: React.FC = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<ColumnType[]>([]);
    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.winloss);
    const { agentid } = useSelector(state => state.user);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchPlayerStats = async () => {
        const { status, result } = await getWinLoss(localStorage.getItem('token') || '', { startDate, endDate });
        if (status) {
            const tempData = result.map((item, index) => ({ key: index, ...item }));
            setData(tempData);
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchPlayerStats();
        }
    }, [startDate, endDate]);

    const handleDateChange = (
        values: RangeValue<dayjs.Dayjs>,
        formatString: [string, string]
    ): void => {
        if (values && values[0] && values[1]) {
            const startDate = values[0].startOf('day').toISOString();
            const endDate = values[1].endOf('day').toISOString();
            setDateRange([values[0], values[1]]);
            dispatch(setWinLossDateRange({ startDate, endDate }));
        } else {
            setDateRange([dayjs(), dayjs()]);
            dispatch(setWinLossDateRange({ startDate: '', endDate: '' }));
        }
    };

    const calculateTotals = (data: readonly ColumnType[]): ColumnType => {
        return data.reduce((acc, curr) => ({
            ...acc,
            betCount: acc.betCount + curr.betCount,
            validTurnover: acc.validTurnover + curr.validTurnover,
            betAmount: acc.betAmount + curr.betAmount,
            totalBet: acc.totalBet + curr.totalBet,
            playerWinLoss: acc.playerWinLoss + curr.playerWinLoss,
            playerAdjustment: acc.playerAdjustment + curr.playerAdjustment,
            playerTotalPL: acc.playerTotalPL + curr.playerTotalPL,
            playerMargin: Number(acc.playerMargin) + Number(curr.playerMargin),
            agentPTWinLoss: acc.agentPTWinLoss + curr.agentPTWinLoss,
            agentAdjustment: acc.agentAdjustment + curr.agentAdjustment,
            agentTotalPL: acc.agentTotalPL + curr.agentTotalPL,
            masterAgentPTWinLoss: acc.masterAgentPTWinLoss + curr.masterAgentPTWinLoss,
            masterAgentAdjustment: acc.masterAgentAdjustment + curr.masterAgentAdjustment,
            masterAgentTotalPL: acc.masterAgentTotalPL + curr.masterAgentTotalPL,
            companyTotalPL: acc.companyTotalPL + curr.companyTotalPL,
        }), {
            key: -1,
            userid: 'Total',
            username: '',
            platform: '',
            type: '',
            location: '',
            betCount: 0,
            validTurnover: 0,
            betAmount: 0,
            totalBet: 0,
            playerWinLoss: 0,
            playerAdjustment: 0,
            playerTotalPL: 0,
            playerMargin: 0,
            agentPTWinLoss: 0,
            agentAdjustment: 0,
            agentTotalPL: 0,
            masterAgentPTWinLoss: 0,
            masterAgentAdjustment: 0,
            masterAgentTotalPL: 0,
            companyTotalPL: 0,
        });
    };

    const getPageData = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = data.slice(startIndex, endIndex);

        const totals = calculateTotals(pageData); // Calculate totals for the current page data
        return [...pageData, totals]; // Append the totals row to the current page data
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const pageData = useMemo(getPageData, [data, currentPage]); // Recalculate page data only when data or currentPage changes

    // Filtered data now includes the totals row dynamically added
    const filteredData = useMemo(() => {
        const totalRow = calculateTotals(data);
        return [...data, totalRow];
    }, [data]);


    const columns: any[] = [
        {
            title: 'User ID',
            dataIndex: 'userid',
            key: 'userid',
            render: (text: string) => <Tag color="volcano">{text}</Tag>,
        },
        {
            title: 'UserName',
            dataIndex: 'username',
            key: 'username'
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Bet Count',
            dataIndex: 'betCount',
            key: 'betCount',
        },
        {
            title: 'Valid Turnover',
            dataIndex: 'validTurnover',
            key: 'validTurnover',
        },
        {
            title: 'Bet Amount',
            dataIndex: 'betAmount',
            key: 'betAmount',
        },
        {
            title: 'Total Bet',
            dataIndex: 'totalBet',
            key: 'totalBet',
        },
        {
            title: 'Player',
            children: [
                {
                    title: 'Win/Loss',
                    dataIndex: 'playerWinLoss',
                    key: 'playerWinLoss',
                    render: (text: string) => Number(text) <= 0 ? <Tag color="red">{Number(text).toFixed(2)}</Tag> : <Tag color='green'>{Number(text).toFixed(2)}</Tag>
                },
                {
                    title: 'Adjustment',
                    dataIndex: 'playerAdjustment',
                    key: 'playerAdjustment',
                },
                {
                    title: 'Total P/L',
                    dataIndex: 'playerTotalPL',
                    key: 'playerTotalPL',
                    onCell: () => {
                        return {
                            style: {
                                backgroundColor: 'yellow'
                            }
                        };
                    },
                    render: (text: string) => Number(text) <= 0 ? <span style={{color: 'red'}}> {Number(text).toFixed(2)}</span> : <span style={{color: 'green'}}> {Number(text).toFixed(2)}</span>,
                },
                {
                    title: 'Margin (%)',
                    dataIndex: 'playerMargin',
                    key: 'playerMargin',
                    render: (text: string) => Number(text) > 0 ? <Tag color="red">{Number(text).toFixed(2)}</Tag> : <>{Number(text).toFixed(2)}</>
                },
            ],
        },
        {
            title: 'Agent',
            children: [
                {
                    title: 'PT Win/Loss',
                    dataIndex: 'agentPTWinLoss',
                    key: 'agentPTWinLoss',
                    render: (text: string) => 0
                },
                {
                    title: 'Adjustment',
                    dataIndex: 'agentAdjustment',
                    key: 'agentAdjustment',
                    render: (text: string) => 0
                },
                {
                    title: 'Total P/L',
                    dataIndex: 'agentTotalPL',
                    key: 'agentTotalPL',
                    render: (text: string) =>  0,
                }
            ],
        },
        {
            title: 'Master Agent',
            children: [
                {
                    title: 'PT Win/Loss',
                    dataIndex: 'agentPTWinLoss',
                    key: 'agentPTWinLoss',
                    render: (text: string) => Number(text) * -1 <= 0 ? <Tag color="red">{(Number(text) * 0.9 * -1).toFixed(2)}</Tag> : <>{(Number(text) * 0.9 * -1).toFixed(2)}</>
                },
                {
                    title: 'Adjustment',
                    dataIndex: 'agentAdjustment',
                    key: 'agentAdjustment',
                },
                {
                    title: 'Total P/L',
                    dataIndex: 'agentTotalPL',
                    key: 'agentTotalPL',
                    onCell: () => {
                        return {
                            style: {
                                backgroundColor: 'yellow'
                            }
                        };
                    },
                    render: (text: string) =>  (Number(text) * 0.9 * -1) <= 0 ? <span style={{color: 'red'}}><span>{(Number(text) * 0.9 * -1).toFixed(2)}</span></span> : 
                    <span style={{ color: 'green' }}>{(Number(text) * 0.9 * -1).toFixed(2)}</span>,
                }
            ],
        },
        {
            title: 'Master Franchise',
            children: [
                {
                    title: 'PT Win/Loss',
                    dataIndex: 'playerWinLoss',
                    key: 'playerWinLoss',
                    render: (text: string) => Number(text) * -1 <= 0 ? <Tag color="red">{(Number(text) * 0.04 * -1).toFixed(2)}</Tag> : <>{(Number(text) * 0.04 * -1).toFixed(2)}</>
                },
                {
                    title: 'Adjustment',
                    dataIndex: 'playerAdjustment',
                    key: 'playerAdjustment',
                },
                {
                    title: 'Total P/L',
                    dataIndex: 'playerWinLoss',
                    key: 'playerWinLoss',
                    onCell: () => {
                        return {
                            style: {
                                backgroundColor: 'yellow'
                            }
                        };
                    },
                    render: (text: string) => (Number(text) * 0.04 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.04 * -1).toFixed(2)}</span> : 
                    <span style={{ color: 'green' }}>{(Number(text) * 0.04 * -1).toFixed(2)}</span>,
                }
            ],
            hidden: agentid === "master" ? false : true
        },
        {
            title: 'Company',
            children: [
                {
                    title: 'Total P/L',
                    dataIndex: 'playerWinLoss',
                    key: 'playerWinLoss',
                    onCell: () => {
                        return {
                            style: {
                                backgroundColor: 'yellow'
                            }
                        };
                    },
                    render: (text: number) => <span style={{ color: 'black' }}>
                        {agentid !== 'master' ?  (Number(text) * 0.1 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.1 * -1).toFixed(2)}</span> : <span style={{color: 'green'}}>{(Number(text) * 0.1 * -1).toFixed(2)}</span> : (Number(text) * 0.06 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.06 * -1).toFixed(2)}</span> : <span style={{ color: 'green'}}>{(Number(text) * 0.06 * -1).toFixed(2)}</span> }
                    </span>,
                }
            ],
        },
    ]
    .filter(item => !item.hidden);

    return (
        <>
            <div style={{ display: 'flex', marginBottom: 16, alignItems: 'center', flex: 'none' }}>
                <RangePicker
                    value={dateRange}
                    onChange={handleDateChange}
                    />
                <Row gutter={16} style={{ marginLeft: '16px' }}>
                    {/* Input and Select components for filtering */}
                </Row>
            </div>

            <Table
                dataSource={pageData}
                pagination={false}
                rowKey="key"
                bordered
                columns={columns}
                // columns and other props
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={data.length}
                onChange={handlePageChange}
            />
        </>
    );
};

export default WinLossReport;

// import React, { useEffect, useState, useMemo } from 'react';
// import { Form, Table, Tag, DatePicker, Row, Pagination } from 'antd';
// import { useDispatch, useSelector } from 'react-redux';
// import { setWinLossDateRange } from '@/stores/winloss.store';
// import { getWinLoss } from '@/api/player.api';
// import dayjs from 'dayjs';
// import type { RangeValue } from 'rc-picker/lib/interface';

// const { RangePicker } = DatePicker;

// interface ColumnType {
//     key: number;
//     userid: string;
//     username: string;
//     platform: string;
//     type: string;
//     location: string;
//     betCount: number;
//     validTurnover: number;
//     betAmount: number;
//     totalBet: number;
//     playerWinLoss: number;
//     playerAdjustment: number;
//     playerTotalPL: number;
//     playerMargin: number;
//     agentPTWinLoss: number;
//     agentAdjustment: number;
//     agentTotalPL: number;
//     masterAgentPTWinLoss: number;
//     masterAgentAdjustment: number;
//     masterAgentTotalPL: number;
//     companyTotalPL: number;
// }

// interface SearchTerms {
//     userid: string;
//     platform: string;
//     type: string;
// }

// const pageSize = 10; // Set the number of items per page

// const WinLossReport: React.FC = () => {
//     const dispatch = useDispatch();
//     const [data, setData] = useState<ColumnType[]>([]);
//     const today = dayjs();
//     const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
//     const { startDate, endDate } = useSelector(state => state.winloss);
//     const { agentid } = useSelector(state => state.user);
//     const [currentPage, setCurrentPage] = useState(1);

//     const fetchPlayerStats = async () => {
//         const { status, result } = await getWinLoss(localStorage.getItem('token') || '', { startDate, endDate });
//         if (status) {
//             const tempData = result.map((item, index) => ({ key: index, ...item }));
//             setData(tempData);
//         }
//     };

//     useEffect(() => {
//         if (startDate && endDate) {
//             fetchPlayerStats();
//         }
//     }, [startDate, endDate]);

//     const handleDateChange = (
//         values: RangeValue<dayjs.Dayjs>,
//         formatString: [string, string]
//     ): void => {
//         if (values && values[0] && values[1]) {
//             const startDate = values[0].startOf('day').toISOString();
//             const endDate = values[1].endOf('day').toISOString();
//             setDateRange([values[0], values[1]]);
//             dispatch(setWinLossDateRange({ startDate, endDate }));
//         } else {
//             setDateRange([dayjs(), dayjs()]);
//             dispatch(setWinLossDateRange({ startDate: '', endDate: '' }));
//         }
//     };

//     const calculateTotals = (data: readonly ColumnType[]): ColumnType => {
//         return data.reduce((acc, curr) => ({
//             ...acc,
//             betCount: acc.betCount + curr.betCount,
//             validTurnover: acc.validTurnover + curr.validTurnover,
//             betAmount: acc.betAmount + curr.betAmount,
//             totalBet: acc.totalBet + curr.totalBet,
//             playerWinLoss: acc.playerWinLoss + curr.playerWinLoss,
//             playerAdjustment: acc.playerAdjustment + curr.playerAdjustment,
//             playerTotalPL: acc.playerTotalPL + curr.playerTotalPL,
//             playerMargin: Number(acc.playerMargin) + Number(curr.playerMargin),
//             agentPTWinLoss: acc.agentPTWinLoss + curr.agentPTWinLoss,
//             agentAdjustment: acc.agentAdjustment + curr.agentAdjustment,
//             agentTotalPL: acc.agentTotalPL + curr.agentTotalPL,
//             masterAgentPTWinLoss: acc.masterAgentPTWinLoss + curr.masterAgentPTWinLoss,
//             masterAgentAdjustment: acc.masterAgentAdjustment + curr.masterAgentAdjustment,
//             masterAgentTotalPL: acc.masterAgentTotalPL + curr.masterAgentTotalPL,
//             companyTotalPL: acc.companyTotalPL + curr.companyTotalPL,
//         }), {
//             key: -1,
//             userid: 'Total',
//             username: '',
//             platform: '',
//             type: '',
//             location: '',
//             betCount: 0,
//             validTurnover: 0,
//             betAmount: 0,
//             totalBet: 0,
//             playerWinLoss: 0,
//             playerAdjustment: 0,
//             playerTotalPL: 0,
//             playerMargin: 0,
//             agentPTWinLoss: 0,
//             agentAdjustment: 0,
//             agentTotalPL: 0,
//             masterAgentPTWinLoss: 0,
//             masterAgentAdjustment: 0,
//             masterAgentTotalPL: 0,
//             companyTotalPL: 0,
//         });
//     };

//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     // const mergedData = useMemo(() => {
//     //     const mergedMap = new Map<string, ColumnType>();
//     //     data.forEach((item) => {
//     //         const existing = mergedMap.get(item.userid);
//     //         if (existing) {
//     //             mergedMap.set(item.userid, {
//     //                 ...existing,
//     //                 betCount: existing.betCount + item.betCount,
//     //                 validTurnover: existing.validTurnover + item.validTurnover,
//     //                 betAmount: existing.betAmount + item.betAmount,
//     //                 totalBet: existing.totalBet + item.totalBet,
//     //                 playerWinLoss: existing.playerWinLoss + item.playerWinLoss,
//     //                 playerAdjustment: existing.playerAdjustment + item.playerAdjustment,
//     //                 playerTotalPL: existing.playerTotalPL + item.playerTotalPL,
//     //                 playerMargin: existing.playerMargin + item.playerMargin,
//     //                 agentPTWinLoss: existing.agentPTWinLoss + item.agentPTWinLoss,
//     //                 agentAdjustment: existing.agentAdjustment + item.agentAdjustment,
//     //                 agentTotalPL: existing.agentTotalPL + item.agentTotalPL,
//     //                 masterAgentPTWinLoss: existing.masterAgentPTWinLoss + item.masterAgentPTWinLoss,
//     //                 masterAgentAdjustment: existing.masterAgentAdjustment + item.masterAgentAdjustment,
//     //                 masterAgentTotalPL: existing.masterAgentTotalPL + item.masterAgentTotalPL,
//     //                 companyTotalPL: existing.companyTotalPL + item.companyTotalPL,
//     //             });
//     //         } else {
//     //             mergedMap.set(item.userid, { ...item });
//     //         }
//     //     });
//     //     return Array.from(mergedMap.values());
//     // }, [data]);

//     const mergedData = useMemo(() => {
//         const mergedMap = new Map<string, { user: ColumnType, rows: ColumnType[] }>();
//         data.forEach((item) => {
//             const existing = mergedMap.get(item.userid);
//             if (existing) {
//                 existing.rows.push(item);
//                 existing.user.betCount += item.betCount;
//                 existing.user.validTurnover += item.validTurnover;
//                 existing.user.betAmount += item.betAmount;
//                 existing.user.totalBet += item.totalBet;
//                 existing.user.playerWinLoss += item.playerWinLoss;
//                 existing.user.playerAdjustment += item.playerAdjustment;
//                 existing.user.playerTotalPL += item.playerTotalPL;
//                 existing.user.playerMargin += item.playerMargin;
//                 existing.user.agentPTWinLoss += item.agentPTWinLoss;
//                 existing.user.agentAdjustment += item.agentAdjustment;
//                 existing.user.agentTotalPL += item.agentTotalPL;
//                 existing.user.masterAgentPTWinLoss += item.masterAgentPTWinLoss;
//                 existing.user.masterAgentAdjustment += item.masterAgentAdjustment;
//                 existing.user.agentTotalPL += item.agentTotalPL;
//                 existing.user.companyTotalPL += item.companyTotalPL;
//             } else {
//                 mergedMap.set(item.userid, { user: { ...item }, rows: [item] });
//             }
//         });
//         console.log("d-----------", Array.from(mergedMap.values()))
//         return Array.from(mergedMap.values());
//     }, [data]);

//     const columns: any[] = [
//         {
//             title: 'User ID',
//             dataIndex: 'userid',
//             key: 'userid',
//             render: (text: string) => <a onClick={() => handleUserIdClick(text)}>{text}</a>,
//         },
//         {
//             title: 'UserName',
//             dataIndex: 'username',
//             key: 'username'
//         },
//         {
//             title: 'Platform',
//             dataIndex: 'platform',
//             key: 'platform',
//         },
//         {
//             title: 'Type',
//             dataIndex: 'type',
//             key: 'type',
//         },
//         {
//             title: 'Location',
//             dataIndex: 'location',
//             key: 'location',
//         },
//         {
//             title: 'Bet Count',
//             dataIndex: 'betCount',
//             key: 'betCount',
//         },
//         {
//             title: 'Valid Turnover',
//             dataIndex: 'validTurnover',
//             key: 'validTurnover',
//         },
//         {
//             title: 'Bet Amount',
//             dataIndex: 'betAmount',
//             key: 'betAmount',
//         },
//         {
//             title: 'Total Bet',
//             dataIndex: 'totalBet',
//             key: 'totalBet',
//         },
//         {
//             title: 'Player',
//             children: [
//                 {
//                     title: 'Win/Loss',
//                     dataIndex: 'playerWinLoss',
//                     key: 'playerWinLoss',
//                     render: (text: string) => Number(text) <= 0 ? <Tag color="red">{Number(text).toFixed(2)}</Tag> : <Tag color='green'>{Number(text).toFixed(2)}</Tag>
//                 },
//                 {
//                     title: 'Adjustment',
//                     dataIndex: 'playerAdjustment',
//                     key: 'playerAdjustment',
//                 },
//                 {
//                     title: 'Total P/L',
//                     dataIndex: 'playerTotalPL',
//                     key: 'playerTotalPL',
//                     onCell: () => {
//                         return {
//                             style: {
//                                 backgroundColor: 'yellow'
//                             }
//                         };
//                     },
//                     render: (text: string) => Number(text) <= 0 ? <span style={{color: 'red'}}> {Number(text).toFixed(2)}</span> : <span style={{color: 'green'}}> {Number(text).toFixed(2)}</span>,
//                 },
//                 {
//                     title: 'Margin (%)',
//                     dataIndex: 'playerMargin',
//                     key: 'playerMargin',
//                     render: (text: string) => Number(text) > 0 ? <Tag color="red">{Number(text).toFixed(2)}</Tag> : <>{Number(text).toFixed(2)}</>
//                 },
//             ],
//         },
//         {
//             title: 'Agent',
//             children: [
//                 {
//                     title: 'PT Win/Loss',
//                     dataIndex: 'agentPTWinLoss',
//                     key: 'agentPTWinLoss',
//                     render: (text: string) => 0
//                 },
//                 {
//                     title: 'Adjustment',
//                     dataIndex: 'agentAdjustment',
//                     key: 'agentAdjustment',
//                     render: (text: string) => 0
//                 },
//                 {
//                     title: 'Total P/L',
//                     dataIndex: 'agentTotalPL',
//                     key: 'agentTotalPL',
//                     render: (text: string) =>  0,
//                 }
//             ],
//         },
//         {
//             title: 'Master Agent',
//             children: [
//                 {
//                     title: 'PT Win/Loss',
//                     dataIndex: 'agentPTWinLoss',
//                     key: 'agentPTWinLoss',
//                     render: (text: string) => Number(text) * -1 <= 0 ? <Tag color="red">{(Number(text) * 0.9 * -1).toFixed(2)}</Tag> : <>{(Number(text) * 0.9 * -1).toFixed(2)}</>
//                 },
//                 {
//                     title: 'Adjustment',
//                     dataIndex: 'agentAdjustment',
//                     key: 'agentAdjustment',
//                 },
//                 {
//                     title: 'Total P/L',
//                     dataIndex: 'agentTotalPL',
//                     key: 'agentTotalPL',
//                     onCell: () => {
//                         return {
//                             style: {
//                                 backgroundColor: 'yellow'
//                             }
//                         };
//                     },
//                     render: (text: string) =>  (Number(text) * 0.9 * -1) <= 0 ? <span style={{color: 'red'}}><span>{(Number(text) * 0.9 * -1).toFixed(2)}</span></span> : 
//                     <span style={{ color: 'green' }}>{(Number(text) * 0.9 * -1).toFixed(2)}</span>,
//                 }
//             ],
//         },
//         {
//             title: 'Master Franchise',
//             children: [
//                 {
//                     title: 'PT Win/Loss',
//                     dataIndex: 'playerWinLoss',
//                     key: 'playerWinLoss',
//                     render: (text: string) => Number(text) * -1 <= 0 ? <Tag color="red">{(Number(text) * 0.04 * -1).toFixed(2)}</Tag> : <>{(Number(text) * 0.04 * -1).toFixed(2)}</>
//                 },
//                 {
//                     title: 'Adjustment',
//                     dataIndex: 'playerAdjustment',
//                     key: 'playerAdjustment',
//                 },
//                 {
//                     title: 'Total P/L',
//                     dataIndex: 'playerWinLoss',
//                     key: 'playerWinLoss',
//                     onCell: () => {
//                         return {
//                             style: {
//                                 backgroundColor: 'yellow'
//                             }
//                         };
//                     },
//                     render: (text: string) => (Number(text) * 0.04 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.04 * -1).toFixed(2)}</span> : 
//                     <span style={{ color: 'green' }}>{(Number(text) * 0.04 * -1).toFixed(2)}</span>,
//                 }
//             ],
//             hidden: agentid === "master" ? false : true
//         },
//         {
//             title: 'Company',
//             children: [
//                 {
//                     title: 'Total P/L',
//                     dataIndex: 'playerWinLoss',
//                     key: 'playerWinLoss',
//                     onCell: () => {
//                         return {
//                             style: {
//                                 backgroundColor: 'yellow'
//                             }
//                         };
//                     },
//                     render: (text: number) => <span style={{ color: 'black' }}>
//                         {agentid !== 'master' ?  (Number(text) * 0.1 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.1 * -1).toFixed(2)}</span> : <span style={{color: 'green'}}>{(Number(text) * 0.1 * -1).toFixed(2)}</span> : (Number(text) * 0.06 * -1) <= 0 ? <span style={{color: 'red'}}>{(Number(text) * 0.06 * -1).toFixed(2)}</span> : <span style={{ color: 'green'}}>{(Number(text) * 0.06 * -1).toFixed(2)}</span> }
//                     </span>,
//                 }
//             ],
//         },
//     ].filter(item => !item.hidden);

//     // Function to handle user ID click
//     const handleUserIdClick = (userId: string) => {
//         // Implement your logic to show detailed information for the user
//         console.log(`User ID clicked: ${userId}`);
//     };

//     return (
//         <>
//             <div style={{ display: 'flex', marginBottom: 16, alignItems: 'center', flex: 'none' }}>
//                 <RangePicker
//                     value={dateRange}
//                     onChange={handleDateChange}
//                 />
//                 <Row gutter={16} style={{ marginLeft: '16px' }}>
//                     {/* Input and Select components for filtering */}
//                 </Row>
//             </div>

//             <Table
//                 dataSource={mergedData.map(record => record.user)}
//                 pagination={false}
//                 rowKey={(record) => {console.log('record.user.key-------------', record.key); return record.key;}}
//                 bordered
//                 columns={columns}
//                 expandable={{
//                     expandedRowRender: rec => {
//                       const newSubData: ColumnType[] = []  
//                       mergedData.map(record => { if(rec == record.user) newSubData.push(...record.rows)}  )
//                         console.log("newSubData========", newSubData)
//                         return   <Table
//                                 dataSource={newSubData}
//                                 pagination={false}
//                                 rowKey="key"
//                                 bordered
//                                 columns={columns}
//                             />
//                     },
//                     // rowExpandable: record => record.rows.length > 0,
//                 }}
//             />

//             <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={data.length}
//                 onChange={handlePageChange}
//             />
//         </>
//     );
// };

// export default WinLossReport;
