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
  past: "completed",
};

const tabs = [
  { id: "pending", icon: <FaChartPie />, label: "Pending" },
  { id: "accepted", icon: <FaCheckCircle />, label: "Accepted" },
  { id: "rejected", icon: <FaTimesCircle />, label: "Cancelled" },
  { id: "past", icon: <FaCalendarAlt />, label: "Completed" },
];

export default function Appointments() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const apiStatus = statusMap[activeTab] || "pending";

  // ✅ API with ensured default param
  const { data, isLoading, refetch, isFetching } = useGetvendorBookingQuery(
    { status: apiStatus }
    // { refetchOnMountOrArgChange: true }
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
        {isFetching ? (
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
                  activeTab === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        type="primary"
                        loading={acceptingId === appt.id}
                        onClick={() => handleAccept(appt.id)}
                        style={{
                          backgroundColor: "#16a34a",
                          borderColor: "#16a34a",
                          color: "#fff",
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        danger
                        type="default"
                        onClick={() => handleReject(appt.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  ),
                  activeTab === "accepted" && (
                    <Button onClick={() => handleComplete(appt.id)}>
                      Mark Completed
                    </Button>
                  ),
                  activeTab === "past" && (
                    <Button onClick={handleGiveFeedbackClick}>
                      Give Feedback
                    </Button>
                  ),
                  <Button
                    type="default"
                    onClick={() => handleViewDetails(appt.id)}
                    style={{
                      backgroundColor: "#EE4E34",
                      borderColor: "#EE4E34",
                      color: "#fff",
                    }}
                  >
                    View Details
                  </Button>,
                ].filter(Boolean)}
                extra={
                  <Tag color={statusColorMap[activeTab]}>
                    {tabs.find((tab) => tab.id === activeTab)?.label}
                  </Tag>
                }
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
                    <div className="flex flex-wrap gap-2">
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
                    ₹{appt.amount}
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
