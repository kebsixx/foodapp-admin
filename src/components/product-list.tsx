"use client";

import React, { useState, useMemo } from "react";

import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { ProductsResponse } from "@/app/products.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SafeImage } from "@/components/ui/SafeImage";

type Props = {
  products: ProductsResponse;
};

export const Content = ({ products }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter out products with invalid images and get up to 2 products per category
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const productsByCategory = products.reduce((acc, product) => {
      // Skip products with invalid or missing images
      if (
        !product.heroImage ||
        product.heroImage.includes("adaptive-icon") ||
        product.heroImage === "" ||
        product.heroImage === "undefined"
      ) {
        return acc;
      }

      // Group products by category
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<number, ProductsResponse>);

    // Show up to 2 products per category
    const selectedProducts = Object.values(productsByCategory || {}).flatMap(
      (categoryProducts) => categoryProducts.slice(0, 2)
    );

    return selectedProducts;
  }, [products]);

  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts?.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Function untuk mendapatkan display image dengan fallback
  const getDisplayImage = (product: any) => {
    return {
      primary:
        product.heroImageUrls?.medium ||
        product.heroImageUrls?.display ||
        product.heroImage,
      fallback: product.heroImage,
    };
  };

  return (
    <section id="menu">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 sm:py-24">
        <header className="text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Menu kami untuk Anda
          </h2>

          <p className="mx-auto mt-4 max-w-md text-gray-500 dark:text-gray-300">
            Rasakan nikmatnya makanan dan minuman yang kami sajikan untuk Anda.
            Pilih menu favorit Anda dan nikmati kelezatannya.
          </p>
        </header>

        {currentProducts && currentProducts.length > 0 ? (
          <>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {currentProducts.map((product) => {
                const imageUrls = getDisplayImage(product);

                return (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700 hover:scale-105 cursor-pointer"
                    isPressable>
                    <CardBody className="overflow-visible p-0">
                      <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                        <SafeImage
                          src={imageUrls.primary}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-110"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          fallbackSrc={imageUrls.fallback}
                          onError={() => {
                            // Only log critical errors
                            if (!imageUrls.fallback) {
                              console.error(
                                "Failed to load product image:",
                                product.title
                              );
                            }
                          }}
                        />

                        {/* Overlay gradient for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </CardBody>
                    <CardFooter className="flex justify-between items-center p-4 dark:text-white">
                      <div className="flex-1">
                        <h3
                          className="font-medium text-lg truncate"
                          title={product.title}>
                          {product.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-default-500 dark:text-emerald-400 font-semibold">
                          {product.price ? (
                            new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(product.price)
                          ) : (
                            <span className="text-sm text-gray-400">
                              Price varies
                            </span>
                          )}
                        </p>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent className="dark:text-white">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1
                            ? handlePageChange(currentPage - 1)
                            : undefined
                        }
                        aria-disabled={currentPage === 1}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={currentPage === index + 1}
                          className={
                            currentPage === index + 1
                              ? "dark:bg-emerald-700 dark:text-white cursor-pointer"
                              : "dark:hover:bg-gray-700 cursor-pointer"
                          }>
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          currentPage < totalPages
                            ? handlePageChange(currentPage + 1)
                            : undefined
                        }
                        aria-disabled={currentPage === totalPages}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="mt-8 text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-lg">
              <p>Belum ada menu yang tersedia</p>
              <p className="text-sm mt-2">Menu akan segera hadir untuk Anda!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default function ProductList({ products }: Props) {
  return <Content products={products} />;
}
