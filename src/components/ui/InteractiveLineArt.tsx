"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  src: string;
  className?: string;
}

export const InteractiveLineArt: React.FC<Props> = ({ src, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      const parent = containerRef.current;
      if (!parent) return;

      const scale = 2; // High DPI
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(scale, scale);

      // Extract image data
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 100; // Small resolution for processing
      tempCanvas.height = 100;
      const tCtx = tempCanvas.getContext("2d")!;
      tCtx.drawImage(img, 0, 0, 100, 100);
      const imageData = tCtx.getImageData(0, 0, 100, 100);
      const data = imageData.data;

      const getLuminance = (x: number, y: number) => {
        const i = (Math.floor(y) * 100 + Math.floor(x)) * 4;
        return (data[i] + data[i + 1] + data[i + 2]) / 3;
      };

      let animationFrame: number;
      const particles: any[] = [];
      const particleCount = 1500;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          history: [] as { x: number; y: number }[],
        });
      }

      const animate = () => {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, width, height);

        particles.forEach((p) => {
          const imgX = (p.x / width) * 100;
          const imgY = (p.y / height) * 100;
          const lum = getLuminance(imgX, imgY);

          // Flow based on image luminance (move towards darker areas)
          const angle = (lum / 255) * Math.PI * 2;
          const speed = (1 - lum / 255) * 2 + 0.5;

          // Mouse interaction
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, (100 - dist) / 100);

          p.vx += Math.cos(angle) * speed + (dx / dist) * force * 5;
          p.vy += Math.sin(angle) * speed + (dy / dist) * force * 5;

          p.vx *= 0.9;
          p.vy *= 0.9;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap around
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          // Draw line
          ctx.beginPath();
          ctx.moveTo(p.x - p.vx, p.y - p.vy);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle =
            dist < 100
              ? `rgba(255, 255, 255, ${0.8 * (1 - lum / 255)})`
              : `rgba(255, 255, 255, ${0.3 * (1 - lum / 255)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        animationFrame = requestAnimationFrame(animate);
      };

      animate();
      setIsLoaded(true);

      return () => cancelAnimationFrame(animationFrame);
    };
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-crosshair bg-black border border-white/10 ${className}`}
    >
      <canvas ref={canvasRef} className="block" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-500 animate-pulse">
          Initializing Vector Field...
        </div>
      )}
    </div>
  );
};
