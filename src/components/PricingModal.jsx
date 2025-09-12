import React, { useState } from "react";
import { Modal, Button, Card, Radio, Typography, Tag } from "antd";
import { useGetsubscriptionQuery } from "../services/subscriptionApi";

const { Title, Paragraph, Text } = Typography;

const plans = {
  monthly: [
    {
      id: "basic",
      name: "Basic",
      price: 10,
      tag: "Starter",
      features: [
        "2 Projects",
        "5 GB Storage",
        "Email Support",
        "Basic Analytics",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 20,
      tag: "Most Popular",
      features: [
        "10 Projects",
        "50 GB Storage",
        "Priority Email Support",
        "Advanced Analytics",
        "Custom Domain",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 50,
      tag: "Best Value",
      features: [
        "Unlimited Projects",
        "1 TB Storage",
        "24/7 Phone & Email Support",
        "Dedicated Account Manager",
        "Advanced Security",
        "Custom Integrations",
      ],
    },
  ],
  yearly: [
    {
      id: "basic",
      name: "Basic",
      price: 100,
      tag: "Starter",
      features: [
        "2 Projects",
        "5 GB Storage",
        "Email Support",
        "Basic Analytics",
      ],
    },
    {
      id: "pro",
      name: "Pro",
      price: 200,
      tag: "Most Popular",
      features: [
        "10 Projects",
        "50 GB Storage",
        "Priority Email Support",
        "Advanced Analytics",
        "Custom Domain",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 500,
      tag: "Best Value",
      features: [
        "Unlimited Projects",
        "1 TB Storage",
        "24/7 Phone & Email Support",
        "Dedicated Account Manager",
        "Advanced Security",
        "Custom Integrations",
      ],
    },
  ],
};

const PricingModal = () => {
  const { data } = useGetsubscriptionQuery();
  console.log(data)
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const handlePayment = () => {
    console.log("Payment started for plan:", selectedPlan);
    setTimeout(() => {
      console.log("Payment successful for plan:", selectedPlan);
      setModalVisible(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 text-center">
      <div className="mt-8 text-center max-w-lg mx-auto">
        <Title level={2} >
          Boost Your Profile Visibility
        </Title>
        <Title level={4} className="mb-2 text-gray-600 font-semibold">
          Choose the Right Plan for You
        </Title>
        <Paragraph type="secondary" className="text-gray-700">
          Increase your customer impressions, likes, and engagement by selecting
          a plan that fits your needs.
        </Paragraph>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <Radio.Group
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
        >
          <Radio.Button value="monthly">Monthly</Radio.Button>
          <Radio.Button value="yearly">Yearly (Save 20%)</Radio.Button>
        </Radio.Group>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans[billingCycle].map((plan) => (
          <Card
            key={plan.id}
            className="shadow-md rounded-xl hover:shadow-lg transition-all flex flex-col"
            title={
              <div className="flex items-center justify-between">
                <span>{plan.name}</span>
                <Tag color={plan.id === "pro" ? "green" : "blue"}>
                  {plan.tag}
                </Tag>
              </div>
            }
            bordered
            hoverable
          >
            <Title level={3} className="mb-4">
              ${plan.price}
              <span className="text-base font-normal">
                /{billingCycle === "monthly" ? "mo" : "yr"}
              </span>
            </Title>

            <ul className="list-disc ml-5 space-y-2 text-left mb-6">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            {/* Better styled button */}
            <Button
              type="primary"
              block
              shape="round"
              size="large"
              className="mt-auto"
              onClick={() => openModal(plan)}
            >
              Subscribe
            </Button>
          </Card>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Modal
        title="Confirm Subscription"
        open={modalVisible}
        onOk={handlePayment}
        onCancel={() => setModalVisible(false)}
        okText="Pay Now"
        cancelText="Cancel"
      >
        <p>
          You have selected the <strong>{selectedPlan?.name}</strong> plan for{" "}
          <strong>${selectedPlan?.price}</strong> ({billingCycle} billing).
        </p>
        <p>
          Features included:
          <ul className="list-disc ml-6 mt-2">
            {selectedPlan?.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </p>
        <p className="mt-4 text-gray-500">Simulating payment gateway flow...</p>
      </Modal>
    </div>
  );
};

export default PricingModal;
