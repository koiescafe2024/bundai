import { useEffect, useState, FC } from 'react';
import { Form, Input, InputNumber, Table, Tag, Modal, Button, DatePicker, notification, Switch, Space } from 'antd';
import { Admin, Player } from '@/interface/player/player.interface';
import { getMembers, updatePassword, updateAccess, updatePlayer, getAdmins, createAdmin } from '@/api/player.api';  // Assuming updatePlayer is the API to update player data
import { RangeValue } from 'rc-picker/lib/interface';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerDateRange } from '@/stores/player.store';
import dayjs from 'dayjs';
import { access } from 'fs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

interface ColumnType {
    key: string;
    _id: string;
    userid: string;
    agentid: string;
    platform: number;
    role: string;
    date: Date;
    twoFactorEnabled: boolean;
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

const EditRole: FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const [data, setData] = useState<ColumnType[]>([]);
    const [filteredData, setFilteredData] = useState<ColumnType[]>([]);
    const [editingKey, setEditingKey] = useState('');
    const navigate = useNavigate();

    const today = dayjs();
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([today, today]);
    const { startDate, endDate } = useSelector(state => state.player);

    const [visible, setVisible] = useState(false);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [searchPhone, setSearchPhone] = useState('');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        userid: '',
        password: '',
        agentid: '',
        platform: '',
        role: '',
        // twoFactorEnabled: false,
    });

    useEffect(() => {
        const startDate = dateRange[0].startOf('day').toISOString();
        const endDate = dateRange[1].endOf('day').toISOString();
        dispatch(setPlayerDateRange({ startDate, endDate }));
    }, [dateRange]);

    const editRole = async (admin_id: String) => {
        navigate('/member/employee-edit-role/' + admin_id);        
    }

    const token: string = localStorage.getItem('token') || '';

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

    const handleAddEmployee = async () => {
        const response = await createAdmin(token, newEmployee);
        if (response.status) {
            notification.success({
                message: 'Employee Added',
                description: 'A new employee has been added successfully.',
            });
            setIsModalVisible(false);
            fetchEmployees(); // Refresh the list after adding
        } else {
            notification.error({
                message: 'Error',
                description: 'Failed to add new employee!',
            });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const fetchEmployees = async () => {
        const { status, result } = await getAdmins(token, {});

        if (status) {
            let tempData: ColumnType[] = result.map((item: Admin, index: number) => ({
                key: String(index + 1),
                _id: item._id,
                userid: item.userid,
                agentid: item.agentid,
                platform: item.platform,
                role: item.role,
                date: item.date,
                twoFactorEnabled: item.twoFactorEnabled
            }));

            setData(tempData);
            setFilteredData(tempData);  // Initialize filteredData with full dataset
        }
    };

    useEffect(() => {
        if (startDate !== "" && endDate !== "") {
            fetchEmployees();
        }
    }, [startDate, endDate]);

    useEffect(() => {
        // Filter data based on the search term
        const filtered = data.filter(item => item.userid.includes(searchPhone));
        setFilteredData(filtered);
    }, [searchPhone, data]);

    const handlePasswordChange = (record: ColumnType) => {
        setSelectedPlayerId(record._id);
        setVisible(true);
    };


    const columns = [
        {
            title: 'User Name',
            dataIndex: 'userid',
            key: 'userid',
            render: (text: string) => <Tag>{text}</Tag>,
        },
        {
            title: 'AgentId',
            dataIndex: 'agentid',
            key: 'agentid',
            render: (text: string) => <Tag color="volcano">{text}</Tag>,
        },
        {
            title: 'Platform',
            dataIndex: 'platform',
            key: 'platform'
        },
        {
            title: 'TwoFactorEnabled',
            dataIndex: 'twoFactorEnabled',
            key: 'twoFactorEnabled',
            render: (twoFactorEnabled: boolean) => {
                return twoFactorEnabled ? 'true' : 'false';
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
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ColumnType) => {
                return <Space size="middle"><Button onClick={() => editRole(record._id)}>Edit Role</Button></Space>
            },
        },
    ]

    return (
        <>
            <Input
                placeholder="Search by phone number"
                value={searchPhone}
                onChange={e => setSearchPhone(e.target.value)}
                style={{ width: 200, marginBottom: 16, flex: 'none' }}
            />
            <Button onClick={showModal} type="primary" style={{ width: '200px', marginBottom: 16 }}>
                Add New Employee
            </Button>
            <Modal
                title="Add New Employee"
                visible={isModalVisible}
                onOk={handleAddEmployee}
                onCancel={handleCancel}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item label="User ID" name="userid" rules={[{ required: true }]}>
                        <Input onChange={e => setNewEmployee({ ...newEmployee, userid: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                        <Input onChange={e => setNewEmployee({ ...newEmployee, password: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Agent ID" name="agentid" rules={[{ required: true }]}>
                        <Input onChange={e => setNewEmployee({ ...newEmployee, agentid: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Platform" name="platform" rules={[{ required: true }]}>
                        <Input onChange={e => setNewEmployee({ ...newEmployee, platform: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Role" name="role" rules={[{ required: true }]}>
                        <Input onChange={e => setNewEmployee({ ...newEmployee, role: e.target.value })} />
                    </Form.Item>
                    {/* <Form.Item label="Two Factor Enabled" name="twoFactorEnabled">
                        <Switch onChange={checked => setNewEmployee({ ...newEmployee, twoFactorEnabled: checked })} />
                    </Form.Item> */}
                </Form>
            </Modal>
            <Form form={form} component={false}>
                <Table
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

export default EditRole;