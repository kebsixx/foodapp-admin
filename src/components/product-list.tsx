"use client";

import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { ProductsResponse } from "@/app/products.types";

type Props = {
  products: ProductsResponse;
};

export const Content = ({ products }: Props) => {
  return (
    <section className="mb-24">
      <div className="mx-auto max-w-full px-4 py-8 sm:px-6 sm:py-12">
        <header className="text-center">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Menu kami untuk Anda
          </h2>

          <p className="mx-auto mt-4 max-w-md text-gray-500">
            Rasakan nikmatnya makanan dan minuman yang kami sajikan untuk Anda.
            Pilih menu favorit Anda dan nikmati kelezatannya.
          </p>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product) => (
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
      </div>
    </section>
  );
};

export default function ProductList({ products }: Props) {
  return <Content products={products} />;
}
