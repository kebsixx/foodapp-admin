"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Clock, Truck } from "lucide-react";
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
    icon: UtensilsCrossed,
    title: "Menu Berkualitas",
    description: "Nikmati hidangan lezat dengan bahan-bahan premium pilihan.",
  },
  {
    icon: Clock,
    title: "Pelayanan Cepat",
    description:
      "Pesanan Anda akan segera disiapkan oleh tim profesional kami.",
  },
  {
    icon: Truck,
    title: "Fleksibel Pengambilan",
    description:
      "Ambil langsung di cafe atau gunakan layanan pesan antar pihak ketiga pilihan Anda.",
  },
];

function Feature() {
  return (
    <section className="py-24" id="services">
      <h3 className="text-3xl font-bold mb-8 text-center dark:text-white">
        Layanan Kami
      </h3>
      <div className="lg:flex flex-row justify-center gap-8 items-center">
        {features.map((feature, index) => (
          <MotionWrapper key={index} delay={index * 0.1}>
            <Card className="mb-4 flex flex-col items-center dark:bg-gray-800/80 dark:border-gray-700 dark:shadow-lg dark:shadow-emerald-900/20 hover:dark:shadow-emerald-800/30 hover:-translate-y-3 transition-all duration-300">
              <CardContent className="p-6 flex flex-col gap items-center text-center max-w-md">
                <feature.icon className="h-12 w-12 mb-4 text-[#7FCD91] dark:text-emerald-500" />
                <h4 className="text-xl font-semibold mb-2 dark:text-white">
                  {feature.title}
                </h4>
                <p className="dark:text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          </MotionWrapper>
        ))}
      </div>
    </section>
  );
}

export default Feature;
