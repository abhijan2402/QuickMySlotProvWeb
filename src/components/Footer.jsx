import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGooglePlay,
  FaApple,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import logo from "../assets/clogo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#0D1B2A] text-white pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {/* <img
              src={logo}
              alt="QuickmySlot Logo"
              className="h-10 w-auto object-contain"
            /> */}
            <h3 className="text-lg font-semibold mb-3">Know Us</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Delivering exceptional digital services and innovative solutions
            across multiple industries to empower businesses worldwide.
          </p>
          <div className="text-sm text-gray-400">
            📍 H.no 152/16 Prem nagar old Jail Road Gurgaon
            <br />
            📞 +91 9810741808
            <br />
            📧 Info@quickmyslot.com
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li
              onClick={() => navigate("/manageshop")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              Services
            </li>
            <li
              onClick={() => navigate("/terms-and-conditions")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              Terms & Conditions
            </li>
            {/* <li
              onClick={() => navigate("/about")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              About
            </li> */}
            <li
              onClick={() => navigate("/support")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              Support
            </li>
            <li
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <div className="flex gap-4 text-2xl text-gray-300 mt-2">
            <a
              href="https://www.youtube.com/channel/UCVxlXRdkkk0ZSUn1-7vd_6A"
              className="hover:text-[#FF0800] transition"
              aria-label="Instagram"
              target="_blank"
            >
              <FaYoutube />
            </a>
            <a
              href="https://www.facebook.com/share/1BAA8a2AjV/?mibextid=wwXIfr"
              className="hover:text-[#3b5998] transition"
              aria-label="Facebook"
              target="_blank"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.instagram.com/quickmyslot?igsh=cmd0cWxkOTl2eDRr&utm_source=qr"
              className="hover:text-[#FF0800] transition"
              aria-label="Instagram"
              target="_blank"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/company/quickmyslot/"
              className="hover:text-[#007FFF] transition"
              target="_blank"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Download Apps - Official Store Badges */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold mb-6 text-white">
            Download QuickMySlot Now
          </h3>

          <div className="flex flex-col md:flex-col gap-4">
            {/* App Store */}
            <a
              href="https://apps.apple.com/in/app/quickmyslot-provider/id6753897063"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-black text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <img src="/appstoreicon.png" alt="Apple" className="h-8 w-8" />
                <div className="leading-tight">
                  <p className="text-xs opacity-80">Download from</p>
                  <p className="text-lg font-semibold">App Store</p>
                </div>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=com.qms_provider"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-black text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]">
                <img
                  src="/playstoreicon.png" // Play icon
                  alt="Google Play"
                  className="h-8 w-8"
                />
                <div className="leading-tight">
                  <p className="text-xs opacity-90">Get it from</p>
                  <p className="text-lg font-semibold">Google Play</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QuickMySlot. All rights reserved.
      </div>
    </footer>
  );
}
