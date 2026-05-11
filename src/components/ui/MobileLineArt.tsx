"use client";
import React, { useEffect, useRef } from "react";

interface Props {
  src: string;
  className?: string;
  threshold?: number;
}

export const MobileLineArt: React.FC<Props> = ({
  src,
  className,
  threshold = 20,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas size
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw and sample
      const offscreen = document.createElement("canvas");
      const scanWidth = 800;
      const scanHeight = (img.naturalHeight / img.naturalWidth) * scanWidth;
      offscreen.width = scanWidth;
      offscreen.height = scanHeight;
      const octx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      octx.drawImage(img, 0, 0, scanWidth, scanHeight);
      const imageData = octx.getImageData(0, 0, scanWidth, scanHeight);
      const data = imageData.data;

      const getGrayscale = (x: number, y: number) => {
        const i = (Math.floor(y) * scanWidth + Math.floor(x)) * 4;
        return (data[i] + data[i + 1] + data[i + 2]) / 3;
      };

      ctx.fillStyle = "#FFFFFF";
      const step = 2;
      const totalSteps = Math.floor(scanHeight / step);
      let currentStep = 0;

      const render = async () => {
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
              const px = (x / scanWidth) * canvas.width;
              const py = (y / scanHeight) * canvas.height;
              ctx.fillRect(px, py, 1.8, 1.8);
            }
          }

          currentStep++;
          if (currentStep % 10 === 0) {
            const progress = (currentStep / totalSteps) * 100;
            window.dispatchEvent(
              new CustomEvent("vector-progress", { detail: progress }),
            );
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
        window.dispatchEvent(new CustomEvent("vector-progress", { detail: 100 }));
        window.dispatchEvent(new CustomEvent("vector-field-ready"));
      };

      render();
    };
  }, [src, threshold]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
