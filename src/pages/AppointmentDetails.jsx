import { Button, Modal } from "antd";
import { useState } from "react";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { FaTimesCircle, FaChevronLeft, FaRupeeSign } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetvendorBookingDetailsQuery,
  useGetvendorBookingQuery,
} from "../services/vendorTransactionListApi";
import SpinnerLodar from "../components/SpinnerLodar";

export default function AppointmentDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetvendorBookingDetailsQuery(id);
  const navigate = useNavigate();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <SpinnerLodar title="Loading Appointment..." />
      </div>
    );
  }

  // const appointment = data?.data?.find((appt) => String(appt.id) === id);
  const appointment = data?.data;

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

  const subtotal = appointment.subtotal ? appointment.subtotal : "00.00";
  const taxes = appointment?.gst_amount ? appointment?.gst_amount : "00.00";
  const discount = appointment.discount_amount
    ? appointment.discount_amount
    : 0;
  const grandTotal = appointment.final_amount
    ? appointment.final_amount
    : "00.00";

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
          {appointment.vendor?.business_name || appointment.vendor?.name}
        </h3>
        <p className="text-gray-600 flex items-center gap-2">
          <EnvironmentOutlined />{" "}
          {appointment.vendor?.location_area_served ||
            appointment.vendor?.FullAddress}
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
          {appointment.customer?.address ||
            appointment.customer?.FullAddress ||
            "Not provided"}
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
          <h4 className="font-semibold mb-3 text-black">Services</h4>

          {appointment.services?.length > 0 ? (
            // Array of services
            <div className="space-y-2">
              {appointment.services.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">
                      {service.name}
                    </span>
                  </div>
                  <span className="font-semibold text-black text-lg">
                    ₹{service.price}
                  </span>
                </div>
              ))}

              {/* Total */}
              {appointment.services.length > 1 && (
                <div className="mt-4 pt-4 border-t-2 border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xl text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-extrabold text-2xl text-indigo-600">
                      ₹
                      {appointment.services.reduce(
                        (total, service) => total + (service.price || 0),
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : appointment.services?.name ? (
            // Single service object
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="font-semibold text-gray-800">
                {appointment.services.name}
              </span>
              <span className="font-bold text-xl text-black">
                ₹{appointment.services.price}
              </span>
            </div>
          ) : (
            // No services
            <div className="text-center py-8 text-gray-500">
              No services selected
            </div>
          )}
        </div>

        {/* Price Details */}
        <div className="bg-white w-full rounded-xl shadow p-4 mb-4 md:mb-0">
          <h4 className="font-semibold text-black mb-2">Price Details</h4>
          <div className="flex justify-between text-gray-700">
            <span>Sub Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>GST</span>
            <span>₹{taxes}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Discount</span>
            <span>₹{discount}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Convenience Fee</span>
            <span>₹{appointment?.convenience_fee}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Platform Fee</span>
            <span>₹{appointment?.platform_fee}</span>
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
          <FaRupeeSign /> {appointment.payment_status || "Pending"}
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
