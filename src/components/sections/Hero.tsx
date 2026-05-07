"use client";
import React from "react";
import { GridLines, PlusIcon } from "@/components/ui/GridLines";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ExactLineArt } from "@/components/ui/ExactLineArt";

export function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden border-b border-white/10 p-6 md:p-12">
      {/* BACKGROUND SPLIT */}
      <div className="absolute inset-0 flex pointer-events-none z-0">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-white" />
      </div>

      {/* Background Technicals */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[40%] bg-gradient-radial from-white/[0.05] via-transparent to-transparent blur-[100px]" />
      </div>

      {/* TOP LEFT: NAME */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-20 self-start mt-20"
      >
        <h1 className="text-5xl md:text-7xl font-black  uppercase leading-[1]">
          Elnatan <br /> Samuel
        </h1>
        <span className="text-[10px] font-mono text-white uppercase tracking-[0.5em] mt-6 block">
          Fullstack mobile and web developer
        </span>
      </motion.div>

      {/* CENTER: BIG IMAGE */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <motion.div
          style={{ opacity, scale }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full max-w-[80vh] aspect-[3/4] pointer-events-auto"
        >
          <ExactLineArt
            src="/el.png"
            threshold={80}
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* BOTTOM RIGHT: BUTTONS & SUBTEXT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="relative z-20 self-end mt-auto mb-12 flex flex-col items-end text-right"
      >
        <p className="text-[10px] md:text-xs font-mono text-black uppercase tracking-[0.4em] mb-12 max-w-sm leading-relaxed">
          Focused on Native Performance & High Capacity Infrastructure. Building
          the next generation of mobile experiences.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative px-10 py-5 bg-black text-white font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition-all overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center gap-3">
              Projects{" "}
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          <button
            onClick={() =>
              document
                .getElementById("skills")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group px-8 py-5 border border-black hover:border-black/30 text-[10px] text-black font-mono uppercase tracking-[0.4em] transition-all w-full sm:w-auto"
          >
            Skills
          </button>
        </div>
      </motion.div>
    </div>
  );
}
