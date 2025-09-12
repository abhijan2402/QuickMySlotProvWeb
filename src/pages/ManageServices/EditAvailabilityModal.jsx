import React, { useState } from "react";
import { Modal, Form, DatePicker, Tag, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function EditAvailabilityModal({
  open,
  service,
  onClose,
  onSave,
}) {
  const [dates, setDates] = useState(service.availability || []);

  const handleSave = () => {
    onSave(dates);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={<span className="text-xl font-bold">Set Availability Dates</span>}
      footer={null}
      destroyOnClose
      centered
      width={420}
    >
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Select Available Dates">
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            format="DD MMM YYYY"
            onChange={(val) => setDates(val)}
          />
        </Form.Item>

        {dates && dates.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {dates.map((dt, idx) => (
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
  );
}
