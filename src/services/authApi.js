// services/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { feDiffuseLighting } from "framer-motion/m";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://lemonchiffon-walrus-503913.hostingersite.com/public/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (body) => ({
        url: "/signup",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "verify-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation({
      query: (body) => ({
        url: "resend-otp",
        method: "POST",
        body,
      }),
    }),
    setProfile: builder.mutation({
      query: (fd) => {
        // ✅ Debug FormData content
        for (let pair of fd.entries()) {
          console.log(pair[0], pair[1]);
        }

        return {
          url: `update/business-profile/2`,
          method: "POST",
          body: fd,
        };
      },
    }),

    setAvailability: builder.mutation({
      query: (fd) => ({
        url: `update/business-availability/3`,
        method: "POST",
        body: fd,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useSetAvailabilityMutation,
  useSetProfileMutation,
} = authApi;
