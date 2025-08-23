import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f9ff] to-[#dceaff] px-6">
      <div className="max-w-2xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[6rem] sm:text-[8rem] font-bold text-[#012A56] leading-none"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-gray-700 mb-4"
        >
          Oops! Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-600 max-w-md mx-auto mb-6"
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link
            to="/"
            className="inline-block bg-[#012A56] hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm sm:text-base transition-all duration-300"
          >
             Go back to Home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
