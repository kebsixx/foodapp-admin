"use client";

import React from "react";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
}

const MotionWrapper = ({ children, delay = 0 }: MotionWrapperProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}>
    {children}
  </motion.div>
);

function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    setRotate({ rotateX, rotateY });
  };

  return (
    <div className="flex flex-col justify-between md:flex-row items-center">
      <div className="md:w-1/2 mb-8 md:mb-0">
        <MotionWrapper>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Nikmati kelezatan Cerita Senja di mana saja, kapan saja!
          </h2>
        </MotionWrapper>
        <MotionWrapper delay={0.2}>
          <p className="text-xl  mb-6">
            Pesan makanan dan minuman favoritmu dengan mudah melalui aplikasi
            kami.
          </p>
        </MotionWrapper>
        <MotionWrapper delay={0.4}>
          <a className="group relative inline-block focus:outline-none focus:ring">
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#7FCD91] transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

            <span className="relative inline-block border-2 border-current px-8 py-3 text-sm font-bold uppercase tracking-widest text-black group-active:text-opacity-75 dark:text-white">
              Download
            </span>
          </a>
        </MotionWrapper>
      </div>

      <div className="w-full md:w-1/3">
        <motion.div
          className="relative"
          style={{ perspective: 1000 }}
          animate={{
            rotateX: isHovered ? rotate.rotateX : 0,
            rotateY: isHovered ? rotate.rotateY : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onMouseMove={handleMouseMove}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}>
          <Image
            width={1920}
            height={1080}
            src="/app-pics.png"
            alt="Cerita Senja App Screenshot"
            className="rounded-3xl object-cover shadow-2xl mx-auto h-[550px] w-[270px]"
          />
          <Badge className="absolute top-4 right-4 bg-[#7FCD91] text-white">
            New Release
          </Badge>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
