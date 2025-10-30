import {
  BellOutlined,
  CheckOutlined,
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
import { convertToIST } from "../utils/utils";
import { useState } from "react";

export default function NotificationsPage() {
  const { data, isLoading, refetch } = useGetnotificationQuery();
  const [loadingId, setLoadingId] = useState(null);

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
    <div className="min-h-screen bg-gray-50 mt-6 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 pb-8">
      <div className="max-w-5xl mx-auto py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6 text-gray-500">
          <HomeOutlined className="mr-2" />
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">Notifications</span>
        </nav>

        {/* Title + Mark All Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Notifications
            </h1>
            <p className="text-sm text-gray-500">
              Stay updated with your latest activities
            </p>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={handleAllRead}
              className="flex items-center justify-center gap-2 bg-[#EE4E34] hover:bg-[#d4452e] text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto cursor-pointer"
            >
              <CheckOutlined />
              Mark All as Read
            </button>
          )}
        </div>

        {/* States */}
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <SpinnerLodar />
          </div>
        ) : !notifications.length ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center px-4">
            <div className="bg-gray-100 rounded-full p-8 mb-6">
              <BellOutlined className="text-5xl text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Notifications Yet
            </h2>
            <p className="text-gray-500 text-sm max-w-md">
              You're all caught up! We'll notify you when there's something new.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const icon =
                notif.type === "booking" || notif.type === "pending" ? (
                  <ClockCircleOutlined className="text-[#EE4E34] text-xl" />
                ) : (
                  <BellOutlined className="text-[#EE4E34] text-xl" />
                );

              const isUnread = notif.status !== "read";

              return (
                <div
                  key={notif.id}
                  className={`relative group flex gap-4 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isUnread
                      ? "bg-orange-50/50 border-orange-200 hover:border-orange-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {isUnread && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#EE4E34] rounded-r" />
                  )}

                  <div className="flex-shrink-0">
                    <div
                      className={`p-3 rounded-lg ${
                        isUnread ? "bg-orange-100" : "bg-gray-100"
                      }`}
                    >
                      {icon}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-20">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`font-semibold text-base leading-tight ${
                          isUnread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notif.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {convertToIST(notif.created_at)}
                      </span>
                      {isUnread && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={() => handleRead(notif.id)}
                      disabled={loadingId === notif.id}
                      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#EE4E34] hover:text-white bg-white hover:bg-[#EE4E34] px-3 py-1.5 border border-[#EE4E34] rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      {loadingId === notif.id ? (
                        <>
                          <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Marking...</span>
                        </>
                      ) : (
                        <>
                          <CheckOutlined className="text-xs cursor-pointer" />
                          <span>Mark Read</span>
                        </>
                      )}
                    </button>
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
