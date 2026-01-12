import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const walletApi = createApi({
  reducerPath: "walletApi",
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
    // Get wallet (GET request)
    getwallet: builder.query({
      query: (id) => ({
        url: `wallet`,
        method: "GET",
      }),
      providesTags: ["wallet"],
    }),
    addwallet: builder.mutation({
      query: (formData) => ({
        url: `wallet`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["wallet"],
    }),
    verifyPayment: builder.mutation({
      query: (formData) => ({
        url: `wallet/verify`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["wallet"],
    }),
  }),
});

export const {
  useGetwalletQuery,
  useAddwalletMutation,
  useVerifyPaymentMutation,
} = walletApi;
