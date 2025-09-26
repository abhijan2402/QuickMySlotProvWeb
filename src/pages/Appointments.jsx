import {
  FaCalendarAlt,
  FaChartPie,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import { useState } from "react";
import { motion } from "framer-motion";
import { Form, Input, Modal, Rate, Pagination } from "antd";
import {
  useAcceptBookingMutation,
  useCompletedBookingMutation,
  useGetvendorBookingQuery,
  useRejectBookingMutation,
} from "../services/vendorTransactionListApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerLoder from "../components/SpinnerLodar";

const noDataVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

const statusMap = {
  upcoming: "pending",
  accepted: "accepted",
  rejected: "rejected",
  past: "completed",
};

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const apiStatus = statusMap[activeTab] || "";
  const { data, isLoading } = useGetvendorBookingQuery({ status: apiStatus });
  const [acceptBooking] = useAcceptBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();
  const [completedBooking] = useCompletedBookingMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptingId, setAcceptingId] = useState(null);
  const [pageSize] = useState(6);

  // Feedback Modal State
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const [feedbackForm] = Form.useForm();

  // Pagination
  const paginatedAppointments = data?.data?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAccept = async (id) => {
    setAcceptingId(id);
    try {
      await acceptBooking(id).unwrap();
      toast.success("Appointment accepted successfully");
    } catch (error) {
      toast.error("Failed to accept the appointment");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id).unwrap();
      toast.success("Appointment rejected successfully");
    } catch (error) {
      toast.error("Failed to reject the appointment");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completedBooking(id).unwrap();
      toast.success("Appointment completed successfully");
    } catch (error) {
      toast.error("Failed to complete the appointment");
    }
  };

  const handleGiveFeedbackClick = (id) => {
    setCurrentFeedbackId(id);
    feedbackForm.resetFields();
    setFeedbackModalVisible(true);
  };

  const handleFeedbackSubmit = () => {
    feedbackForm.validateFields().then((values) => {
      console.log("Feedback for appointment", currentFeedbackId, values);
      setFeedbackModalVisible(false);
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/appointments_details/${id}`);
  };

  const renderAppointments = () => {
    if (isLoading) {
      return (
        <div className="h-[50vh] flex items-center justify-center">
          <SpinnerLoder title="Appointments" />
        </div>
      );
    }

    if (paginatedAppointments?.length === 0) {
      return (
        <motion.div
          className="h-[50vh] flex flex-col items-center justify-center text-gray-400 select-none"
          variants={noDataVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <FaTimesCircle className="text-6xl mb-4 animate-bounce" />
          <p className="text-lg font-medium">No appointments found.</p>
        </motion.div>
      );
    }

    return (
      <motion.ul
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={tabVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {paginatedAppointments.map((appt) => (
          <li
            key={appt.id}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between hover:shadow-xl transition"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-gray-800 font-semibold text-lg">
                  {appt.service?.name || "Service"}
                </h4>
                <span
                  onClick={() => handleViewDetails(appt.id)}
                  className="text-orange-500 flex items-center gap-1 cursor-pointer hover:underline font-medium"
                >
                  View details <FaCalendarAlt />
                </span>
              </div>

              <div className="text-gray-600 text-sm">
                <p className="font-medium text-gray-800">Customer:</p>
                <p>{appt.customer?.name}</p>
              </div>

              <div className="text-gray-600 text-sm">
                <p className="font-medium text-gray-800">Booking Date:</p>
                {appt.schedule_time &&
                  Object.entries(appt.schedule_time).map(([time, date]) => (
                    <p key={time}>
                      {date} at {time}
                    </p>
                  ))}
              </div>

              <p className="flex justify-between items-center mt-1 text-gray-800 font-medium">
                Amount:
                <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                  ₹{appt.amount}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {activeTab === "upcoming" && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(appt.id);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    {acceptingId === appt.id ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(appt.id);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              )}

              {activeTab === "accepted" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete(appt.id);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Completed
                </button>
              )}
            </div>
          </li>
        ))}
      </motion.ul>
    );
  };

  const tabs = [
    { id: "upcoming", icon: <FaChartPie />, label: "Upcoming" },
    { id: "accepted", icon: <FaCheckCircle />, label: "Accepted" },
    { id: "rejected", icon: <FaTimesCircle />, label: "Rejected" },
    { id: "past", icon: <FaCalendarAlt />, label: "Completed" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <Breadcrumb propertyTitle={"My Appointments"} />

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500 inline-block">
            Appointments
          </h3>

          {/* Tabs */}
          <div className="flex gap-3 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(({ id, icon, label }) => (
              <motion.button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setCurrentPage(1);
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 whitespace-nowrap px-5 py-2 rounded-lg font-semibold text-sm transition ${
                  activeTab === id
                    ? "bg-[#EE4E34] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>

          {renderAppointments()}

          {/* Pagination */}
          {paginatedAppointments?.length > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={data?.data?.length || 0}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal
        title="Give Feedback"
        open={feedbackModalVisible}
        onOk={handleFeedbackSubmit}
        onCancel={() => setFeedbackModalVisible(false)}
        okText="Submit"
        cancelText="Cancel"
        destroyOnClose
      >
        <Form form={feedbackForm} layout="vertical">
          <Form.Item
            name="rating"
            label="Rate Customer"
            rules={[{ required: true, message: "Please provide a rating" }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item
            name="review"
            label="Review / Comments"
            rules={[{ required: true, message: "Please write your review" }]}
          >
            <Input.TextArea rows={4} placeholder="Write your feedback here" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
