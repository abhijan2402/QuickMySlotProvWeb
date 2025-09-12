import React from "react";
import { FaWallet, FaChartPie, FaHeart, FaGift } from "react-icons/fa";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useGetanalyticsQuery } from "../services/analyticsApi";

const Analytics = () => {
  const { data, isLoading } = useGetanalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg font-medium">
          📊 No analytics available yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl shadow bg-gradient-to-r from-blue-50 to-blue-100">
          <h4 className="text-gray-700 font-semibold flex items-center gap-2">
            <FaWallet className="text-blue-500" /> Revenue This Month
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{data?.data?.revenue_this_month ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl shadow bg-gradient-to-r from-green-50 to-green-100">
          <h4 className="text-gray-700 font-semibold flex items-center gap-2">
            <FaGift className="text-green-500" /> Total Customers
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {data?.data?.total_customers ?? 0}
          </p>
        </div>
        <div className="p-4 rounded-xl shadow bg-gradient-to-r from-purple-50 to-purple-100">
          <h4 className="text-gray-700 font-semibold flex items-center gap-2">
            <FaChartPie className="text-purple-500" /> Reach (vs Last Month)
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-1">
            {data?.data?.reach ?? 0}
            <ArrowUpOutlined />
          </p>
        </div>
        <div className="p-4 rounded-xl shadow bg-gradient-to-r from-pink-50 to-pink-100">
          <h4 className="text-gray-700 font-semibold flex items-center gap-2">
            <FaHeart className="text-pink-500" /> Estimated Footfall
          </h4>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {data?.data?.estimated_footfall ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
