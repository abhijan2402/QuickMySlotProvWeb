import React, { useState } from "react";
import {
  useAddSubscriptionMutation,
  useGetsubscriptionQuery,
  useVerifySubscriptionMutation,
} from "../services/subscriptionApi";
import SpinnerLodar from "./SpinnerLodar";
import { useSelector } from "react-redux";
import { Form } from "antd";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../utils/utils";

export function PlanDescription({ description }) {
  return (
    <div className="text-gray-700 space-y-3">
      <div className="font-semibold text-lg mb-2">
        Subscription Plan Benefits:
      </div>
      {description.split("\r\n\r\n").map((item, index) => (
        <div key={index} className="flex items-start space-x-3 py-1">
          <span className="text-gray-500 font-bold text-lg mt-0.5 min-w-[20px]">
          </span>
          <span>{item.trim()}</span>
        </div>
      ))}
    </div>
  );
}

const tagColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-yellow-500",
];

const PricingModal = () => {
  const user = useSelector((state) => state.auth.user);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [form] = Form.useForm();
  // ✅ Fetch API
  const [addSubscription] = useAddSubscriptionMutation();
  const [verifySubscription] = useVerifySubscriptionMutation();
  const { data, isLoading } = useGetsubscriptionQuery();


  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handlePayment = async () => {
    const formData = new FormData();
    formData.append("subscription_id", selectedPlan.id);
    formData.append("role", "vendor");

    // ✅ Create booking/order
    const order = await addSubscription(formData).unwrap();

    // 🔹 Razorpay payment flow
    if (!order?.order_id) {
      toast.error("Failed to create Razorpay order");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: "INR",
      name: "QuickMySlot",
      description: "Add Subscription",
      image: "/logo1.png",
      order_id: order?.order_id,
      handler: async function (response) {
        const verifyData = new FormData();
        verifyData.append("subscription_user_id", order?.subscription_user_id);
        verifyData.append("razorpay_payment_id", response.razorpay_payment_id);
        verifyData.append("razorpay_order_id", response.razorpay_order_id);
        verifyData.append("razorpay_signature", response.razorpay_signature);

        try {
          const verifyRes = await verifySubscription(verifyData).unwrap();
          if (verifyRes.status) {
            toast.success("Payment verified & booking confirmed!");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (err) {
          toast.error("Error verifying payment");
          setModalVisible(false);
        }
      },
      prefill: {
        name: user?.name,
        contact: user?.phone_number,
        email: user?.email,
      },
      theme: { color: "#EE4E34" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setModalVisible(false);
    setSelectedPlan(null);
    form.resetFields();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 text-center">
      {/* Heading */}
      <div className="mt-4 mb-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl mb-2 font-bold text-orange-600">
          Boost Your Profile Visibility
        </h2>
        <h4 className="mb-2 text-xl text-gray-600 font-semibold">
          Choose the Right Plan for You
        </h4>
        <p className="text-gray-700">
          Increase your customer impressions, likes, and engagement by selecting
          a plan that fits your needs.
        </p>
      </div>

      {/* Billing Toggle */}
      {/* <div className="flex justify-center mb-8 mt-4 bg-gray-100 rounded-lg p-1 w-max mx-auto shadow-sm">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-6 py-2 rounded-sm transition-all font-medium ${
            billingCycle === "monthly"
              ? "bg-[#EE4E34] text-white shadow"
              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-8 py-2 rounded-sm transition-all font-medium ${
            billingCycle === "yearly"
              ? "bg-[#EE4E34] text-white shadow"
              : "bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-200"
          }`}
        >
          Yearly
        </button>
      </div> */}

      {/* Pricing Cards */}
      {isLoading ? (
        <div className="h-80vh">
          <SpinnerLodar ht="80vh" title="Subscription Plan" />
        </div>
      ) : data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.data?.map((plan, idx) => (
            <div
              key={plan.id}
              className="flex flex-col mb-8 justify-between h-full shadow-lg rounded-xl p-6 border hover:shadow-2xl transition-all"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg text-gray-700 font-semibold">
                    {plan.subscription_name}
                  </span>
                  <span
                    className={`text-xs text-white px-3 py-1 rounded-full ${
                      tagColors[idx % tagColors.length]
                    }`}
                  >
                    {capitalizeFirstLetter(plan.extra?.key_word) || "Plan"}
                  </span>
                </div>

                {/* Price */}
                <h3 className="text-2xl text-gray-700 font-bold mb-4">
                  ₹{plan.price}
                  <span className="text-base font-normal text-gray-500">
                    /{plan.validity === "monthly" ? "mo" : "yr"}
                  </span>
                </h3>

                {/* Features */}
                <ul className="list-disc ml-5 space-y-2 text-left mb-6 text-gray-700">
                  {Object.keys(plan.extra || {})
                    .filter((k) => k !== "key_word")
                    .map((key) => (
                      <li key={key}>{plan.extra[key]}</li>
                    ))}
                </ul>
                <div className="text-gray-700">
                  <PlanDescription description={plan.description} />
                </div>
              </div>

              {/* Button always bottom */}
              <button
                onClick={() => openModal(plan)}
                className="mt-auto bg-[#EE4E34] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#d63c25] transition"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center border justify-center mt-1 h-[48vh] animate-fadeIn">
          <div className="text-[#EE4E34] mb-4 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 14l6-6m0 0l-6-6m6 6H3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Plans Available
          </h3>
          <p className="text-gray-500 text-center max-w-sm">
            Sorry, we couldn't find any subscription plans at the moment. Please
            check back later or try changing your filters.
          </p>
        </div>
      )}

      {/* Custom Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <h2 className="text-xl font-bold mb-4 text-orange-600">
              Confirm Subscription
            </h2>
            <p className="text-gray-700">
              You have selected the{" "}
              <strong>{selectedPlan?.subscription_name}</strong> plan for{" "}
              <strong>₹{selectedPlan?.price}</strong> ({billingCycle} billing).
            </p>

            <div className="flex flex-col items-start">
              <p className="mt-3  font-semibold text-gray-900">
                Features included:
              </p>

              <ul className="list-disc text-left ml-4  mt-2 text-gray-700">
                {Object.keys(selectedPlan?.extra || {})
                  .filter((k) => k !== "key_word")
                  .map((key) => (
                    <li key={key}>{selectedPlan.extra[key]}</li>
                  ))}
              </ul>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#EE4E34] text-white hover:bg-[#d63c25]"
                onClick={handlePayment}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingModal;
