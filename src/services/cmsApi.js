import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
  }),
  endpoints: (builder) => ({
    // Get cms (GET request)
    // [{"key":"slug","value":"privacy-policy","equals":true,"description":"privacy-policy,about-us,terms-condition","enabled":true,"uuid":"600cafc6-a933-4dc6-87ab-de4fd5959681"}]
    getcms: builder.query({
      query: (slug) => ({
        url: `cms-page?type=vendor&slug=${slug}`,
        method: "GET",
      }),
      providesTags: ["cms"],
    }),
  }),
});

export const { useGetcmsQuery } = cmsApi;
