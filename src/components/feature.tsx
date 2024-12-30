"use client";

import React from "react";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Zap, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    icon: Gift,
    title: "Exclusive Deals",
    description: "Access app-only discounts and special offers.",
  },
];

function Feature() {
  return (
    <section className="mb-24">
      <h3 className="text-3xl font-bold mb-8 text-center">App Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <MotionWrapper key={index} delay={index * 0.1}>
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <feature.icon className="h-12 w-12  mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          </MotionWrapper>
        ))}
      </div>
    </section>
  );
}

export default Feature;
