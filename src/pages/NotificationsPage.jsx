import { BellOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useGetnotificationQuery } from "../services/notification.Api";

// Dummy notifications data
const notifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    status: "Read",
    message:
      "Your appointment with Dr. Emily Davis on Oct 26th at 2:00 PM is confirmed.",
    time: "2 hours ago",
    icon: <ClockCircleOutlined className="text-purple-500 text-2xl" />,
    statusColor: "text-green-600",
  },
  {
    id: 2,
    type: "upcoming",
    title: "Upcoming Appointment",
    status: "Unread",
    message:
      "Reminder: Your appointment with John Doe is tomorrow at 10:00 AM.",
    time: "Yesterday",
    icon: <BellOutlined className="text-purple-500 text-2xl" />,
    statusColor: "text-gray-500",
  },
  {
    id: 3,
    type: "message",
    title: "New Message Received",
    status: "New",
    message: "You have a new message from Provider Jane Smith.",
    time: "1 day ago",
    icon: <BellOutlined className="text-purple-500 text-2xl" />,
    statusColor: "text-blue-600 font-bold",
  },
  {
    id: 4,
    type: "pending",
    title: "Booking Pending",
    status: "Pending",
    message:
      'Your booking request for service "Haircut" with Stylist Mark is pending confirmation.',
    time: "2 days ago",
    icon: <ClockCircleOutlined className="text-purple-500 text-2xl" />,
    statusColor: "text-yellow-600 font-bold",
  },
];

export default function NotificationsPage() {
  const { data } = useGetnotificationQuery();
  console.log(data)
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex items-center gap-2">
          <button
            aria-label="Go Back"
            className="mr-2 text-xl text-black/60"
            onClick={() => window.history.back()}
          >
            &#8592;
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Notifications
          </h1>
        </div>

        {/* Notifications List */}
        <div className="mt-6 flex flex-col gap-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="rounded-xl border border-gray-200 bg-white px-5 py-4 flex gap-4 items-start shadow-sm hover:shadow transition
              flex-col sm:flex-row sm:items-center"
            >
              {/* Icon */}
              <div className="flex-shrink-0">{notif.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold xl:text:md sm:text-sm md:text-lg text-black ">
                    {notif.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      notif.status === "Read"
                        ? "bg-green-50 " + notif.statusColor
                        : notif.status === "Unread"
                        ? "bg-gray-100 " + notif.statusColor
                        : notif.status === "New"
                        ? "bg-blue-50 " + notif.statusColor
                        : notif.status === "Pending"
                        ? "bg-yellow-50 " + notif.statusColor
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {notif.status}
                  </span>
                </div>
                <div className="text-gray-700 mt-1 sm:text-[14px] md:text-[16px] xl:text:md">
                  {notif.message}
                </div>
                <div className="text-xs text-gray-400 mt-2">{notif.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
