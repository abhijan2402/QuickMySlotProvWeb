import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const faqApi = createApi({
  reducerPath: "faqApi",
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
    // Get faq (GET request)
    getfaq: builder.query({
      query: () => ({
        url: "faq-support?role=vendor",
        method: "GET",
      }),
      providesTags: ["faq"],
    }),
  }),
});

export const { useGetfaqQuery } = faqApi;
