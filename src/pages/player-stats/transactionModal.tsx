import { FC, useState } from 'react';
import { Modal, Table, Input, Row, Col, Form, Space, Button, Tag } from 'antd';

import { ColumnsType } from 'antd/es/table';
import AddCreditModal from './addCreditModal';

interface TransactionDetailProps {
  clientCode: string; // Assuming this as stand-in for userId
  date: Date;
  payAmount: number;
  trxNo: string;
  status: string;
}

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  content: TransactionDetailProps[];
  userid: string | null;
}

export const TransactionModal: FC<TransactionModalProps> = ({ visible, onClose, content, userid }) => {
  const [clientCodeSearch, setClientCodeSearch] = useState('');
  const [trxNoSearch, setTrxNoSearch] = useState('');
  const [isAddCreditModalVisible, setIsAddCreditModalVisible] = useState<boolean>(false);

  const columns: ColumnsType<TransactionDetailProps> = [
    {
      title: 'Transaction No',
      dataIndex: 'trxNo',
      key: 'trxNo',
      sorter: (a, b) => a.trxNo.localeCompare(b.trxNo), // String comparison
    },
    {
      title: 'Client Code',
      dataIndex: 'clientCode',
      key: 'clientCode',
      sorter: (a, b) => a.clientCode.localeCompare(b.clientCode), // String comparison
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(), // Date comparison
      render: text => <>{new Date(text).toLocaleString()}</>, // Updated to show date and time
    },
    {
      title: 'Pay Amount',
      dataIndex: 'payAmount',
      key: 'payAmount',
      sorter: (a, b) => a.payAmount - b.payAmount, // Number comparison
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status), // String comparison
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record: TransactionDetailProps) => {
        if (record.status == "PENDING")
        return (<Space size="middle">
                    <Button onClick={() => showAddCreditModal(userid)}>Add Credit</Button>
                </Space>
                )
      },
    }
  ];

  const showAddCreditModal = (userId: string | null) => {

    console.log(userId);
    setIsAddCreditModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsAddCreditModalVisible(false);
  };

  const handleAddCredit = (record: TransactionDetailProps) => {
      console.log("Adding credit to user ID:", userid);
      // Implementation details...
  };

  const handleDeposit = (amount: number) => {
    console.log("Depositing", amount, "to user ID:", userid);
    // Implement the deposit logic here
  //   setIsAddCreditModalVisible(false);
  };

  const filteredContent = content.filter(item =>
    item.clientCode.toLowerCase().includes(clientCodeSearch.toLowerCase()) &&
    item.trxNo.toLowerCase().includes(trxNoSearch.toLowerCase())
  );

  return (
    <Modal title="Transaction Details" visible={visible} onOk={onClose} onCancel={onClose} width={800}>
      <div style={{ marginBottom: 16 }}>
        <Tag color="volcano"> {userid} </Tag>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col span={12}>
            <div style={{ marginBottom: 8 }}>
              <label>Client Code:</label>
            </div>
            <Input
              placeholder="Search by Client Code..."
              value={clientCodeSearch}
              onChange={e => setClientCodeSearch(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8 }}>
              <label>Transaction No:</label>
            </div>
            <Input
              placeholder="Search by Transaction No..."
              value={trxNoSearch}
              onChange={e => setTrxNoSearch(e.target.value)}
            />
          </Col>
        </Row>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredContent}
        rowKey="trxNo"
        pagination={{ pageSize: 5 }}
      />

      <AddCreditModal
          visible={isAddCreditModalVisible}
          onDeposit={handleDeposit}
          onCancel={handleCancel}
      />
    </Modal>
  );
};