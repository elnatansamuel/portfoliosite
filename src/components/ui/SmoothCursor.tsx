"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const SmoothCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isRightSide, setIsRightSide] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "hero" | "projects" | "about" | "experience" | "skills" | "footer"
  >("hero");
  const [hoveredButtonType, setHoveredButtonType] = useState<
    "projects" | "skills" | null
  >(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
      setIsRightSide(e.clientX > window.innerWidth / 2);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Image detection
      const isImg = target.tagName === "IMG" || target.closest("img");
      setIsHoveringImage(!!isImg);

      const isButtonOrLink =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.style.cursor === "pointer";

      if (isButtonOrLink) {
        setIsHovering(true);
        // Detect specific buttons in Hero
        const text = target.innerText?.toLowerCase() || "";
        if (text.includes("projects")) setHoveredButtonType("projects");
        else if (text.includes("skills")) setHoveredButtonType("skills");
      } else {
        setIsHovering(false);
        setHoveredButtonType(null);
      }
    };

    // Detect active section based on cursor position
    const updateActiveSection = () => {
      const sections = ["hero", "projects", "about", "experience", "skills", "footer"];
      const cursorY = mouseY.get();
      const cursorX = mouseX.get();

      // Find the section currently under the cursor
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (
            cursorY >= rect.top && 
            cursorY <= rect.bottom
          ) {
            setActiveSection(id as any);
            break;
          }
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", updateActiveSection);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("scroll", updateActiveSection); // Also update on scroll

    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", updateActiveSection);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("scroll", updateActiveSection);
      document.body.style.cursor = "auto";
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  const getCursorColor = () => {
    // 1. Hero Section Split (High Priority)
    if (activeSection === "hero" || !activeSection) {
      if (hoveredButtonType === "projects") return "#FFFFFF";
      if (hoveredButtonType === "skills") return "#000000";
      return isRightSide ? "#000000" : "#FFFFFF";
    }

    // 2. Experience & Projects (WHITE BG -> BLACK CURSOR)
    if (activeSection === "experience" || activeSection === "projects") {
      if (activeSection === "projects" && isHoveringImage) return "#FFFFFF"; 
      return "#000000";
    }

    // 3. About & Skills (BLACK BG -> WHITE CURSOR)
    if (activeSection === "about" || activeSection === "skills" || activeSection === "footer") {
      return "#FFFFFF";
    }

    return "#000000";
  };

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          x: smoothX,
          y: smoothY,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={{
            scale: isHovering ? 2.5 : isClicking ? 0.8 : 1,
            backgroundColor: getCursorColor(),
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <motion.div
          animate={{
            scale: isHovering ? 2 : 1,
            opacity: isHovering ? 0.2 : 0,
            backgroundColor: getCursorColor(),
          }}
          style={{
            position: "absolute",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          animate={{
            scale: isHovering ? 1.2 : 1,
            opacity: isHovering ? 0 : 0.4,
            borderColor: getCursorColor(),
          }}
          style={{
            position: "absolute",
            width: "30px",
            height: "30px",
            border: "1px solid",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        button,
        a {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};
