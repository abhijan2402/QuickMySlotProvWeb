import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetbannerQuery } from "../services/bannerApi";

const HeroIntro = () => {
  const { data, isLoading, isError, error } = useGetbannerQuery();

  // Filter banners: exclude top position and null images
  const filteredTopBanners =
    data?.data?.banners?.filter(
      (banner) =>
        banner.position == "top" && banner.image && banner.type === "vendor"
    ) || [];

  // console.log(filteredTopBanners);

  const settings = {
    dots: true,
    infinite: filteredTopBanners.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: filteredTopBanners.length > 1,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
  };

  if (filteredTopBanners.length === 0) return null;

  return (
    <section
      className="relative w-full mb-16"
      style={{ height: "60vh", minHeight: 500 }}
    >
      <Slider {...settings}>
        {filteredTopBanners.map(({ id, image, position }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className=" h-[60vh] min-h-[500px]"
          >
            <img
              src={image}
              alt={`Banner ${id} - ${position}`}
              className="w-full h-full object-fill"
              loading="lazy"
            />
          </motion.div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroIntro;
