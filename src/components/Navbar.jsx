import { useState, useEffect } from "react";
import { FaHeart, FaMapMarkerAlt, FaUserCircle } from "react-icons/fa"; // For wishlist and location icons
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/clogo.png";
import { FaLocationPin } from "react-icons/fa6";
import { BiHeart } from "react-icons/bi";
import { BsBellFill } from "react-icons/bs";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Example username for profile icon (replace with actual user data)
  const username = "JohnDoe";

  const navItems = [
    "Home",
    "Appointment",
    "Services",
    "Support",
  ];
  const routeToNavItem = {
    "/": "Home",
    "/appointments": "Appointment",
    "/manageshop": "Services",
    "/support": "Support",
  };
  const [active, setActive] = useState(routeToNavItem[location.pathname] || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync active nav item with route changes
  useEffect(() => {
    setActive(routeToNavItem[location.pathname] || "");
  }, [location.pathname]);

  // Nav item click handler updated to navigate routes
  const handleClick = (item) => {
    setActive(item);
    setIsMobileMenuOpen(false);

    // Navigate to corresponding route for nav item
    const path =
      Object.keys(routeToNavItem).find((key) => routeToNavItem[key] === item) ||
      "/";
    navigate(path);
  };

  const isMinimalPage =
    location.pathname === "/privacy-policy" ||
    location.pathname === "/terms-and-conditions";

  // Example wishlist count
  const wishlistCount = 3;
  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[85px] z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Right Part: Logo */}

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="QuickmySlot Logo"
              className="h-16 w-32 rounded object-contain"
            />
          </div>

          {/* Center Part: Nav Items */}
          {!isMinimalPage && (
            <ul className="hidden md:flex gap-6 text-[#000] font-medium">
              {navItems.map((item) => (
                <li
                  key={item}
                  onClick={() => handleClick(item)}
                  className={`cursor-pointer px-3 py-1 rounded transition ${
                    active === item
                      ? "bg-[#6961ab] text-white"
                      : "hover:bg-[#eee]"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {/* Left Part: Wishlist, Location, User Profile */}
          {!isMinimalPage && (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative p-2 rounded-full border border-[#6961ab] text-[#6961ab] hover:bg-[#6961ab] hover:text-white transition duration-300"
              >
                <div
                  className="relative p-2 rounded-full border bg-[#6961ab] border-[#6961ab] text-[#6961ab] hover:bg-[#6961ab] hover:text-white transition duration-300"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className=" text-center text-[#fff] text-xl">
                    {" "}
                    <BsBellFill />
                  </span>
                  {/* {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"></span>
                  )} */}
                </div>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="relative p-2 rounded-full border border-[#6961ab] text-[#6961ab] hover:bg-[#6961ab] hover:text-white transition duration-300"
              >
                <div
                  className="w-8 h-8 rounded-full bg-[#6961ab] text-white flex items-center justify-center font-semibold cursor-pointer select-none"
                  title={username}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
              </button>
              <div className="flex items-center space-x-3 bg-transparent rounded-lg px-0 py-0  ">
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <div className="relative p-0 rounded-full  text-[#6961ab] transition duration-300">
                      <FaLocationPin className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[#6961ab] text-[14px]">
                      {"Jaipur"}
                    </span>
                  </div>
                  <p className="text-[12px] pl-1 text-[#6961ab] font-semibold">
                    {"Abc, Jaipur, Rajasthan"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {!isMinimalPage && (
            <>
              <div className="md:hidden flex items-center space-x-3 bg-transparent rounded-lg px-0 py-0  ">
                <div className="flex flex-col">
                  <div className="flex gap-1 items-center">
                    <div className="relative p-0 rounded-full  text-[#6961ab] transition duration-300">
                      <FaLocationPin className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-[#6961ab] text-[14px]">
                      {"Jaipur"}
                    </span>
                  </div>
                  <p className="text-[12px] pl-1 text-[#6961ab] font-semibold">
                    {"Abc, Jaipur, Rajasthan"}
                  </p>
                </div>
              </div>
              <button
                className="md:hidden text-[#000] text-3xl"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                ☰
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {!isMinimalPage && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-full h-full bg-white text-[#000] flex flex-col items-center justify-center z-50 md:hidden"
            >
              <button
                className="absolute top-6 right-6 text-3xl"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </button>

              <ul className="flex flex-col gap-6 text-xl">
                {navItems.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleClick(item)}
                    className={`cursor-pointer text-center transition px-3 py-1 rounded ${
                      active === item
                        ? "bg-[#6961ab] text-white"
                        : "hover:bg-[#eee]"
                    }`}
                  >
                    {item}
                  </li>
                ))}
                <ul className="flex flex-col gap-4 justify-center items-center ">
                  <li>
                    <div
                      className="relative cursor-pointer text-xl text-black"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/notifications");
                      }}
                    >
                      <span className=" text-cente text-xl">Notification</span>
                      {/* {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {wishlistCount}
                        </span>
                      )} */}
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
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
