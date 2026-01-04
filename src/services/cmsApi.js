import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
  }),
  endpoints: (builder) => ({
    // Get cms (GET request)
    // [{"key":"slug","value":"privacy-policy","equals":true,"description":"privacy-policy,about-us,terms-condition","enabled":true,"uuid":"600cafc6-a933-4dc6-87ab-de4fd5959681"}]
    getcms: builder.query({
      query: ({ slug, type }) => ({
        url: `cms-page?type=${type}&slug=${slug}`,
        method: "GET",
      }),
      providesTags: ["cms"],
    }),
  }),
});

export const { useGetcmsQuery } = cmsApi;
