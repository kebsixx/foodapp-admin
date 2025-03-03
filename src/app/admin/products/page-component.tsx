"use client";

import { FC, useState } from "react";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProductsWithCategoriesResponse } from "@/app/admin/products/products.types";
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
} from "@/components/ui/dialog";
import { Category } from "@/app/admin/categories/categories.types";
import {
  createOrUpdateProductSchema,
  CreateOrUpdateProductSchema,
} from "@/app/admin/products/schema";
import { imageUploadHandler } from "@/actions/categories";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/actions/products";
import { ProductForm } from "@/app/admin/products/product-form";
import { ProductTableRow } from "@/app/admin/products/product-table-row";
import { PlusIcon } from "lucide-react";
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

type Props = {
  categories: Category[];
  productsWithCategories: ProductsWithCategoriesResponse;
};

export const ProductPageComponent: FC<Props> = ({
  categories,
  productsWithCategories,
}) => {
  const [currentProduct, setCurrentProduct] =
    useState<CreateOrUpdateProductSchema | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = ["5", "10", "20", "50"];

  const form = useForm<CreateOrUpdateProductSchema>({
    resolver: zodResolver(createOrUpdateProductSchema),
    defaultValues: {
      title: "",
      category: undefined,
      price: undefined,
      maxQuantity: undefined,
      heroImage: undefined,
      intent: "create",
    },
  });

  const router = useRouter();

  const productCreateUpdateHandler = async (
    data: CreateOrUpdateProductSchema
  ) => {
    setIsLoading(true);
    const {
      title,
      category,
      price,
      maxQuantity,
      heroImage,
      slug,
      intent = "create",
    } = data;

    const uploadFile = async (file: File) => {
      const uniqueId = uuid();
      const fileName = `product/product-${uniqueId}-${file.name}`;
      const formData = new FormData();
      formData.append("file", file, fileName);
      return imageUploadHandler(formData);
    };

    let heroImageUrl: string | undefined;

    if (heroImage) {
      const imagePromise = Array.from(heroImage).map((file) =>
        uploadFile(file as unknown as File)
      );
      try {
        [heroImageUrl] = await Promise.all(imagePromise);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    switch (intent) {
      case "create": {
        if (heroImageUrl) {
          await createProduct({
            category: Number(category),
            heroImage: heroImageUrl,
            maxQuantity: Number(maxQuantity),
            price: Number(price),
            title,
          });
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product created successfully");
        }
        break;
      }
      case "update": {
        if (heroImageUrl && slug) {
          await updateProduct({
            category: Number(category),
            heroImage: heroImageUrl,
            maxQuantity: Number(maxQuantity),
            price: Number(price),
            title,
            slug,
          });
          form.reset();
          router.refresh();
          setIsProductModalOpen(false);
          toast.success("Product updated successfully");
        }
        break;
      }
      default:
        console.error("Invalid intent");
    }
    setIsLoading(false);
  };

  const deleteProductHandler = async () => {
    setIsLoading(true);
    if (currentProduct?.slug) {
      await deleteProduct(currentProduct.slug);
      router.refresh();
      toast.success("Product deleted successfully");
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
    setIsLoading(false);
  };

  const totalPages = Math.ceil(productsWithCategories.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = productsWithCategories.slice(
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

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <Button
            onClick={() => {
              setCurrentProduct(null);
              setIsProductModalOpen(true);
            }}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max Quantity</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.map((product) => (
              <ProductTableRow
                setIsProductModalOpen={setIsProductModalOpen}
                key={product.id}
                product={product}
                setCurrentProduct={setCurrentProduct}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
              />
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          {/* Left: Showing items count */}
          <span className="text-sm text-gray-500">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, productsWithCategories.length)} of{" "}
            {productsWithCategories.length} items
          </span>

          {/* Center: Pagination */}
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

          {/* Right: Items per page selector */}
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

        <ProductForm
          form={form}
          onSubmit={productCreateUpdateHandler}
          categories={categories}
          isProductModalOpen={isProductModalOpen}
          setIsProductModalOpen={setIsProductModalOpen}
          defaultValues={currentProduct}
        />

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete {currentProduct?.title}</p>
            <DialogFooter>
              <Button variant="destructive" onClick={deleteProductHandler}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};
