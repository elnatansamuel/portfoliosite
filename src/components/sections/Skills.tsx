"use client";
import React from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "@/components/ui/GridLines";
import {
  SiReact,
  SiNextdotjs,
  SiSvelte,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiPython,
  SiDocker,
} from "react-icons/si";

const stack = [
  { name: "React Native", icon: <SiReact className="w-5 h-5" /> },
  { name: "React", icon: <SiReact className="w-5 h-5" /> },
  { name: "Next.js", icon: <SiNextdotjs className="w-5 h-5" /> },
  { name: "Svelte/SvelteKit", icon: <SiSvelte className="w-5 h-5" /> },
  { name: "TypeScript", icon: <SiTypescript className="w-5 h-5" /> },
  { name: "Tailwind", icon: <SiTailwindcss className="w-5 h-5" /> },
  { name: "Node.js", icon: <SiNodedotjs className="w-5 h-5" /> },
  { name: "Express.js", icon: <SiExpress className="w-5 h-5" /> },
  { name: "MongoDB", icon: <SiMongodb className="w-5 h-5" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
  { name: "Python", icon: <SiPython className="w-5 h-5" /> },
  { name: "Docker", icon: <SiDocker className="w-5 h-5" /> },
];

export function Skills() {
  return (
    <section id="skills" className="py-40 px-6 bg-black relative ">
      <div className="max-w-7xl mx-auto px-10  lg:py-20 relative">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="md:w-1/2">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-[0.4em] block mb-3">
              skills log
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
              Global Stack
            </h2>
            <div className="w-20 h-1 bg-white mb-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-white/5 border border-white/5">
          {stack.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-black p-10 group relative h-full flex flex-col items-center justify-center text-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="mb-6 text-neutral-500 group-hover:text-white transition-all transform group-hover:scale-110">
                {item.icon}
              </div>
              <h3 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                {item.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
