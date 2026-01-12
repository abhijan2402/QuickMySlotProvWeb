import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const profileApi = createApi({
  reducerPath: "profileApi",
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
    // Get profile (GET request)
    getProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["profile"],
    }),
    // Update profile (POST request)
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "profile/update",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["profile"],
    }),
    // Add profile (POST request)
    addGST: builder.mutation({
      query: (formData) => ({
        url: "profile/gst",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddGSTMutation,
} = profileApi;
