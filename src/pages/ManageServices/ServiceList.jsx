import React from "react";
import ServiceCard from "./ServiceCard";

export default function ServiceList({
  services,
  onDelete,
  onEditAvailability,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onDelete={onDelete}
          onEditAvailability={onEditAvailability}
        />
      ))}
    </div>
  );
}
