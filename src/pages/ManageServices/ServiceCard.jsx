import React from "react";
import { Button, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ServiceCard({ service, onDelete, onEditAvailability }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-black">{service.name}</h3>
        <p className="text-gray-500 mb-2">{service.description}</p>

        <div className="flex justify-between items-center">
          <span className="font-bold text-black">
            ${service.price.toFixed(2)}
          </span>
          <Tag color="blue">{service.duration} mins</Tag>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {service.tags.includes("Peak Eligible") && (
            <Tag color="orange">Peak Eligible</Tag>
          )}
          {service.tags.includes("Discount Eligible") && (
            <Tag color="green">Discount Eligible</Tag>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => onEditAvailability(service)}
        />
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(service.id)}
        />
      </div>
    </div>
  );
}
