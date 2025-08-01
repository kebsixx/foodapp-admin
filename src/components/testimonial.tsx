"use client";

import React, { useEffect, useState } from "react";

interface Testimonial {
  id: number;
  name: string;
  comment: string;
  initialDate: string;
}

const TestimonialGrid = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Format relative date function
  const formatRelativeDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/testimonials.json");
        const data = await response.json();

        const processedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          comment: item.comment,
          initialDate: item.initialDate,
        }));

        setTestimonials(processedData);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        // Sample data for demonstration
        setTestimonials([
          {
            id: 1,
            name: "Sarah Johnson",
            comment:
              "The experience was phenomenal every step of the way. The attention to detail and customer service exceeded our expectations significantly.",
            initialDate: "2024-01-15",
          },
          {
            id: 2,
            name: "Michael Chen",
            comment:
              "Outstanding performance team! Understanding and can create innovative design that brought our vision to reality.",
            initialDate: "2024-01-10",
          },
          {
            id: 3,
            name: "Emily Rodriguez",
            comment:
              "Exceptional work quality and professionalism. They deliver exactly what we needed with excellent timing and execution.",
            initialDate: "2024-01-08",
          },
          {
            id: 4,
            name: "David Park",
            comment:
              "From concept to execution, their team delivered excellence that surpassed our highest expectations for this project.",
            initialDate: "2024-01-05",
          },
          {
            id: 5,
            name: "Lisa Thompson",
            comment:
              "A refreshing and imaginative agency that understands our brand and consistently delivers outstanding results.",
            initialDate: "2024-01-03",
          },
          {
            id: 6,
            name: "Alex Kumar",
            comment:
              "Their team worked like true strategic experts and delivered innovative solutions for our creative partner.",
            initialDate: "2024-01-01",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse"></div>
          </div>
          <div className="flex space-x-6 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 bg-white" id="testimonials">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Apa yang mereka katakan?
          </h2>
          <p className="text-xl text-gray-600 font-medium">
            Baca Ulasan dari pelanggan kami yang puas dengan layanan kami.
          </p>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="relative overflow-hidden">
          {/* Left Gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

          {/* Right Gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex space-x-6 animate-scroll-continuous scrollbar-hide py-6 w-max">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 h-auto w-80 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden flex flex-col">
                {/* Quote Icon */}
                <div className="p-6 pb-4 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg
                        fill="#7FCD91"
                        viewBox="0 0 32 32"
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <path d="M6.67,26.06c.09,0,8.77-.14,8.77-11.89A7.22,7.22,0,1,0,5.67,20.9v4.16A1,1,0,0,0,6.67,26.06ZM3,14.17a5.22,5.22,0,1,1,10.44,0c0,7.5-3.88,9.31-5.77,9.75V20.17a1,1,0,0,0-.75-1A5.21,5.21,0,0,1,3,14.17Z"></path>{" "}
                          <path d="M22.22,26.06c.09,0,8.78-.14,8.78-11.89a7.22,7.22,0,1,0-9.78,6.73v4.16A1,1,0,0,0,22.22,26.06ZM18.56,14.17a5.22,5.22,0,1,1,10.44,0c0,7.5-3.89,9.31-5.78,9.75V20.17a1,1,0,0,0-.75-1A5.21,5.21,0,0,1,18.56,14.17Z"></path>{" "}
                        </g>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">
                      {formatRelativeDate(testimonial.initialDate)}
                    </span>
                  </div>

                  {/* Comment - Only render if comment exists and is not empty */}
                  {testimonial.comment && testimonial.comment.trim() && (
                    <p className="text-gray-700 leading-relaxed font-medium text-sm">
                      {testimonial.comment}
                    </p>
                  )}
                </div>

                {/* Author Info */}
                <div className="px-6 pb-6 mt-auto">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {testimonial.name}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes scroll-continuous {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-continuous {
          animation: scroll-continuous 60s linear infinite;
        }

        .animate-scroll-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TestimonialGrid;
