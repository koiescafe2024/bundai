import { useEffect, useState, type FC } from 'react';
import { Form, Input, InputNumber, Table, Tag } from 'antd';
import { Player } from '@/interface/player/player.interface';
import { getNewEnteringPlayers } from '@/api/player.api';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { RangeValue } from 'rc-picker/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerDateRange } from '@/stores/player.store';

const { RangePicker } = DatePicker;

interface ColumnType {
    key: string;
    _id: string;
    name: string;
    phone: string;
    balance: number;
    platform: string;
    deptime: number;
    origin: string;
    date: Date;
}

const EditableCell: FC<{
    editing: boolean;
    dataIndex: keyof ColumnType;
    title: string;
    inputType: 'text' | 'number' | 'password';
    record: ColumnType;
    index: number;
    children: React.ReactNode;
}> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
        const inputNode =
            inputType === 'number' ? <InputNumber /> : <Input type={inputType} />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

const NewPlayerStatistics: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<ColumnType[]>([]);

    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.player);

    const handleDateChange = (values: RangeValue<dayjs.Dayjs>, formatString: [string, string]) => {
        if (values) {
            setDateRange([values[0]!, values[1]!]);
            console.log(values);
        }
    };

    useEffect(() => {
        const startDate = dateRange[0].startOf('day').toISOString();
        const endDate = dateRange[1].endOf('day').toISOString();
        console.log("Start Date:", startDate, "End Date:", endDate);

        dispatch(setPlayerDateRange({ startDate, endDate }));
    }, [dateRange]);

    const token : string = localStorage.getItem('token') || '';

    const fetchSubAgents = async () => {
        const { status, result } = await getNewEnteringPlayers(token, {
            startDate,
            endDate
        });

        if (status) {
            let tempData: ColumnType[] = []
            result.map((item: Player, index: number) => {
                tempData.push({
                    key: String(index + 1),
                    _id: item._id,
                    name: item.name,
                    platform: item.platform,
                    balance: item.balance,
                    phone: item.phone,
                    deptime: item.deptime,
                    origin: item.origin,
                    date: item.date
                })
            });

            setData(tempData);
        }
    };

    useEffect(() => {
        if(startDate != "" && endDate != "")
            fetchSubAgents();
    }, [startDate, endDate]);

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <Tag >{text}</Tag>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => (
                <Tag color="volcano">{text}</Tag>
            ),
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (text: string) => (
                <span>{Number(text).toFixed(2)}</span>
            ),
        },
        {
            title: 'Agent',
            dataIndex: 'platform',
            key: 'platform',
        },
        {
            title: 'First Deposit Time',
            dataIndex: 'deptime',
            key: 'deptime',
            render: (deptime: Number) => {
                return deptime ? deptime + 's' : 'N/A';
            }
        },
        {
            title: 'CreatedAt',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => {
                return new Date(date).toLocaleDateString('en-US', {
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
            title: 'Origin',
            dataIndex: 'origin',
            key: 'origin'
        },
    ].map((col) => {
            return col;
    });

    return (
        <>
            <div style={{ display: 'flex', marginBottom: 16, flex: 'none' }}>
                <RangePicker value={dateRange} onChange={handleDateChange} />
            </div>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={data}
                    rowKey="key"
                    columns={columns as any}
                    rowClassName="editable-row"
                />
            </Form>
        </>

    );
};

export default NewPlayerStatistics;
