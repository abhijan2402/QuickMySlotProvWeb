import { useState, useEffect } from "react";
import { BsBellFill } from "react-icons/bs";
import { MdOutlineMyLocation } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "/logo.png";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "../services/profileApi";
import {
  getCityAndAreaFromAddress,
  getLatLngFromAddress,
  truncateText,
} from "../utils/utils";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import LocationModal from "./Modals/LocationModal";

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { data: profile } = useGetProfileQuery();
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  useEffect(() => {
    async function fetchCityAndArea() {
      if (user?.exact_location || userLocation) {
        const result = await getCityAndAreaFromAddress(user.exact_location);
        if (result) {
          setCity(result.city);
          setArea(result.area);
        } else {
          setCity(null);
          setArea(null);
        }
      } else {
        setCity(null);
        setArea(null);
      }
    }
    fetchCityAndArea();
  }, [user?.exact_location, userLocation]);

  // Convert user's address to lat/lng on change
  const addressString = user?.exact_location;
  useEffect(() => {
    async function fetchLatLng() {
      const coord = await getLatLngFromAddress(addressString);
      if (coord) {
        setInitialLocation(coord);
      } else {
        console.error("Could not geocode address");
      }
    }
    fetchLatLng();
  }, [addressString]);


  const navItems = [
    "Home",
    "Appointment",
    "Services",
    "Subscription",
    "Support",
  ];
  const routeToNavItem = {
    "/": "Home",
    "/appointments": "Appointment",
    "/manageshop": "Services",
    "/pricing": "Subscription",
    "/support": "Support",
  };
  const [active, setActive] = useState(routeToNavItem[location.pathname] || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setActive(routeToNavItem[location.pathname] || "");
  }, [location.pathname]);

  const handleClick = (item) => {
    setActive(item);
    setIsMobileMenuOpen(false);
    const path =
      Object.keys(routeToNavItem).find((key) => routeToNavItem[key] === item) ||
      "/";
    navigate(path);
  };

  const isMinimalPage =
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-and-conditions";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-md shadow-md z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-2 sm:px-4 md:px-8 py-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="QuickmySlot Logo"
              className="h-12 w-28 md:h-16 md:w-32 object-contain rounded"
            />
          </div>
          {/* Nav Items - Centered on md+ */}
          {!isMinimalPage && (
            <ul className="hidden md:flex flex-1 justify-center gap-4 lg:gap-8 text-black font-medium">
              {navItems.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer px-3 py-1 text-sm rounded transition
                      ${
                        active === item
                          ? "bg-[#EE4E34] text-white"
                          : "hover:bg-[#eee]"
                      }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          {/* Right Actions */}
          {!isMinimalPage && (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-full border border-[#EE4E34] text-[#EE4E34] hover:bg-[#EE4E34] hover:text-white transition"
              >
                <div
                  className="w-6 h-6 rounded-full bg-[#EE4E34] text-white flex items-center justify-center font-semibold"
                  title={profile?.data?.name}
                >
                  <span className="relative p-1 rounded-full bg-[#EE4E34]">
                    <BsBellFill className="text-sm text-white" />
                  </span>
                </div>
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="relative p-2 rounded-full border border-[#EE4E34] text-[#EE4E34] hover:bg-[#EE4E34] hover:text-white transition"
              >
                <div
                  className="w-6 h-6 rounded-full bg-[#EE4E34] text-white flex items-center justify-center font-semibold"
                  title={profile?.data?.name}
                >
                  {profile?.data?.name?.charAt(0)?.toUpperCase() || "-"}
                </div>
              </button>
              <div
                role="button"
                className="flex items-center gap-1  rounded-l  cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C0902]"
                title="Click to select a different location"
                onClick={() => setModalOpen(true)}
              >
                <FaLocationDot
                  className="w-6 h-6 text-[#EE4E34]"
                  aria-hidden="true"
                />
                <div className="flex flex-col leading-none">
                  <p className="text-[12px] flex items-center gap-1 justify-center text-gray-800 font-medium overflow-hidden whitespace-nowrap truncate ">
                    {city || "NA"},{truncateText(area, 15)}
                    <span>
                      <IoIosArrowDown className="w-4 h-4 text-[#EE4E34]" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {!isMinimalPage && (
              <>
                <div
                  className="flex items-center bg-white rounded-lg px-3 py-1 border border-gray-300"
                  title="Click to select a different location"
                  onClick={() => setModalOpen(true)}
                >
                  <FaLocationDot
                    className="w-6 h-6 text-[#EE4E34]"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col leading-none">
                    <p className="text-[12px] flex items-center gap-1 justify-center text-gray-800 font-medium overflow-hidden whitespace-nowrap truncate">
                      {city || "NA"},{truncateText(area, 15)}
                      <span>
                        <IoIosArrowDown className="w-4 h-4 text-[#EE4E34]" />
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  className="text-3xl text-[#EE4E34] px-2"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  ☰
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Mobile Popover */}
      <AnimatePresence>
        {isMobileMenuOpen && !isMinimalPage && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white md:hidden"
          >
            <button
              className="absolute top-6 right-6 text-3xl"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
            <ul className="flex flex-col gap-6 text-xl items-center mb-8">
              {navItems.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer text-center transition px-6 py-2 rounded w-[220px]
                    ${
                      active === item
                        ? "bg-[#EE4E34] text-white"
                        : "hover:bg-[#eee] text-black"
                    }`}
                >
                  {item}
                </li>
              ))}
              <li>
                <div
                  className="relative cursor-pointer text-xl text-black mt-4"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/notifications");
                  }}
                >
                  <span>Notification</span>
                </div>
              </li>
              <li>
                <div
                  className="cursor-pointer text-black text-xl "
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  Profile
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <LocationModal
        open={modalOpen}
        initialLocation={initialLocation}
        onOk={(loc) => {
          setUserLocation({ lat: loc.lat, lng: loc.lng });
          setModalOpen(false);
        }}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
