import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
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
  }),
});

export const { useGetsubscriptionQuery } = subscriptionApi;
