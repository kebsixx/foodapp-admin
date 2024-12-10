"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  Smartphone,
  Zap,
  ShoppingCart,
  Gift,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const features = [
  {
    icon: Smartphone,
    title: "User-Friendly Interface",
    description: "Intuitive design for effortless navigation and shopping.",
  },
  {
    icon: Zap,
    title: "Lightning-Fast Search",
    description:
      "Find the perfect gadget in seconds with our powerful search engine.",
  },
  {
    icon: ShoppingCart,
    title: "Secure Checkout",
    description: "Shop with confidence using our encrypted payment system.",
  },
  {
    icon: Gift,
    title: "Exclusive Deals",
    description: "Access app-only discounts and special offers.",
  },
];

const testimonials = [
  {
    name: "John Doe",
    comment:
      "GadgetApp has revolutionized how I shop for tech. It's so convenient!",
  },
  {
    name: "Jane Doe",
    comment:
      "The exclusive deals on this app are unbeatable. I've saved so much!",
  },
];

export default function Home() {
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
    <div className="min-h-screen">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cerita Senja</h1>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-24">
          <div className="flex flex-col justify-between md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <MotionWrapper>
                <h2 className="text-4xl md:text-6xl font-bold mb-4">
                  Nikmati kelezatan Cerita Senja di mana saja, kapan saja!
                </h2>
              </MotionWrapper>
              <MotionWrapper delay={0.2}>
                <p className="text-xl  mb-6">
                  Nikmati kelezatan Cerita Senja di mana saja, kapan saja!
                </p>
              </MotionWrapper>
              <MotionWrapper delay={0.4}>
                <Button size="lg" className="bg-[#1BC464] hover:bg-[#1bc464d7]">
                  Download Now <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </MotionWrapper>
            </div>

            <div className="w-1/3">
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
                <Badge className="absolute top-4 right-4 bg-[#1bc464] text-white">
                  New Release
                </Badge>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <h3 className="text-3xl font-bold mb-8 text-center">App Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <MotionWrapper key={index} delay={index * 0.1}>
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <feature.icon className="h-12 w-12  mb-4" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
