import { Button, Form, Input, List, Modal } from "antd";
import { useState } from "react";

const Wallet = ({ walletHistory, walletTotal, addAmount }) => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddAmount = () => {
    form.validateFields().then((values) => {
      console.log("Add amount:", values);
      addAmount(values.amount);
      setIsAddModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg ">
      <h3 className="mb-6 font-semibold text-lg text-gray-800">
        Wallet Total Amount:{" "}
        <span className="text-indigo-600">₹{walletTotal}</span>
      </h3>
      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        className="mb-6 px-5 py-2 rounded-md text-indigo-800 bg-[#F9F4FE] border-transparent hover:bg-[#e8dffd] focus:bg-[#e8dffd] transition-colors"
      >
        Add Amount
      </Button>

      <List
        header={
          <div className="text-lg font-semibold text-gray-700">
            Wallet History
          </div>
        }
        bordered
        dataSource={walletHistory}
        className="rounded-md"
        renderItem={(item) => (
          <List.Item className="flex justify-between flex-wrap">
            <div className="text-gray-700 font-medium">{item.type}</div>
            <div className="text-indigo-600 font-semibold">₹{item.amount}</div>
            <div className="text-gray-500 text-sm">
              {new Date(item.date).toLocaleDateString()}
            </div>
          </List.Item>
        )}
      />

      <Modal
        title="Add Amount"
        visible={isAddModalVisible}
        onOk={handleAddAmount}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: "Please enter amount" },
              { pattern: /^\d+$/, message: "Please enter a valid number" },
            ]}
          >
            <Input autoFocus placeholder="Enter amount to add" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Wallet;
