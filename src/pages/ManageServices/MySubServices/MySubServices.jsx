import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  Select,
  Popconfirm,
  Space,
  Spin,
  Empty,
  message,
  TimePicker,
  Tag,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  useAddServicesMutation,
  useDeleteServicesMutation,
  useGetmanageServicesQuery,
  useGetServicesQuery,
  useUpdateServicesMutation,
} from "../../../services/manageServicesApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import noimg from "/noimg.png";
import { FaIndianRupeeSign } from "react-icons/fa6";

const { Meta } = Card;
const { Option } = Select;

export default function MySubServices() {
  const user = useSelector((state) => state.auth.user);
  const { data: myServices } = useGetmanageServicesQuery();
  const { data, isLoading: fetchingServices } = useGetServicesQuery();
  const [addServices, { isLoading: adding }] = useAddServicesMutation();
  const [updateServices, { isLoading: updating }] = useUpdateServicesMutation();
  const [deleteServices, { isLoading: deleting }] = useDeleteServicesMutation();

  const [subServices, setSubServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubService, setEditingSubService] = useState(null);
  const [form] = Form.useForm();
  console.log(editingSubService);
  useEffect(() => {
    if (data?.data) {
      setSubServices(data.data);
    }
  }, [data]);

  const openModal = (subService = null) => {
    setEditingSubService(subService);
    if (subService) {
      form.setFieldsValue({
        ...subService,
        // ✅ Convert object { key: value } → array [{ key, value }]
        addons: subService.addons
          ? Object.entries(subService.addons).map(([key, value]) => ({
              key,
              value,
            }))
          : [],

        // ✅ Convert object { "05:06 PM": "92" } → array [{ key: moment(), value }]
        peak_hours: subService.peak_hours
          ? Object.entries(subService.peak_hours).map(([key, value]) => ({
              key: moment(key, ["hh:mm A", "HH:mm"]),
              value,
            }))
          : [],
        images: Array.isArray(subService.images)
          ? subService.images.map((url, index) => ({
              uid: index,
              name: `Image ${index + 1}`,
              status: "done",
              url,
            }))
          : [],
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = async (values) => {
    const formdata = new FormData();
    formdata.append("category_id", user?.service_category);
    formdata.append("service_id", values.serviceId);
    formdata.append("name", values.name);
    formdata.append("description", values.description);
    formdata.append("price", values.price);
    formdata.append("gender", values.gender?.toLowerCase());
    formdata.append("duration", values.duration);

    // Addons
    values.addons?.forEach((a) => {
      formdata.append(`addons[${a.key}]`, a.value);
    });

    // Peak Hours in HH:MM 12-hour format
    values.peak_hours?.forEach((p) => {
      const timeStr = p.key.format("HH:mm"); // 24-hour format without AM/PM
      formdata.append(`peak_hours[${timeStr}]`, p.value);
    });

    // Availability (Dates with multiple time slots)
    values.availability?.forEach((item) => {
      const dateStr = item.date.format("DD/MM/YYYY");
      const slots = item.slots?.map((t) => t.format("HH:mm")) || []; // 24-hour format
      slots.forEach((time) => {
        formdata.append(`available_schedule[${time}]`, dateStr);
      });
    });

    // Images
    values.images?.forEach((file) => {
      if (file.originFileObj) formdata.append("image", file.originFileObj);
    });

    try {
      if (editingSubService) {
        await updateServices({
          id: editingSubService.id,
          formData: formdata,
        }).unwrap();

        toast.success("Service updated successfully");
      } else {
        await addServices(formdata).unwrap();
        toast.success("Service added successfully");
        setIsModalOpen(false);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }

    setIsModalOpen(false);
    setEditingSubService(null);
  };

  const handleDelete = async (id) => {
    console.log(id);
    try {
      await deleteServices(id).unwrap();
      setSubServices((prev) => prev.filter((s) => s.id !== id));
      message.success("Service deleted successfully");
    } catch {
      message.error("Delete failed!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-black">My Services</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ background: "#EE4E34", borderColor: "#EE4E34" }}
          loading={adding || updating}
        >
          Add Service
        </Button>
      </div>

      {fetchingServices ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : subServices.length === 0 ? (
        <Empty description="No Services Found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subServices.map((sub) => (
            <Card
              key={sub.id}
              hoverable
              className="rounded-2xl shadow-lg transition-transform  hover:shadow-xl overflow-hidden"
            >
              {/* Header (Name + Gender) */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold text-gray-800">
                  {sub.name}
                </span>
                <Tag color="blue" className="text-sm font-medium">
                  {sub.gender?.charAt(0).toUpperCase() + sub.gender?.slice(1)}
                </Tag>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{sub.description}</p>

              {/* Price & Duration */}
              <div className="flex items-center justify-between text-gray-700 mb-3">
                <span className="flex items-center gap-1 font-medium">
                  <FaIndianRupeeSign /> {sub.price}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <ClockCircleOutlined /> {sub.duration} mins
                </span>
              </div>

              {/* Add-ons */}
              {sub.addons && Object.keys(sub.addons).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Add-ons:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sub.addons).map(([key, value], i) => (
                      <Tag key={i} color="green">
                        {key} (₹{value})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Peak Hours */}
              {sub.peak_hours && Object.keys(sub.peak_hours).length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Peak Hours:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(sub.peak_hours).map(([key, value], i) => (
                      <Tag key={i} color="orange">
                        {key} (₹{value})
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center  gap-3 mt-4">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => openModal(sub)}
                  className="rounded-lg w-full"
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete Sub Service?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDelete(sub.id)}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    className="rounded-lg w-full"
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingSubService ? "Edit Sub Service" : "Add Sub Service"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={editingSubService ? "Update" : "Add"}
        confirmLoading={adding || updating}
        width={600}
        okButtonProps={{
          style: {
            backgroundColor: "#EE5C32",
            borderColor: "#EE5C32",
          },
          className: "custom-ok-btn",
        }}
        className="rounded-2xl"
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Service"
            name="serviceId"
            rules={[{ required: true, message: "Select a parent service" }]}
          >
            <Select placeholder="Select Service">
              {myServices?.data?.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Sub Service Name"
            name="name"
            rules={[{ required: true, message: "Enter sub service name" }]}
          >
            <Input placeholder="e.g. Men's Haircut" />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Enter services duration" }]}
          >
            <Input type="number" placeholder="e.g. 25, 45" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Enter description" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Enter price" }]}
          >
            <Input type="number" placeholder="e.g. 25" />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Select gender" }]}
          >
            <Select placeholder="Select Gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Unisex">Unisex</Option>
            </Select>
          </Form.Item>

          {/* Availability (Dates + Time Slots) */}

          {/* 
          
          <Form.List name="availability">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                <label className="font-medium">Availability</label>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="border p-3 rounded-lg space-y-2">
                    <Form.Item
                      {...restField}
                      name={[name, "date"]}
                      label="Select Date"
                      rules={[{ required: true, message: "Select a date" }]}
                    >
                      <DatePicker format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.List name={[name, "slots"]}>
                      {(slotFields, { add: addSlot, remove: removeSlot }) => (
                        <>
                          {slotFields.map(
                            ({ key: slotKey, name: slotName, ...slotRest }) => (
                              <Space
                                key={slotKey}
                                className="flex"
                                align="baseline"
                              >
                                <Form.Item
                                  {...slotRest}
                                  name={slotName}
                                  rules={[
                                    { required: true, message: "Select time" },
                                  ]}
                                >
                                  <TimePicker format="hh:mm A" use12Hours />
                                </Form.Item>
                                <Button
                                  danger
                                  onClick={() => removeSlot(slotName)}
                                >
                                  Delete
                                </Button>
                              </Space>
                            )
                          )}
                          <Button type="dashed" onClick={() => addSlot()} block>
                            + Add Time Slot
                          </Button>
                        </>
                      )}
                    </Form.List>

                    <Button danger onClick={() => remove(name)} block>
                      Remove Date
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Date
                </Button>
              </div>
            )}
          </Form.List>
          */}

          {/* Addons */}
          <Form.List name="addons">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                <label className="font-medium">Add-ons</label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} className="flex" align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      rules={[{ required: true, message: "Addon name" }]}
                    >
                      <Input placeholder="Addon Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Addon price" }]}
                    >
                      <Input type="number" placeholder="Price" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Delete
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Addon
                </Button>
              </div>
            )}
          </Form.List>

          {/* Peak Hours */}
          <Form.List name="peak_hours">
            {(fields, { add, remove }) => (
              <div className="space-y-2">
                <label className="font-medium">
                  Peak Hours (HH:MM 12-hour)
                </label>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} className="flex" align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, "key"]}
                      rules={[{ required: true, message: "Select time" }]}
                    >
                      <TimePicker format="hh:mm A" use12Hours />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <Input type="number" placeholder="Price" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Delete
                    </Button>
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  + Add Peak Hour
                </Button>
              </div>
            )}
          </Form.List>

          {/* Images */}
          {/*
          
          
          <Form.Item
            label="Images"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList || []
            }
          >
            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              maxCount={5}
            >
              <div>
                <UploadOutlined /> Upload
              </div>
            </Upload>
          </Form.Item>
          */}
        </Form>
      </Modal>
    </div>
  );
}
