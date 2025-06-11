import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableCell, TableRow } from "@/components/ui/table";
import { CreateCategorySchema } from "@/app/admin/categories/create-category.schema";
import { CategoryWithProducts } from "@/app/admin/categories/categories.types";

export const CategoryTableRow = ({
  category,
  onEdit,
  onDelete,
}: {
  category: CategoryWithProducts;
  onEdit: (category: CategoryWithProducts) => void;
  onDelete: (id: number) => Promise<void>;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProductsDialogOpen, setIsProductsDialogOpen] = useState(false);

  const handleDelete = async () => {
    await onDelete(category.id);
    setIsDeleteDialogOpen(false);
  };

  const handleProductsDialogChange = (open: boolean) => {
    setIsProductsDialogOpen(open);
  };

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
  };

  // Default placeholder image
  const placeholderImage = "/placeholder.jpg";
  const imageUrl = category.imageUrl || placeholderImage;

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{category.name}</TableCell>
        <TableCell>
          {category.products && category.products.length > 0 ? (
            <Button
              variant="link"
              onClick={() => setIsProductsDialogOpen(true)}
              className="p-0 h-auto">
              {category.products.length} {category.products.length === 1 ? 'product' : 'products'}
            </Button>
          ) : (
            "No products"
          )}
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {format(new Date(category.created_at), "yyyy-MM-dd")}
        </TableCell>
        <TableCell className="text-center">
          <Image
            alt="Category image"
            className="aspect-square rounded-md object-cover inline-block"
            height="48"
            src={imageUrl}
            width="48"
          />
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(category)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <Dialog
        open={isProductsDialogOpen}
        onOpenChange={handleProductsDialogChange}>
        <DialogContent aria-describedby="products-dialog-description">
          <DialogHeader>
            <DialogTitle>Products in {category.name}</DialogTitle>
            <DialogDescription id="products-dialog-description">
              List of products associated with this category
            </DialogDescription>
          </DialogHeader>
                <ScrollArea className="h-[400px] rounded-md p-4">
                  {category.products.map((product) => (
                    <Card key={product.id} className="cursor-pointer mb-2">
                      <div className="grid grid-cols-[100px,1fr] items-center gap-4">
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="100"
                    src={product.heroImage || placeholderImage}
                          width="100"
                        />
                        <div className="flex flex-col space-y-1">
                          <h3 className="font-medium leading-none">
                            {product.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.maxQuantity} in stock
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}>
        <DialogContent aria-describedby="delete-category-dialog-description">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription id="delete-category-dialog-description">
              This action cannot be undone. This will permanently delete this
              category and remove it from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
