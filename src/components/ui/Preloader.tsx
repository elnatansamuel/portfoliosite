"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let assetsReady = false;
    let minTimePassed = false;

    const checkReady = () => {
      if (assetsReady && minTimePassed) {
        setLoading(false);
      }
    };

    const handleReady = () => {
      // We rely on handleProgress reaching 100% now
    };

    const handleProgress = (e: any) => {
      setProgress(e.detail);
      if (e.detail >= 100) {
        // Small delay so user sees 100% before exit
        setTimeout(() => {
          assetsReady = true;
          checkReady();
        }, 800);
      }
    };

    window.addEventListener("vector-field-ready", handleReady);
    window.addEventListener("vector-progress", handleProgress);

    // Minimum display time for animation (2 seconds)
    const minTimer = setTimeout(() => {
      minTimePassed = true;
      checkReady();
    }, 2000);

    // Safety timeout (10 seconds for heavy compilation)
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => {
      window.removeEventListener("vector-field-ready", handleReady);
      window.removeEventListener("vector-progress", handleProgress);
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
              className="flex flex-col items-center w-full max-w-xs"
            >
              <span className="text-black font-black text-4xl uppercase tracking-tighter mb-8">
                Elnatan Samuel
              </span>

              {/* Progress Bar Container */}
              <div className="w-full h-[2px] bg-neutral-100 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                />
              </div>

              <div className="flex justify-between w-full mt-2">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest"></span>
                <span className="text-[10px] font-mono text-black font-bold">
                  {Math.round(progress)}%
                </span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
