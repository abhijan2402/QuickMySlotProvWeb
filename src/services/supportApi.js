import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const supportApi = createApi({
  reducerPath: "supportApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Get support (GET request)
    getsupport: builder.query({
      query: () => ({
        url: `supports`,
        method: "GET",
      }),
      providesTags: ["support"],
    }),
    addsupport: builder.mutation({
      query: (formData) => ({
        url: `supports`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["support"],
    }),
  }),
});

export const { useGetsupportQuery, useAddsupportMutation } = supportApi;
