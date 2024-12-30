"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ProductsWithCategoriesResponse } from "@/app/admin/products/products.types";

type Props = {
  products: ProductsWithCategoriesResponse;
};

export const ProductList = ({ products }: Props) => {
  return (
    <section className="mb-24">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 sm:py-12">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Product Collection
          </h2>

          <p className="mt-4 max-w-md text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque
            praesentium cumque iure dicta incidunt est ipsam, officia dolor
            fugit natus?
          </p>
        </header>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Showing <span> 4 </span> of 40
          </p>
        </div>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
              isPressable>
              <CardBody className="p-0">
                <Image
                  src={product.heroImage}
                  alt={product.title}
                  className="w-full h-48 object-fill"
                  radius="none"
                />
              </CardBody>
              <CardFooter className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-sm text-gray-500">
                    {product.category.name}
                  </p>
                </div>
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(product.price || 0)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </ul>

        <ol className="mt-8 flex justify-center gap-1 text-xs font-medium">
          <li>
            <a
              href="#"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100">
              <span className="sr-only">Prev Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block size-8 rounded border border-gray-100 text-center leading-8">
              1
            </a>
          </li>

          <li className="block size-8 rounded border-black bg-black text-center leading-8 text-white">
            2
          </li>

          <li>
            <a
              href="#"
              className="block size-8 rounded border border-gray-100 text-center leading-8">
              3
            </a>
          </li>

          <li>
            <a
              href="#"
              className="block size-8 rounded border border-gray-100 text-center leading-8">
              4
            </a>
          </li>

          <li>
            <a
              href="#"
              className="inline-flex size-8 items-center justify-center rounded border border-gray-100">
              <span className="sr-only">Next Page</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
};
