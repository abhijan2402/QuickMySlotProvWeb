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
  }),
});

export const { useGetvendorTransactionQuery } = vendorTransactionApi;
