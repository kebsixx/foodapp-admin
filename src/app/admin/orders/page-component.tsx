"use client";

import { useState } from "react";
import { format } from "date-fns";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { OrdersWithProducts } from "@/app/admin/orders/types";

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

type OrderedProducts = {
  order_id: number;
  product: number & {
    category: number;
    created_at: string;
    heroImage: string;
    id: number;
    imagesUrl: string[];
    maxQuantity: number;
    price: number;
    slug: string;
    title: string;
  };
}[];

export default function PageComponent({ ordersWithProducts }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>([]);

  const openProductsModal = (products: OrderedProducts) => {
    setSelectedProducts(products);
  };

  const OrderedProducts = ordersWithProducts.flatMap((order) =>
    order.order_items.map((item) => ({
      order_id: order.id,
      product: item.product,
    }))
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Page</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersWithProducts.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {format(new Date(order.created_at), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.description || `No Description`}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>Rp. {order.totalPrice.toFixed(3)}</TableCell>
              <TableCell>
                {order.order_items.length} order
                {order.order_items.length > 1 ? "s" : ""}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openProductsModal(
                          OrderedProducts.filter(
                            (item) => item.order_id === order.id
                          )
                        )
                      }>
                      View Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Products</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4">
                      {selectedProducts.map(({ product }, index) => (
                        <div
                          key={index}
                          className="mr-2 mb-2 flex items-center space-x-2">
                          <Image
                            className="w-16 h-16 object-cover rounded"
                            src={product.heroImage}
                            alt={product.title}
                            width={64}
                            height={64}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {product.title}
                            </span>
                            <span className="text-gray-600">
                              Rp. {product.price.toFixed(3)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Available Quantity: {product.maxQuantity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
