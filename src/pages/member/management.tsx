import { useEffect, useState, FC } from 'react';
import { Form, Input, InputNumber, Table, Tag, Modal, Button, DatePicker, notification, Switch, Space } from 'antd';
import { Player } from '@/interface/player/player.interface';
import { getMembers, updatePassword, updateAccess, updatePlayer} from '@/api/player.api';  // Assuming updatePlayer is the API to update player data
import { RangeValue } from 'rc-picker/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerDateRange } from '@/stores/player.store';
import dayjs from 'dayjs';
import { access } from 'fs';

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
    access: boolean;
    bban: string;
    bbn: string;
    bbun: string;
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

const MemberManagement: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<ColumnType[]>([]);
    const [filteredData, setFilteredData] = useState<ColumnType[]>([]);
    const [editingKey, setEditingKey] = useState('');

    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.player);

    const [visible, setVisible] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [searchPhone, setSearchPhone] = useState('');

    useEffect(() => {
        const startDate = dateRange[0].startOf('day').toISOString();
        const endDate = dateRange[1].endOf('day').toISOString();
        dispatch(setPlayerDateRange({ startDate, endDate }));
    }, [dateRange]);

    const isEditing = (record: ColumnType) => record.key === editingKey;

    const edit = (record: Partial<ColumnType> & { key: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as ColumnType;
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
                await updatePlayer(token, { ...item, ...row });  // Update the player details on the server
                notification.success({
                    message: 'Update Successful',
                    description: 'Player details updated successfully.',
                });
            }
        } catch (errInfo) {
            notification.error({
                message: 'Update Failed',
                description: 'Failed to save changes. Please try again.',
            });
        }
    };

    const token: string = localStorage.getItem('token') || '';

    // const updateAccess = async (token: string, updateData: { playerId: string; access: boolean }) => {
    //     // Mocked API call function
    //     console.log(updateData.playerId, updateData.access);
    //     // ObjectId, boolean

    //     return {
    //         status: Math.random() > 0.5, // Simulates a 50% chance of success
    //     };
    // };

    const handleToggleAccess = async (id: string, checked: boolean) => {
        console.log("Toggling access for player with id:", id, "New access state:", checked);
        const response = await updateAccess(token, { userId: id, access: checked });
    
        if (response.status) {
            notification.success({
                message: 'Access Update',
                description: `Access is now ${checked ? 'enabled' : 'disabled'}.`,
            });
            // Update local data to reflect the change immediately
            setData(data.map(item => {
                if (item._id === id) {
                    return { ...item, access: checked };
                }
                return item;
            }));
        } else {
            notification.error({
                message: 'Access Update',
                description: 'Failed to update access!',
            });
        }
    };

    const fetchSubAgents = async () => {
        const { status, result } = await getMembers(token, {});

        if (status) {
            let tempData: ColumnType[] = result.map((item: Player, index: number) => ({
                key: String(index + 1),
                _id: item._id,
                name: item.name,
                platform: item.platform,
                balance: item.balance,
                phone: item.phone,
                deptime: item.deptime,
                origin: item.origin,
                date: item.date,
                access: item.access,
                bban: item.bban,
                bbn: item.bbn,
                bbun: item.bbun
            }));

            setData(tempData);
            setFilteredData(tempData);  // Initialize filteredData with full dataset
        }
    };

    useEffect(() => {
        if (startDate !== "" && endDate !== "") {
            fetchSubAgents();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // Filter data based on the search term
        const filtered = data.filter(item => item.phone.includes(searchPhone));
        setFilteredData(filtered);
    }, [searchPhone, data]);

    const handlePasswordChange = (record: ColumnType) => {
        setSelectedPlayerId(record._id);
        setVisible(true);
    };

    const handlePasswordChangeSubmit = async () => {
        console.log("Changing password for player with id:", selectedPlayerId, "New password:", newPassword);

        const response = await updatePassword(token, {
            selectedPlayerId, 
            newPassword
        });

        if(response.status) {
            notification.success({
                message: 'Password Change',
                description: 'Changed password successfully!',
            });
        } else {
            notification.error({
                message: 'Password Change',
                description: 'Failed changing password!'
            });
        }
        
        setVisible(false);
    };

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            editable: true,
            render: (text: string) => <Tag color="volcano">{text}</Tag>,
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            editable: true,
            render: (text: string) => (
                <span>{Number(text).toFixed(2)}</span>
            ),
        },
        {
            title: 'Agent',
            dataIndex: 'platform',
            key: 'platform',
            editable: true,
        },
        {
            title: 'First Deposit Time',
            dataIndex: 'deptime',
            key: 'deptime',
            editable: true,
            render: (deptime: Number) => {
                return deptime ? deptime + 's' : 'N/A';
            }
        },
        {
            title: 'CreatedAt',
            dataIndex: 'date',
            key: 'date',
            editable: true,
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
        // {
        //     title: 'Origin',
        //     dataIndex: 'origin',
        //     key: 'origin',
        //     editable: true,
        // },
        {
            title: 'bban',
            dataIndex: 'bban',
            key: 'bban',
            editable: true,
        },
        {
            title: 'bbn',
            dataIndex: 'bbn',
            key: 'bbn',
            editable: true,
        },
        {
            title: 'bbun',
            dataIndex: 'bbun',
            key: 'bbun',
            editable: true,
        },
        {
            title: 'Access',
            key: 'access',
            dataIndex: 'access',
            render: (access: boolean, record: ColumnType) => (
                <Switch
                    checked={access}
                    onChange={checked => handleToggleAccess(record._id, checked)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ColumnType) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space size="middle">
                        <Button onClick={() => save(record.key)}>Save</Button>
                    </Space>
                ) : (
                    <Space size="middle">
                        <Button onClick={() => edit(record)}>Edit</Button>
                        <Button type="primary" onClick={() => handlePasswordChange(record)}>Change Password</Button>
                    </Space>
                );
            },
        },
    ].map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ColumnType) => ({
                record,
                // inputType: col.inputType || 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });;

    return (
        <>
            <Input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                style={{ width: 200, marginBottom: 16, flex: 'none' }}
            />
            <Modal
                title="Change Password"
                open={visible}
                onCancel={() => {
                    setVisible(false);
                    setNewPassword('');
                }}
                footer={null}
            >
                <Input.Password
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onPressEnter={handlePasswordChangeSubmit}
                    autoFocus
                />
                <Button 
                    onClick={handlePasswordChangeSubmit} type="primary"
                    style={{ marginTop: '10px', width: '100%' }}
                >
                    Submit
                </Button>
            </Modal>
            <Form form={form} component={false}>
                {/* <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={filteredData}  // Use filtered data for rendering
                    rowKey="key"
                    columns={columns as any}
                    rowClassName="editable-row"
                /> */}
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={filteredData}
                    rowKey="key"
                    columns={columns as any}
                    rowClassName="editable-row"
                />
            </Form>
        </>
    );
};

export default MemberManagement;