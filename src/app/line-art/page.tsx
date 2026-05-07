"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon } from "@/components/ui/GridLines";
import { Preloader } from "@/components/ui/Preloader";

type FilterMode = "edges" | "hatching" | "flow" | "dots";

export default function LineArtStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<FilterMode>("edges");
  const [threshold, setThreshold] = useState(30);
  const [lineLength, setLineLength] = useState(10);
  const [density, setDensity] = useState(2);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (image && canvasRef.current && sourceCanvasRef.current) {
      processImage();
    }
  }, [image, mode, threshold, lineLength, density]);

  const processImage = () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = canvasRef.current!;
      const sourceCanvas = sourceCanvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const sCtx = sourceCanvas.getContext("2d")!;

      // Set dimensions
      const maxWidth = 800;
      const scale = Math.min(1, maxWidth / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      sourceCanvas.width = canvas.width;
      sourceCanvas.height = canvas.height;

      // Draw source image to hidden canvas
      sCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = sCtx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Clear output
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;

      if (mode === "edges") {
        drawEdges(ctx, imageData, threshold);
      } else if (mode === "hatching") {
        drawHatching(ctx, imageData, density);
      } else if (mode === "flow") {
        drawFlow(ctx, imageData, threshold, lineLength, density);
      } else if (mode === "dots") {
        drawDots(ctx, imageData, density);
      }

      setIsProcessing(false);
    };
  };

  const getGrayscale = (data: Uint8ClampedArray, i: number) => {
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  };

  const drawEdges = (ctx: CanvasRenderingContext2D, imageData: ImageData, thresh: number) => {
    const { width, height, data } = imageData;
    ctx.beginPath();
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        
        // Sobel kernels
        const gx = 
          -1 * getGrayscale(data, ((y-1)*width + (x-1))*4) + 1 * getGrayscale(data, ((y-1)*width + (x+1))*4) +
          -2 * getGrayscale(data, (y*width + (x-1))*4) + 2 * getGrayscale(data, (y*width + (x+1))*4) +
          -1 * getGrayscale(data, ((y+1)*width + (x-1))*4) + 1 * getGrayscale(data, ((y+1)*width + (x+1))*4);

        const gy = 
          -1 * getGrayscale(data, ((y-1)*width + (x-1))*4) + -2 * getGrayscale(data, ((y-1)*width + x)*4) + -1 * getGrayscale(data, ((y-1)*width + (x+1))*4) +
           1 * getGrayscale(data, ((y+1)*width + (x-1))*4) +  2 * getGrayscale(data, ((y+1)*width + x)*4) +  1 * getGrayscale(data, ((y+1)*width + (x+1))*4);

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        if (magnitude > thresh) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + 1, y + 1);
        }
      }
    }
    ctx.stroke();
  };

  const drawHatching = (ctx: CanvasRenderingContext2D, imageData: ImageData, dens: number) => {
    const { width, height, data } = imageData;
    const step = Math.max(2, 12 - dens);
    ctx.beginPath();
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const gray = getGrayscale(data, i);
        if (gray < 200) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + step, y + step);
          if (gray < 100) {
            ctx.moveTo(x + step, y);
            ctx.lineTo(x, y + step);
          }
        }
      }
    }
    ctx.stroke();
  };

  const drawDots = (ctx: CanvasRenderingContext2D, imageData: ImageData, dens: number) => {
    const { width, height, data } = imageData;
    const step = Math.max(2, 12 - dens);
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const gray = getGrayscale(data, i);
        if (gray < 220) {
          const radius = (1 - gray / 255) * (step / 2);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "white";
          ctx.fill();
        }
      }
    }
  };

  const drawFlow = (ctx: CanvasRenderingContext2D, imageData: ImageData, thresh: number, len: number, dens: number) => {
    const { width, height, data } = imageData;
    const step = Math.max(2, 12 - dens);
    
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (y * width + x) * 4;
        const gray = getGrayscale(data, i);
        
        if (gray < 200) {
          const gx = getGrayscale(data, (y * width + (x + 1)) * 4) - getGrayscale(data, (y * width + (x - 1)) * 4);
          const gy = getGrayscale(data, ((y + 1) * width + x) * 4) - getGrayscale(data, ((y - 1) * width + x) * 4);
          const angle = Math.atan2(gx, -gy);
          
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(
            x + Math.cos(angle) * len * (1 - gray/255),
            y + Math.sin(angle) * len * (1 - gray/255)
          );
          ctx.stroke();
        }
      }
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "line-art.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-mono selection:bg-white selection:text-black p-8 md:p-20 relative overflow-hidden">
      <Preloader />
      
      <div className="fixed inset-0 grid-background pointer-events-none opacity-30" />
      <div className="fixed left-[5%] top-0 h-full w-[1px] bg-white/10" />
      <div className="fixed right-[5%] top-0 h-full w-[1px] bg-white/10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-500 mb-4 block">
              Image Processing // Studio
            </span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Line Art <br /> <span className="text-neutral-500">Studio</span>
            </h1>
          </motion.div>
          
          <div className="flex flex-col items-end">
            <label className="group relative cursor-pointer overflow-hidden border border-white/20 px-8 py-4 bg-white/5 hover:bg-white hover:text-black transition-all">
              <span className="relative z-10 uppercase font-bold tracking-widest text-sm">
                Upload Source
              </span>
              <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12">
          <div className="relative aspect-video bg-neutral-950 border border-white/5 flex items-center justify-center group overflow-hidden min-h-[400px]">
            <PlusIcon className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
            <PlusIcon className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2" />
            <PlusIcon className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
            <PlusIcon className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
            
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-700 text-center uppercase tracking-widest text-xs"
                >
                  No Image Loaded <br /> [Waiting for Input]
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative flex items-center justify-center"
                >
                  <canvas 
                    ref={canvasRef} 
                    className="max-w-full max-h-[70vh] shadow-2xl border border-white/10"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-xs tracking-[0.3em] uppercase animate-pulse text-white">Processing...</div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <canvas ref={sourceCanvasRef} className="hidden" />
          </div>

          <aside className="space-y-12">
            <section>
              <h2 className="text-[10px] text-neutral-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">
                Output Mode
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {(["edges", "hatching", "flow", "dots"] as FilterMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-3 text-[10px] uppercase font-bold tracking-widest border transition-all ${
                      mode === m ? "bg-white text-black border-white" : "border-white/10 text-neutral-500 hover:border-white/30"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-[10px] text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">
                Parameters
              </h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span>Sensitivity</span>
                  <span>{threshold}</span>
                </div>
                <input 
                  type="range" min="0" max="200" value={threshold} 
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                  <span>Line Density</span>
                  <span>{density}</span>
                </div>
                <input 
                  type="range" min="1" max="10" value={density} 
                  onChange={(e) => setDensity(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              {mode === "flow" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-tighter">
                    <span>Line Length</span>
                    <span>{lineLength}</span>
                  </div>
                  <input 
                    type="range" min="1" max="50" value={lineLength} 
                    onChange={(e) => setLineLength(Number(e.target.value))}
                    className="w-full accent-white"
                  />
                </div>
              )}
            </section>

            <button
              disabled={!image}
              onClick={downloadImage}
              className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Export Drawing
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
