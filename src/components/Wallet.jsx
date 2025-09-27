import { Button, Form, Input, Modal, Table } from "antd";
import { useState } from "react";
import {
  useAddwalletMutation,
  useGetwalletQuery,
  useVerifyPaymentMutation,
} from "../services/walletApi";
import { toast } from "react-toastify";
import { convertToIST } from "../utils/utils";
import { useSelector } from "react-redux";

const Wallet = () => {
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetwalletQuery();
  const [addwallet] = useAddwalletMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleAddAmount = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData();
      formData.append("amount", values.amount);
      // formData.append("type", "credit");

      // ✅ Create booking/order
      const order = await addwallet(formData).unwrap();
      console.log(order);

      // 🔹 Razorpay payment flow
      if (!order?.order_id) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order?.amount,
        currency: "INR",
        name: "Quickmyslot",
        description: "Add Amount to Wallet",
        image: "/logo1.png",
        order_id: order?.order_id,
        handler: async function (response) {
          const verifyData = new FormData();
          verifyData.append("amount", order?.amount);
          verifyData.append(
            "razorpay_payment_id",
            response.razorpay_payment_id
          );
          verifyData.append("razorpay_order_id", response.razorpay_order_id);
          verifyData.append("razorpay_signature", response.razorpay_signature);

          try {
            const verifyRes = await verifyPayment(verifyData).unwrap();
            console.log(verifyRes);
            if (verifyRes.status) {
              toast.success("Payment verified & booking confirmed!");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Error verifying payment");
            console.error(err);
            setIsAddModalVisible(false);
          }
        },
        prefill: {
          name: user?.name,
          contact: user?.phone_number,
          email: user?.email,
        },
        theme: { color: "#EE4E34" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setIsAddModalVisible(false);
      form.resetFields();
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
      dataIndex: "status",
      key: "status",
      render: (type) => (
        <span
          className={`text-[10px] p-2 py-1 rounded-md font-medium border ${
            type === 0
              ? "bg-orange-100 border-orange-400 text-orange-700"
              : "bg-green-100 border-green-400 text-green-700"
          }`}
        >
          {type === 0 ? "Pending" : "Success"}
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
        <span className="text-indigo-600">₹ {user?.wallet}</span>
      </h3>

      <Button
        type="primary"
        onClick={() => setIsAddModalVisible(true)}
        className="mb-6 px-5 py-2 rounded-md text-indigo-800 bg-[#F9F4FE] border-transparent hover:bg-[#e8dffd] focus:bg-[#e8dffd] transition-colors"
      >
        Add Amount
      </Button>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data?.data?.transactions || []}
          rowKey="transaction_id"
          bordered
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          locale={{ emptyText: "No data found" }}
          scroll={{ x: "max-content" }} // allows horizontal scroll if columns overflow container width
        />
      </div>

      {/* Modal for adding amount */}
      <Modal
        title="Add Amount"
        open={isAddModalVisible}
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
