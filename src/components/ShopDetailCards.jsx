import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import {
  FaUserAlt,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGlobe,
  FaCalendarAlt,
} from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../utils/utils";
import { useGetCategoryQuery } from "../services/bannerApi";

export default function ShopDetailCards() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { data } = useGetCategoryQuery();

  console.log(data?.data);

  const sliderSettings = {
    dots: true,
    infinite: user?.portfolio_images?.length > 1,
    autoplay: user?.portfolio_images?.length > 1,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
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
          transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
          className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-200"
        >
          {/* Image / Slider */}
          <div className="lg:w-1/2 w-full h-72 sm:h-96 lg:h-auto">
            {user?.portfolio_images && user?.portfolio_images.length > 0 ? (
              user?.portfolio_images.length === 1 ? (
                <img
                  src={user.portfolio_images[0].image_url}
                  alt={`${user?.business_name} portfolio`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Slider {...sliderSettings} className="h-full">
                  {user.portfolio_images.map((img, idx) => (
                    <div key={img.id || idx}>
                      <img
                        src={img.image_url}
                        alt={`${user?.business_name} portfolio ${idx + 1}`}
                        className="w-full h-72 sm:h-96 lg:h-[500px] object-cover"
                      />
                    </div>
                  ))}
                </Slider>
              )
            ) : (
              <img
                src="https://via.placeholder.com/600x400?text=No+Images+Available"
                alt="No portfolio"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-center gap-6 bg-gray-50">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#EE4E34]">
              {capitalizeFirstLetter(user?.business_name)}
            </h1>

            <p className="text-gray-700 italic text-sm sm:text-base">
              {user?.business_description || "No description available."}
            </p>

            <div className="space-y-4 text-gray-700 text-sm sm:text-base">
              <div className="flex items-center gap-3">
                <FaUserAlt className="text-[#EE4E34]" />
                <span className="font-semibold">Vendor:</span>
                <span>{user?.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaUserAlt className="text-[#EE4E34]" />
                <span className="font-semibold">Business Category:</span>
                <span>
                  {data?.data.find(
                    (cat) => cat.id === Number(user?.service_category)
                  )?.name || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#EE4E34]" />
                <span className="font-semibold">Mobile:</span>
                <span>{user?.phone_number}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-[#EE4E34]" />
                <span className="font-semibold">Address:</span>
                <span className="line-clamp-2">
                  {user?.location_area_served}, {user?.exact_location}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BsClock className="text-[#EE4E34]" />
                <span className="font-semibold">Timings:</span>
                <span>
                  {user?.daily_start_time} - {user?.daily_end_time}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-[#EE4E34]" />
                <span className="font-semibold">Working Days:</span>
                <span>{user?.working_days?.join(", ") || "Not specified"}</span>
              </div>

              {user?.business_website && (
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-[#EE4E34]" />
                  <span className="font-semibold">Website:</span>
                  <a
                    href={user.business_website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.business_website}
                  </a>
                </div>
              )}
            </div>

            <button
              className="mt-6 py-3 px-5 rounded-lg text-white bg-[#EE4E34] hover:bg-[#d13c25] transition font-semibold w-fit"
              onClick={() => navigate(`/manageshop`)}
            >
              Manage Services
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
