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

const MotionWrapper = ({ children, delay = 0 }: MotionWrapperProps) => {
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}>
    {children}
  </motion.div>;
};

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-indigo-300">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cerita Senja</h1>
      </header>
    </div>
  );
}
