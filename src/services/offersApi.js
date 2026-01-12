import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const offerApi = createApi({
  reducerPath: "offerApi",
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
    // Get offer (GET request)
    getoffer: builder.query({
      query: () => ({
        url: `promo-codes`,
        method: "GET",
      }),
      providesTags: ["offer"],
    }),
    addoffer: builder.mutation({
      query: (formData) => ({
        url: `promo-codes`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["offer"],
    }),
    updateoffer: builder.mutation({
      query: ({ formData, id }) => ({
        url: `promo-codes/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["offer"],
    }),

    deleteoffer: builder.mutation({
      query: (id) => ({
        url: `promo-codes/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["offer"],
    }),
  }),
});

export const {
  useGetofferQuery,
  useAddofferMutation,
  useUpdateofferMutation,
  useDeleteofferMutation,
} = offerApi;
