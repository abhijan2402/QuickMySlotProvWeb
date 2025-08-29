import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, message } from "antd";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const { Option } = Select;

const initialAccounts = [
  {
    id: 1,
    bankName: "HDFC Bank",
    accountHolderName: "John Doe",
    accountNumber: "123456789012",
    ifscCode: "HDFC0001234",
    branch: "Mumbai",
    accountType: "Savings",
    isDefault: true,
  },
  {
    id: 2,
    bankName: "State Bank of India",
    accountHolderName: "Jane Smith",
    accountNumber: "987654321098",
    ifscCode: "SBIN0005678",
    branch: "Delhi",
    accountType: "Current",
    isDefault: false,
  },
];

const AccountManagement = () => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (editingAccount) {
      form.setFieldsValue(editingAccount);
    } else {
      form.resetFields();
    }
  }, [editingAccount, form]);

  const showModal = (account) => {
    setEditingAccount(account || null);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingAccount(null);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingAccount) {
          const updated = accounts.map((acc) =>
            acc.id === editingAccount.id ? { ...acc, ...values } : acc
          );
          console.log("Bank account updated:", values);
          setAccounts(updated);
        } else {
          const newAccount = {
            id: Date.now(),
            ...values,
            isDefault: accounts.length === 0, // first account default
          };
          console.log("Bank account added:", newAccount);
          setAccounts([...accounts, newAccount]);
        }
        closeModal();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleDelete = (id) => {
    const filtered = accounts.filter((acc) => acc.id !== id);
    console.log("Bank account deleted:", id);
    const wasDefault = accounts.find((acc) => acc.id === id)?.isDefault;
    // If deleted account was default, reset default to first account if available
    if (wasDefault && filtered.length) {
      filtered[0].isDefault = true;
    }
    setAccounts(filtered);
  };

  const setDefaultAccount = (id) => {
    const updated = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    console.log("Set default bank account:", id);
    setAccounts(updated);
  };

  return (
    <div>
      <div className="flex justify-between px-1">
        <h2 className="text-black text-xl font-medium">Manage Accounts</h2>
        <Button
          onClick={() => showModal(null)}
          type="primary"
          className="mb-6"
          icon={<FaPlus />}
        >
          Add Bank Account
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {accounts.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.bankName}
                </h3>
                {item.isDefault && (
                  <span className="text-xs text-white bg-indigo-600 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-gray-700 mt-1">{item.accountHolderName}</p>
              <p className="text-gray-600 mt-3 text-sm">
                <span className="block">Acc No: {item.accountNumber}</span>
                <span className="block">IFSC: {item.ifscCode}</span>
                <span className="block">Branch: {item.branch || "-"}</span>
                <span className="block">Type: {item.accountType}</span>
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="small"
                onClick={() => showModal(item)}
                icon={<FaEdit />}
              >
                Edit
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleDelete(item.id)}
                icon={<FaTrash />}
              >
                Delete
              </Button>
              <Button
                size="small"
                type={item.isDefault ? "primary" : "default"}
                onClick={() => setDefaultAccount(item.id)}
              >
                {item.isDefault ? "Default" : "Set Default"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingAccount ? "Edit Bank Account" : "Add Bank Account"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={closeModal}
        okText={editingAccount ? "Update" : "Add"}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            bankName: "",
            accountHolderName: "",
            accountNumber: "",
            ifscCode: "",
            branch: "",
            accountType: "Savings",
          }}
        >
          <Form.Item
            label="Bank Name"
            name="bankName"
            rules={[{ required: true, message: "Please enter bank name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Holder Name"
            name="accountHolderName"
            rules={[
              { required: true, message: "Please enter account holder name" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Number"
            name="accountNumber"
            rules={[
              { required: true, message: "Please enter account number" },
              { pattern: /^\d+$/, message: "Account number must be numeric" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="IFSC Code"
            name="ifscCode"
            rules={[
              { required: true, message: "Please enter IFSC code" },
              {
                pattern: /^[A-Za-z]{4}\d{7}$/,
                message: "Invalid IFSC format (e.g., ABCD0123456)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Branch" name="branch">
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="accountType"
            rules={[{ required: true, message: "Please select account type" }]}
          >
            <Select>
              <Option value="Savings">Savings</Option>
              <Option value="Current">Current</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
