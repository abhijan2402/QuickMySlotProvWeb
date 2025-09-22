import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";

export default function Breadcrumb({ propertyTitle }) {
  const navigate = useNavigate();

  return (
    <nav className="max-w-7xl mx-auto flex items-center text-sm text-gray-600 mb-6 px-0 sm:px-6">
      {/* Home */}
      <Link
        to={"/"}
        className="flex items-center hover:text-[#EE4E34] shrink-0"
      >
        <FaHome className="mr-1" /> Home
      </Link>

      <FaChevronRight className="mx-2 text-gray-400 shrink-0" />

      {/* Current Page */}
      <span className="text-gray-500 truncate max-w-[50%] sm:max-w-none">
        {propertyTitle}
      </span>

      <button
        onClick={() => navigate(-1)}
        className="ml-auto text-[#EE4E34] text-xs underline hover:text-[#EE4E34] shrink-0"
      >
        ← Go Back
      </button>
    </nav>
  );
}
