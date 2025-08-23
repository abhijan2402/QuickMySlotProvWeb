import React from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import Slider from "react-slick";

const upcomingBookings = [
  {
    id: 1,
    customerName: "John Doe",
    services: [
      { name: "Haircut", subServices: ["Beard Trim", "Shampoo"] },
      { name: "Facial", subServices: ["Gold Facial"] },
    ],
    price: 1200,
    date: "2025-08-25",
    address: "123 Main Street, New Delhi",
    phone: "9876543210",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    services: [{ name: "Full Body Massage", subServices: ["Aroma Therapy"] }],
    price: 2500,
    date: "2025-09-01",
    address: "456 Park Avenue, Mumbai",
    phone: "9123456780",
  },
];

const VendorUpcomingBookings = () => {
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <div
        className="slick-arrow slick-next"
        style={{
          display: "block",
          right: "-35px",
          fontSize: "30px",
          color: "#722ed1",
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
          color: "#722ed1",
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
    infinite: upcomingBookings.length > 1,
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
    // Replace with your actual view logic (modal, page redirect, etc.)
    console.log("View details clicked for booking:", booking);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      <div className="flex flex-col items-center mb-10 px-4 max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center w-full gap-4">
          <div className="flex-grow border-t-2 w-10 border-[#6961AB]"></div>
          <div className="text-center px-6">
            <h2 className="text-4xl font-extrabold text-[#6961AB]">
              Upcoming Bookings
            </h2>
          </div>
          <div className="flex-grow border-t-2 w-10 border-[#6961AB]"></div>
        </div>
      </div>
      {upcomingBookings.length > 0 ? (
        <Slider {...settings}>
          {upcomingBookings.map((booking) => (
            <div key={booking.id} className="px-3 ">
              <div className="bg-white rounded-2xl h-[300px] shadow-lg p-6 border border-gray-200 flex flex-col justify-between overflow-y-auto">
                {/* Customer Name */}
                <h3 className="text-xl font-semibold text-[#6961AB] mb-2">
                  {booking.customerName}
                </h3>

                {/* Services */}
                <div className="mb-4 flex-1">
                  <p className="text-gray-800 font-medium">Services:</p>
                  <ul className="list-disc erflow-hidden list-inside text-gray-600 ml-2">
                    {booking.services.map((service, i) => (
                      <li key={i}>
                        {service.name}{" "}
                        {service.subServices?.length > 0 && (
                          <span className="text-sm text-gray-500">
                            ({service.subServices.join(", ")})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {/* Price & Date */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-green-600">
                      Price: ₹{booking.price}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="mt-auto bg-[#6961AB] text-white px-4 py-2 rounded-lg shadow hover:bg-[#6961AB] transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-gray-600">You have no upcoming bookings.</p>
      )}
    </div>
  );
};

export default VendorUpcomingBookings;
