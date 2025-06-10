"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  FormProductValues,
  ProductsWithCategoriesResponse,
  ProductWithCategory,
} from "@/app/admin/products/products.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Category } from "@/app/admin/categories/categories.types";
import { createOrUpdateProductSchema } from "@/app/admin/products/schema";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/actions/products";
import { ProductForm } from "@/app/admin/products/product-form";
import { ProductTableRow } from "@/app/admin/products/product-table-row";
import { PlusIcon, ArrowUpDown, SearchIcon, FilterIcon } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
  categories: Category[];
  productsWithCategories: ProductsWithCategoriesResponse;
};

type SortField = "title" | "category" | "price";
type SortOrder = "asc" | "desc";

export const ProductPageComponent: FC<Props> = ({
  categories,
  productsWithCategories,
}) => {
  const [currentProduct, setCurrentProduct] =
    useState<FormProductValues | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = ["5", "10", "20", "50"];
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");

  const form = useForm<FormProductValues>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: "",
      category: "",
      price: "",
      maxQuantity: "",
      heroImage: "",
      heroImageUrls: undefined,
      variants: [],
      intent: "create",
    },
  });

  const router = useRouter();

  const productCreateUpdateHandler = async (data: FormProductValues) => {
    setIsLoading(true);
    const {
      title,
      category,
      price,
      maxQuantity,
      heroImage,
      heroImageUrls,
      slug,
      intent = "create",
      variants,
    } = data;

    // Validasi data sebelum create/update
    if (!title || !category || !price || !maxQuantity) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (intent === "update" && !slug) {
      toast.error("Slug is required for updating product");
      setIsLoading(false);
      return;
    }

    try {
      if (intent === "create") {
        await createProduct({
          title,
          category: Number(category),
          price: Number(price),
          maxQuantity: Number(maxQuantity),
          heroImage: heroImage || undefined, // Allow undefined heroImage
          heroImageUrls,
          variants: variants?.map((v) => ({
            id: v.id || crypto.randomUUID(),
            name: v.name,
            price: Number(v.price),
            available: v.available ?? true,
          })),
        });
        toast.success("Product created successfully");
      } else {
        await updateProduct({
          title,
          category: Number(category),
          price: Number(price),
          maxQuantity: Number(maxQuantity),
          heroImage: heroImage || undefined,
          heroImageUrls,
          slug: slug as string,
          variants: variants?.map((v) => ({
            id: v.id || crypto.randomUUID(),
            name: v.name,
            price: Number(v.price),
            available: v.available ?? true,
          })),
        });
        toast.success("Product updated successfully");
      }

      // Reset form and close modal
      form.reset({
        title: "",
        category: "",
        price: "",
        maxQuantity: "",
        heroImage: "",
        heroImageUrls: undefined,
        variants: [],
        intent: "create",
      });
      setCurrentProduct(null);
      setIsProductModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred while saving the product";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProductHandler = async () => {
    setIsLoading(true);
    try {
      if (currentProduct?.slug) {
        await deleteProduct(
          currentProduct.slug,
          currentProduct.heroImage as string | undefined
        );
        router.refresh();
        toast.success("Product deleted successfully");
        setIsDeleteModalOpen(false);
        setCurrentProduct(null);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error deleting product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    form.reset({
      title: "",
      category: "",
      price: "",
      maxQuantity: "",
      heroImage: "",
      heroImageUrls: undefined,
      variants: [],
      intent: "create",
    });
    setIsProductModalOpen(true);
  };

  const sortProducts = (products: ProductWithCategory[]) => {
    return [...products].sort((a, b) => {
      let compareA, compareB;

      switch (sortField) {
        case "title":
          compareA = a.title.toLowerCase();
          compareB = b.title.toLowerCase();
          break;
        case "category":
          compareA = a.category.name.toLowerCase();
          compareB = b.category.name.toLowerCase();
          break;
        case "price":
          compareA = a.price || 0;
          compareB = b.price || 0;
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0;
      } else {
        return compareB < compareA ? -1 : compareB > compareA ? 1 : 0;
      }
    });
  };

  const filterProducts = (products: ProductWithCategory[]) => {
    return products.filter((product) => {
      const matchesTitle = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        searchCategory === "all" ||
        product.category.id.toString() === searchCategory;
      return matchesTitle && matchesCategory;
    });
  };

  const filteredProducts = filterProducts(productsWithCategories);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const sortedProducts = sortProducts(filteredProducts);
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
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

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="inline h-4 w-4 ml-1 text-gray-400" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUpDown className="inline h-4 w-4 ml-1 text-primary rotate-180" />
    ) : (
      <ArrowUpDown className="inline h-4 w-4 ml-1 text-primary" />
    );
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold whitespace-nowrap">
            Products Management
          </h1>

          <div className="flex flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by product name..."
                className="w-full sm:w-[240px] pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="sm:hidden">
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="hidden sm:block">
              <Select
                value={searchCategory}
                onValueChange={(value) => {
                  setSearchCategory(value);
                  setCurrentPage(1);
                }}>
                <SelectTrigger className="w-[150px] pl-3">
                  <SelectValue
                    className="text-left"
                    placeholder="Filter by category"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="fixed bottom-4 right-4 sm:static sm:ml-auto">
            <Button onClick={handleAddProduct}>
              <PlusIcon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Product</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => {
                    if (sortField === "title") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("title");
                      setSortOrder("asc");
                    }
                  }}
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    sortField === "title" && "text-primary font-medium"
                  )}>
                  Name {getSortIcon("title")}
                </TableHead>
                <TableHead
                  onClick={() => {
                    if (sortField === "category") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("category");
                      setSortOrder("asc");
                    }
                  }}
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    sortField === "category" && "text-primary font-medium"
                  )}>
                  Category {getSortIcon("category")}
                </TableHead>
                <TableHead
                  onClick={() => {
                    if (sortField === "price") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortField("price");
                      setSortOrder("asc");
                    }
                  }}
                  className={cn(
                    "cursor-pointer hover:bg-gray-100",
                    sortField === "price" && "text-primary font-medium"
                  )}>
                  Price {getSortIcon("price")}
                </TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Max Quantity</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.length === 0 ? (
                <TableRow>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {searchTerm || searchCategory !== "all"
                      ? "No products found matching your criteria"
                      : "No products available. Add your first product!"}
                  </td>
                </TableRow>
              ) : (
                currentProducts.map((product) => (
                  <ProductTableRow
                    setIsProductModalOpen={setIsProductModalOpen}
                    key={product.id}
                    product={product}
                    setCurrentProduct={(productData: FormProductValues) => {
                      setCurrentProduct(productData);
                    }}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-gray-500">
              Showing {indexOfFirstProduct + 1}-
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} items
            </span>

            <div className="flex-1 flex justify-center">
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
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {generatePaginationItems()}

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
          </div>
        )}

        <ProductForm
          form={form}
          onSubmit={productCreateUpdateHandler}
          categories={categories}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          defaultValues={currentProduct}
          name={""}
        />

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent aria-describedby="delete-dialog-description">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription id="delete-dialog-description">
                This action cannot be undone. Please confirm if you want to proceed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong>{currentProduct?.title}</strong>?
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isLoading}>
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={deleteProductHandler}
                disabled={isLoading}>
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};
