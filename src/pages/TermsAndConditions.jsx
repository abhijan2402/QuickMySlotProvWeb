import React from "react";
import { useGetcmsQuery } from "../services/cmsApi";

export default function TermsAndConditions() {
  const { data, isLoading } = useGetcmsQuery({
    slug: "terms-condition",
    type: "provider",
  });

if (isLoading) {
  return (
    <section className="py-28 flex flex-col items-center justify-center h-[600px] text-gray-600">
      <div className="relative">
        {/* Rotating Circle */}
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        {/* Pulse Background */}
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full animate-pulse opacity-75"></div>
      </div>

      <p className="mt-4 text-lg font-medium text-gray-500">
        Loading Terms & Conditions...
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Please wait while we fetch the latest content
      </p>
    </section>
  );
}


  const cmsData = data?.data;

  return (
    <section className="py-28 px-4 bg-gradient-to-br from-[#f5f9ff] to-[#e6f0ff] text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Dynamic Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 text-[#012A56]">
          {cmsData?.title || "Terms & Conditions"}
        </h1>

        {/* CMS HTML Content */}
        <div
          className="space-y-6 text-base sm:text-lg leading-relaxed text-gray-700 cms-content"
          dangerouslySetInnerHTML={{ __html: cmsData?.body || "" }}
        />
      </div>
    </section>
  );
}
