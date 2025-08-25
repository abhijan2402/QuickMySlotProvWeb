import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const serviceImages = [
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
    alt: "Salon Services",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNM-EBaeIFmRXeyCa_td5D083wA3nE3gYsxg&s",
    alt: "Healthcare Excellence",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lK5IT4Y_9T1hepyuIPLIFcrE0rCMUzN3qw&s",
    alt: "Relaxing Spa Treatments",
  },
  {
    src: "https://thumbs.dreamstime.com/b/vet-dog-cat-puppy-kitten-doctor-examining-veterinarian-animal-clinic-pet-check-up-vaccination-health-care-dogs-156067334.jpg",
    alt: "Pet Clinic Care",
  },
];

const HeroIntro = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <section
      className="relative w-full mb-8"
      style={{ height: "50vh", minHeight: 300 }}
    >
      <Slider {...settings}>
        {serviceImages.map(({ src, alt }) => (
          <motion.div
            key={alt}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[50vh] min-h-[300px]"
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover object-center rounded-none"
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
