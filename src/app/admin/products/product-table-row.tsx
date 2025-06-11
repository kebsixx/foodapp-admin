import { Dispatch, SetStateAction } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { SafeImage } from "@/components/ui/SafeImage";

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
      heroImage: product.heroImage ?? "",
      heroImageUrls: product.heroImageUrls,
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
      heroImage: product.heroImage ?? "",
      heroImageUrls: product.heroImageUrls,
      variants:
        product.variants?.map((v) => ({
          id: v.id || crypto.randomUUID(),
          name: v.name,
          price: v.price.toString(),
          available: v.available,
        })) || [],
      intent: "update",
    });
    setIsDeleteModalOpen(true);
  };

  // Function untuk mendapatkan thumb URL dengan fallback
  const getImageUrls = () => {
    // Validasi URL
    const isValidUrl = (url: string | undefined | null) => {
      if (!url) return false;

      // Handle relative URLs (starting with /)
      if (url.startsWith("/")) {
        return true;
      }

      // Handle URLs that start with @ (special case for our app)
      if (url.startsWith("@")) {
        // Remove the @ prefix and validate the remaining URL
        const cleanUrl = url.substring(1);
        try {
          new URL(cleanUrl);
          return true;
        } catch (error) {
          return false;
        }
      }

      try {
        const parsedUrl = new URL(url);

        // Validasi untuk Supabase Storage
        if (parsedUrl.hostname === "ftcctrtnvcytcuuljjik.supabase.co") {
          return true;
        }

        // Validasi untuk ImgBB
        if (
          parsedUrl.hostname === "i.ibb.co" ||
          parsedUrl.hostname === "ibb.co"
        ) {
          const pathParts = parsedUrl.pathname.split("/").filter(Boolean);
          if (pathParts.length < 2) {
            return false;
          }
          return true;
        }

        // Validasi untuk Cloudinary
        if (parsedUrl.hostname === "res.cloudinary.com") {
          return true;
        }

        // Accept other valid URLs without logging errors
        return true;
      } catch (error) {
        // Don't log errors to reduce console noise
        return false;
      }
    };

    // Coba gunakan heroImageUrls terlebih dahulu
    const heroImageUrls = product.heroImageUrls as {
      original?: string;
      display?: string;
      medium?: string;
      thumb?: string;
    } | null;

    // Ambil URL dari heroImageUrls jika ada
    const thumb = heroImageUrls?.thumb;
    const medium = heroImageUrls?.medium;
    const display = heroImageUrls?.display;
    const original = heroImageUrls?.original;

    // Fallback ke heroImage jika diperlukan
    const legacyImage = product.heroImage;

    // Default image jika tidak ada gambar valid
    const defaultImage =
      "https://res.cloudinary.com/dgg4mki57/image/upload/v1749646662/ceritasenja_k2jnf1.jpg";

    // Validasi dan pilih URL terbaik
    const validUrls = [
      { url: thumb, priority: 1, type: "thumb" },
      { url: medium, priority: 2, type: "medium" },
      { url: display, priority: 3, type: "display" },
      { url: original, priority: 4, type: "original" },
      { url: legacyImage, priority: 5, type: "legacy" },
    ]
      .filter((item) => isValidUrl(item.url))
      .sort((a, b) => a.priority - b.priority);

    // Jika tidak ada URL yang valid, gunakan default image
    if (validUrls.length === 0) {
      return { primary: defaultImage, fallback: defaultImage };
    }

    return {
      primary: validUrls[0].url || defaultImage,
      fallback: validUrls[1]?.url || validUrls[0].url || defaultImage,
    };
  };

  const imageUrls = getImageUrls();

  // Format price for display
  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-md overflow-hidden sm:hidden">
            <SafeImage
              src={imageUrls.primary}
              alt={product.title}
              fill
              className="object-cover"
              sizes="32px"
              fallbackSrc={imageUrls.fallback}
            />
          </div>
          <span className="line-clamp-2">{product.title}</span>
        </div>
        <div className="text-xs text-gray-500 mt-1 sm:hidden">
          {formatPrice(product.price)}
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        {product.category.name}
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        {formatPrice(product.price)}
      </TableCell>

      <TableCell className="hidden md:table-cell">
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
                      {formatPrice(variant.price)}
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

      <TableCell className="hidden sm:table-cell">
        {product.maxQuantity}
      </TableCell>

      <TableCell className="hidden sm:table-cell text-center p-2">
        <div className="relative w-10 h-10 rounded-md overflow-hidden mx-auto">
          <SafeImage
            src={imageUrls.primary}
            alt={product.title}
            fill
            className="object-cover"
            sizes="40px"
            fallbackSrc={imageUrls.fallback}
            onError={(error) => {
              console.error("Image load error for product:", {
                title: product.title,
                primaryUrl: imageUrls.primary,
                fallbackUrl: imageUrls.fallback,
                heroImage: product.heroImage,
                heroImageUrls: product.heroImageUrls,
              });
            }}
          />
        </div>
      </TableCell>

      <TableCell className="text-center p-2">
        <div className="flex gap-1 justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditClick}
            className="h-8 w-8 sm:h-9 sm:w-9">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="h-8 w-8 sm:h-9 sm:w-9">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
