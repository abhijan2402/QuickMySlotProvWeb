import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
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
  }),
});

export const { useGetnotificationQuery } = notificationApi;
