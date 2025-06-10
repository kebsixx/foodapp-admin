"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search, FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Props = {
  customerFeedbacks: {
    id: string;
    user_email: string | null;
    name: string | null;
    status: string | null;
    feedback: string;
    created_at: string;
  }[];
};

export default function PageComponent({ customerFeedbacks }: Props) {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(customerFeedbacks);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const filtered = customerFeedbacks.filter((feedback) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        (feedback.user_email?.toLowerCase() || "").includes(searchLower) ||
        (feedback.name?.toLowerCase() || "").includes(searchLower) ||
        feedback.feedback.toLowerCase().includes(searchLower);
      
      const matchesStatus = 
        statusFilter === "all" || 
        feedback.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  }, [searchQuery, customerFeedbacks, statusFilter]);

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const currentFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

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
  const statusOptions = ["pending", "resolved", "no status"];

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
            <SelectItem value="all">All Feedbacks</SelectItem>
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
        onClick={() => setIsMobileFiltersOpen(false)}
      >
        Apply Filters
      </Button>
    </div>
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">
              Customer Feedbacks
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by name, email, or feedback..."
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
                  <SelectItem value="all">All Feedbacks</SelectItem>
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
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
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
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFeedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchQuery || statusFilter !== "all"
                      ? "No feedbacks found matching your criteria"
                      : "No feedbacks available yet"}
                  </TableCell>
                </TableRow>
              ) : (
                currentFeedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="whitespace-nowrap text-xs sm:text-sm">
                      {format(new Date(feedback.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{feedback.name || "Anonymous"}</TableCell>
                    <TableCell className="hidden md:table-cell">{feedback.user_email || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={cn("px-2 py-1 rounded text-xs", {
                          "bg-yellow-100 text-yellow-800": feedback.status === "pending",
                          "bg-green-100 text-green-800": feedback.status === "resolved",
                          "bg-gray-100 text-gray-800": !feedback.status || feedback.status === "no status"
                        })}>
                        {feedback.status || "no status"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 text-xs sm:text-sm">{feedback.feedback}</p>
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
              {Math.min(currentPage * itemsPerPage, filteredFeedbacks.length)} of{" "}
              {filteredFeedbacks.length} feedbacks
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
                      <PaginationLink
                        href="#"
                        isActive={true}>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    <span className="text-sm text-gray-500">of {totalPages}</span>
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
