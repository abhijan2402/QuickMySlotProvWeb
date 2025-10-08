import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetbannerQuery } from "../services/bannerApi";

const HeroIntro = () => {
  const { data, isLoading, isError } = useGetbannerQuery();

  // Filter banners: exclude top position and null images
  const filteredBanners =
    data?.data?.banners?.filter(
      (banner) => banner.position !== "top" && banner.image
    ) || [];

  const settings = {
    dots: true,
    infinite: filteredBanners.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: filteredBanners.length > 1,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
  };

  if (isLoading) return <p className="text-center py-12">Loading banners...</p>;
  if (isError)
    return (
      <p className="text-center py-12 text-red-500">Failed to load banners.</p>
    );
  if (filteredBanners.length === 0)
    return <p className="text-center py-12">No banners available</p>;

  return (
    <section
      className="relative w-full mb-8"
      style={{ height: "50vh", minHeight: 300 }}
    >
      <Slider {...settings}>
        {filteredBanners.map(({ id, image, position }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[50vh] min-h-[300px]"
          >
            <img
              src={image}
              alt={`Banner ${id} - ${position}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </motion.div>
        ))}
      </Slider>

      {/* Overlay text content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-20 bg-black bg-opacity-40 text-white pointer-events-none"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-2xl">
          Empowering Your Lifestyle
        </h1>
      </motion.div>
    </section>
  );
};

export default HeroIntro;
