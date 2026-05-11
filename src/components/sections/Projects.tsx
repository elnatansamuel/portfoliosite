"use client";
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code, Layers, Cpu } from "lucide-react";
import { SiNpm } from "react-icons/si";
import { PlusIcon } from "@/components/ui/GridLines";
import Image from "next/image";

const projects = [
  {
    title: "venvy",
    category: "Core Lib",
    desc: "Venvy is a schema first environment variable validator for Node.js. Define your env shape once, get full TypeScript inference, CLI validation, CI/CD guards, and Zod integration all from one source of truth.",
    tags: ["nodejs", "typescript"],
    id: "01",
    icon: <Layers className="w-5 h-5" />,
    image: "/venv.png",
    github: "https://github.com/ElnatanSamuel/venvy" as string | null,
    live: "https://venvydocs.vercel.app/",
    npm: "https://www.npmjs.com/package/venvy" as string | null,
  },
  {
    title: "sirou(simple route)",
    category: "Core Lib",
    desc: "Sirou is a framework agnostic, universal routing and navigation engine for TypeScript. It provides a single source of truth for your application's architecture, ensuring type safe and consistent logic across Web, Mobile, and Server environments.",
    tags: ["nodejs", "typescript"],
    id: "02",
    icon: <Cpu className="w-5 h-5" />,
    image: "/sirou.png",
    github: "https://github.com/ElnatanSamuel/sirou" as string | null,
    live: "https://siroudoc.vercel.app/",
    npm: "https://www.npmjs.com/package/@sirou/core" as string | null,
  },
  {
    title: "simple api",
    category: "Core Lib",
    desc: "simple-api is a production grade, type safe API client builder designed for high scale TypeScript applications. It provides a structured, service-oriented architecture with built in resilience.",
    tags: ["nodejs", "typescript"],
    id: "03",
    icon: <Cpu className="w-5 h-5" />,
    image: "/simpleapi.png",
    github: "https://github.com/ElnatanSamuel/simple-api" as string | null,
    live: "https://simpleapidocs.vercel.app/",
    npm: "https://www.npmjs.com/package/@simple-api/core",
  },
  {
    title: "reptok",
    category: "Mobile",
    desc: "An offline, TikTok‑style gallery app for your device media. Built with React Native CLI.",
    tags: ["react native"],
    id: "04",
    icon: <Cpu className="w-5 h-5" />,
    image: "/reptok.png",
    github: "https://github.com/ElnatanSamuel/reptok" as string | null,
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-40 px-4 md:px-6 relative z-30 bg-white">
      <div className="max-w-7xl mx-auto relative px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-8 md:gap-12"
        >
          <div className="md:w-1/2">
            <span className="text-[10px] md:text-xs font-mono text-neutral-400 uppercase tracking-[0.4em] block mb-3">
              Selected Works
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-black leading-none">
              Featured Projects
            </h2>
            <div className="w-20 h-1 bg-black mb-6" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/5 border border-black/5">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-0 group relative overflow-hidden h-full flex flex-col border border-black/5"
            >
              {/* Project Image Container */}
              <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden flex-shrink-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                />
              </div>

              <div className="p-10 flex flex-col flex-grow border-t border-black/5">
                <div className="mb-2">
                  <h3 className="text-3xl font-bold tracking-tight uppercase text-black group-hover:text-black transition-colors">
                    {project.title}
                  </h3>
                </div>

                <p className="text-neutral-500 mb-4 leading-relaxed text-sm max-w-sm uppercase tracking-tight">
                  {project.desc}
                </p>

                <div className="flex flex-col gap-6 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono px-3 py-1 border border-black/20 text-black uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-6 opacity-40 group-hover:opacity-100 transition-opacity">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-125 transition"
                        title="View Source"
                      >
                        <Code className="w-5 h-5" />
                      </a>
                    )}
                    {project.npm && (
                      <a
                        href={project.npm}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:scale-125 transition"
                        title="View on npm"
                      >
                        <SiNpm className="w-5 h-5" />
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:scale-125 transition"
                        title="View Live"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
