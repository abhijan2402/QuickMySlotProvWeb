import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

const serviceImages = [
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
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
  return (
    <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-gradient-to-br from-violet-100 via-white to-blue-50">
      {/* Text Section */}
      <motion.div
        className="max-w-xl mb-12 md:mb-0"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-6">
          Empowering Your Lifestyle
          <br />
          <span className="text-violet-600">
            From Wellness to Style — All in One Place
          </span>
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Discover top-tier services from salons, healthcare, spas, pet clinics,
          automotive care, retail, to tattoo artistry. Seamlessly find and book
          your needs with us.
        </p>
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition"
          onClick={() => alert("Explore all services")}
        >
          Explore Our Services <FaArrowRight />
        </motion.button> */}
      </motion.div>

      {/* Image Slider Section */}
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Slider
          dots={true}
          infinite={true}
          speed={600}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={4000}
          arrows={false}
          className="rounded-xl shadow-lg"
        >
          {serviceImages.map(({ src, alt }) => (
            <img
              key={alt}
              src={src}
              alt={alt}
              className="w-full h-[400px] object-cover rounded-xl"
            />
          ))}
        </Slider>
      </motion.div>
    </section>
  );
};

export default HeroIntro;
