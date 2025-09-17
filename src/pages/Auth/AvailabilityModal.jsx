// AvailabilityModal.jsx
import React from "react";
import { Modal, Form, TimePicker, Select, Button, message } from "antd";
import dayjs from "dayjs";
import { useSetAvailabilityMutation } from "../../services/authApi";
import { toast } from "react-toastify";

const { Option } = Select;

export default function AvailabilityModal({ visible, onClose, userID }) {
  const [setAvailability, { isLoading }] = useSetAvailabilityMutation();

  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      const fd = new FormData();

      // append times
      fd.append("daily_start_time", values.daily_start.format("HH:mm"));
      fd.append("daily_end_time", values.daily_end.format("HH:mm"));
      fd.append("user_id", userID);

      // ✅ Map short day names (Mon, Tue, etc.) → full lowercase names
      const dayMap = {
        Mon: "monday",
        Tue: "tuesday",
        Wed: "wednesday",
        Thu: "thursday",
        Fri: "friday",
        Sat: "saturday",
        Sun: "sunday",
      };

      (values.working_days || []).forEach((day, index) => {
        fd.append(`working_days[${index}]`, dayMap[day] || day.toLowerCase());
      });

      await setAvailability(fd).unwrap();
      toast.success("Availability Saved successfully.");
      form.resetFields();
      onNext();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to save availability.");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Set Your Availability"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="daily_start"
          label="Daily Start Time"
          rules={[{ required: true, message: "Select start time" }]}
        >
          <TimePicker
            format="HH:mm"
            defaultOpenValue={dayjs("09:00", "HH:mm")}
          />
        </Form.Item>

        <Form.Item
          name="daily_end"
          label="Daily End Time"
          rules={[{ required: true, message: "Select end time" }]}
        >
          <TimePicker
            format="HH:mm"
            defaultOpenValue={dayjs("18:00", "HH:mm")}
          />
        </Form.Item>

        <Form.Item
          name="working_days"
          label="Working Days"
          rules={[{ required: true, message: "Select at least one day" }]}
        >
          <Select mode="multiple" placeholder="Select working days">
            <Option value="Mon">Monday</Option>
            <Option value="Tue">Tuesday</Option>
            <Option value="Wed">Wednesday</Option>
            <Option value="Thu">Thursday</Option>
            <Option value="Fri">Friday</Option>
            <Option value="Sat">Saturday</Option>
            <Option value="Sun">Sunday</Option>
          </Select>
        </Form.Item>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save & Continue
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
