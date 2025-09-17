import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { CgLock } from "react-icons/cg";
import { BsClock } from "react-icons/bs";
import { useGetProfileQuery } from "../services/profileApi";
import { useSelector } from "react-redux";

const shopData = [
  {
    id: 1,
    vendorName: "John Doe",
    mobile: "+91 9876543210",
    shopName: "Elite Salon",
    description:
      "Unleash your beauty with expert styling and personalized care.",
    address: "123 Main Street, New Delhi",
    opentime: "10:00AM",
    closetime: "10:00PM",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGF3MiZ7vAAl58bi9m6YHS4FYTevIZzpxX3A&s",
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1590080877777-3e919f9d17a0?auto=format&fit=crop&w=700&q=80",
    ],
  },
];

export default function ShopDetailCards() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { data: profile, error, isLoading } = useGetProfileQuery();
  console.log(user);
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
  };

  const {
    id,
    vendorName,
    mobile,
    shopName,
    description,
    address,
    images,
    opentime,
    closetime,
  } = shopData[0];

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-purple-700">
                My Shop
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Manage your shop and showcase your services professionally.
              </p>
            </div>
            <div className="flex-grow border-t-2 w-10 border-purple-700"></div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 70 }}
          className="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden flex flex-col lg:flex-row border border-gray-200"
        >
          {/* Image Slider */}
          <div className="lg:w-1/2 w-full h-96 lg:h-auto">
            <Slider {...sliderSettings}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${shopName} image ${idx + 1}`}
                  className="w-full h-96 lg:h-full object-cover"
                />
              ))}
            </Slider>
          </div>

          {/* Details Panel */}
          <div className="lg:w-1/2 w-full p-8 flex flex-col justify-center gap-6 bg-purple-50">
            <h1 className="text-4xl font-extrabold text-purple-700">
              {user.business_name}
            </h1>

            <p className="text-lg text-gray-700 italic max-w-md">
              {user.business_description}
            </p>

            <div className="space-y-4 text-gray-700 max-w-md">
              <div className="flex items-center gap-3">
                <FaUserAlt className="text-purple-600" />
                <span className="font-semibold">Vendor:</span>
                <span>{user.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-purple-600" />
                <span className="font-semibold">Mobile:</span>
                <span>{user.phone_number}</span>
              </div>

              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-purple-600" />
                <span className="font-semibold">Address:</span>
                <span>
                  {user.location_area_served},{" "}
                  {user.exact_location}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <BsClock className="text-purple-600" />
                <span className="font-semibold">Time:</span>
                <span>
                  {user.daily_start_time}-
                  {user.daily_end_time}
                </span>
              </div>
            </div>

            <button
              className="mt-6 py-3 w-40 rounded-lg text-white bg-purple-700 hover:bg-purple-800 transition font-semibold"
              onClick={() => navigate(`/manageshop`)}
              // aria-label={`View details of ${shopName}`}
            >
              Manage Services
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
