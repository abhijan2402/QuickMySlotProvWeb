import React from "react";
import ServiceList from "./ServiceList";

export default function CategoryList({
  services,
  onDelete,
  onEditAvailability,
}) {
  const grouped = services.reduce((acc, svc) => {
    acc[svc.mainCategory] = acc[svc.mainCategory] || [];
    acc[svc.mainCategory].push(svc);
    return acc;
  }, {});

  return (
    <div>
      {Object.keys(grouped).map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <ServiceList
            services={grouped[category]}
            onDelete={onDelete}
            onEditAvailability={onEditAvailability}
          />
        </div>
      ))}
    </div>
  );
}
