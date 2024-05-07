import React from 'react';
import { Modal, Button, Form, InputNumber } from 'antd';

interface AddCreditModalProps {
  visible: boolean;
  onDeposit: (amount: number) => void;
  onCancel: () => void;
}

const AddCreditModal: React.FC<AddCreditModalProps> = ({ visible, onDeposit, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onDeposit(values.depositAmount);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Add Credit"
      visible={visible}
      onOk={handleOk}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Deposit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="addCreditForm">
        <Form.Item
          name="depositAmount"
          label="Deposit Amount"
          rules={[{ required: true, message: 'Please input the deposit amount!' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCreditModal;
