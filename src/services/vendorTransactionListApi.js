import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const vendorTransactionApi = createApi({
  reducerPath: "vendorTransactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get vendorTransaction (GET request)
    getvendorTransaction: builder.query({
      query: () => ({
        url: `vendor-transactions/list`,
        method: "GET",
      }),
      providesTags: ["vendorTransaction"],
    }),
    getvendorBooking: builder.query({
      query: ({ status } = {}) => {
        const url = status ? `bookings/list?status=${status}` : `bookings/list`;
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["vendorBooking"],
    }),

    // Accept Booking
    acceptBooking: builder.mutation({
      query: (id) => ({
        url: `booking/accepted/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),

    // Reject Booking
    rejectBooking: builder.mutation({
      query: (id) => ({
        url: `booking/reject/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),
    // Completed Booking
    completedBooking: builder.mutation({
      query: (id) => ({
        url: `booking/completed/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["vendorBooking"],
    }),
  }),
});

export const {
  useGetvendorTransactionQuery,
  useGetvendorBookingQuery,
  useAcceptBookingMutation,
  useRejectBookingMutation,
  useCompletedBookingMutation,
} = vendorTransactionApi;
