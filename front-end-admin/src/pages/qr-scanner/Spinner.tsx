import React from "react";
import { motion } from "framer-motion";

const Spinner: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center h-full">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
        className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
      />
    </div>
  );
};

export default Spinner;
