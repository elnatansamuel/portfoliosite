"use client";
import React from "react";
import { GridLines, PlusIcon } from "@/components/ui/GridLines";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { SiGithub, SiNpm } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { ExactLineArt } from "@/components/ui/ExactLineArt";
import { MobileLineArt } from "@/components/ui/MobileLineArt";
import { SmoothCursor } from "@/components/ui/SmoothCursor";

export function Hero() {
  const { scrollY, scrollYProgress } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);

  // Parallax transforms
  const nameY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const subtextY = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <div
      id="hero"
      className="relative min-h-screen w-full flex flex-col overflow-hidden p-6 md:p-12 bg-black md:bg-white"
    >
      <SmoothCursor />
      {/* BACKGROUND SPLIT - Hidden on mobile */}
      <motion.div
        id="hero-split-center"
        style={{
          opacity: useTransform(scrollY, [0, 600], [1, 0]),
          x: useTransform(scrollY, [0, 600], [0, -50]),
        }}
        className="absolute inset-y-0 left-0 w-1/2 bg-black pointer-events-none z-0 hidden md:block"
      />

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

      {/* TOP RIGHT: SOCIALS */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute top-8 right-6 md:top-12 md:right-12 z-50 flex items-center gap-2 md:gap-4"
      >
        <a
          href="mailto:elnatansamuel25@gmail.com"
          className="text-white md:text-black hover:scale-110 transition-transform p-2"
          aria-label="Email"
        >
          <Mail className="w-4 h-4 md:w-5 md:h-5" />
        </a>
        <a
          href="https://github.com/ElnatanSamuel"
          className="text-white md:text-black hover:scale-110 transition-transform p-2"
          aria-label="GitHub"
        >
          <SiGithub className="w-4 h-4 md:w-5 md:h-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/elnatansamuel999/"
          className="text-white md:text-black hover:scale-110 transition-transform p-2"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="w-4 h-4 md:w-5 md:h-5" />
        </a>
        <a
          href="https://www.npmjs.com/~elnatan"
          className="text-white md:text-black hover:scale-110 transition-transform p-2"
          aria-label="NPM"
        >
          <SiNpm className="w-4 h-4 md:w-5 md:h-5" />
        </a>
      </motion.div>

      {/* TOP LEFT: NAME */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{ y: nameY }}
        className="relative z-20 self-start mt-16 md:mt-20"
      >
        <h1 className="text-4xl md:text-7xl font-black uppercase leading-[1] text-white md:mix-blend-difference">
          Elnatan <br /> Samuel
        </h1>
        <span className="text-[9px] md:text-[10px] font-mono text-white uppercase tracking-[0.4em] md:tracking-[0.5em] mt-4 md:mt-6 block md:mix-blend-difference">
          Fullstack mobile and web developer
        </span>
      </motion.div>

      {/* CENTER: BIG IMAGE */}
      <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
        <motion.div
          style={{ opacity, scale, y: imageY }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full max-w-[100vw] md:max-w-[90vh] aspect-[3/4] pointer-events-auto mt-[-10vh] md:mt-0"
        >
          <div
            className="hidden md:block w-full h-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
            }}
          >
            <ExactLineArt
              src="/el.png"
              threshold={80}
              className="w-full h-full z-50"
            />
          </div>
          <div
            className="block opacity-70 md:hidden w-full h-full"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 80%, transparent 100%)",
            }}
          >
            <MobileLineArt
              src="/el.png"
              threshold={100}
              className="w-full h-full z-50"
            />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM RIGHT: BUTTONS & SUBTEXT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ y: subtextY }}
        className="relative z-50 self-end mt-auto mb-6 md:mb-12 flex flex-col items-end text-right px-4"
      >
        <p className="text-[10px] md:text-xs font-mono text-white md:text-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12 max-w-[250px] md:max-w-sm leading-relaxed md:mix-blend-difference">
          I build modern apps, weird ideas, and occasionally turn them into real
          products.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group relative px-10 py-5 bg-white md:bg-black text-black md:text-white font-bold uppercase tracking-widest text-[10px] transition-all overflow-hidden w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-neutral-200 md:bg-neutral-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-3">
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
            className="group px-8 py-5 border border-white md:border-black text-[10px] text-white md:text-black font-mono uppercase tracking-[0.4em] transition-all w-full sm:w-auto"
          >
            Skills
          </button>
        </div>
      </motion.div>
    </div>
  );
}
