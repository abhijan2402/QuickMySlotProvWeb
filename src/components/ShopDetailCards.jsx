import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
  FaPercentage,
  FaFilePdf,
} from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../utils/utils";
import { useGetCategoryQuery } from "../services/bannerApi";
import { useAddGSTMutation, useGetProfileQuery } from "../services/profileApi";
import { Button, Modal, Form, Input } from "antd";
import { toast } from "react-toastify";

export default function ShopDetailCards() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetCategoryQuery();
  const { data: profile, refetch } = useGetProfileQuery();
  const [addGST, { isLoading: isSaving }] = useAddGSTMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const profileData = profile?.data;

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user]);

  const sliderSettings = {
    dots: true,
    infinite: profileData?.portfolio_images?.length > 1,
    autoplay: profileData?.portfolio_images?.length > 1,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };


  const handleOpenModal = () => {
    if (profileData?.gst_setting) {
      form.setFieldsValue({
        title: profileData.gst_setting.title || "",
        value: profileData.gst_setting.value || "",
        description: profileData.gst_setting.description || "",
      });
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("key", "gst");
      formData.append("value", values.value);
      formData.append("title", values.title);
      formData.append("description", values.description);

      await addGST(formData).unwrap();
      toast.success("GST details saved successfully!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      toast.error("Failed to save GST details!");
    }
  };

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 border-[#EE4E34]"></div>
            <div className="text-center px-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#EE4E34]">
                My Shop
              </h2>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Manage your shop and showcase your services professionally.
              </p>
            </div>
            <div className="flex-grow border-t-2 border-[#EE4E34]"></div>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          className="bg-white rounded-2xl  overflow-hidden  flex flex-col lg:flex-row"
        >
          {/* Left Side - Portfolio Image / Slider */}
          <div className="lg:w-1/2 w-full h-72 sm:h-96 lg:h-[480px] flex items-center justify-center bg-gray-100">
            {profileData?.portfolio_images?.length > 0 ? (
              profileData.portfolio_images.length === 1 ? (
                <img
                  src={profileData.portfolio_images[0].image_url}
                  alt={`${profileData?.business_name} portfolio`}
                  className="w-full h-full object-cover rounded-none"
                />
              ) : (
                <Slider {...sliderSettings} className="h-full w-full">
                  {profileData.portfolio_images.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="h-full flex items-center justify-center"
                    >
                      <img
                        src={img.image_url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              )
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/1179/1179069.png"
                alt="No portfolio"
                className="w-48 opacity-60"
              />
            )}
          </div>

          {/* Right Side - Shop Details */}
          <div className="lg:w-1/2 w-full p-8 flex flex-col justify-center bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200">
            <h1 className="text-3xl font-bold text-[#EE4E34] mb-3 tracking-wide">
              {capitalizeFirstLetter(profileData?.business_name)}
            </h1>

            <p className="text-gray-600 italic text-base mb-6 leading-relaxed">
              {profileData?.business_description || "No description available."}
            </p>

            <div className="space-y-3 text-gray-700 text-base">
              <div className="flex items-center gap-3">
                <FaUserAlt className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Vendor:</span>
                <span className="truncate">{profileData?.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaUserAlt className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Category:</span>
                <span>
                  {data?.data.find(
                    (cat) => cat.id === Number(profileData?.service_category)
                  )?.name || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Phone:</span>
                <span>{profileData?.phone_number}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Address:</span>
                <span className="truncate">{profileData?.exact_location}</span>
              </div>

              <div className="flex items-center gap-3">
                <BsClock className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Timings:</span>
                <span>
                  {profileData?.daily_start_time} -{" "}
                  {profileData?.daily_end_time}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#EE4E34]" />
                <span className="font-semibold w-40">Working Days:</span>
                <span>
                  {profileData?.working_days?.join(", ") || "Not specified"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                type="primary"
                style={{
                  backgroundColor: "#EE4E34",
                  borderColor: "#EE4E34",
                }}
                onClick={() => navigate(`/manageshop`)}
              >
                Manage Services
              </Button>

              {/* {location.pathname === "/profile" && (
                <Button
                  icon={<FaPercentage />}
                  onClick={handleOpenModal}
                  style={{
                    backgroundColor: "#16a34a",
                    borderColor: "#16a34a",
                    color: "#fff",
                  }}
                >
                  GST Setting
                </Button>
              )} */}
            </div>
          </div>
        </motion.div>

        {/* Documents Section */}
{/* 

        {location.pathname === "/profile" && (
          <section className="mt-4 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-[#EE4E34] mb-8 text-center">
              Verification Documents
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  key: "photo_verification",
                  title: "Photo Verification",
                  url: profileData?.photo_verification,
                },
                {
                  key: "business_proof",
                  title: "Business Proof",
                  url: profileData?.business_proof,
                },
                {
                  key: "adhaar_card_verification",
                  title: "Aadhaar Card",
                  url: profileData?.adhaar_card_verification,
                },
                {
                  key: "pan_card",
                  title: "PAN Card",
                  url: profileData?.pan_card,
                },
              ].map((doc) => (
                <div
                  key={doc.key}
                  className="border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col items-center justify-start bg-gray-50 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-gray-800 mb-4 text-lg">
                    {doc.title}
                  </h3>

                  {doc.url ? (
                    doc.url.endsWith(".pdf") ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-40 h-40 flex items-center justify-center rounded-lg border border-gray-200 mb-4 bg-gray-50 hover:bg-gray-100"
                        style={{ textDecoration: "none" }}
                      >
                        <FaFilePdf className="text-red-600" size={80} />
                      </a>
                    ) : (
                      <img
                        src={doc.url}
                        alt={doc.title}
                        className="w-40 h-40 object-cover rounded-lg border border-gray-200 mb-4"
                        onError={(e) => (e.target.src = "/noimage.jpg")}
                      />
                    )
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm mb-4">
                      No file uploaded
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
*/}
      </div>

      {/* GST Modal */}
      <Modal
        title="GST Setting"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSaving}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter GST title" }]}
          >
            <Input placeholder="GST title" />
          </Form.Item>

          <Form.Item
            name="value"
            label="GST Value (%)"
            rules={[{ required: true, message: "Please enter GST value" }]}
          >
            <Input placeholder="Enter GST %" type="number" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the GST policy..." />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
