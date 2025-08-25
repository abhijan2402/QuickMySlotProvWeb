import {
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

import logo from "../assets/clogo.png";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#0D1B2A] text-white pt-16 pb-6 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
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
            📍 1234 Innovation Drive, Tech Park, Springfield, IL 62704, USA
            <br />
            📞 +91-xxxxxx98, +91-xxxxxxxxx78
            <br />
            📧 contact@QuickmySlot.com
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li
              onClick={() => navigate("/services")}
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
            <li
              onClick={() => navigate("/about")}
              className="hover:text-[#007FFF] transition cursor-pointer"
            >
              About
            </li>
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
              href="#"
              className="hover:text-[#3b5998] transition"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="hover:text-[#FF0800] transition"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="hover:text-[#536878] transition"
              aria-label="X Twitter"
            >
              <FaSquareXTwitter />
            </a>
            <a
              href="#"
              className="hover:text-[#007FFF] transition"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              className="hover:text-[#6e5494] transition"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QuickmySlot. All rights reserved.
      </div>
    </footer>
  );
}
