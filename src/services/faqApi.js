import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get faq (GET request)
    getfaq: builder.query({
      query: () => ({
        url: "faq-support",
        method: "GET",
      }),
      providesTags: ["faq"],
    }),
  }),
});

export const { useGetfaqQuery } = faqApi;
