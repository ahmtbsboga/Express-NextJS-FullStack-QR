"use client"; // Bu şart çünkü window kullanıyoruz

import React, { useEffect, useState } from "react";

const ScrollBackground = () => {
  const [bgColor, setBgColor] = useState("bg-white");
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY > 300) {
        setBgColor("bg-sky-500");
      } else {
        setBgColor("bg-sky-600");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full -z-10 transition-colors duration-500 ${bgColor}`}
    />
  );
};

export default ScrollBackground;
