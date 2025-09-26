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

export default function Appointments() {
  const { data, isLoading } = useGetvendorBookingQuery();
  const [acceptBooking] = useAcceptBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();
  const [acceptingId, setAcceptingId] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // appointments per page

  // Feedback Modal State
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState(null);
  const [feedbackForm] = Form.useForm();

  // Filter appointments by status
  const filteredAppointments = data?.data?.filter((appt) => {
    switch (activeTab) {
      case "upcoming":
        return appt.status === "pending";
      case "accepted":
        return appt.status === "accepted";
      case "rejected":
        return appt.status === "rejected";
      case "past":
        return appt.status === "completed";
      default:
        return true;
    }
  });

  console.log(filteredAppointments);

  // Pagination
  const paginatedAppointments = filteredAppointments?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAccept = async (id) => {
    setAcceptingId(id); // mark this appointment as being accepted
    try {
      await acceptBooking(id).unwrap();
      toast.success("Appointment accepted successfully");
    } catch (error) {
      toast.error("Failed to accept the appointment");
    } finally {
      setAcceptingId(null); // reset after done
    }
  };

  const handleReject = async (id) => {
    console.log("Reject appointment", id);
    await rejectBooking(id)
      .unwrap()
      .then(() => {
        toast.success("Appointment rejected successfully");
      })
      .catch(() => {
        toast.error("Failed to reject the appointment");
      });
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
    navigate(`/appointment/${id}`); // navigate to details page
  };

  const renderAppointments = () => {
    if (paginatedAppointments?.length === 0) {
      return (
        <motion.div
          className="h-[50vh] flex flex-col items-center justify-center text-gray-500 select-none"
          variants={noDataVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key="no-data"
        >
          <FaTimesCircle className="text-6xl mb-4 animate-bounce text-gray-400" />
          <p className="text-lg">No appointments found.</p>
        </motion.div>
      );
    }

    if (isLoading) {
      return (
        <motion.div
          className="h-[50vh] flex flex-col items-center justify-center text-gray-500 select-none"
          variants={noDataVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key="no-data"
        >
          {/* <FaTimesCircle className="text-6xl mb-4 animate-bounce text-gray-400" />
              <p className="text-lg">No appointments found.</p> */}
          <SpinnerLoder title="Appointments" />
        </motion.div>
      );
    }

    return (
      <div>
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key="appointments-list"
        >
          {paginatedAppointments.map((appt) => (
            <li
              key={appt.id}
              className="p-6 bg-white rounded-xl shadow-md border flex flex-col space-y-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleViewDetails(appt.id)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  {appt.service?.name || "Service"}
                </h4>
                <FaCalendarAlt className="text-blue-500 text-lg" />
              </div>

              {/* Customer */}
              <div className="text-gray-700 text-sm">
                <p className="text-black font-medium">Customer:</p>
                <p>{appt.customer?.name}</p>
              </div>

              {/* Booking Time */}
              <div className="text-gray-700 text-sm">
                <p className="text-black font-medium">Booking Date:</p>
                {appt.schedule_time &&
                  Object.entries(appt.schedule_time).map(([time, date]) => (
                    <p key={time}>
                      {date} at {time}
                    </p>
                  ))}
              </div>

              {/* Amount */}
              <p className="text-gray-900 text-sm flex justify-between mt-1">
                <span className="text-black font-medium">Amount:</span>
                <span className="border bg-green-200 px-4 py-1 rounded-md">
                  ₹{appt.amount}
                </span>
              </p>

              {/* Actions */}
              {activeTab === "upcoming" && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(appt.id);
                    }}
                    className="bg-green-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-green-700 transition"
                  >
                    {acceptingId === appt.id ? "Accepting..." : "Accept"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(appt.id);
                    }}
                    className="bg-red-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
              {activeTab === "accepted" && (
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(appt.id);
                    }}
                    className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Completed
                  </button>
                </div>
              )}
            </li>
          ))}
        </motion.ul>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredAppointments?.length || 0}
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: "upcoming", icon: <FaChartPie />, label: "Upcoming" },
    { id: "past", icon: <FaCheckCircle />, label: "Past" },
    { id: "accepted", icon: <FaCheckCircle />, label: "Accepted" },
    { id: "rejected", icon: <FaCheckCircle />, label: "Rejected" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <Breadcrumb propertyTitle={"My Appointment"} />

        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointments</h3>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(({ id, icon, label }) => (
              <motion.button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setCurrentPage(1); // reset pagination when tab changes
                }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm font-semibold select-none transition ${
                  activeTab === id
                    ? "bg-[#EE4E34] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>

          <div>{renderAppointments()}</div>
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
