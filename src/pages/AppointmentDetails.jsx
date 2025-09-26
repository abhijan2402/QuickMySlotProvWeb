import { Button, Modal } from "antd";
import { useState } from "react";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { FaTimesCircle, FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useGetvendorBookingQuery } from "../services/vendorTransactionListApi";
import SpinnerLodar from "../components/SpinnerLodar";

export default function AppointmentDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetvendorBookingQuery();
  const navigate = useNavigate();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerLodar title="Loading Appointment..." />
      </div>
    );
  }

  const appointment = data?.data?.find((appt) => String(appt.id) === id);

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <FaTimesCircle className="text-6xl mb-4 animate-bounce" />
        <p className="text-lg font-semibold">No appointment found</p>
        <Button
          className="mt-4 bg-[#EE4E34] text-white"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const subtotal = Number(appointment.service?.price || 0);
  const taxes = Number(appointment.tax || 0);
  const discount = appointment.promo_code_id ? 50 : 0;
  const grandTotal = subtotal + taxes - discount;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <p
        className="text-[#EE4E34] flex items-center cursor-pointer font-medium underline mb-4"
        onClick={() => navigate(-1)}
      >
        <FaChevronLeft className="mx-2 text-[#EE4E34]" /> Back
      </p>

      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#EE4E34]">
        Appointment Details
      </h2>

      {/* Shop Details */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <img
          src={appointment.vendor?.image}
          alt="shop"
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <h3 className="text-lg font-semibold text-black">
          {appointment.vendor?.business_name}
        </h3>
        <p className="text-gray-600 flex items-center gap-2">
          <EnvironmentOutlined />{" "}
          {appointment.vendor?.location_area_served || "Not provided"}
        </p>
        <p className="text-gray-600 flex items-center gap-2">
          <PhoneOutlined /> {appointment.vendor?.phone_number}
        </p>
        <div className="flex justify-end">
          <Button type="primary" className="mt-2 bg-[#EE4E34]">
            Chat
          </Button>
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h4 className="font-semibold mb-2 text-black">Customer Details</h4>
        <p className="text-gray-700 flex items-center gap-2">
          <UserOutlined /> {appointment.customer?.name}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <PhoneOutlined /> {appointment.customer?.phone_number}
        </p>
        <p className="text-gray-700 flex items-center gap-2">
          <EnvironmentOutlined />{" "}
          {appointment.customer?.address || "Not provided"}
        </p>
        <p className="text-gray-700 flex items-center gap-2 flex-wrap">
          <CalendarOutlined />{" "}
          {Object.entries(appointment.schedule_time || {}).map(
            ([time, date]) => (
              <span key={time} className="mr-3">
                {date} - {time}
              </span>
            )
          )}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Services */}
        <div className="bg-white w-full rounded-xl shadow p-4 mb-4 md:mb-0">
          <h4 className="font-semibold mb-2 text-black">Service</h4>
          <div className="flex justify-between text-gray-700 mb-1">
            <span>{appointment.service?.name}</span>
            <span>₹{appointment.service?.price}</span>
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-white w-full rounded-xl shadow p-4 mb-4 md:mb-0">
          <h4 className="font-semibold text-black mb-2">Price Details</h4>
          <div className="flex justify-between text-gray-700">
            <span>Sub Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Taxes</span>
            <span>₹{taxes}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
          <div className="flex justify-between font-bold text-[#EE4E34] mt-2 border-t pt-2">
            <span>Grand Total</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl text-black shadow mt-4 p-4 mb-4">
        <h4 className="font-semibold mb-2">Payment Status</h4>
        <p className="text-gray-700 flex items-center gap-2">
          <DollarOutlined /> {appointment.payment_status || "Pending"}
        </p>
      </div>

      {/* Cancel Button */}
      {/* <Button
        block
        size="large"
        className="bg-red-500 text-white"
        onClick={() => setCancelModalVisible(true)}
      >
        Cancel Appointment
      </Button> */}

      {/* Cancel Modal */}
      <Modal
        title="Confirm Cancellation"
        open={cancelModalVisible}
        onOk={() => alert("Appointment Cancelled")}
        onCancel={() => setCancelModalVisible(false)}
        okText="Yes, Cancel"
        cancelText="No"
        centered
      >
        <p>Are you sure you want to cancel this appointment?</p>
      </Modal>
    </div>
  );
}
