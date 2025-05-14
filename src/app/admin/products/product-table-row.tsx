import { Dispatch, SetStateAction } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  FormProductValues,
  ProductWithCategory,
} from "@/app/admin/products/products.types";
import { CreateOrUpdateProductSchema } from "@/app/admin/products/schema";

type Props = {
  product: ProductWithCategory;
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentProduct: (product: FormProductValues) => void;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProductTableRow = ({
  product,
  setIsProductModalOpen,
  setCurrentProduct,
  setIsDeleteModalOpen,
}: Props) => {
  const handleEditClick = () => {
    if (!product.slug) return;

    setCurrentProduct({
      title: product.title,
      category: product.category.id.toString(),
      price: product.price?.toString() ?? "",
      maxQuantity: product.maxQuantity.toString(),
      slug: product.slug,
      heroImage: product.heroImage,
      oldHeroImage: product.heroImage,
      variants:
        product.variants?.map((v) => ({
          id: v.id,
          name: v.name,
          price: v.price.toString(),
          available: v.available ?? true,
        })) || [],
      intent: "update",
    });
    setIsProductModalOpen(true);
  };

  const handleDeleteClick = () => {
    setCurrentProduct({
      title: product.title,
      category: product.category.id.toString(),
      price: product.price?.toString() ?? "",
      maxQuantity: product.maxQuantity.toString(),
      slug: product.slug,
      heroImage: product.heroImage,
      oldHeroImage: product.heroImage, // Tambahkan ini untuk penghapusan gambar
      intent: "update",
    });
    setIsDeleteModalOpen(true);
  };

  return (
    <TableRow key={product.id}>
      <TableCell>{product.title}</TableCell>
      <TableCell>{product.category.name}</TableCell>
      <TableCell>
        {product.price !== null
          ? new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(product.price)
          : "N/A"}
      </TableCell>
      <TableCell>
        {product.variants && product.variants.length > 0 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="underline cursor-pointer">
                  {product.variants.length} variants
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{variant.name}</span>:{" "}
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(variant.price)}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-gray-500">No variants</span>
        )}
      </TableCell>
      <TableCell>{product.maxQuantity}</TableCell>
      <TableCell>
        {product.heroImage && (
          <Image
            width={40}
            height={40}
            src={product.heroImage}
            alt="Hero"
            className="w-10 h-10 object-cover"
          />
        )}
      </TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={handleEditClick}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
