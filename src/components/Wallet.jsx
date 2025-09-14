import { Button, Form, Input, Modal, Table } from "antd";
import { useState } from "react";
import { useAddwalletMutation, useGetwalletQuery } from "../services/walletApi";
import { toast } from "react-toastify";
import { convertToIST } from "../utils/utils";

const Wallet = () => {
  const { data } = useGetwalletQuery();
  const [addwallet] = useAddwalletMutation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddAmount = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();
      formData.append("amount", values.amount);
      formData.append("type", "credit");
      try {
        await addwallet(formData)
          .unwrap()
          .then(() => {
            toast.success("Amount added to wallet.");
            setIsAddModalVisible(false);
            form.resetFields();
          });
      } catch (error) {
        console.error("Failed to add amount:", error);
        toast.error("Failed to add amount.");
      }
    });
  };

  // Table Columns
  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      key: "transaction_id",
      render: (text) => (
        <span className="font-medium text-gray-700">{text}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span className="font-semibold text-indigo-600">₹{amount}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className="font-medium text-gray-700">
          {type === "credit" && "credited"}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (
        <span className="text-sm text-gray-500">{convertToIST(date)}</span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white rounded-lg">
      <h3 className="mb-6 font-semibold text-lg text-gray-800">
        Wallet Total Amount:{" "}
        <span className="text-indigo-600">
          ₹ {data?.data?.total_amount?.toFixed()}
        </span>
      </h3>

      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        className="mb-6 px-5 py-2 rounded-md text-indigo-800 bg-[#F9F4FE] border-transparent hover:bg-[#e8dffd] focus:bg-[#e8dffd] transition-colors"
      >
        Add Amount
      </Button>

      {/* ✅ Ant Design Table with pagination */}
      <Table
        columns={columns}
        dataSource={data?.data?.transactions || []}
        rowKey="transaction_id"
        bordered
        pagination={{
          pageSize: 5, // ✅ number of items visible per page
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        locale={{ emptyText: "No data found" }}
      />

      {/* Modal for adding amount */}
      <Modal
        title="Add Amount"
        open={isAddModalVisible} // ✅ changed from "visible" (deprecated in v5)
        onOk={handleAddAmount}
        onCancel={() => setIsAddModalVisible(false)}
        okText="Add"
        cancelText="Cancel"
        destroyOnClose
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
