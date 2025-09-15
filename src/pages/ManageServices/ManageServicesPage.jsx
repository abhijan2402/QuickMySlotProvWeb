import React from "react";
import { Tabs } from "antd";
import MyServices from "./MyServices/MyServices";
import MySubServices from "./MySubServices/MySubServices";

const { TabPane } = Tabs;

export default function ManageServicesPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-xl font-medium text-black">Manage Services</h1>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="1"
        type="card"
        className="bg-white p-4 rounded-2xl shadow-md"
      >
        <TabPane tab="My Services" key="1">
          <div className="p-4">
            <p className="text-gray-600">
              Here you can manage all your **services** under sub services.
            </p>
            <MySubServices />
          </div>
        </TabPane>
        <TabPane tab="My Sub-Services" key="2">
          <div className="p-4">
            <p className="text-gray-600">
              Here you can manage all your **sub services** under business
              category.
            </p>
            <MyServices />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
