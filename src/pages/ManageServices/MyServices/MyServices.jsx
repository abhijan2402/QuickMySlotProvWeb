import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Popconfirm,
  Empty,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  useAddMyServicesMutation,
  useDeleteMyServicesMutation,
  useUpdateMyServicesMutation,
  useGetmanageServicesQuery,
} from "../../../services/manageServicesApi";
import { toast } from "react-toastify";

const { Meta } = Card;

export default function MyServices() {
  // API hooks
  const { data, isLoading, refetch } = useGetmanageServicesQuery();
  const [addMyServices, { isLoading: Adding }] = useAddMyServicesMutation();
  const [updateMyServices, { isLoading: Updating }] =
    useUpdateMyServicesMutation();
  const [deleteMyServices, { isLoading: Deleting }] =
    useDeleteMyServicesMutation();

  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // Load services
  useEffect(() => {
    if (data?.data) {
      setServices(data.data);
    }
  }, [data]);

  // Open Add/Edit modal
  const openModal = (service = null) => {
    setEditingService(service);

    if (service) {
      form.setFieldsValue({
        name: service.name,
        image: service.image
          ? [
              {
                uid: "-1",
                name: "current.png",
                status: "done",
                url: service.image_url,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }

    setIsModalOpen(true);
  };

  // Save (Add or Edit)
  const handleSave = async (values) => {
    const fd = new FormData();
    fd.append("name", values.name);

    // Handle image
    if (values.image && values.image.length > 0) {
      const fileObj = values.image[0].originFileObj || null;
      if (fileObj) {
        fd.append("image", fileObj);
      }
    }

    try {
      if (editingService) {
        await updateMyServices({
          id: editingService.id,
          formData: fd,
        }).unwrap();
        toast.success("Service updated successfully");
      } else {
        await addMyServices(fd).unwrap();
        toast.success("Service added successfully");
      }

      refetch();
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteMyServices({ id }).unwrap();
      toast.success("Service deleted successfully");
      refetch();
    } catch (err) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-black">My Services</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ background: "#6961AB", borderColor: "#6961AB" }}
        >
          Add Service
        </Button>
      </div>

      {/* Loader & Empty State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" />
        </div>
      ) : services.length === 0 ? (
        <Empty
          description="No services found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 40 }}
        />
      ) : (
        // Services Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              hoverable
              cover={
                service.image_url ? (
                  <img
                    alt={service?.name}
                    src={service?.image_url}
                    className="h-40 w-full object-full rounded-t-2xl"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center bg-gray-100 text-gray-400 rounded-t-2xl">
                    No Image
                  </div>
                )
              }
              actions={[
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openModal(service)}
                  className="text-blue-600 font-medium"
                >
                  Edit
                </Button>,
                <Popconfirm
                  title="Delete Service?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(service.id)}
                >
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    className="font-medium"
                  >
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
              className="rounded-xl shadow-md"
            >
              <Meta title={service.name} />
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        title={editingService ? "Edit Service" : "Add Service"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingService ? "Update" : "Create"}
        confirmLoading={Adding || Updating}
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Service Name"
            name="name"
            rules={[{ required: true, message: "Enter service name" }]}
          >
            <Input placeholder="e.g. Haircut, Facial" />
          </Form.Item>

          <Form.Item
            label="Service Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              listType="picture-card"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
