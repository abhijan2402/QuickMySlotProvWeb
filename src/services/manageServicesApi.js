import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const manageServicesApi = createApi({
  reducerPath: "manageServicesApi",
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
    // Get manageServices (GET request)
    getmanageServices: builder.query({
      query: () => ({
        url: "sub-services",
        method: "GET",
      }),
      providesTags: ["manageServices"],
    }),

    addMyServices: builder.mutation({
      query: (formData) => ({
        url: "sub-services",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["manageServices"],
    }),

    updateMyServices: builder.mutation({
      query: ({ formData, id }) => ({
        url: `sub-services/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["manageServices"],
    }),
    deleteMyServices: builder.mutation({
      query: ({ formData, id }) => ({
        url: `sub-services/delete/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["manageServices"],
    }),

    // Manage Services Under Sub Services
    getServices: builder.query({
      query: () => ({
        url: "services",
        method: "GET",
      }),
      providesTags: ["Services"],
    }),
    addServices: builder.mutation({
      query: (formData) => ({
        url: "services",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Services"],
    }),
    updateServices: builder.mutation({
      query: ({ formData, id }) => {
        // ✅ Guard against undefined
        if (formData instanceof FormData) {
          console.log("---- FormData Preview ----");
          for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }
          console.log("--------------------------");
        } else {
          console.warn("⚠️ No FormData provided or invalid type:", formData);
        }

        return {
          url: `services/${id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Services"],
    }),

    deleteServices: builder.mutation({
      query: (id) => ({
        url: `services/delete/${id}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetmanageServicesQuery,
  useAddMyServicesMutation,
  useUpdateMyServicesMutation,
  useDeleteMyServicesMutation,

  //   Services
  useGetServicesQuery,
  useAddServicesMutation,
  useDeleteServicesMutation,
  useUpdateServicesMutation,
} = manageServicesApi;
