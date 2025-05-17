"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Search } from "lucide-react";

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

  useEffect(() => {
    const filtered = customerFeedbacks.filter((feedback) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (feedback.user_email?.toLowerCase() || "").includes(searchLower) ||
        (feedback.name?.toLowerCase() || "").includes(searchLower) ||
        feedback.feedback.toLowerCase().includes(searchLower)
      );
    });
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  }, [searchQuery, customerFeedbacks]);

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Feedbacks</h1>
        <div className="w-96">
          <Command className="border rounded-lg">
            <CommandInput
              placeholder="Search feedbacks..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            {searchQuery && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {filteredFeedbacks.slice(0, 5).map((feedback) => (
                    <CommandItem
                      key={feedback.id}
                      value={feedback.user_email || ""}
                      onSelect={() =>
                        setSearchQuery(feedback.user_email || "")
                      }>
                      <Search className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{feedback.user_email || "Anonymous"}</span>
                        <span className="text-sm text-muted-foreground">
                          {feedback.feedback.substring(0, 30)}...
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
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Feedback</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFeedbacks.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>
                {format(new Date(feedback.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{feedback.name || "Anonymous"}</TableCell>
              <TableCell>{feedback.user_email || "-"}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    feedback.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : feedback.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {feedback.status || "no status"}
                </span>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="line-clamp-2">{feedback.feedback}</p>
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
