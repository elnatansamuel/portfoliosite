"use client";
import React, { useRef, useEffect, useState } from "react";

interface Props {
  src: string;
  className?: string;
  threshold?: number;
}

interface Point {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  px: number; // Physical current X
  py: number; // Physical current Y
  ox: number; // Original physical X (at load time)
  oy: number; // Original physical Y (at load time)
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
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef<number>();
  const dimensionsRef = useRef({ w: 0, h: 0 });

  // Build point cloud once at a fixed reference resolution
  const buildPoints = (img: HTMLImageElement): Point[] => {
    // We use a fixed scan width to keep the threshold consistent
    const scanWidth = 1000;
    const scanHeight = (img.naturalHeight / img.naturalWidth) * scanWidth;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = scanWidth;
    tempCanvas.height = scanHeight;
    const tCtx = tempCanvas.getContext("2d")!;
    tCtx.drawImage(img, 0, 0, scanWidth, scanHeight);
    const { data } = tCtx.getImageData(0, 0, scanWidth, scanHeight);

    const getGrayscale = (x: number, y: number) => {
      const i = (Math.floor(y) * scanWidth + Math.floor(x)) * 4;
      if (data[i + 3] < 10) return 0;
      return (data[i] + data[i + 1] + data[i + 2]) / 3;
    };

    const points: Point[] = [];
    const step = 2;

    for (let y = 1; y < scanHeight - 1; y += step) {
      for (let x = 1; x < scanWidth - 1; x += step) {
        const gx =
          -getGrayscale(x - 1, y - 1) +
          getGrayscale(x + 1, y - 1) +
          -2 * getGrayscale(x - 1, y) +
          2 * getGrayscale(x + 1, y) +
          -getGrayscale(x - 1, y + 1) +
          getGrayscale(x + 1, y + 1);
        const gy =
          -getGrayscale(x - 1, y - 1) -
          2 * getGrayscale(x, y - 1) -
          getGrayscale(x + 1, y - 1) +
          getGrayscale(x - 1, y + 1) +
          2 * getGrayscale(x, y + 1) +
          getGrayscale(x + 1, y + 1);

        if (Math.sqrt(gx * gx + gy * gy) > threshold) {
          points.push({
            x: x / scanWidth,
            y: y / scanHeight,
            px: 0,
            py: 0,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
    }
    return points;
  };

  // Initial load
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const basePoints = buildPoints(img);

      // Initialize points with current container dimensions
      const container = containerRef.current;
      if (container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        dimensionsRef.current = { w, h };

        basePoints.forEach((p) => {
          p.px = p.ox = p.x * w;
          p.py = p.oy = p.y * h;
        });
      }

      pointsRef.current = basePoints;
      setIsLoaded(true);
    };
  }, [src, threshold]);

  // Handle Resizing without re-scanning image
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!isLoaded || !canvasRef.current) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (w === 0 || h === 0) return;

      const canvas = canvasRef.current;
      canvas.width = w;
      canvas.height = h;
      dimensionsRef.current = { w, h };

      // Re-map points to new dimensions
      pointsRef.current.forEach((p) => {
        p.px = p.ox = p.x * w;
        p.py = p.oy = p.y * h;
        p.vx = 0;
        p.vy = 0; // Reset physics on big resize to prevent explosion
      });
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isLoaded]);

  const timeRef = useRef(0);

  // Animation loop
  useEffect(() => {
    if (!isLoaded) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const { w, h } = dimensionsRef.current;
      ctx.clearRect(0, 0, w, h);

      const splitScreenX = window.innerWidth / 2;
      const canvasScreenLeft = container.getBoundingClientRect().left;
      const mouse = mouseRef.current;
      timeRef.current += 0.015;

      const points = pointsRef.current;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];

        // Organic Wobble (Per-point phase based on index)
        const phase = i * 0.005;
        const baseWobbleSpeed = timeRef.current;
        const wobbleX = Math.sin(baseWobbleSpeed + phase) * 1.5; 
        const wobbleY = Math.cos(baseWobbleSpeed * 0.8 + phase) * 1.5;

        // Interaction
        const dx = mouse.x - p.px;
        const dy = mouse.y - p.py;
        const distSq = dx * dx + dy * dy;
        const radius = 160; 
        
        let interactionWobble = 1;
        if (distSq < radius * radius) {
          const dist = Math.sqrt(distSq);
          const force = (radius - dist) / radius;
          const angle = Math.atan2(dy, dx);
          
          // Repulsion force
          p.vx -= Math.cos(angle + 0.1) * force * 1.2;
          p.vy -= Math.sin(angle + 0.1) * force * 1.2;
          
          // Amplify wobble significantly near mouse
          interactionWobble = 1 + force * 5;
        }

        // Apply Wobble to the return-to-origin physics
        const targetX = p.ox + wobbleX * interactionWobble;
        const targetY = p.oy + wobbleY * interactionWobble;

        p.vx += (targetX - p.px) * 0.05;
        p.vy += (targetY - p.py) * 0.05;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.px += p.vx;
        p.py += p.vy;

        const dotScreenX = canvasScreenLeft + p.px;
        ctx.fillStyle = dotScreenX > splitScreenX ? "#000000" : "#FFFFFF";
        ctx.fillRect(Math.round(p.px), Math.round(p.py), 2, 2);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-neutral-500">
          Compiling Vector Field...
        </div>
      )}
    </div>
  );
};
