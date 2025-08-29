import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  Modal,
  Tooltip,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ShopDetails = ({ initialData }) => {
  const [form] = Form.useForm();
  const [shopDetails, setShopDetails] = useState(initialData);
  const [editing, setEditing] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState(
    initialData.images.map((url, idx) => ({
      uid: `${idx}`,
      url,
      status: "done",
    }))
  );

  // Sync form fields with shopDetails when editing mode starts
  useEffect(() => {
    if (editing) {
      form.setFieldsValue({
        ...shopDetails,
        images: fileList,
      });
    }
  }, [editing, form, shopDetails, fileList]);

  const onFinish = (values) => {
    // Extract images URLs from fileList for saving
    const images = (values.images || fileList).map(
      (file) => file.url || file.thumbUrl || ""
    );

    if (images.length < 1) {
      Modal.error({ title: "Please add at least 1 image." });
      return;
    }

    setShopDetails({ ...values, images });
    setEditing(false);
    setFileList(
      images.map((url, idx) => ({ uid: `${idx}`, url, status: "done" }))
    );
    console.log("Updated shop details:", { ...values, images });
  };

  const handleCancelPreview = () => setImagePreviewVisible(false);
  const handleImagePreview = (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setImagePreviewVisible(true);
  };

  // Handle Upload component's fileList changes
  const handleChange = ({ fileList: newFileList }) => {
    // Limit max 5 files
    if (newFileList.length > 5) return;
    setFileList(newFileList);
  };

  // Dummy upload handler (no actual upload)
  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => onSuccess("ok"), 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <Title level={3} className="m-0">
          Shop Details
        </Title>
        {!editing && (
          <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
            Edit Details
          </Button>
        )}
      </div>
      {editing ? (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ ...shopDetails, images: fileList }}
          scrollToFirstError
        >
          <Row gutter={24}>
            <Col xs={24} md={10}>
              <Form.Item
                name="images"
                label="Shop Images"
                rules={[
                  { required: true, message: "Please add at least 1 image" },
                ]}
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handleImagePreview}
                  onChange={handleChange}
                  customRequest={dummyRequest}
                  multiple
                  maxCount={5}
                  accept="image/*"
                >
                  {fileList.length >= 5 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item
                label="Vendor Name"
                name="vendorName"
                rules={[
                  { required: true, message: "Please enter vendor name" },
                ]}
              >
                <Input placeholder="Vendor Name" />
              </Form.Item>
              <Form.Item
                label="Mobile"
                name="mobile"
                rules={[
                  { required: true, message: "Please enter mobile number" },
                  {
                    pattern: /^\+?\d{7,15}$/,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input placeholder="+91 9876543210" />
              </Form.Item>
              <Form.Item
                label="Shop Name"
                name="shopName"
                rules={[{ required: true, message: "Please enter shop name" }]}
              >
                <Input placeholder="Shop Name" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <Input.TextArea rows={3} placeholder="Description" />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: "Please enter address" }]}
              >
                <Input.TextArea rows={2} placeholder="Address" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Opening Time"
                    name="opentime"
                    rules={[
                      { required: true, message: "Please enter opening time" },
                    ]}
                  >
                    <Input placeholder="e.g. 10:00AM" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Closing Time"
                    name="closetime"
                    rules={[
                      { required: true, message: "Please enter closing time" },
                    ]}
                  >
                    <Input placeholder="e.g. 10:00PM" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="GST Number" name="gstNo">
                <Input placeholder="Optional" />
              </Form.Item>
              <div className="flex gap-3 mt-4">
                <Button htmlType="submit" type="primary" block>
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false);
                    setFileList(
                      shopDetails.images.map((url, idx) => ({
                        uid: `${idx}`,
                        url,
                        status: "done",
                      }))
                    );
                    form.resetFields();
                  }}
                  block
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-wrap gap-4">
            {shopDetails.images.map((img, idx) => (
              <Tooltip key={idx} title={`Shop Image ${idx + 1}`}>
                <img
                  src={img}
                  alt={`Shop Image ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    setPreviewImage(img);
                    setImagePreviewVisible(true);
                  }}
                />
              </Tooltip>
            ))}
          </div>
          <div className="md:w-2/3 flex flex-col justify-between">
            <div className="space-y-3 text-gray-800">
              <Title level={4} className="mb-1">
                {shopDetails.shopName}
              </Title>

              <div className="flex justify-between">
                <Text strong>Vendor:</Text>
                <span>{shopDetails.vendorName}</span>
              </div>

              <div className="flex justify-between">
                <Text strong>Mobile:</Text>
                <span>{shopDetails.mobile}</span>
              </div>

              <div className="flex justify-between">
                <Text strong>Opening Time:</Text>
                <span>{shopDetails.opentime}</span>
              </div>

              <div className="flex justify-between">
                <Text strong>Closing Time:</Text>
                <span>{shopDetails.closetime}</span>
              </div>

              <div className="flex justify-between">
                <Text strong>GST Number:</Text>
                <span>{shopDetails.gstNo || "Not Provided"}</span>
              </div>

              <div className="flex justify-between">
                <Text strong>Description:</Text>
                <p className="ml-4 flex-1">{shopDetails.description}</p>
              </div>

              <div className="flex justify-between">
                <Text strong>Address:</Text>
                <p className="ml-4 flex-1">{shopDetails.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal
        visible={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
      >
        <img
          alt="Preview"
          src={previewImage}
          className="w-full object-contain"
        />
      </Modal>
    </div>
  );
};

export default ShopDetails;
