import {
  FaCalendarAlt,
  FaCheckCircle,
  FaChartPie,
  FaTimesCircle,
} from "react-icons/fa";
import { useState } from "react";
import {
  Form,
  Input,
  Modal,
  Rate,
  Pagination,
  List,
  Tag,
  Button,
  Skeleton,
} from "antd";
import {
  useAcceptBookingMutation,
  useCompletedBookingMutation,
  useGetvendorBookingQuery,
  useRejectBookingMutation,
} from "../services/vendorTransactionListApi";
import { toast } from "react-toastify";
import { convertToIST } from "../utils/utils";
import Breadcrumb from "../components/Breadcrumb";
import { useNavigate } from "react-router-dom";

const statusMap = {
  pending: "pending",
  accepted: "accepted",
  rejected: "rejected",
  completed: "completed",
};

const tabs = [
  { id: "pending", icon: <FaChartPie />, label: "Pending" },
  { id: "accepted", icon: <FaCheckCircle />, label: "Accepted" },
  { id: "rejected", icon: <FaTimesCircle />, label: "Cancelled" },
  { id: "completed", icon: <FaCalendarAlt />, label: "Completed" },
];

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const apiStatus = statusMap[activeTab] || "pending";

  // ✅ API with ensured default param
  const { data, isLoading, refetch, error } = useGetvendorBookingQuery(
    { status: apiStatus },
    {
      skip: !apiStatus, // Don't call empty status
      refetchOnMountOrArgChange: 5, // Refetch on tab change
    }
  );

  const [acceptBooking] = useAcceptBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();
  const [completedBooking] = useCompletedBookingMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptingId, setAcceptingId] = useState(null);
  const [pageSize] = useState(8);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

  const toggleTimeSlot = (appointmentId, time) => {
    setSelectedTimeSlots((prev) => ({
      ...prev,
      [appointmentId]: prev[appointmentId] === time ? null : time,
    }));
  };

  const getSelectedTimeSlot = (appointmentId) => {
    return selectedTimeSlots[appointmentId] || null;
  };

  // Feedback Modal
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackForm] = Form.useForm();

  const appointments = data?.data || [];
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const statusColorMap = {
    confirmed: "processing",
    accepted: "success",
    rejected: "error",
    past: "default",
  };

  // --- Actions ---
  const handleAccept = async (id) => {
    const selectedTimeSlot = getSelectedTimeSlot(id);
    if (!selectedTimeSlot) {
      toast.warning("Please select a time slot to accept the booking.");
      return;
    }

    setAcceptingId(id);
    try {
      const formdata = new FormData();
      formdata.append("accept_time", selectedTimeSlot);

      await acceptBooking({ id, formdata }).unwrap();
      toast.success("Appointment accepted successfully");
      refetch();
      setSelectedTimeSlots((prev) => ({ ...prev, [id]: null }));
    } catch {
      toast.error("Failed to accept appointment");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectBooking(id).unwrap();
      toast.success("Appointment rejected successfully");
      refetch();
    } catch {
      toast.error("Failed to reject appointment");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completedBooking(id).unwrap();
      toast.success("Appointment marked as completed");
      refetch();
    } catch {
      toast.error("Failed to complete appointment");
    }
  };

  const handleGiveFeedbackClick = () => {
    feedbackForm.resetFields();
    setFeedbackModalVisible(true);
  };

  const handleFeedbackSubmit = () => {
    feedbackForm.validateFields().then(() => {
      toast.success("Feedback submitted!");
      setFeedbackModalVisible(false);
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/appointments_details/${id}`);
  };

  // --- UI ---
  return (
    <div className="mt-10 px-3 sm:px-6 mb-8  ">
      <Breadcrumb propertyTitle={"My Appointments"} />

      <div className="max-w-7xl mx-auto bg-white border rounded-2xl shadow-md p-4 sm:p-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6">
          Appointments
        </h3>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          {tabs.map(({ id, icon, label }) => (
            <Button
              key={id}
              type={activeTab === id ? "primary" : "default"}
              onClick={() => {
                setActiveTab(id);
                setCurrentPage(1);
              }}
              icon={icon}
              style={
                activeTab === id
                  ? { background: "#EE4E34", borderColor: "#EE4E34" }
                  : {}
              }
              className="flex-1 sm:flex-none"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <Skeleton active paragraph={{ rows: 4 }} className="w-full" />
          </div>
        ) : paginatedAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
            <FaTimesCircle className="text-5xl mb-3" />
            <p className="text-lg font-medium">No appointments found</p>
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={paginatedAppointments}
            renderItem={(appt) => (
              <List.Item
                key={appt.id}
                className="rounded-xl border border-gray-200 bg-gray-50 mb-4 p-3 sm:p-5 shadow-sm hover:shadow-md transition"
                actions={[
                  <div
                    key="actions"
                    className="w-full flex flex-col sm:flex-row gap-2 justify-stretch sm:justify-start"
                  >
                    {/* Pending */}
                    {activeTab === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button
                          className="w-full sm:w-auto px-4 py-2 text-white bg-green-700 hover:bg-green-800 rounded-md text-sm font-medium flex items-center justify-center h-8"
                          disabled={acceptingId === appt.id}
                          onClick={() => handleAccept(appt.id)}
                        >
                          {acceptingId === appt.id ? (
                            <span className="flex items-center gap-2">
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Accepting...
                            </span>
                          ) : (
                            "Accept"
                          )}
                        </button>

                        <button
                          className="w-full sm:w-auto px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md text-sm font-medium flex items-center justify-center h-8"
                          onClick={() => handleReject(appt.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Accepted */}
                    {activeTab === "accepted" && (
                      <button
                        className="w-full sm:w-auto px-6 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-semibold flex items-center justify-center h-8"
                        onClick={() => handleComplete(appt.id)}
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* Past */}
                    {activeTab === "past" && (
                      <button
                        className="w-full sm:w-auto px-6 py-2 text-white bg-purple-500 hover:bg-purple-600 rounded-md text-sm font-semibold flex items-center justify-center h-8"
                        onClick={handleGiveFeedbackClick}
                      >
                        Give Feedback
                      </button>
                    )}

                    {/* Always visible */}
                    <button
                      className="w-full sm:w-auto px-6 py-2 text-white bg-[#EE4E34] hover:bg-[#d43c2c] rounded-md text-sm font-semibold flex items-center justify-center h-8"
                      onClick={() => handleViewDetails(appt.id)}
                    >
                      View Details
                    </button>
                  </div>,
                ].filter(Boolean)}
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
                  backgroundColor: "#F5F5F5",
                  padding: 10,
                }}
              >
                <List.Item.Meta
                  title={
                    <div className="flex  justify-between items-center gap-2">
                      {Array.isArray(appt.services) && appt.services.length > 0
                        ? appt.services.map((service) => (
                            <span
                              key={service.id || service.name}
                              className="bg-orange-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold"
                            >
                              {service.name}
                            </span>
                          ))
                        : "Service"}

                      <div>
                        {/* Status Tag */}
                        <Tag
                          color={statusColorMap[activeTab]}
                          className="w-full  p-1 text-center  flex items-center justify-center text-xs"
                        >
                          {tabs.find((tab) => tab.id === activeTab)?.label}
                        </Tag>
                      </div>
                    </div>
                  }
                  description={
                    <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                      <div className="p-2 border rounded-md">
                        <span className="font-semibold text-gray-800">
                          Shop Name:{" "}
                        </span>
                        <span>{appt.vendor?.business_name || "-"}</span>
                      </div>

                      <div className="p-2 border rounded-md">
                        <span className="font-semibold text-gray-800">
                          Customer:{" "}
                        </span>
                        <span>{appt.customer?.name || "-"}</span>
                      </div>

                      <div className="p-2 border rounded-md">
                        <span className="font-semibold text-gray-800">
                          Booking Date:{" "}
                        </span>
                        <span>{convertToIST(appt.created_at)}</span>
                      </div>

                      <div className="p-2 flex items-center gap-4 border rounded-md">
                        <span className="font-semibold text-gray-800">
                          Time Slots:{" "}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {appt.schedule_time &&
                            Object.entries(appt.schedule_time).map(
                              ([time, date], index) => {
                                const isPendingTab = activeTab === "pending";
                                const isSelected = isPendingTab
                                  ? getSelectedTimeSlot(appt.id) === time
                                  : appt.accept_time === time;

                                return (
                                  <span
                                    key={`${appt.id}-${time}-${index}`}
                                    onClick={
                                      isPendingTab
                                        ? () => toggleTimeSlot(appt.id, time)
                                        : undefined
                                    }
                                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 relative group ${
                                      isSelected
                                        ? "border-2 border-orange-500 bg-orange-500 text-white shadow-lg scale-105"
                                        : isPendingTab
                                        ? "border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-md hover:scale-[1.02]"
                                        : "border-gray-200 bg-gray-50 cursor-default"
                                    } ${
                                      isPendingTab
                                        ? "cursor-pointer select-none"
                                        : "cursor-default"
                                    }`}
                                    title={
                                      isSelected && !isPendingTab
                                        ? `Accepted time: ${time}`
                                        : isPendingTab
                                        ? "Click to select"
                                        : ""
                                    }
                                  >
                                    {time}
                                    {isSelected && !isPendingTab && (
                                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                        ✓
                                      </div>
                                    )}
                                  </span>
                                );
                              }
                            )}
                        </div>
                      </div>
                    </div>
                  }
                />
                <div className="mt-2 font-medium text-gray-800">
                  Amount:{" "}
                  <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    ₹{appt.amount || appt.final_amount}
                  </span>
                </div>
              </List.Item>
            )}
          />
        )}

        {/* Pagination */}
        {appointments.length > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={appointments.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              simple
            />
          </div>
        )}

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
              <Input.TextArea rows={4} placeholder="Write your feedback..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
