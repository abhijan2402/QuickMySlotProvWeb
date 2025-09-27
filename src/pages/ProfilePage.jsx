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
import { useGetSubscriptionCurrentQuery } from "../services/subscriptionApi";
import { logout, setUser } from "../slices/authSlice";
import { useGetcategoryQuery } from "../services/categoryApi";
import EditProfileModal from "../components/Modals/EditProfileModal";
import ShopDetailCards from "../components/ShopDetailCards";

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
  const { data: currentPlan } = useGetSubscriptionCurrentQuery();
  const navigate = useNavigate();
  useUpdateProfileMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log(category?.data);

  const dispatch = useDispatch();

  // For image preview

  // Boost Modal state

  const showModal = () => setIsModalOpen(true);

  return (
    <div className="max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:gap-4 max-w-7xl mx-auto py-6">
        {/* Left Section: Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6 flex-grow md:w-2/3 relative">
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
              <p className="text-gray-600 truncate">
                <span>Email : </span>
                <span>{user?.email || "NA"}</span>
              </p>
              <p className="text-sm text-gray-600 truncate">
                <span>Ph. No. : </span>
                <span>+91 {user?.phone_number || "NA"}</span>
              </p>
            </div>
          </div>

          {/* Wallet and Buttons */}
          <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
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
        {/* Right Section: Upgrade your Business Plan */}
        <div className="bg-purple-50 p-6 rounded-2xl shadow-md mt-8 md:mt-0 md:w-1/3 flex flex-col justify-center">
          {currentPlan?.subscription ? (
            <>
              <h3 className="text-black text-xl font-medium flex mb-2 justify-between">
                Current Plan:{" "}
                <span className="text-[#EE4E34]">
                  {currentPlan?.subscription?.subscription?.subscription_name}
                </span>
              </h3>

              <div className="flex flex-col">
                <h2 className="text-black flex justify-between items-center font-medium">
                  ₹{currentPlan?.subscription?.subscription?.price}{" "}
                  <span>
                    {currentPlan?.subscription?.subscription?.validity}
                  </span>
                </h2>
                <p className="text-gray-500 text-sm">
                  {currentPlan?.subscription?.subscription?.description}
                </p>
              </div>

              <div className="flex mt-4">
                <Button
                  onClick={() => navigate("/pricing")}
                  style={{ backgroundColor: "#EE4E34", color: "#fff" }}
                >
                  Upgrade Plan
                </Button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-black text-xl font-medium mb-2 text-center">
                No Plan Activated Yet 🚀
              </h3>
              <p className="text-gray-500 text-sm text-center">
                Purchase a plan to unlock premium features and grow your
                business.
              </p>
              <div className="flex mt-4 justify-center">
                <Button
                  onClick={() => navigate("/pricing")}
                  style={{ backgroundColor: "#EE4E34", color: "#fff" }}
                >
                  Purchase Plan
                </Button>
              </div>
            </>
          )}
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
          onClick={() => navigate("/pricing")}
        >
          Boost Profile
        </button>
      </div>
      <DashboardTabs />
      <ShopDetailCards />;{/* Edit Profile Modal */}
      <EditProfileModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </div>
  );
}
