"use client";

import React, { useState, useMemo } from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ProductsResponse } from "@/app/products.types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  products: ProductsResponse;
};

export const Content = ({ products }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter out adaptive icons and get up to 3 products per category
  const filteredProducts = useMemo(() => {
    const productsByCategory = products?.reduce((acc, product) => {
      // Skip products with adaptive icons
      if (product.heroImage.includes("adaptive-icon")) {
        return acc;
      }

      // Group products by category
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    }, {} as Record<number, ProductsResponse>);

    // To show up to 3 products per category for example:
    const selectedProducts = Object.values(productsByCategory || {}).flatMap(
      (categoryProducts) => categoryProducts.slice(0, 3)
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
    // Menghapus window.scrollTo() agar tidak scroll ke atas saat pindah halaman
  };

  return (
    <section className="mb-24">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 sm:py-12">
        <header className="text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Menu kami untuk Anda
          </h2>

          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Rasakan nikmatnya makanan dan minuman yang kami sajikan untuk Anda.
            Pilih menu favorit Anda dan nikmati kelezatannya.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentProducts?.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
              isPressable>
              <CardBody className="overflow-visible p-0">
                <Image
                  src={product.heroImage}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                  radius="lg"
                  shadow="sm"
                  width="100%"
                />
              </CardBody>
              <CardFooter className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-medium text-lg">{product.title}</h3>
                </div>
                <p className="text-default-500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price || 0)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </ul>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1
                        ? handlePageChange(currentPage - 1)
                        : undefined
                    }
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}>
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
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
};
export default function ProductList({ products }: Props) {
  return <Content products={products} />;
}
