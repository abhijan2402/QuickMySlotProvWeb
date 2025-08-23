import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const services = [
  "Salon",
  "Healthcare",
  "Spa",
  "Pet Clinic",
  "Automotive Car",
  "Retail/Designer",
  "Tattoo & Piercing",
];

export default function ServicesSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % services.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = (index) => {
    setCurrent(index);
  };

  return (
    <section
      id="Services"
      className="relative min-h-[30vh] sm:min-h-[40vh] md:min-h-[50vh] flex flex-col items-center justify-center px-4 text-center pt-28 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white"
    >
      {/* Animated service name */}
      <motion.h2
        key={services[current]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-bold"
      >
        {services[current]}
      </motion.h2>

      {/* Indicators */}
      <div className="flex mt-6 gap-3">
        {services.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to ${services[index]}`}
            onClick={() => handleIndicatorClick(index)}
            className={`w-4 h-4 rounded-full transition-colors ${
              current === index ? "bg-white" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
