// src/components/Features.jsx
import { motion } from "framer-motion";

const featureVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3 },
  }),
};

export default function Features() {
  const features = ["🚀 Fast", "🎨 Beautiful", "⚙️ Functional"];

  return (
    <section id="features" className="py-20 bg-white text-center">
      <h2 className="text-3xl font-bold mb-10">Features</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={featureVariants}
            className="bg-blue-100 text-blue-700 p-6 rounded-xl shadow-lg w-60"
          >
            {feature}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
