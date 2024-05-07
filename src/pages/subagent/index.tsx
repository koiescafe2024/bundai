import { useCallback, useEffect, useState, type FC } from 'react';
import { Button, Form, Input, InputNumber, Space, Table, Tag, notification, Row, Col } from 'antd';
import axios from 'axios';
import { createSubAgent, getSubAgents, updateSubAgent } from '@/api/agent.api';
import { Agent, AgentList } from '@/interface/agent/agent.interface';

interface ColumnType {
  key: string;
  agentid: string;
  platform: string;
  url: string;
  percentage: number;
  userid: string;
  pwd: string;
  parent: string;
  prefix: string;
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

const SubAgentPage: FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ColumnType[]>([]);
  const [editingKey, setEditingKey] = useState('');

  const token : string = localStorage.getItem('token') || '';

  const fetchSubAgents = useCallback(async () => {
    const { status, result } = await getSubAgents(token);

    if (status) {
        let tempData : ColumnType[] = []
        result.map((item : Agent, index: number) => {
            tempData.push({
                key: String(index + 1),
                agentid: item.agentid,
                platform: item.platform,
                url: item.url,
                percentage: item.percentage,
                userid: item.userid,
                pwd: item.pwd,
                parent: item.parent,
                prefix: item.prefix,
                date: item.date
            })
        });

        setData(tempData);
    }
  }, []);

  useEffect(() => {
    fetchSubAgents();
  }, [fetchSubAgents]);

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
  
        if (item.agentid) {
          // Existing entry, update it
          const {status} = await updateSubAgent(newData[index]);
          if (status) {
            // show notification
            notification.success({
                message: 'Update Successful',
                description: 'The sub-agent has been successfully updated.',
              });
            setData(newData);
            setEditingKey('');
          } else {
            notification.error({
                message: 'Update Failed',
                description: 'Failed to update the sub-agent. Please try again.',
              });
          }

        } else {
          // New entry, create it
          const {status} = await createSubAgent(newData[index]); // Replace with your actual API call
          if (status) {
            notification.success({
                message: 'Creation Successful',
                description: 'The sub-agent has been successfully created.',
              });
            setData(newData);
            setEditingKey('');
          } else {
            notification.error({
                message: 'Creation Failed',
                description: 'Failed to create the sub-agent. Please try again.',
              });
          }
        }
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  

  const columns = [
    {
      title: 'AgentId',
      dataIndex: 'agentid',
      key: 'agentid',
      editable: true,
      render: (text: string) => (
        <Tag color="volcano">{text}</Tag>
      ),
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      editable: true,
    },
    {
        title: 'Url',
        dataIndex: 'url',
        key: 'url',
        editable: true,
    },
    {
      title: 'Parent',
      dataIndex: 'parent',
      key: 'parent',
      editable: true,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix',
      key: 'prefix',
      editable: true,
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      key: 'percentage',
      editable: true,
    },
    {
      title: 'UserId',
      dataIndex: 'userid',
      key: 'userid',
      editable: true,
    },
    {
      title: 'Password',
      dataIndex: 'pwd',
      key: 'pwd',
      editable: true,
      inputType: 'password',
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
          </Space>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ColumnType) => ({
        record,
        inputType: col.inputType || 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const addNewEntry = () => {
    const newKey = data.length + 1; // You can use a more robust method to generate unique keys
    const newEntry = {
      key: String(newKey),
      agentid: '',
      platform: '',
      url: '',
      percentage: 0,
      userid: '',
      pwd: '',
      parent: '',
      prefix: '',
      date: new Date(),
    };
    setData([newEntry, ...data]); // Add the new entry at the beginning of the array
    setEditingKey(String(newKey));
  };
  

  return (
    <>
  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16, flex: 'none' }}>
    <Button
      onClick={addNewEntry}
      type="primary"
      style={{ width: '150px', height: '32px' }} // Adjust the height as needed
    >
      Add New Agent
    </Button>
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
      pagination={{
        onChange: () => setEditingKey(''),
      }}
    />
  </Form>
</>

  );
};

export default SubAgentPage;
