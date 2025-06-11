"use client";

import { FC, useState, useCallback, useMemo, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle, ArrowUpDown, Search, FilterIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { CategoryTableRow } from "@/components/category";
import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { CategoriesWithProductsResponse, Category } from "@/app/admin/categories/categories.types";
import { CategoryForm } from "@/app/admin/categories/category-form";
import {
  createCategory,
  deleteCategory,
  imageUploadHandler,
  updateCategory,
} from "@/actions/categories";
import slugify from "slugify";

type Props = {
  categories: CategoriesWithProductsResponse;
};

const CategoriesPageComponent: FC<Props> = ({ categories }) => {
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<CreateCategorySchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "created_at" | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = ["5", "10", "20", "50"];
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const router = useRouter();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isCreateCategoryModalOpen) {
      if (currentCategory) {
        form.reset({
          name: currentCategory.name,
          imageUrl: currentCategory.imageUrl,
          intent: "update",
          slug: currentCategory.slug,
        });
      } else {
        form.reset({
          name: "",
          image: undefined,
          intent: "create",
        });
      }
    }
  }, [isCreateCategoryModalOpen, currentCategory, form]);

  const handleModalOpenChange = (open: boolean) => {
    if (!isLoading) {
      if (!open) {
        // Only close if not loading
        setIsCreateCategoryModalOpen(false);
        setTimeout(() => {
          form.reset();
          if (!open) setCurrentCategory(null);
        }, 100);
      } else {
        setIsCreateCategoryModalOpen(true);
      }
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const sortedCategories = useMemo(() => {
    if (!sortBy) return filteredCategories;

    return [...filteredCategories].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [filteredCategories, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = sortedCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async (
    data
  ) => {
    setIsLoading(true);
    const { image, name, intent = "create" } = data;

    const handleImageUpload = async (): Promise<string | null> => {
      if (!image || image.length === 0) return null;
      const uniqueId = uuid();
      const fileName = `category/category-${uniqueId}`;
      const file = new File([image[0]], fileName);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const url = await imageUploadHandler(formData);
        return url || null;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Error uploading image");
      }
    };

    let imageUrl: string | null = null;

    try {
      imageUrl = await handleImageUpload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
      setIsLoading(false);
      return;
    }

    switch (intent) {
      case "create": {
        if (!imageUrl) {
          toast.error("Image is required");
          setIsLoading(false);
          return;
        }

        await createCategory({
          imageUrl,
          name,
        });
        break;
      }
      case "update": {
        if (currentCategory?.slug) {
          const newSlug =
            currentCategory.name === name
              ? currentCategory.slug
              : slugify(name, { lower: true });

          const finalImageUrl = imageUrl || currentCategory.imageUrl || "";

          const categoryId = (categories.find(c => c.slug === currentCategory.slug)?.id) || 0;

          await updateCategory({
            id: categoryId,
            imageUrl: finalImageUrl,
            name,
          });
        }
        break;
      }
      default:
        console.log("Invalid intent");
    }

    form.reset();
    router.refresh();
    setIsCreateCategoryModalOpen(false);
    toast.success(
      `Category ${intent === "create" ? "created" : "updated"} successfully`
    );
    setIsLoading(false);
  };

  const deleteCategoryHandler = useCallback(
    async (id: number) => {
      setIsLoading(true);
      await deleteCategory(id);
      router.refresh();
      toast.success("Category deleted successfully");
      setIsLoading(false);
    },
    [router]
  );

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

  // Filter content for mobile
  const FilterContent = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Sort By</h4>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={sortBy || "name"}
            onValueChange={(value: "name" | "created_at") => {
              setSortBy(value);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created_at">Date</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortOrder}
            onValueChange={(value: "asc" | "desc") => {
              setSortOrder(value);
            }}>
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      {isLoading && <div className="loading">Loading...</div>}

      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Categories Management</h1>
            <Dialog
              open={isCreateCategoryModalOpen}
              onOpenChange={handleModalOpenChange}>
              <DialogTrigger asChild>
                <Button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentCategory(null);
                    setIsCreateCategoryModalOpen(true);
                  }}>
                  <PlusCircle className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Category</span>
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby="category-dialog-description">
                <DialogHeader>
                  <DialogTitle>
                    {currentCategory ? "Update Category" : "Add Category"}
                  </DialogTitle>
                  <DialogDescription id="category-dialog-description">
                    {currentCategory
                      ? "Update the details of your existing category."
                      : "Fill in the details to add a new category to your store."}
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  form={form}
                  onSubmit={submitCategoryHandler}
                  defaultValues={currentCategory as unknown as Category | null}
                  setIsCategoryModalOpen={setIsCreateCategoryModalOpen}
                  isCategoryModalOpen={isCreateCategoryModalOpen}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by category name..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-2">
              <Select
                value={sortBy || "name"}
                onValueChange={(value: "name" | "created_at") => {
                  setSortBy(value);
                }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="created_at">Sort by Date</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => {
                  setSortOrder(value);
                }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
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
                  <SheetTitle>Filters & Sort</SheetTitle>
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
                <TableHead 
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    sortBy === "name" && "text-primary font-medium"
                  )}
                    onClick={() => {
                      setSortBy("name");
                    setSortOrder(sortBy === "name" && sortOrder === "asc" ? "desc" : "asc");
                    }}>
                  Name {sortBy === "name" && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1 text-primary" />
                  )}
                </TableHead>
                <TableHead>Products</TableHead>
                <TableHead 
                  className={cn(
                    "cursor-pointer hover:bg-gray-100 hidden md:table-cell",
                    sortBy === "created_at" && "text-primary font-medium"
                  )}
                    onClick={() => {
                      setSortBy("created_at");
                    setSortOrder(sortBy === "created_at" && sortOrder === "asc" ? "desc" : "asc");
                    }}>
                  Created At {sortBy === "created_at" && (
                    <ArrowUpDown className="inline h-4 w-4 ml-1 text-primary" />
                  )}
                </TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCategories.length === 0 ? (
                <TableRow>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No categories found matching your criteria"
                      : "No categories available. Add your first category!"}
                  </td>
                </TableRow>
              ) : (
                currentCategories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                    onDelete={deleteCategoryHandler}
                    onEdit={(category) => {
                      setCurrentCategory({
                        name: category.name,
                        imageUrl: category.imageUrl,
                        slug: category.slug,
                        intent: "update",
                      });
                      setIsCreateCategoryModalOpen(true);
                    }}
                />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
            <span className="text-sm text-gray-500 text-center sm:text-left">
              Showing {indexOfFirstCategory + 1}-
              {Math.min(indexOfLastCategory, sortedCategories.length)} of{" "}
              {sortedCategories.length} items
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
};

export default CategoriesPageComponent;
