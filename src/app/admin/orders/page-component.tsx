"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Search } from "lucide-react";

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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { OrdersWithProducts } from "@/app/admin/orders/types";
import { updateOrderStatus } from "@/actions/orders";
import { cn } from "@/lib/utils";

const statusOptions = [
  "Pending",
  "On Review",
  "Process",
  "Completed",
  "Cancelled",
];

const PICKUP_METHOD_LABELS = {
  pickup: "Ambil ditempat",
  delivery: "Jasa Antar",
} as const;

type Props = {
  ordersWithProducts: OrdersWithProducts;
};

type OrderedProducts = {
  order_id: number;
  product: {
    category: number;
    created_at: string;
    heroImage: string;
    id: number;
    maxQuantity: number;
    price: number | null;
    slug: string;
    title: string;
    variants?: any;
  };
}[];

const statusStyles = {
  Process: "bg-[#81C784]",
  Completed: "bg-[#4CAF50]",
  "On Review": "bg-[#FFA726]",
  Pending: "bg-[#FF5722] animate-pulse",
  Cancelled: "bg-[#FF0000]",
} as const;

const StatusIndicator = ({ status }: { status: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (status === "Pending" && audioRef.current) {
      const playSound = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {
            // Handle any autoplay restrictions
          });
        }
      };

      const interval = setInterval(playSound, 1000); // Beep every 2 seconds
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-3 w-3 rounded-full",
          statusStyles[status as keyof typeof statusStyles]
        )}
      />
      {status === "Pending" && (
        <audio
          ref={audioRef}
          src="/sounds/notification.mp3"
          className="hidden"
        />
      )}
    </div>
  );
};

export default function PageComponent({ ordersWithProducts }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState(ordersWithProducts);

  useEffect(() => {
    const filtered = ordersWithProducts.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        order.slug.toLowerCase().includes(searchLower) ||
        (order.user?.name?.toLowerCase() || "").includes(searchLower) ||
        (order.user?.phone?.toLowerCase() || "").includes(searchLower)
      );
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, ordersWithProducts]);

  // Update the pagination calculation to use filteredOrders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openProductsModal = (products: OrderedProducts) => {
    setSelectedProducts(products);
  };

  const OrderedProducts = ordersWithProducts.flatMap((order) =>
    order.order_items.map((item) => ({
      order_id: order.id,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.title,
            price: item.product.price || 0,
            image: item.product.heroImage,
            category: item.product.category,
          }
        : {
            price: 0,
          },
    }))
  );

  const handleStatusChange = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5; // Number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
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

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
            isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const itemsPerPageOptions = ["5", "10", "20", "50"];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Page</h1>
        <div className="w-96">
          <Command className="border rounded-lg">
            <CommandInput
              placeholder="Search orders..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {searchQuery && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {filteredOrders.slice(0, 5).map((order) => (
                    <CommandItem
                      key={order.id}
                      value={order.slug}
                      onSelect={() => setSearchQuery(order.slug)}>
                      <Search className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{order.slug}</span>
                        <span className="text-sm text-muted-foreground">
                          {order.user.name} - {order.user.phone}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
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
                <div className="flex items-center gap-2">
                  <StatusIndicator status={order.status} />
                  <Select
                    onValueChange={(value) =>
                      handleStatusChange(order.id, value)
                    }
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
                </div>
              </TableCell>
              <TableCell>{order.description || `No Description`}</TableCell>
              {/* @ts-ignore */}
              <TableCell>{order.user.name}</TableCell>
              <TableCell>{order.user.phone}</TableCell>
              <TableCell>{order.slug}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(order.totalPrice)}
              </TableCell>
              <TableCell>
                {order.order_items.length} Product
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
                          order.order_items.map((item) => ({
                            order_id: order.id,
                            product: item.product,
                            quantity: item.quantity,
                          }))
                        )
                      }>
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
                      {/* Order Information */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">
                            Order Information
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Order ID:</span>{" "}
                              {order.slug}
                            </p>
                            <p>
                              <span className="font-medium">Date:</span>{" "}
                              {format(
                                new Date(order.created_at),
                                "dd/MM/yyyy HH:mm"
                              )}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              {order.status}
                            </p>
                            <p>
                              <span className="font-medium">Total Amount:</span>{" "}
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(order.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">
                            Customer Information
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Name:</span>{" "}
                              {order.user.name}
                            </p>
                            <p>
                              <span className="font-medium">Phone:</span>{" "}
                              {order.user.phone}
                            </p>
                            <p>
                              <span className="font-medium">
                                Payment Method:
                              </span>{" "}
                              {order.pickup_method
                                ? PICKUP_METHOD_LABELS[
                                    order.pickup_method as keyof typeof PICKUP_METHOD_LABELS
                                  ]
                                : "Not specified"}
                            </p>
                            <p>
                              <span className="font-medium">Notes:</span>{" "}
                              {order.description || "No notes"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Proof */}
                      {order.payment_proof && (
                        <div>
                          <h3 className="font-semibold mb-2">Payment Proof</h3>
                          <Image
                            src={order.payment_proof}
                            alt="Payment Proof"
                            width={300}
                            height={200}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}

                      {/* Ordered Products */}
                      <div>
                        <h3 className="font-semibold mb-2">Ordered Products</h3>
                        <div className="grid gap-4">
                          {selectedProducts.map(({ product }, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4 p-3 border rounded-lg">
                              <Image
                                className="w-20 h-20 object-cover rounded"
                                src={product.heroImage}
                                alt={product.title}
                                width={80}
                                height={80}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  {product.title}
                                </h4>
                                <p className="text-gray-600">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(product.price || 0)}{" "}
                                  {/* Handle price yang mungkin null */}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Available Quantity: {product.maxQuantity}
                                </p>
                                {product.variants && (
                                  <p className="text-sm text-gray-500">
                                    Variants: {JSON.stringify(product.variants)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Items per page:</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
