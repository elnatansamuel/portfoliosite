"use client";
import React, { useRef } from "react";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/sections/Footer";
import { Preloader } from "@/components/ui/Preloader";
import { GridLines, PlusIcon } from "@/components/ui/GridLines";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

function ExperienceCard({ exp, index }: { exp: any; index: number }) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative pl-12 border-l border-black/10"
    >
      <div className="absolute left-[-4px] top-6 w-2 h-2 bg-black" />
      <span className="text-[10px] font-mono text-neutral-500 mb-3 block uppercase tracking-[0.3em]">
        {exp.period}
      </span>
      <h3 className="text-4xl font-bold mb-2 tracking-tighter uppercase text-black">
        {exp.role}
      </h3>
      <p className="text-black mb-8 font-mono uppercase tracking-[0.2em] text-[12px]">
        {exp.company}
      </p>
      <ul className="space-y-4 max-w-md">
        {exp.points.map((point: string, i: number) => (
          <li key={i} className="flex gap-4 group">
            <div className="w-[2px] h-[2px] bg-black/60 rounded-full mt-2 shrink-0 group-hover:bg-black transition-colors" />
            <span className="text-black leading-relaxed text-[11px] uppercase tracking-tight group-hover:text-neutral-500 transition-colors">
              {point}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef(null);

  return (
    <main
      ref={containerRef}
      className="min-h-screen bg-black text-white selection:bg-white selection:text-black relative"
    >
      <Preloader />
      <div className="fixed inset-0 grid-background pointer-events-none z-0" />

      {/* Structural Vertical Lines */}
      <div className="fixed left-[10%] top-0 h-full w-[1px] bg-white/[0.03] z-0" />
      <div className="fixed left-1/4 top-0 h-full w-[1px] bg-white/[0.02] z-0" />
      <div className="fixed left-1/2 top-0 h-full w-[1px] bg-white/[0.02] z-0" />
      <div className="fixed left-3/4 top-0 h-full w-[1px] bg-white/[0.02] z-0" />
      <div className="fixed right-[10%] top-0 h-full w-[1px] bg-white/[0.03] z-0" />

      <div className="relative">
        <Hero />

        {/* Projects (White) */}
        <div className="bg-white relative z-30">
          <motion.div
            style={{
              y: useTransform(
                useScroll().scrollYProgress,
                [0.1, 0.3],
                [0, -50],
              ),
            }}
          >
            <Projects />
          </motion.div>
        </div>

        {/* About (Black) with Parallax Transition */}
        <motion.div
          style={{
            y: useTransform(useScroll().scrollYProgress, [0.3, 0.5], [100, 0]),
            zIndex: 31,
          }}
          className="relative bg-black"
        >
          <About />
        </motion.div>

        {/* Experience Section (White) with Parallax Transition */}
        <motion.section
          id="experience"
          style={{
            y: useTransform(useScroll().scrollYProgress, [0.5, 0.7], [100, 0]),
            zIndex: 32,
          }}
          className="py-10 md:py-40 px-4 md:px-6 relative bg-white border-t border-black/5"
        >
          <div className="max-w-7xl mx-auto relative px-4 md:px-10 ">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 py-10 md:py-20 items-start">
              {/* Sticky Header Column - Relative on mobile to prevent overlap */}
              <div className="relative md:sticky md:top-40 h-fit z-10 bg-white md:bg-transparent py-4 md:py-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.4em] block mb-3">
                    Career .LOG
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black -tracking-normal uppercase leading-[1] mb-2 text-black">
                    Experience <br /> History
                  </h2>
                  <div className="w-24 h-1 bg-black mb-8" />
                </motion.div>
              </div>

              {/* Parallax Content Column */}
              <div className="space-y-10 md:space-y-60 py-10 md:py-20">
                {[
                  {
                    role: "Mobile App Developer",
                    company: "EagleLion System Technologies",
                    period: "MAR 2025 - Present",
                    points: [
                      "Develop and maintain commercial banking and Wallet apps by implementing new features, fixing bugs, and building responsive UI",
                      "Collaborate with cross-functional teams to enhance performance, ensure stability, and deliver seamless user experience in existing projects",
                    ],
                  },
                  {
                    role: "Mobile App Developer",
                    company: "Bamacon Construction",
                    period: "SEP 2024 - DEC 2024",
                    points: [
                      "Developed a cross-platform construction management app using React Native.",
                      "ntegrated a GraphQL API to streamline backend data retrieval.",
                      "Contributed to design improvements and conducted user experience testing.",
                    ],
                  },
                  {
                    role: "AI Research/Web development Intern",
                    company: "iCog Labs",
                    period: "MAR 2024 - AUG 2024",
                    points: [
                      "Trained and implemented AI models using diverse datasets.",
                      "Conducted research on AGI concepts to improve LLM intelligence.",
                      "Explored Deep Learning and Reinforcement Learning principles to model human like intelligence.",
                      "Developed a knowledge graph and cleaned datasets to populate the companyʼs database",
                    ],
                  },
                  {
                    role: "Fullstack Web Developer",
                    company: "Ale Interiors",
                    period: "JUN 2023 - NOV 2023",
                    points: [
                      "Designed and developed responsive user interfaces using React, managing the full frontend development lifecycle.",
                      "Integrated CMS to enhance content management efficiency for clients.",
                      "Focused on performance optimization, creating fast, scalable websites with exceptional user experiences.",
                    ],
                  },
                ].map((exp, index) => (
                  <ExperienceCard key={exp.company} exp={exp} index={index} />
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Combined Dark Bottom Section (Skills & Footer) */}
        <motion.div
          style={{
            y: useTransform(useScroll().scrollYProgress, [0.7, 0.9], [100, 0]),
            zIndex: 33,
          }}
          className="bg-black relative"
        >
          <motion.div
            style={{
              y: useTransform(
                useScroll().scrollYProgress,
                [0.7, 0.9],
                [50, -50],
              ),
            }}
          >
            <Skills />
          </motion.div>

          <footer
            id="footer"
            className="px-6 text-center border-t border-white/10 bg-black relative overflow-hidden"
          >
            <div className="absolute inset-0 grid-background opacity-5" />

            <div className="max-w-7xl mx-auto p-20 flex flex-col items-center gap-12 bg-black relative z-10">
              <div className="flex items-center gap-3">
                <span className="font-bold tracking-tighter text-4xl  text-white uppercase">
                  ELNATAN SAMUEL
                </span>
              </div>

              <div className="flex gap-12">
                <a
                  href="mailto:elnatansamuel25@gmail.com"
                  className="nav-link font-bold font-mono hover:tracking-widest transition-all !text-white border-white/20"
                >
                  Email
                </a>
                <a
                  href="https://github.com/ElnatanSamuel"
                  className="nav-link font-bold font-mono hover:tracking-widest transition-all !text-white border-white/20"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/elnatansamuel999/"
                  className="nav-link font-bold font-mono hover:tracking-widest transition-all !text-white border-white/20"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </motion.div>
      </div>
    </main>
  );
}
