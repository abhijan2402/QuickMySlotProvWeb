import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const qptoken = getState().auth.qptoken;
      if (qptoken) {
        headers.set("Authorization", `Bearer ${qptoken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get notification (GET request)
    getnotification: builder.query({
      query: () => ({
        url: "notifications/list",
        method: "GET",
      }),
      providesTags: ["notification"],
    }),

    readNotification: builder.mutation({
      query: ({ id, type }) => {
        const baseUrl = `read-all?type=${type}`;
        const url = id ? `${baseUrl}&id=${id}` : baseUrl;
        return {
          url,
          method: "GET",
        };
      },
      invalidatesTags: ["notification"],
    }),

    // read-all?type=is_single_read&id=2
  }),
});

export const { useGetnotificationQuery, useReadNotificationMutation } =
  notificationApi;
