import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get subscription (GET request)
    getsubscription: builder.query({
      query: ({ validity, type }) => ({
        url: `subscriptions?validity=${validity}&type=${type}`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    // Get subscription current plan (GET request)
    getSubscriptionCurrent: builder.query({
      query: () => ({
        url: `subscription/current`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    addSubscription: builder.mutation({
      query: (formData) => ({
        url: `subscription/create-order`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["subscription"],
    }),
    verifySubscription: builder.mutation({
      query: (formData) => ({
        url: `subscription/verify-payment`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const { useGetsubscriptionQuery, useAddSubscriptionMutation, useVerifySubscriptionMutation, useGetSubscriptionCurrentQuery } = subscriptionApi;
