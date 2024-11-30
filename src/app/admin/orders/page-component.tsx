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

import { OrdersWithProducts } from "@/app/admin/orders/types";

type Props = {
  ordersWIthProducts: OrdersWithProducts;
};

type OrderedProducts = {
  order_id: number;
  product: number & {
    category: number | null;
    created_at: string | null;
    description: string | null;
    id: number;
    imagesUrl: string[] | null;
    maxQuantity: number | null;
    price: number | null;
    slug: string | null;
    title: string | null;
  };
};

export default function PageComponent({ ordersWIthProducts }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>([]);

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
          {ordersWIthProducts.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {format(new Date(order.created_at), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{order.description || `No Description`}</TableCell>
              <TableCell>{order.user.email}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>{order.totalPrice.toFixed(2)}</TableCell>
              <TableCell>
                {order.order_item.length} order
                {order.order_item.length > 1 ? "s" : ""}
              </TableCell>
              <TableCell>
                <Button variant="outline">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
