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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { OrdersWithProducts } from "@/app/admin/orders/types";
import { updateOrderStatus } from "@/actions/orders";

const statusOptions = ["Pending", "On Review", "Process", "Completed"];

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(ordersWithProducts.length / itemsPerPage);
  const currentOrders = ordersWithProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openProductsModal = (products: OrderedProducts) => {
    setSelectedProducts(products);
  };

  const OrderedProducts = ordersWithProducts.flatMap((order) =>
    order.order_items.map((item) => ({
      order_id: order.id,
      product: item.product,
    }))
  );

  const handleStatusChange = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const generatePaginationItems = () => {
    let items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(i);
            }}
            isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Page</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {format(new Date(order.created_at), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                  defaultValue={order.status}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue>{order.status}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{order.description || `No Description`}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(order.totalPrice)}
              </TableCell>
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
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(product.price)}
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

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {generatePaginationItems()}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
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
    </div>
  );
}
