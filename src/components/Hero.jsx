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
    <section className="relative mb-10 sm:mb-16 ">
      <Slider {...settings}>
        {filteredTopBanners.map(({ id, image, position }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[30vh] min-h-[250px] max-h-[50vh] sm:h-[50vh] sm:min-h-[350px] md:h-[60vh] md:min-h-[500px]"
          >
            <img
              src={image}
              alt={`Banner ${id} - ${position}`}
              className="w-full h-full object-fill object-center sm:object-cover md:object-fill"
              loading="lazy"
            />
          </motion.div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroIntro;
