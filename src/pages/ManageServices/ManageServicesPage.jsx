import React, { useState } from "react";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Checkbox,
  DatePicker,
  Tag,
  message,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import Breadcrumb from "../../components/Breadcrumb";

const { Option } = Select;

// Dummy data
const initialServices = [
  {
    id: 1,
    category: "Hair",
    name: "Haircut & Styling",
    description: "Includes wash, cut, and blow-dry.",
    price: 45,
    duration: 45,
    tags: ["Peak Eligible", "Discount Eligible"],
    durationLabel: "mins",
    image: null,
    availability: [],
  },
  {
    id: 2,
    category: "Skin",
    name: "Facial & Cleanup",
    description: "Basic cleanup with herbal products.",
    price: 30,
    duration: 30,
    tags: ["Peak Eligible", "Discount Eligible"],
    durationLabel: "mins",
    image: null,
    availability: [],
  },
];

const categories = [
  { label: "Hair", value: "Hair" },
  { label: "Skin", value: "Skin" },
  { label: "Massage", value: "Massage" },
  { label: "Makeup", value: "Makeup" },
];

export default function ManageServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Form handlers
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Add new service modal functions
  const handleAddNew = () => setAddModalOpen(true);
  const handleAddCancel = () => setAddModalOpen(false);

  const validateUpload = (file, fileList) => {
    const isJpgOrPng = file.type === "image/png" || file.type === "image/jpeg";
    if (!isJpgOrPng) {
      message.error("You can only upload PNG/JPG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Each file must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length > 5) {
      message.error("Max 5 images allowed.");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleAddFinish = (values) => {
    const imgs = (values.images || []).map((f) =>
      URL.createObjectURL(f.originFileObj)
    );
    const newService = {
      id: Date.now(),
      category: values.category,
      name: values.name,
      description: values.description,
      price: Number(values.price),
      duration: Number(values.duration),
      tags: [
        values.discounted ? "Discount Eligible" : null,
        values.peak ? "Peak Eligible" : null,
      ].filter(Boolean),
      durationLabel: "mins",
      image: imgs?.[0] || null,
      availability: [],
    };
    setServices((prev) => [newService, ...prev]);
    message.success("Service added successfully!");
    form.resetFields();
    setAddModalOpen(false);
  };

  // Edit modal: Show, set id & initial dates
  const handleEditService = (svc) => {
    setEditingServiceId(svc.id);
    setAvailabilityDates(svc.availability || []);
    setEditModalOpen(true);
  };
  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingServiceId(null);
    setAvailabilityDates([]);
  };
  // On select dates in edit modal
  const handleDateChange = (dates) => {
    setAvailabilityDates(dates);
  };
  // Submit availability for the service being edited
  const handleEditFinish = () => {
    setServices((services) =>
      services.map((svc) =>
        svc.id === editingServiceId
          ? { ...svc, availability: availabilityDates }
          : svc
      )
    );
    message.success("Availability updated!");
    setEditModalOpen(false);
    setEditingServiceId(null);
    setAvailabilityDates([]);
  };

  // Delete service
  const handleDeleteService = (id) => {
    setServices((prev) => prev.filter((svc) => svc.id !== id));
    message.success("Service deleted!");
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-center md:text-left text-black">
          Manage Services
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{
            background: "#6961AB",
            borderColor: "#6961AB",
            height: 44,
            fontWeight: 600,
            fontSize: "1.05rem",
          }}
          className="w-full md:w-auto"
          onClick={handleAddNew}
        >
          Add New Service
        </Button>
      </div>
      <h3 className="font-semibold text-lg mb-4 text-black">
        Your Current Services
      </h3>
      <div className="px-2 py-4 mb-4">
        {services.map((service) => (
          <div className="mb-8 border p-4 rounded-md ">
            {/* Category badge */}
            <div className="flex justify-start ">
              <div
                className={`rounded-xl font-bold text-white text-base px-6 py-2 mb-4`}
                style={{
                  background:
                    service.category === "Hair"
                      ? "#F8BE6D"
                      : service.category === "Skin"
                      ? "#4B83A2"
                      : "#6961AB",
                  display: "inline-block",
                }}
              >
                {service.category}
              </div>
            </div>
            {/* Service Title and Actions */}
            <div className="flex justify-between items-center mb-1">
              <div className="font-bold text-xl text-black">{service.name}</div>
              <div className="flex gap-2">
                <Button
                  type="text"
                  icon={<EditOutlined style={{ fontSize: 18 }} />}
                  onClick={() => handleEditService(service)}
                  aria-label="Edit availability"
                  style={{ color: "#6961AB" }}
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                  aria-label="Delete service"
                  onClick={() => handleDeleteService(service.id)}
                />
              </div>
            </div>
            <div className="text-gray-500 mb-2 text-base">
              {service.description}
            </div>
            <div className=" flex justify-between">

            {/* Price and Duration */}
            <div className="flex items-center justify-between gap-4">
              <div className="font-bold text-sm text-black">
                ${service.price.toFixed(2)}
              </div>
              <Tag
                color="blue"
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: 14,
                  padding: "2px 16px",
                }}
              >
                {service.duration} mins
              </Tag>
            </div>
            {/* Tags */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {service.tags.includes("Peak Eligible") && (
                <Tag
                  color="orange"
                  style={{
                    borderRadius: 8,
                    fontWeight: 500,
                    fontSize: 12,
                    padding: "2.5px 10px",
                  }}
                >
                  Peak Eligible
                </Tag>
              )}
              {service.tags.includes("Discount Eligible") && (
                <Tag
                  color="green"
                  style={{
                    borderRadius: 8,
                    fontWeight: 500,
                    fontSize: 12,
                    padding: "2.5px 10px",
                  }}
                >
                  Discount Eligible
                </Tag>
              )}
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Service Modal */}
      <Modal
        open={addModalOpen}
        onCancel={handleAddCancel}
        title={
          <div className="text-xl font-bold mb-4 text-[#6961AB]">
            Add New Service
          </div>
        }
        footer={null}
        width={600}
        destroyOnClose
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleAddFinish}>
          <Form.Item
            name="name"
            label="Service Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter service name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={2} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (USD)"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} step="0.01" placeholder="e.g. 45.00" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Estimated Duration (mins)"
            rules={[{ required: true }]}
          >
            <Input type="number" min={1} max={240} placeholder="e.g. 45" />
          </Form.Item>
          <Form.Item
            name="images"
            label="Service Images"
            rules={[
              { required: true, message: "At least 1 image is required" },
            ]}
            valuePropName="fileList"
            getValueFromEvent={(file) => file?.fileList}
          >
            <Upload
              listType="picture-card"
              multiple
              maxCount={5}
              beforeUpload={validateUpload}
              accept=".png,.jpg,.jpeg"
            >
              <div>
                <UploadOutlined /> Upload (max 5)
              </div>
            </Upload>
          </Form.Item>
          <div>
            <Form.Item name="discounted" valuePropName="checked">
              <Checkbox>Offer as Discounted Service (5% app margin)</Checkbox>
            </Form.Item>
            <Form.Item name="peak" valuePropName="checked">
              <Checkbox>
                Can be offered as a Peak Service (25% app margin)
              </Checkbox>
            </Form.Item>
          </div>
          <div className="mb-2 text-gray-600 text-xs font-medium bg-yellow-100 p-2 rounded">
            Note: All these services to be booked during peak time will have
            extra charges.
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                background: "#6961AB",
                borderColor: "#6961AB",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Add Service
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Availability Modal */}
      <Modal
        open={editModalOpen}
        onCancel={handleEditCancel}
        title={
          <span className="text-xl font-bold">Set Availability Dates</span>
        }
        footer={null}
        destroyOnClose
        centered
        width={420}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditFinish}>
          <Form.Item label="Select Available Dates">
            <DatePicker
              multiple
              value={availabilityDates}
              onChange={handleDateChange}
              style={{ width: "100%" }}
              format="DD MMM YYYY"
              allowClear
            />
          </Form.Item>
          {availabilityDates && availabilityDates.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {availabilityDates.map((dt, idx) => (
                <Tag icon={<CalendarOutlined />} color="#6961AB" key={idx}>
                  {dayjs(dt).format("DD MMM YYYY")}
                </Tag>
              ))}
            </div>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                background: "#6961AB",
                borderColor: "#6961AB",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Save Availability
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
