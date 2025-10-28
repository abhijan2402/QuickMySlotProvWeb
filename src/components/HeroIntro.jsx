import React from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { useGetbannerQuery } from "../services/bannerApi";

const HeroIntro = () => {
  const { data } = useGetbannerQuery();

  // Filter valid banners (bottom + vendor + image)
  const filteredBanners =
    data?.data?.banners?.filter(
      (banner) =>
        banner.position === "bottom" && banner.image && banner.type === "vendor"
    ) || [];

  const hasBanners = filteredBanners.length > 0;

  // Slider settings only if multiple banners exist
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <section
      className={`min-h-[80vh] flex flex-col ${
        hasBanners ? "md:flex-row" : "md:flex-col"
      } items-center justify-between px-6 md:px-20 py-16 bg-gradient-to-br from-violet-100 via-white to-blue-50`}
    >
      {/* Text Section */}
      <motion.div
        className={`${
          hasBanners
            ? "max-w-xl mb-12 md:mb-0 text-left"
            : "max-w-3xl text-center"
        }`}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className={`text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight mb-6 ${
            !hasBanners && "mx-auto"
          }`}
        >
          Empowering Your Lifestyle
          <br />
          <span className="text-[#EE4E34]">
            From Wellness to Style — All in One Place
          </span>
        </h1>

        <p
          className={`text-gray-700 text-lg mb-6 ${
            !hasBanners ? "max-w-2xl mx-auto" : ""
          }`}
        >
          Discover top-tier services from salons, healthcare, spas, pet clinics,
          automotive care, retail, to tattoo artistry. Seamlessly find and book
          your needs with us.
        </p>
      </motion.div>

      {/* Image or Slider Section */}
      {hasBanners && (
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {filteredBanners.length > 1 ? (
            <Slider {...sliderSettings} className="rounded-xl shadow-lg">
              {filteredBanners.map(({ image, title }, index) => (
                <img
                  key={index}
                  src={image}
                  alt={title || `Banner ${index + 1}`}
                  className="w-full h-[320px] sm:h-[400px] object-cover rounded-xl"
                />
              ))}
            </Slider>
          ) : (
            <img
              src={filteredBanners[0].image}
              alt={filteredBanners[0].title || "Banner"}
              className="w-full h-[320px] sm:h-[400px] object-cover rounded-xl shadow-lg"
            />
          )}
        </motion.div>
      )}
    </section>
  );
};

export default HeroIntro;
