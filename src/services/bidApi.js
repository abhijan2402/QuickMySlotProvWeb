import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const bidApi = createApi({
  reducerPath: "bidApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get bid (GET request)
    getbid: builder.query({
      query: (id) => ({
        url: `bids-list`,
        method: "GET",
      }),
      providesTags: ["bid"],
    }),
    addbid: builder.mutation({
      query: (formData) => ({
        url: `bid-entries`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["bid"],
    }),
  }),
});

export const { useGetbidQuery, useAddbidMutation } = bidApi;
