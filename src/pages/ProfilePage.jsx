import React, { useState } from "react";
import {
  FaWallet,
  FaSignOutAlt,
  FaChartPie,
  FaUserCircle,
  FaHeart,
  FaGift,
} from "react-icons/fa";
import {
  Modal,
  Input,
  Button,
  Upload,
  Form,
  Tabs,
  List,
  Radio,
  Typography,
  Divider,
} from "antd";
import { ArrowUpOutlined, UploadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Promotion Plans (editable)
const promotionPlans = [
  {
    key: "basic",
    name: "Basic Visibility Boost",
    description: "Appear higher in search results for 7 days.",
    price: 25,
  },
  {
    key: "featured",
    name: "Featured Listing (Weekly)",
    description: "Highlighted spot on category pages for 7 days.",
    price: 75,
  },
  {
    key: "banner",
    name: "Homepage Banner Ad (Weekly)",
    description: "Prominent banner on app homepage for 7 days.",
    price: 120,
  },
  {
    key: "none",
    name: "No Promotion",
    description: "Continue with standard visibility.",
    price: 0,
  },
];

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+91 9876543210",
    wallet: 1200,
    image: null,
  });

  // Wallet History
  const walletHistory = [
    {
      id: 1,
      type: "Credit",
      amount: 500,
      date: "2025-08-10",
      desc: "Monthly cashback",
    },
    {
      id: 2,
      type: "Debit",
      amount: 300,
      date: "2025-08-15",
      desc: "Payment for appointment",
    },
    {
      id: 3,
      type: "Credit",
      amount: 200,
      date: "2025-08-18",
      desc: "Referral bonus",
    },
  ];

  // For image preview
  const [previewImage, setPreviewImage] = useState(null);

  // Boost Modal state
  const [selectedPlan, setSelectedPlan] = useState("basic");

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const showBoostModal = () => setBoostModalOpen(true);
  const closeBoostModal = () => setBoostModalOpen(false);
  const showForgotModal = () => setForgotModalOpen(true);
  const closeForgotModal = () => setForgotModalOpen(false);

  const onFinish = (values) => {
    setProfile((prev) => ({
      ...prev,
      name: values.name,
      email: values.email,
      phone: values.phone,
      image: previewImage || prev.image,
    }));
    setIsModalOpen(false);
  };

  const handleUploadChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  // Find the selected plan object
  const planObj = promotionPlans.find((p) => p.key === selectedPlan);

  // Forgot Password form submit
  const onForgotFinish = (values) => {
    console.log("Forgot Password Data Submitted:", values);
    // Here you would normally call API to trigger password reset
    closeForgotModal();
  };

  return (
    <div className="max-w-full sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:gap-8 max-w-7xl mx-auto p-6">
        {/* Left Section: Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6 flex-grow md:w-2/3 relative">
          {/* Forgot Password Button top right */}
          <button
            onClick={showForgotModal}
            className="absolute top-4 right-4 text-sm underline text-[#6961AB] hover:text-[#4e3b9e] transition whitespace-nowrap"
          >
            Forgot Password?
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-4 min-w-0">
            {profile.image ? (
              <img
                src={profile.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <FaUserCircle className="text-5xl text-gray-600 flex-shrink-0" />
            )}
            <div className="min-w-0 truncate">
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {profile.name}
              </h2>
              <p className="text-gray-500 truncate">{profile.email}</p>
              <p className="text-sm text-gray-400 truncate">{profile.phone}</p>
            </div>
          </div>

          {/* Wallet and Buttons */}
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
            {/* <div className="flex items-center gap-2 whitespace-nowrap">
              <FaWallet className="text-green-500 text-xl" />
              <span className="font-semibold text-gray-800">
                ₹{profile.wallet}
              </span>
            </div> */}
            <button
              onClick={showModal}
              className="bg-[#6961AB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition whitespace-nowrap"
            >
              Edit Profile
            </button>
            <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition whitespace-nowrap">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Right Section: Boost your Business */}
        <div className="bg-purple-50 p-6 rounded-2xl shadow-md mt-8 md:mt-0 md:w-1/3 flex flex-col justify-center">
          <h3 className="text-black text-xl font-medium mb-2">
            Promote Your Business
          </h3>
          <p className="text-black mb-6">
            Increase Profile Visibility. Get noticed by more customers.
          </p>
          <button
            className="flex items-center gap-2 border border-[#6961AB] bg-purple-200 text-black px-4 py-2 rounded-lg shadow hover:bg-[#6961AB] hover:text-white transition whitespace-nowrap justify-center"
            onClick={showBoostModal}
          >
            Boost Profile
          </button>
        </div>
      </div>

      {/* Boost Modal */}
      <Modal
        open={boostModalOpen}
        onCancel={closeBoostModal}
        footer={null}
        title={<div className=" font-semibold text-lg">Boost Your Profile</div>}
        centered
        width={500}
        bodyStyle={{ paddingBottom: 0, paddingTop: 16 }}
        destroyOnClose
      >
        {/* Choose Plan */}
        <div className="mb-6">
          <p className="font-semibold mb-3">Choose Plan</p>
          <Radio.Group
            className="w-full space-y-2 flex flex-col"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            style={{ width: "100%" }}
          >
            {promotionPlans.map((plan) => (
              <div
                key={plan.key}
                className={`flex justify-between items-center border rounded-xl px-4 py-3 mb-3 cursor-pointer ${
                  selectedPlan === plan.key
                    ? "border-[#6961AB] bg-purple-100"
                    : "border-gray-200 bg-white"
                }`}
                style={{
                  transition: "background 0.2s, border 0.2s",
                }}
                onClick={() => setSelectedPlan(plan.key)}
              >
                <div>
                  <Radio checked={selectedPlan === plan.key} value={plan.key} />
                  <span className="ml-2 font-medium block text-black">
                    {plan.name}
                  </span>
                  <span className="ml-8 text-black text-sm block">
                    {plan.description}
                  </span>
                </div>
                <div className="text-xl font-semibold text-[#6961AB] ml-4 min-w-[85px] text-right">
                  ${plan.price.toFixed(2)}
                </div>
              </div>
            ))}
          </Radio.Group>
        </div>
        {/* Order Summary */}
        <div className="rounded-xl border px-4 py-3 mb-6 bg-gray-50">
          <div className="font-semibold mb-2">Order Summary</div>
          <div className="flex justify-between">
            <div>{planObj.name}</div>
            <div>${planObj.price.toFixed(2)}</div>
          </div>
          <Divider className="my-2" />
          <div className="flex justify-between font-bold">
            <div>Total:</div>
            <div>${planObj.price.toFixed(2)}</div>
          </div>
        </div>
        {/* Checkout Button */}
        <Button
          type="primary"
          block
          style={{
            background: "#6961AB",
            color: "#fff",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 8,
            height: 40,
            border: "none",
            marginBottom: 8,
          }}
        >
          Checkout
        </Button>
      </Modal>

      {/* Tabs for Analytics and Wallet History */}
      <Tabs
        defaultActiveKey="analytics"
        type="line"
        className="bg-white rounded-2xl p-6 shadow-md"
      >
        <TabPane tab="My Analytics" key="analytics">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl shadow bg-gradient-to-r from-blue-50 to-blue-100">
                <h4 className="text-gray-700 font-semibold flex items-center gap-2">
                  <FaWallet className="text-blue-500" /> Revenue This Month
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">₹2,300</p>
              </div>
              <div className="p-4 rounded-xl shadow bg-gradient-to-r from-green-50 to-green-100">
                <h4 className="text-gray-700 font-semibold flex items-center gap-2">
                  <FaGift className="text-green-500" /> Total Customers
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">450</p>
              </div>
              <div className="p-4 rounded-xl shadow bg-gradient-to-r from-purple-50 to-purple-100">
                <h4 className="text-gray-700 font-semibold flex items-center gap-2">
                  <FaChartPie className="text-purple-500" /> Reach (vs Last
                  Month)
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  18% <ArrowUpOutlined />{" "}
                </p>
              </div>
              <div className="p-4 rounded-xl shadow bg-gradient-to-r from-pink-50 to-pink-100">
                <h4 className="text-gray-700 font-semibold flex items-center gap-2">
                  <FaHeart className="text-pink-500" /> Estimated Footfall
                </h4>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  40 / Day
                </p>
              </div>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Wallet History" key="wallet">
          <List
            itemLayout="horizontal"
            dataSource={walletHistory}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={`${item.type} - ₹${item.amount}`}
                  description={`${item.desc} on ${new Date(
                    item.date
                  ).toLocaleDateString()}`}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          initialValues={{
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
          }}
          onFinish={onFinish}
        >
          <Form.Item label="Profile Image">
            <Upload
              beforeUpload={() => false}
              onChange={handleUploadChange}
              showUploadList={false}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-3 rounded-full w-24 h-24 object-cover"
              />
            )}
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 3, message: "Name must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={handleCancel} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-[#6961AB]">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        open={forgotModalOpen}
        onCancel={closeForgotModal}
        footer={null}
        destroyOnClose
        centered
        width={400}
      >
        <Form layout="vertical" onFinish={onForgotFinish}>
          <Form.Item
            name="email"
            label="Enter your registered email"
            rules={[
              { required: true, message: "Please enter your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input placeholder="example@domain.com" />
          </Form.Item>
          <Form.Item className="text-right">
            <Button onClick={closeForgotModal} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-[#6961AB]">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
