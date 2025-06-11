"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Search, FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { OrdersWithProducts, OrderItem } from "@/app/admin/orders/types";
import { updateOrderStatus } from "@/actions/orders";

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
  id: number;
  quantity: number;
  order_id: number;
  product: any;
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
  const [filteredOrders, setFilteredOrders] = useState<OrdersWithProducts>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPageOptions = ["5", "10", "20", "50"];

  useEffect(() => {
    const filtered = ordersWithProducts.filter((order) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        order.slug.toLowerCase().includes(searchLower) ||
        (order.user?.name?.toLowerCase() || "").includes(searchLower) ||
        (order.user?.phone?.toLowerCase() || "").includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchQuery, ordersWithProducts, statusFilter]);

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

  // Filter content for mobile
  const FilterContent = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Filter by Status</h4>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Items per page</h4>
        <Select
          value={String(itemsPerPage)}
          onValueChange={handleItemsPerPageChange}>
          <SelectTrigger>
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

      <Button
        className="w-full mt-4"
        onClick={() => setIsMobileFiltersOpen(false)}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Orders Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by order ID, customer name, or phone..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={`${itemsPerPage} per page`} />
                </SelectTrigger>
                <SelectContent>
                  {itemsPerPageOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile filter button */}
            <Sheet
              open={isMobileFiltersOpen}
              onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Order ID</TableHead>
                <TableHead className="whitespace-nowrap hidden sm:table-cell">
                  Date
                </TableHead>
                <TableHead className="whitespace-nowrap">Customer</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">
                  Contact
                </TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">
                  Method
                </TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== "all"
                      ? "No orders found matching your criteria"
                      : "No orders available yet"}
                  </TableCell>
                </TableRow>
              ) : (
                currentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <StatusIndicator status={order.status} />
                        <span className="text-xs sm:text-sm">
                          #{order.slug}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs sm:text-sm whitespace-nowrap">
                      {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm">
                      {order.user?.name || "Guest"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                      {order.user?.phone || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100">
                        {PICKUP_METHOD_LABELS[
                          order.pickup_method as keyof typeof PICKUP_METHOD_LABELS
                        ] || order.pickup_method}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order.id, value)
                        }>
                        <SelectTrigger className="w-[110px] h-8 text-xs">
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() =>
                              openProductsModal(
                                order.order_items.map((item) => ({
                                  id: item.id,
                                  quantity: item.quantity,
                                  order_id: order.id,
                                  product: item.product,
                                }))
                              )
                            }>
                            <span className="hidden sm:inline mr-1">View</span>{" "}
                            Items
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order #{order.slug}</DialogTitle>
                            <DialogDescription>
                              Ordered on{" "}
                              {format(
                                new Date(order.created_at),
                                "dd MMMM yyyy, HH:mm"
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div>
                              <h3 className="font-medium mb-2">
                                Customer Information
                              </h3>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-500">Name</p>
                                  <p>{order.user?.name || "Guest"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Phone</p>
                                  <p>{order.user?.phone || "-"}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-gray-500">Address</p>
                                  <p>{order.user?.address || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Method</p>
                                  <p>
                                    {PICKUP_METHOD_LABELS[
                                      order.pickup_method as keyof typeof PICKUP_METHOD_LABELS
                                    ] || order.pickup_method}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Status</p>
                                  <p>{order.status}</p>
                                </div>
                              </div>
                            </div>

                            {/* Payment Proof Section */}
                            {order.payment_proof && (
                              <div>
                                <h3 className="font-medium mb-2">
                                  Payment Proof
                                </h3>
                                <div className="border rounded-md p-3 flex flex-col items-center">
                                  <div className="max-h-[300px] overflow-auto">
                                    <a
                                      href={order.payment_proof}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block">
                                      <Image
                                        src={order.payment_proof}
                                        alt="Payment proof"
                                        width={300}
                                        height={200}
                                        className="rounded-md object-contain w-auto"
                                      />
                                    </a>
                                  </div>
                                  <div className="mt-2 text-xs text-gray-500">
                                    Click image to view full size
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              <h3 className="font-medium mb-2">Order Items</h3>
                              <div className="border rounded-md">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Product</TableHead>
                                      <TableHead className="text-right">
                                        Quantity
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Price
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.order_items.map((item, i) => {
                                      // Determine the correct price to display
                                      const itemPrice =
                                        (item as any).price || // Direct price on the item
                                        (item as any).variant_price || // Variant price
                                        item.product?.price || // Product price
                                        0; // Fallback

                                      return (
                                        <TableRow key={i}>
                                          <TableCell>
                                            <div className="flex items-center gap-2">
                                              {item.product?.heroImage && (
                                                <Image
                                                  src={item.product.heroImage}
                                                  alt={
                                                    item.product?.title || ""
                                                  }
                                                  width={40}
                                                  height={40}
                                                  className="rounded-md object-cover"
                                                />
                                              )}
                                              <div>
                                                <p className="font-medium">
                                                  {item.product?.title}
                                                </p>
                                                {(item as any).variant_name && (
                                                  <p className="text-xs text-gray-500">
                                                    {(item as any).variant_name}
                                                  </p>
                                                )}
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {item.quantity}
                                          </TableCell>
                                          <TableCell className="text-right">
                                            Rp{" "}
                                            {itemPrice.toLocaleString("id-ID")}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                    <TableRow>
                                      <TableCell
                                        colSpan={2}
                                        className="font-medium text-right">
                                        Total
                                      </TableCell>
                                      <TableCell className="font-bold text-right">
                                        Rp{" "}
                                        {order.order_items
                                          .reduce((sum, item) => {
                                            const itemPrice =
                                              (item as any).price ||
                                              (item as any).variant_price ||
                                              item.product?.price ||
                                              0;
                                            return (
                                              sum + itemPrice * item.quantity
                                            );
                                          }, 0)
                                          .toLocaleString("id-ID")}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
            <span className="text-sm text-gray-500 text-center sm:text-left">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </span>

            <div className="flex-1 flex justify-center">
              <Pagination>
                <PaginationContent className="flex flex-wrap justify-center gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* On mobile, show only current page */}
                  <div className="sm:hidden flex items-center gap-1">
                    <PaginationItem>
                      <PaginationLink href="#" isActive={true}>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <span className="text-sm text-gray-500">
                      of {totalPages}
                    </span>
                  </div>

                  {/* On desktop, show pagination numbers */}
                  <div className="hidden sm:flex">
                    {generatePaginationItems()}
                  </div>

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
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

            <div className="hidden sm:flex items-center gap-2 justify-end">
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
          </div>
        )}
      </div>
    </main>
  );
}
