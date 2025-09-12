import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Checkbox,
  Button,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const mainCategories = [
  { label: "Hair", value: "Hair" },
  { label: "Skin", value: "Skin" },
  { label: "Massage", value: "Massage" },
  { label: "Makeup", value: "Makeup" },
];

export default function AddServiceModal({ open, onClose, onAdd }) {
  const [form] = Form.useForm();

  const validateUpload = (file, fileList) => {
    const isJpgOrPng = file.type === "image/png" || file.type === "image/jpeg";
    if (!isJpgOrPng) {
      message.error("You can only upload PNG/JPG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    if (fileList.length > 5) {
      message.error("Max 5 images allowed.");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleFinish = (values) => {
    const imgs = (values.images || []).map((f) =>
      URL.createObjectURL(f.originFileObj)
    );
    const newService = {
      id: Date.now(),
      mainCategory: values.mainCategory,
      name: values.name,
      description: values.description,
      price: Number(values.price),
      duration: Number(values.duration),
      tags: [
        values.discounted ? "Discount Eligible" : null,
        values.peak ? "Peak Eligible" : null,
      ].filter(Boolean),
      image: imgs?.[0] || null,
      availability: [],
    };
    onAdd(newService);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="text-xl font-bold text-[#6961AB]">Add New Service</div>
      }
      footer={null}
      width={600}
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Main Category */}
        <Form.Item
          name="mainCategory"
          label={
            <span>
              Main Category <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Category is required" }]}
        >
          <Select placeholder="Select a category">
            {mainCategories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Name */}
        <Form.Item
          name="name"
          label={
            <span>
              Service Name <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Service name required" }]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="description"
          label={
            <span>
              Description <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Description is required" }]}
        >
          <Input.TextArea rows={2} placeholder="Enter description" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          name="price"
          label={
            <span>
              Price <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Price required" }]}
        >
          <Input type="number" min={1} step="0.01" placeholder="e.g. 45.00" />
        </Form.Item>

        {/* Duration */}
        <Form.Item
          name="duration"
          label={
            <span>
              Estimated Duration (mins) <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "Duration is required" }]}
        >
          <Input type="number" min={1} max={240} placeholder="e.g. 45" />
        </Form.Item>

        {/* Images */}
        <Form.Item
          name="images"
          label={
            <span>
              Service Images <span style={{ color: "red" }}>*</span>
            </span>
          }
          rules={[{ required: true, message: "At least 1 image is required" }]}
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList}
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

        {/* Options */}
        <Form.Item name="discounted" valuePropName="checked">
          <Checkbox>Offer as Discounted Service (5% app margin)</Checkbox>
        </Form.Item>
        <Form.Item name="peak" valuePropName="checked">
          <Checkbox>Can be offered as Peak Service (25% app margin)</Checkbox>
        </Form.Item>

        <div className="mb-2 text-gray-600 text-xs font-medium bg-yellow-100 p-2 rounded">
          Note: Services booked in peak time will have extra charges.
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
  );
}
