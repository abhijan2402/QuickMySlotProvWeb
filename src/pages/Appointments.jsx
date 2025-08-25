import {
  FaCalendarAlt,
  FaChartPie,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";
import { useState } from "react";
import { motion } from "framer-motion";

const noDataVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
  exit: { opacity: 0, y: -10 },
};

const tabVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");

  // Example appointment data for vendor side
  const appointments = {
    upcoming: [
      {
        id: 1,
        customer: {
          name: "John Doe",
          phone: "+91 9876543210",
          address: "123 Main Street, New Delhi",
        },
        services: [
          { name: "Haircut", price: 300 },
          { name: "Shampoo", price: 150 },
        ],
        totalAmount: 450,
        bookingDetails: {
          date: "2025-08-25",
          time: "5:00 PM",
          duration: "1 hr",
        },
        provider: "John's Salon",
        title: "Haircut - 5PM",
      },
      {
        id: 2,
        customer: {
          name: "Jane Smith",
          phone: "+91 9123456780",
          address: "456 Park Avenue, Mumbai",
        },
        services: [{ name: "Spa", price: 1200 }],
        totalAmount: 1200,
        bookingDetails: {
          date: "2025-08-27",
          time: "3:00 PM",
          duration: "1.5 hrs",
        },
        provider: "Relax Hub",
        title: "Spa - 3PM",
      },
    ],
    past: [
      {
        id: 3,
        customer: {
          name: "Michael Johnson",
          phone: "+91 9988776655",
          address: "789 Elm Street, Chennai",
        },
        services: [
          { name: "Facial", price: 800 },
          { name: "Massage", price: 1500 },
        ],
        totalAmount: 2300,
        bookingDetails: {
          date: "2025-07-15",
          time: "11:00 AM",
          duration: "2 hrs",
        },
        provider: "Relax Hub",
        title: "Facial + Massage",
      },
    ],
  };

  const handleAccept = (id) => {
    console.log("Accept appointment", id);
    // Implement API call or state update here
  };

  const handleReject = (id) => {
    console.log("Reject appointment", id);
    // Implement API call or state update here
  };

  const handleFeedback = (id) => {
    console.log("Give feedback for appointment", id);
    // Implement modal or page redirect here
  };

  const renderAppointments = () => {
    const currentAppointments = appointments[activeTab];

    if (!currentAppointments || currentAppointments.length === 0) {
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

    return (
      <div>
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full"
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key="appointments-list"
        >
          {currentAppointments.map((appt) => (
            <>
              <li
                key={appt.id}
                className="p-6 bg-white rounded-xl shadow-md border flex flex-col space-y-4 hover:shadow-lg transition cursor-default"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-gray-800">{appt.title}</h4>
                  <FaCalendarAlt className="text-blue-500 text-lg" />
                </div>

                {/* Customer Details */}
                <div className="text-gray-700 text-sm ">
                  <p className="text-black font-medium">Booking Details:</p>
                  <div className="ml-5">
                    <p className="flex justify-between">
                      <span>Customer:</span> {appt.customer.name}
                    </p>
                    <p className="flex justify-between">
                      <span>Phone:</span> {appt.customer.phone}
                    </p>
                    <p className="flex justify-between">
                      <span>Address:</span> {appt.customer.address}
                    </p>
                  </div>
                </div>

                {/* Services Booked */}
                <div>
                  <p className="text-black font-medium text-sm">
                    Services Booked:
                  </p>
                  <ul className="list-disc list-inside ml-5 text-gray-700 text-sm">
                    {appt.services.map((svc, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{svc.name}:</span> ₹{svc.price}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Booking Details */}
                <div className="text-gray-700 space-x-4">
                  <p className="text-black font-medium text-sm">
                    Booking Details:
                  </p>
                  <span className="text-sm">
                    Date:
                    {new Date(appt.bookingDetails.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm">
                    Time: {appt.bookingDetails.time}
                  </span>
                  <span className="text-sm">
                    Duration: {appt.bookingDetails.duration}
                  </span>
                </div>

                {/* Total Amount */}
                <p className=" text-sm mt-1 text-gray-900 flex justify-between ">
                  <span className="text-black tezt-sm font-medium">
                    Total Amount:
                  </span>{" "}
                  <span className="border bg-green-200 px-8 py-1 rounded-md">
                    ₹{appt.totalAmount}
                  </span>
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-2">
                  {activeTab === "upcoming" ? (
                    <>
                      <button
                        onClick={() => handleAccept(appt.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        aria-label="Accept appointment"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(appt.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        aria-label="Reject appointment"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleFeedback(appt.id)}
                      className="bg-[#6961AB] text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                      aria-label="Give feedback"
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </li>
            </>
          ))}
        </motion.ul>
      </div>
    );
  };

  const tabs = [
    { id: "upcoming", icon: <FaChartPie />, label: "Upcoming" },
    { id: "past", icon: <FaCheckCircle />, label: "Past" },
  ];

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <Breadcrumb propertyTitle={"My Appointment"} />

        {/* My Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Appointments</h3>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(({ id, icon, label }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-sm font-semibold select-none transition ${
                  activeTab === id
                    ? "bg-[#6961AB] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                }`}
                aria-current={activeTab === id ? "true" : undefined}
                aria-label={`Show ${label} appointments`}
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>

          {/* Animated content */}
          <div>{renderAppointments()}</div>
        </div>
      </div>
    </>
  );
}
