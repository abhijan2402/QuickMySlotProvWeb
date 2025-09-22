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
  Select,
} from "antd";
import { ArrowUpOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardTabs from "./DashboardTabs";
import ShopDetails from "../components/ShopDetails";
import { initialShopData } from "../utils/shopdata";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../services/profileApi";
import { toast } from "react-toastify";
import { useGetsubscriptionQuery } from "../services/subscriptionApi";
import { logout, setUser } from "../slices/authSlice";
import { useGetcategoryQuery } from "../services/categoryApi";

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
  const user = useSelector((state) => state.auth.user);
  const { data: category } = useGetcategoryQuery();
  const { data: currentPlan } = useGetsubscriptionQuery();
  const { data: profile, error, isLoading } = useGetProfileQuery();
  const navigate = useNavigate();
  const [updateProfile, { isLoading: isUpdating, error: updateError }] =
    useUpdateProfileMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  console.log(category?.data);

  const dispatch = useDispatch();

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

  const onFinish = async (values) => {
    try {
      console.log("Form Values:", values);

      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "image" && Array.isArray(value)) {
          // AntD Upload file list
          if (value[0]?.originFileObj) {
            formData.append("profile_picture", value[0].originFileObj);
          }
        } else {
          formData.append(key, value);
        }
      });

      const res = await updateProfile(formData).unwrap();
      dispatch(setUser(res.data));
      setIsModalOpen(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      const errorMessage =
        error?.data?.message || error.message || "Failed to update profile";
      toast.error(errorMessage);
    }
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

    closeForgotModal();
  };

  const defaultFileList = user?.image
    ? [
        {
          uid: "-1", // unique id (must be string)
          name: "profile.jpg", // a filename
          status: "done", // marks file as uploaded
          url: user?.image, // image URL for preview
        },
      ]
    : [];

  const [fileList, setFileList] = React.useState(defaultFileList);
  React.useEffect(() => {
    if (user?.image) {
      setFileList([
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: profile.data.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  }, [user?.image]);

  return (
    <div className="max-w-full sm:max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:gap-4 max-w-7xl mx-auto py-6">
        {/* Left Section: Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6 flex-grow md:w-2/3 relative">
          {/* Forgot Password Button top right */}
          {/* <button
            onClick={showForgotModal}
            className="absolute top-4 right-4 text-sm underline text-[#EE4E34] hover:text-[#4e3b9e] transition whitespace-nowrap"
          >
            Forgot Password?
          </button> */}

          {/* Profile Info */}
          <div className="flex items-center gap-4 min-w-0">
            {user?.image ? (
              <img
                src={user?.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <FaUserCircle className="text-5xl text-gray-600 flex-shrink-0" />
            )}
            <div className="min-w-0 truncate">
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {user?.name || "NA"}
              </h2>
              <p className="text-gray-500 truncate">{user?.email || "NA"}</p>
              <p className="text-sm text-gray-400 truncate">
                {user?.phone_number || "NA"}
              </p>
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
              className="bg-[#EE4E34] text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition whitespace-nowrap"
            >
              Edit Profile
            </button>
            <button
              className="flex items-center text-sm gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition whitespace-nowrap"
              onClick={() => dispatch(logout())}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Right Section: Upgrade your Business Plan */}
        <div className="bg-purple-50 p-6 rounded-2xl shadow-md mt-8 md:mt-0 md:w-1/3 flex flex-col justify-center">
          <h3 className="text-black text-xl font-medium flex mb-2 justify-between">
            Current Plan:{" "}
            <span className="text-[#EE4E34]">
              ${currentPlan?.data?.[0]?.price}
            </span>
          </h3>
          <div className=" flex flex-col">
            <h2 className="text-black font-medium">
              {currentPlan?.data?.[0]?.subscription_name}
            </h2>
            <p className="text-gray-500 text-sm">
              {currentPlan?.data?.[0]?.description}
            </p>
          </div>
          <div className="flex  mt-4 ">
            <Button
              onClick={() => navigate("/pricing")}
              style={{ backgroundColor: "#EE4E34", color: "#fff" }}
            >
              Upgrade Plan
            </Button>
          </div>
        </div>
      </div>
      {/*  Boost your Business  */}
      <div className="bg-purple-50 p-6 rounded-2xl shadow-md mt-2  flex justify-between items-center md:flex-row md:gap-8 max-w-7xl mx-auto ">
        <div>
          <h3 className="text-black text-xl font-medium ">
            Promote Your Business
          </h3>
          <p className="text-black ">
            Increase Profile Visibility. Get noticed by more customers.
          </p>
        </div>
        <button
          className="flex items-center gap-2 border border-[#EE4E34] bg-purple-200 text-black px-4 py-2 rounded-lg shadow hover:bg-[#EE4E34] hover:text-white transition whitespace-nowrap justify-center"
          // onClick={showBoostModal}
          onClick={() => navigate("/pricing")}
        >
          Boost Profile
        </button>
      </div>
      <ShopDetails initialData={initialShopData} />;
      <DashboardTabs />
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
            className="w-full flex flex-col"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            style={{ width: "100%" }}
          >
            {promotionPlans.map((plan) => (
              <div
                key={plan.key}
                className={`flex items-center border rounded-xl px-4 py-3 mb-3 cursor-pointer ${
                  selectedPlan === plan.key
                    ? "border-[#EE4E34] bg-purple-100"
                    : "border-gray-200 bg-white"
                }`}
                style={{
                  transition: "background 0.2s, border 0.2s",
                }}
                onClick={() => setSelectedPlan(plan.key)}
              >
                <Radio checked={selectedPlan === plan.key} value={plan.key} />
                <div className="flex flex-col ml-2 flex-1 min-w-0">
                  <span className="font-medium text-black truncate">
                    {plan.name}
                  </span>
                  <span className="text-black text-sm truncate">
                    {plan.description}
                  </span>
                </div>
                <div className="text-xl font-semibold text-[#EE4E34] ml-4 min-w-[70px] text-right">
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
            background: "#EE4E34",
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
            image: fileList,
            name: user?.name,
            email: user?.email,
            phone: user?.phone_number,
            business_name: user?.business_name,
            service_category: user?.service_category,
            website: user?.business_website,
            location_area_served: user?.location_area_served,
            exact_location: user?.exact_location,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Profile Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              beforeUpload={() => false}
              listType="picture"
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="service_category"
            label="Services Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select category" size="medium">
              {category?.data?.map((cat) => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ min: 3, message: "Name must be at least 3 characters" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Please enter a valid email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ message: "Please input your phone number!" }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          {/* <Form.Item label="City" name="location_area_served">
            <Input placeholder="Enter your city" />
          </Form.Item> */}

          <Form.Item label="Address" name="exact_location">
            <Input placeholder="Enter your complete address" />
          </Form.Item>

          <Form.Item label="Services Location Area" name="location_area_served">
            <Input placeholder="Enter your service location area" />
          </Form.Item>

          <Form.Item label="Website" name="website">
            <Input placeholder="Enter your website" />
          </Form.Item>

          <Form.Item label="Business Name" name="business_name">
            <Input placeholder="Enter your Businees Name" />
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={handleCancel} className="mr-3">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-[#EE4E34]">
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
            <Button
              type="primary"
              htmlType="submit"
              disabled={isUpdating}
              className="bg-[#EE4E34]"
            >
              {isUpdating ? "Updating" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
