import React from "react";
import { FaWhatsapp, FaTelegramPlane, FaSkype } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import "./SocialReach.css";
import { BiWorld } from "react-icons/bi";

const SocialReach = () => {
  return (
    <div className="social-reach">
      <a
        href="https://web.whatsapp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp"
      >
        <FaWhatsapp />
      </a>
      <a
        href="https://web.whatsapp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="email rapid"
      >
        <BiWorld />
      </a>

      <a
        href="https://web.whatsapp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="telegram"
      >
        <FaTelegramPlane />
      </a>
      <a href="skype:live:.cid.6b5756bc6ad80f3d?chat" className="skype">
        <FaSkype />
      </a>
      <a href="mailto:contact@QuickmySlot.com" className="email">
        <MdEmail />
      </a>
    </div>
  );
};

export default SocialReach;
