"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let assetsReady = false;
    let minTimePassed = false;

    const checkReady = () => {
      if (assetsReady && minTimePassed) {
        setLoading(false);
      }
    };

    const handleReady = () => {
      assetsReady = true;
      checkReady();
    };

    window.addEventListener("vector-field-ready", handleReady);

    // Minimum display time for animation (2 seconds)
    const minTimer = setTimeout(() => {
      minTimePassed = true;
      checkReady();
    }, 2000);

    // Safety timeout (6 seconds)
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => {
      window.removeEventListener("vector-field-ready", handleReady);
      clearTimeout(minTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="preloader-container"
          initial={{ y: 0 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
          }}
          className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none"
        >
          {/* Layer 1: The Initial Black Screen */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
            className="absolute inset-0 bg-black z-10"
          />

          {/* Layer 2: The White Panel pushing from left */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
            className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center"
          >
            {/* Minimalist branding or loading indicator on the white layer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-col items-center"
            >
              <span className="text-black font-black text-4xl uppercase tracking-tighter mb-4">
                Elnatan Samuel
              </span>
              <div className="w-12 h-1 bg-black" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
