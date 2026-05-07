"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const PlusIcon = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative w-3 h-3 text-white/20 flex items-center justify-center",
        className,
      )}
    >
      <div className="absolute w-full h-[1px] bg-current" />
      <div className="absolute w-[1px] h-full bg-current" />
    </div>
  );
};

export const GridLines = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Horizontal Lines */}
      <div className="absolute top-[10%] left-0 w-full h-[1px] bg-white/[0.05]" />
      {/* <div className="absolute top-[90%] left-0 w-full h-[1px] bg-white/[0.05]" /> */}

      {/* Vertical Lines */}
      <div className="absolute left-[10%] top-0 h-full w-[1px] bg-white/[0.05]" />
      <div className="absolute right-[10%] top-0 h-full w-[1px] bg-white/[0.05]" />

      {/* Intersections */}
      <PlusIcon className="absolute top-[10%] left-[10%] -translate-x-1/2 -translate-y-1/2" />
      <PlusIcon className="absolute top-[10%] right-[10%] translate-x-1/2 -translate-y-1/2" />
      <PlusIcon className="absolute top-[90%] left-[10%] -translate-x-1/2 translate-y-1/2" />
      <PlusIcon className="absolute top-[90%] right-[10%] translate-x-1/2 translate-y-1/2" />
    </div>
  );
};
