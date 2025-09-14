import React from "react";
import { Modal, Form, Input, Upload, Button, Select, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { useSetProfileMutation } from "../../services/authApi";
import { useGetcategoryQuery } from "../../services/categoryApi";

const { Dragger } = Upload;
const { Option } = Select;

export default function ProfileModal({ visible, onClose, onNext, userID }) {
  const [setProfile, { isLoading }] = useSetProfileMutation();
  const { data: category } = useGetcategoryQuery();
  const [form] = Form.useForm();

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const handleFinish = async (values) => {
    try {
      const fd = new FormData();

      const pushSingleFile = (fieldValue, key) => {
        if (fieldValue && fieldValue.length > 0) {
          const file = fieldValue[0].originFileObj || fieldValue[0];
          if (file) fd.append(key, file);
        }
      };

      pushSingleFile(values.photo, "photo_verification");
      pushSingleFile(values.business_proof, "business_proof");
      pushSingleFile(values.aadhaar, "adhaar_card_verification");
      pushSingleFile(values.pan, "pan_card");

      fd.append("business_description", values.about || "");
      fd.append("years_of_experience", values.experience || "");
      fd.append("exact_location", values.location || "");
      fd.append("business_website", values.website || "");
      fd.append("gstin_number", values.gstin || "");
      fd.append("user_id", userID);

      // ✅ Category required
      fd.append("service_category", values.service_category);

      await setProfile(fd)
        .unwrap()
        .then(() => {
          toast.success("Profile submitted successfully.");
          form.resetFields();
          onNext();
        })
        .catch(() => {
          toast.error("Failed to submit profile. Try again.");
        });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit profile. Try again.");
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    listType: "picture-card",
    accept: "image/*",
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Complete Your Profile"
      destroyOnClose
      width="50%"
    >
      <p style={{ color: "#555", marginBottom: 16, fontSize: 13 }}>
        <strong>Note:</strong> Please provide accurate details, including valid
        proof documents.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        validateMessages={{
          required: "${label} is required!",
          types: {
            number: "${label} must be a valid number",
            url: "${label} is not a valid URL",
          },
        }}
      >
        {/* ✅ Category Dropdown */}
        <Form.Item
          name="service_category"
          label="Select Business Category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Choose a category">
            {category?.data?.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Photo Verification */}
        <Form.Item
          name="photo"
          label="Photo Verification"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#6961AB" }} />
            </p>
            <p className="ant-upload-text">Click or drag photo to upload</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Business Proof */}
        <Form.Item
          name="business_proof"
          label="Business Proof"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#6961AB" }} />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Aadhaar */}
        <Form.Item
          name="aadhaar"
          label="Aadhaar Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#6961AB" }} />
            </p>
            <p className="ant-upload-text">Upload Aadhaar (front/back)</p>
          </Upload.Dragger>
        </Form.Item>

        {/* PAN */}
        <Form.Item
          name="pan"
          label="PAN Card"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true }]}
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: "#6961AB" }} />
            </p>
            <p className="ant-upload-text">Upload PAN card</p>
          </Upload.Dragger>
        </Form.Item>

        {/* About */}
        <Form.Item
          name="about"
          label="About Your Business"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={3} placeholder="Brief description" />
        </Form.Item>

        {/* Experience */}
        <Form.Item
          name="experience"
          label="Years of Experience"
          rules={[
            { required: true },
            {
              pattern: /^[0-9]+$/,
              message: "Please enter a valid number",
            },
          ]}
        >
          <Input
            placeholder="e.g. 5"
            inputMode="numeric"
            pattern="\d*"
            maxLength={2}
            onChange={(e) => {
              const digits = e.target.value.replace(/[^\d]/g, "");
              form.setFieldsValue({ experience: digits });
            }}
          />
        </Form.Item>
        
        {/* Location */}
        <Form.Item
          name="location"
          label="Exact Location"
          rules={[{ required: true }]}
        >
          <Input placeholder="Branch / city / street address" />
        </Form.Item>

        {/* Website - optional */}
        <Form.Item
          name="website"
          label="Business Website"
          rules={[
            {
              type: "url",
              message: "Enter a valid URL (https://...)",
            },
          ]}
        >
          <Input placeholder="https://your-business.com" />
        </Form.Item>

        {/* GSTIN */}
        <Form.Item
          name="gstin"
          label="GSTIN No."
          rules={[
            {
              pattern: /^[0-9A-Z]{15}$/,
              message: "Enter a valid 15-character GSTIN",
            },
          ]}
        >
          <Input placeholder="GSTIN number" />
        </Form.Item>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Next
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
