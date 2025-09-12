import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
  }),
  endpoints: (builder) => ({
    // Get category (GET request)
    getcategory: builder.query({
      query: () => ({
        url: "category",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
  }),
});

export const { useGetcategoryQuery } = categoryApi;
