// customer/home
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const bannerApi = createApi({
  reducerPath: "bannerApi",
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
    // Get banner (GET request)
    getbanner: builder.query({
      query: () => ({
        url: `customer/home`,
        method: "GET",
      }),
      providesTags: ["banner"],
    }),
    getCategory: builder.query({
      query: () => ({
        url: `category`,
        method: "GET",
      }),
      providesTags: ["banner"],
    }),
  }),
});

export const { useGetbannerQuery, useGetCategoryQuery } = bannerApi;
