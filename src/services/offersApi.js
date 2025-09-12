import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const offerApi = createApi({
  reducerPath: "offerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
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
