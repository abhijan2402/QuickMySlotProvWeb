// customer/home
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const bannerApi = createApi({
  reducerPath: "bannerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
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
