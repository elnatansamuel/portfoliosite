"use client";
import React, { useRef, useEffect, useState } from "react";

interface Props {
  src: string;
  className?: string;
  threshold?: number;
}

interface Point {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

export const ExactLineArt: React.FC<Props> = ({
  src,
  className,
  threshold = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const parent = containerRef.current;
      if (!parent) return;

      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      canvas.width = width;
      canvas.height = height;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tCtx = tempCanvas.getContext("2d")!;
      tCtx.drawImage(img, 0, 0, width, height);
      const imageData = tCtx.getImageData(0, 0, width, height);
      const { data } = imageData;

      const getGrayscale = (x: number, y: number) => {
        const i = (Math.floor(y) * width + Math.floor(x)) * 4;
        if (data[i + 3] < 10) return 0;
        return (data[i] + data[i + 1] + data[i + 2]) / 3;
      };

      const points: Point[] = [];
      const step = 2;

      for (let y = 1; y < height - 1; y += step) {
        for (let x = 1; x < width - 1; x += step) {
          const gx =
            -1 * getGrayscale(x - 1, y - 1) +
            1 * getGrayscale(x + 1, y - 1) +
            -2 * getGrayscale(x - 1, y) +
            2 * getGrayscale(x + 1, y) +
            -1 * getGrayscale(x - 1, y + 1) +
            1 * getGrayscale(x + 1, y + 1);

          const gy =
            -1 * getGrayscale(x - 1, y - 1) +
            -2 * getGrayscale(x, y - 1) +
            -1 * getGrayscale(x + 1, y - 1) +
            1 * getGrayscale(x - 1, y + 1) +
            2 * getGrayscale(x, y + 1) +
            1 * getGrayscale(x + 1, y + 1);

          const magnitude = Math.sqrt(gx * gx + gy * gy);

          if (magnitude > threshold) {
            points.push({
              x: x,
              y: y,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      pointsRef.current = points;
      setIsLoaded(true);

      let animationFrame: number;
      const animate = () => {
        ctx.clearRect(0, 0, width, height);

        const mouse = mouseRef.current;

        for (let i = 0; i < pointsRef.current.length; i++) {
          const p = pointsRef.current[i];

          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const force = (120 - dist) / 120;
            const angle = Math.atan2(dy, dx);

            // Smoother repulsion + slight swirl
            p.vx -= Math.cos(angle + 0.2) * force * 3;
            p.vy -= Math.sin(angle + 0.2) * force * 3;
          }

          // Return to home with damping
          p.vx += (p.ox - p.x) * 0.08;
          p.vy += (p.oy - p.y) * 0.08;

          p.vx *= 0.92;
          p.vy *= 0.92;

          p.x += p.vx;
          p.y += p.vy;

          // Color Inversion based on absolute screen X
          const absoluteX = parent.getBoundingClientRect().left + p.x;
          const isOnRightSide = absoluteX > window.innerWidth / 2;
          ctx.fillStyle = isOnRightSide ? "#000000" : "#FFFFFF";

          // Brighter points (slightly larger + shadow for glow feel)
          ctx.fillRect(p.x, p.y, 1.5, 1.5);
        }

        animationFrame = requestAnimationFrame(animate);
      };

      animate();
      return () => cancelAnimationFrame(animationFrame);
    };
  }, [src, threshold]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-800">
          Compiling Vector Field...
        </div>
      )}
    </div>
  );
};
