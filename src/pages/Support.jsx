import { useState } from "react";
import { Table, Modal, Button, Form, Input, Upload, Spin, Alert } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  useGetsupportQuery,
  useAddsupportMutation,
} from "../services/supportApi";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb";
import { BiError } from "react-icons/bi";

export default function Support() {
  const { data, isLoading, isError, refetch } = useGetsupportQuery();
  const [addSupport, { isLoading: isAdding }] = useAddsupportMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Handle Submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      await addSupport(formData).unwrap();
      toast.success("Ticket raised successfully!");
      form.resetFields();
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Error adding support:", error);
      toast.error("Failed to raise ticket.");
    }
  };

  // Table Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="text-gray-600 line-clamp-2">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "replyed_by",
      key: "replyed_by",
      render: (status) => {
        const isResolved = status !== null && status !== undefined;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isResolved
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isResolved ? "Resolved" : "Pending"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mt-4 mx-auto p-6 space-y-8">
      <Breadcrumb propertyTitle={"Support"} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-[#EE4E34]">Support</h2>
        <button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="text-white bg-orange-600 px-4 py-2 rounded-md cursor-pointer hover:bg-[#EE4E34]"
        >
          Raise a Ticket
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-4">
            <Spin size="large" tip="Loading tickets..." />
            <p className="text-gray-500 text-sm">
              Please wait while we fetch your support tickets
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center h-[400px] rounded-md border border-dashed">
          <div className="max-w-md w-full flex-col text-gray-700 flex justify-center items-center">
            <BiError size={44} />
            <p className="text-lg mt-2">Failed to load tickets</p>
          </div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          bordered
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20"],
          }}
          locale={{ emptyText: "No tickets found" }}
        />
      )}

      {/* Modal */}
      <Modal
        title="Raise a Ticket"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isAdding}
        okText="Submit"
        okButtonProps={{
          style: {
            backgroundColor: "#EE5C32",
            borderColor: "#EE5C32",
          },
          className: "custom-ok-btn",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter ticket title" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} placeholder="Describe your issue" />
          </Form.Item>

          <Form.Item
            label="Upload Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
