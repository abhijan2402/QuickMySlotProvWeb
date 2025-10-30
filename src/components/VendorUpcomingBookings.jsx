import React from "react";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaTimesCircle,
} from "react-icons/fa";
import Slider from "react-slick";
import { useGetvendorBookingQuery } from "../services/vendorTransactionListApi";
import SpinnerLodar from "../components/SpinnerLodar";
import { useNavigate } from "react-router-dom";

const VendorUpcomingBookings = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetvendorBookingQuery({ status: "pending" });

  // Slider arrows
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        style={{
          display: "block",
          right: "-35px",
          fontSize: "30px",
          color: "#EE4E34",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <FaArrowAltCircleRight />
      </div>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-prev"
        style={{
          display: "block",
          left: "-35px",
          fontSize: "30px",
          color: "#EE4E34",
          cursor: "pointer",
        }}
        onClick={onClick}
      >
        <FaArrowAltCircleLeft />
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: (data?.data?.length || 0) > 1,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  const handleViewDetails = (booking) => {
    console.log("View details clicked for booking:", booking);
    navigate("/appointments");
  };

  // Take only first 6 bookings
  const upcomingBookings = data?.data?.slice(0, 6) || [];

  if (upcomingBookings) {
    return null
  }
    return (
      <div className="w-full max-w-7xl mx-auto py-8">
        <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center w-full gap-4">
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
            <div className="text-center px-6">
              <h2 className="text-4xl font-extrabold text-[#EE4E34]">
                Upcoming Bookings
              </h2>
            </div>
            <div className="flex-grow border-t-2 w-10 border-[#EE4E34]"></div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <SpinnerLodar title="Loading upcoming bookings..." />
          </div>
        ) : upcomingBookings.length > 0 ? (
          <Slider {...settings}>
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="px-3">
                <div className="bg-white rounded-2xl h-[300px] shadow-lg p-6 border border-gray-200 flex flex-col justify-between overflow-y-auto">
                  <h3 className="text-xl font-semibold text-[#EE4E34] mb-2">
                    {booking.customer?.name || "Customer"}
                  </h3>

                  {/* Services */}
                  <div className="mb-4 flex-1">
                    <p className="text-gray-800 font-medium">Service:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      <li>{booking.service?.name}</li>
                    </ul>

                    {/* Price & Date */}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-semibold text-green-600">
                        Price: ₹{booking.amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        Date:{" "}
                        {Object.entries(booking.schedule_time || {})
                          .map(([time, date]) => `${date} - ${time}`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="mt-auto bg-[#EE4E34] text-white px-4 py-2 rounded-lg shadow hover:bg-[#d63c25] transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="flex flex-col items-center justify-center h-60 text-gray-500">
            <FaTimesCircle className="text-6xl mb-4 animate-bounce" />
            <p className="text-lg font-semibold">No upcoming bookings found</p>
          </div>
        )}
      </div>
    );
};

export default VendorUpcomingBookings;
