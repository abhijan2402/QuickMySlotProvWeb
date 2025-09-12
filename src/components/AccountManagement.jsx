import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Input, Select, message, Spin } from "antd";
import { FaEdit, FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";
import {
  useGetbankQuery,
  useAddbankMutation,
  useUpdatebankMutation,
  useDeletebankMutation,
} from "../services/bankApi";
import { toast } from "react-toastify";

const { Option } = Select;

const AccountManagement = () => {
  const { data, isLoading, refetch } = useGetbankQuery();
  const [addbank] = useAddbankMutation();
  const [updatebank] = useUpdatebankMutation();
  const [deletebank] = useDeletebankMutation();

  const [accounts, setAccounts] = useState([]);
  const [defaultAccountId, setDefaultAccountId] = useState(null);

  const [editingAccount, setEditingAccount] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Load accounts into local state when API returns data
  useEffect(() => {
    if (data?.data) {
      setAccounts(data.data);
      if (!defaultAccountId && data.data.length > 0) {
        setDefaultAccountId(data.data[0].id); // first one default by default
      }
    }
  }, [data]);

  // Open modal
  const showModal = (account) => {
    setEditingAccount(account || null);
    if (account) {
      form.setFieldsValue({
        bank_name: account.bank_name,
        account_number: account.account_number,
        ifsc_code: account.ifsc_code,
        bank_type: account.bank_type,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalVisible(false);
    setEditingAccount(null);
    form.resetFields();
  };

  // Save (Add / Update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("bank_name", values.bank_name);
      formData.append("account_number", values.account_number);
      formData.append("ifsc_code", values.ifsc_code);
      formData.append("bank_type", values.bank_type.toLowerCase());

      if (editingAccount) {
        await updatebank({ id: editingAccount.id, formData }).unwrap();
        toast.success("Bank account updated successfully");
      } else {
        await addbank(formData).unwrap();
        toast.success("Bank account added successfully");
      }

      refetch();
      closeModal();
    } catch (err) {
      console.error("Error saving bank account:", err);
      toast.error("Failed to save bank account");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deletebank(id).unwrap();
      toast.success("Bank account deleted successfully");
      refetch();

      // if deleted account was default, reset
      if (defaultAccountId === id) {
        setDefaultAccountId(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete bank account");
    }
  };

  // Set default account
  const handleSetDefault = (id) => {
    setDefaultAccountId(id);
    toast.info("Default bank account set");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spin size="large" />
      </div>
    );
  }

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
            className={`border rounded-lg p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow ${
              defaultAccountId === item.id ? "border-indigo-500" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.bank_name}
                </h3>
                {defaultAccountId === item.id && (
                  <span className="text-xs text-white bg-indigo-600 px-2 py-1 rounded flex items-center gap-1">
                    <FaCheckCircle /> Default
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-3 text-sm">
                <span className="block">Acc No: {item.account_number}</span>
                <span className="block">IFSC: {item.ifsc_code}</span>
                <span className="block capitalize">Type: {item.bank_type}</span>
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
                type={defaultAccountId === item.id ? "primary" : "default"}
                onClick={() => handleSetDefault(item.id)}
              >
                {defaultAccountId === item.id ? "Default" : "Set Default"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={editingAccount ? "Edit Bank Account" : "Add Bank Account"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={closeModal}
        okText={editingAccount ? "Update" : "Add"}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Bank Name"
            name="bank_name"
            rules={[{ required: true, message: "Please enter bank name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Number"
            name="account_number"
            rules={[
              { required: true, message: "Please enter account number" },
              { pattern: /^\d+$/, message: "Account number must be numeric" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="IFSC Code"
            name="ifsc_code"
            rules={[
              { required: true, message: "Please enter IFSC code" },
              {
                message: "Invalid IFSC format (e.g., ABCD0123456)",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Account Type"
            name="bank_type"
            rules={[{ required: true, message: "Please select account type" }]}
          >
            <Select>
              <Option value="Saving">Savings</Option>
              <Option value="Current">Current</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;
