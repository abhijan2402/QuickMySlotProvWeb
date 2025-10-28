import {
  BellOutlined,
  ClockCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  useGetnotificationQuery,
  useReadNotificationMutation,
} from "../services/notificationApi";
import SpinnerLodar from "../components/SpinnerLodar";
import { message } from "antd";
import { toast } from "react-toastify";

export default function NotificationsPage() {
  const { data, isLoading, refetch } = useGetnotificationQuery();
  const [readNotification, { isLoading: readLoading }] =
    useReadNotificationMutation();
  const notifications = data?.data || [];

  const handleRead = async (id) => {
    const res = await readNotification({ id, type: "is_single_read" });
    if (res?.data?.success) {
      toast.success("Marked as read");
      refetch();
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleAllRead = async () => {
    const res = await readNotification({ id: "", type: "is_all_read" });
    if (res?.data?.success) {
      toast.success("All notifications marked as read");
      refetch();
    } else {
      toast.error("Failed to update all");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-6 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24">
      <div className="max-w-6xl mx-auto py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center text-gray-500 text-sm mb-6 font-medium select-none">
          <HomeOutlined className="mr-2 text-lg" />
          <span className="mr-2">/</span>
          <span className="text-gray-800">Notifications</span>
        </nav>

        {/* Title and All Read Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Notifications
          </h1>
          {notifications.length > 0 && (
            <button
              onClick={handleAllRead}
              className="bg-[#EE4E34] hover:bg-[#EE4E34] text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 w-full sm:w-auto"
            >
              Mark All as Read
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="h-[350px] flex items-center justify-center">
            <SpinnerLodar />
          </div>
        ) : !notifications.length ? (
          <div className="h-[350px] flex flex-col items-center justify-center text-gray-400 text-center px-4">
            <BellOutlined className="text-6xl sm:text-7xl mb-4 animate-pulse text-gray-300" />
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              No Notifications
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-sm">
              You don’t have any notifications right now. We’ll let you know
              when something comes up.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
            {notifications.map((notif) => {
              const icon =
                notif.type === "booking" || notif.type === "pending" ? (
                  <ClockCircleOutlined className="text-[#EE4E34] text-2xl" />
                ) : (
                  <BellOutlined className="text-[#EE4E34] text-2xl" />
                );

              const statusStyles = {
                read: {
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
                  className={`flex flex-col sm:flex-row sm:items-start gap-4 p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200 bg-white hover:shadow-md transition-all duration-300 border-l-4 ${styles.border}`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gray-50  sm:self-start">
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
                      <h2 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                        {notif.title}
                      </h2>
                      <span
                        className={`text-xs sm:text-sm px-3 py-1 rounded-full ${styles.bg} ${styles.text}`}
                      >
                        {notif.status}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-2 break-words">
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400">{notif.time}</span>
                  </div>

                  {/* Button */}
                  {notif.status !== "read" && (
                    <div className="mt-2 sm:mt-0 sm:self-center">
                      <button
                        onClick={() => handleRead(notif.id)}
                        disabled={readLoading}
                        className="w-full sm:w-auto text-sm font-semibold text-[#EE4E34] hover:text-purple-700 px-4 py-2 border border-purple-200 hover:border-purple-400 rounded-md transition-all duration-200"
                      >
                        {readLoading ? "Marking..." : "Mark as Read"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
