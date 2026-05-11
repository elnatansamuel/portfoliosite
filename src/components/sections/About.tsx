"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PlusIcon } from "@/components/ui/GridLines";

export function About() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full flex flex-col overflow-hidden bg-black py-10 md:py-40 px-6"
    >
      <div className="max-w-7xl mx-auto px-10 relative z-10 w-full flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="md:w-1/2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.4em] block mb-3">
                Profile
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
                About Me
              </h2>
              <div className="w-20 h-1 bg-white mb-6" />
            </div>
            <div className="md:w-1/2 mt-2 md:mt-24">
              <p className="text-xl md:text-2xl font-medium leading-tight uppercase tracking-tight mb-8 text-white">
                I LIKE BUILDING THINGS PEOPLE CAN ACTUALLY USE WITHOUT GETTING
                ANNOYED FIVE SECONDS IN.
              </p>
              <p className="text-white uppercase text-xs font-mono tracking-widest leading-relaxed ">
                I started with ui/ux design, then moved into full stack
                development because i wanted control over the whole thing, not
                just how it looked. Since then i’ve built mobile apps, ai tools,
                productivity systems, npm packages, schedulers, and tool
                wrappers. Most of my projects start from random ideas i get at
                2am and turn into something real after a few days of obsessing
                over them. I mostly work with next.js, react native, node.js,
                and whatever else helps me build faster and cleaner.
              </p>
            </div>
          </div>

          {/* Scrolling Text Ribbon */}
          {/* <div className="mt-24 border-y border-white/10 py-12 overflow-hidden whitespace-nowrap">
            <motion.div style={{ x: x1 }} className="flex gap-12">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-4xl md:text-6xl font-black uppercase text-white/50 tracking-tighter"
                >
                  Typescript • Python • Svelte • Express.js •
                </span>
              ))}
            </motion.div>
            <motion.div style={{ x: x2 }} className="flex gap-12 mt-6">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-4xl md:text-6xl font-black uppercase text-white/50 tracking-tighter"
                >
                  React Native • Next.js • MongoDB • Postgres •
                </span>
              ))}
            </motion.div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
