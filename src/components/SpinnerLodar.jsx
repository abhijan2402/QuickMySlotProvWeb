import React from "react";

const SpinnerLodar = ({ title, ht }) => {
  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6`}
      >
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-[#EE4E34] border-t-transparent border-b-transparent rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-gray-700 font-semibold text-lg">
          {`${
            title ? title : "Shop details"
          }  are being loaded, please wait...`}
        </p>

        <style>
          {`
                @keyframes shimmer {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(100%); }
                }
                .animate-[shimmer_1.5s_infinite] {
                  animation: shimmer 1.5s infinite;
                }
              `}
        </style>
      </div>
    </div>
  );
};

export default SpinnerLodar;
