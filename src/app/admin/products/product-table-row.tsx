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
import { ProductWithCategory } from "@/app/admin/products/products.types";
import { CreateOrUpdateProductSchema } from "@/app/admin/products/schema";

type Props = {
  product: ProductWithCategory;
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  setCurrentProduct: Dispatch<
    SetStateAction<CreateOrUpdateProductSchema | null>
  >;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const ProductTableRow = ({
  product,
  setIsProductModalOpen,
  setCurrentProduct,
  setIsDeleteModalOpen,
}: Props) => {
  const handleEditClick = (product: CreateOrUpdateProductSchema) => {
    setCurrentProduct({
      title: product.title,
      category: product.category,
      price: product.price,
      maxQuantity: product.maxQuantity,
      heroImage: product.heroImage,
      slug: product.slug,
      intent: "update",
    });
    setIsProductModalOpen(true);
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            handleEditClick({
              title: product.title,
              category: product.category.id.toString(),
              price: product.price?.toString() ?? "",
              maxQuantity: product.maxQuantity.toString(),
              slug: product.slug,
              heroImage: product.heroImage,
              variants: product.variants?.map((v) => ({
                name: v.name,
                price: v.price.toString(),
              })),
              intent: "update",
            })
          }>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setCurrentProduct({
              title: product.title,
              category: product.category.id.toString(),
              price: product.price?.toString() ?? "",
              maxQuantity: product.maxQuantity.toString(),
              slug: product.slug,
              heroImage: product.heroImage,
              intent: "update",
            })
          }>
          <Trash2
            className="h-4 w-4"
            onClick={() => setIsDeleteModalOpen(true)}
          />
        </Button>
      </TableCell>
    </TableRow>
  );
};
