// src/components/LandingPage.jsx
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center px-4">
      <div className="text-center text-white space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold"
        >
          Welcome to My Website
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl"
        >
          We bring ideas to life with creativity and code.
        </motion.p>

        <motion.a
          href="#features"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-white text-blue-500 font-semibold px-6 py-3 rounded-full shadow-lg transition-all"
        >
          Explore More
        </motion.a>
      </div>
    </div>
  );
}
