import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { getProducts } from "@/actions/products";

import ProductList from "@/components/product-list";
import Hero from "@/components/hero";
import Feature from "@/components/feature";
import Testimonial from "@/components/testimonial";
import Header from "@/components/HeaderClient";
import Footer from "@/components/FooterClient";
import FeedbackForm from "@/components/FeedbackForm";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-24">
          <Hero />
        </section>

        {/* Features Section */}
        <Feature />

        {/* Product Showcase Section */}
        <ProductList products={products} />

        {/* Promotion Application Section */}
        <section className="mb-12">
          <Card className="bg-[#7FCD91] dark:bg-emerald-700 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Download Cerita Senja Sekarang
              </h3>
              <p className="text-xl mb-6">
                Rasakan kemudahan memesan makanan dan minuman favoritmu.
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-0 md:flex-nowrap md:space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-green-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                  <Image
                    src="/google-play.png"
                    alt="Google Play"
                    className="mr-2 h-6 w-6"
                    height={24}
                    width={24}
                  />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonial Section */}
        <Testimonial />

        {/* Download App */}
        <section className="text-center mb-24">
          <h3 className="text-3xl font-bold mb-4 dark:text-white">
            Nikmati beragam pilihan makanan dan minuman lezat.
          </h3>
          <p className="text-xl  mb-8 dark:text-gray-300">
            Dari kopi spesial hingga hidangan utama yang menggugah selera, kami
            punya semuanya.
          </p>
          <a
            className="group relative inline-flex w-56 justify-center items-center overflow-hidden rounded-full bg-transparent border-2 border-[#7FCD91] px-8 py-3 text-[#7FCD91] focus:outline-none focus:ring active:bg-[#7FCD91] hover:bg-[#7FCD91] hover:text-white dark:border-emerald-600 dark:text-emerald-500 dark:hover:bg-emerald-600 dark:active:bg-emerald-600"
            href="#">
            <span className="absolute -end-full transition-all group-hover:end-4">
              <svg
                className="size-5 rtl:rotate-180 dark:text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>

            <span className="text-sm font-medium transition-all group-hover:me-4 dark:text-white">
              {" "}
              Coming Soon{" "}
            </span>
          </a>
        </section>

        {/* Feedback Form Section */}
        <FeedbackForm />
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
