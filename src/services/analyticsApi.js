import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get faq (GET request)
    getanalytics: builder.query({
      query: () => ({
        url: "random-analytics/overview",
        method: "GET",
      }),
      providesTags: ["faq"],
    }),
  }),
});

export const { useGetanalyticsQuery } = analyticsApi;
