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
    <div className="min-h-screen bg-gray-50 mt-6 px-4 sm:px-8 md:px-14 lg:px-20 xl:px-32">
      <div className="max-w-5xl mx-auto py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center text-gray-500 text-sm mb-6 font-medium select-none">
          <HomeOutlined className="mr-2 text-lg" />
          <span className="mr-2">/</span>
          <span className="text-gray-800">Notifications</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Notifications
        </h1>

        {/* Loading */}
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <SpinnerLodar />
          </div>
        ) : !notifications.length ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-gray-400">
            <BellOutlined className="text-7xl mb-4 animate-pulse text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2">No Notifications</h2>
            <p className="text-center max-w-md text-base leading-relaxed text-gray-500">
              You don’t have any notifications right now. We’ll let you know
              when something comes up.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {notifications.map((notif) => {
              const icon =
                notif.type === "booking" || notif.type === "pending" ? (
                  <ClockCircleOutlined className="text-purple-600 text-2xl" />
                ) : (
                  <BellOutlined className="text-purple-600 text-2xl" />
                );

              const statusStyles = {
                Read: {
                  text: "text-green-700",
                  bg: "bg-green-100",
                  border: "border-l-green-600",
                },
                unread: {
                  text: "text-orange-600",
                  bg: "bg-orange-100",
                  border: "border-l-orange-600",
                },
                New: {
                  text: "text-blue-700",
                  bg: "bg-blue-100",
                  border: "border-l-blue-600",
                },
                Pending: {
                  text: "text-yellow-700",
                  bg: "bg-yellow-100",
                  border: "border-l-yellow-600",
                },
                default: {
                  text: "text-gray-600",
                  bg: "bg-gray-100",
                  border: "border-l-gray-400",
                },
              };

              const styles = statusStyles[notif.status] || statusStyles.default;

              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-6 rounded-xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-300 border-l-4 ${styles.border}`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gray-50">
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-semibold text-lg text-gray-900 truncate">
                        {notif.title}
                      </h2>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${styles.bg} ${styles.text}`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">
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
