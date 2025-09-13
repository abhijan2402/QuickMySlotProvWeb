import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const faqApi = createApi({
  reducerPath: "faqApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
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
