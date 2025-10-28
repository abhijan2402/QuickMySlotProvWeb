import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const bankApi = createApi({
  reducerPath: "bankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get bank (GET request)
    getbank: builder.query({
      query: (id) => ({
        url: `bank-accounts`,
        method: "GET",
      }),
      providesTags: ["bank"],
    }),
    addbank: builder.mutation({
      query: (formData) => ({
        url: `bank-accounts`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["bank"],
    }),
    updatebank: builder.mutation({
      query: ({ formData, id }) => ({
        url: `bank-accounts/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["bank"],
    }),

    defalutbank: builder.mutation({
      query: (id) => ({
        url: `bank-accounts/set/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["bank"],
    }),

    deletebank: builder.mutation({
      query: (id) => ({
        url: `bank-accounts/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["bank"],
    }),
  }),
});

export const {
  useGetbankQuery,
  useAddbankMutation,
  useUpdatebankMutation,
  useDeletebankMutation,
  useDefalutbankMutation,
} = bankApi;
