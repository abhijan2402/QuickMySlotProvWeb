import {
  BellOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useGetnotificationQuery } from "../services/notificationApi";
import SpinnerLodar from "../components/SpinnerLodar";

export default function NotificationsPage() {
  const { data, isLoading } = useGetnotificationQuery();
  const notifications = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 mt-4">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        <nav className="flex items-center text-gray-500 text-sm mb-4">
          <HomeOutlined className="mr-1" />
          <span className="mr-1">/</span>
          <span className="font-medium text-gray-700">Notifications</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          Notifications
        </h1>

        {/* Notifications List */}
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <SpinnerLodar />
          </div>
        ) : !notifications.length ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-gray-500">
            <div className="text-6xl mb-4 text-gray-300 animate-pulse">
              <BellOutlined />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Notifications</h2>
            <p className="text-gray-400 text-center max-w-sm">
              You have no notifications at the moment. Check back later for
              updates and alerts.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {notifications.map((notif) => {
              const icon =
                notif.type === "booking" || notif.type === "pending" ? (
                  <ClockCircleOutlined className="text-purple-500 text-3xl" />
                ) : (
                  <BellOutlined className="text-purple-500 text-3xl" />
                );

              const statusColor =
                notif.status === "Read"
                  ? "text-green-600"
                  : notif.status === "Unread"
                  ? "text-gray-500"
                  : notif.status === "New"
                  ? "text-blue-600 font-bold"
                  : notif.status === "Pending"
                  ? "text-yellow-600 font-bold"
                  : "text-gray-500";

              const bgColor =
                notif.status === "Read"
                  ? "bg-green-50"
                  : notif.status === "Unread"
                  ? "bg-gray-100"
                  : notif.status === "New"
                  ? "bg-blue-50"
                  : notif.status === "Pending"
                  ? "bg-yellow-50"
                  : "bg-gray-100";

              return (
                <div
                  key={notif.id}
                  className="flex gap-4 items-start p-5 rounded-xl shadow hover:shadow-lg transition bg-white border border-gray-200"
                >
                  <div className="flex-shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-lg text-gray-800">
                        {notif.title}
                      </h2>
                      <span
                        className={`text-xs px-2 py-1 rounded ${bgColor} ${statusColor}`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base mb-2">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
