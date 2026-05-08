"use client";
import React from "react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer id="footer" className="bg-white px-6 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-black uppercase tracking-tighter">
            Elnatan Samuel
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            Built with Native Precision & Brutalist Intent
          </span>
        </div>

        <div className="flex gap-12 text-[10px] font-mono uppercase tracking-[0.3em]">
          <a
            href="https://github.com/ElnatanSamuel"
            target="_blank"
            className="hover:text-black transition-colors text-black"
          >
            Github
          </a>
          <a
            href="https://linkedin.com/in/elnatan-samuel"
            target="_blank"
            className="hover:text-black transition-colors text-black"
          >
            Linkedin
          </a>
          <a
            href="mailto:contact@elnatan.com"
            className="hover:text-black transition-colors text-black"
          >
            Email
          </a>
        </div>

        <div className="text-[10px] font-mono text-black uppercase tracking-widest">
          © {new Date().getFullYear()} All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
