import { useState } from "react";
import Slider from "react-slick"; // Install with: npm i react-slick slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { salondata } from "../utils/slaondata";
import { useSelector } from "react-redux";

export default function ServicesPage() {
  const user = useSelector((state) => state.auth.user);

  console.log(user);

  // Extract unique locations
  const locations = [...new Set(salondata.map((s) => s.location))];

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const { type } = useParams();
  const navigate = useNavigate();

  // Filtered Shops
  const filteredShops = salondata.filter((s) => {
    const matchesLocation =
      selectedLocation === "All" || s.location === selectedLocation;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });
  // React-Slick settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <Breadcrumb propertyTitle={"Services"} />
        {/* Heading & Subheading */}
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-[#EE4E34]">
                Our Services
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
                Browse through the various professional services we provide
                across different locations.
              </p>
            </div>
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex justify-between items-center">
          {/* Title */}
          <h4 className="text-2xl font-bold text-center text-gray-800">
            Explore & Book{" "}
            {type ? type.charAt(0).toUpperCase() + type.slice(1) : ""} Around
            You
          </h4>

          {/* Search + Dropdown Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 border rounded-lg px-4 py-2 shadow-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />

            {/* Location Dropdown */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-56 border rounded-lg px-4 py-2 shadow-sm bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 hover:border-purple-400 cursor-pointer transition"
            >
              <option value="All"> All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => navigate(`/services/${type || "all"}/${shop.id}`)}
              className="border rounded-lg shadow-lg overflow-hidden bg-white cursor-pointer"
            >
              {/* Image Carousel */}
              <div className="relative">
                <Slider {...sliderSettings}>
                  {shop.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={shop.name}
                      className="w-full h-56 object-cover"
                    />
                  ))}
                </Slider>
                {shop.offer.length > 0 && (
                  <span className="absolute w-full text-center top-0 left-0 bg-green-500 text-white text-sm font-semibold px-3 py-1  shadow">
                    {shop.offer[0]}
                  </span>
                )}
              </div>

              {/* Shop Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#EE4E34]">
                  {shop.name}
                </h3>
                <p className="text-gray-600 text-sm">{shop.address}</p>

                <p className="text-gray-500 text-sm mt-1">
                  Experience: {shop.experience}
                </p>
                <p className="text-gray-500 text-sm">Available: {shop.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
