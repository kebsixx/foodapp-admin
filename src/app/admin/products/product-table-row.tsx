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
      heroImage: product.heroImage,
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
      heroImage: product.heroImage,
      heroImageUrls: product.heroImageUrls,
      intent: "update",
    });
    setIsDeleteModalOpen(true);
  };

  // Function untuk mendapatkan thumb URL dengan fallback
  const getImageUrls = () => {
    // Validasi URL
    const isValidUrl = (url: string | undefined) => {
      if (!url) return false;
      try {
        const parsedUrl = new URL(url);
        
        // Validasi untuk Supabase Storage
        if (parsedUrl.hostname === 'ftcctrtnvcytcuuljjik.supabase.co') {
          return true;
        }
        
        // Validasi untuk ImgBB
        if (parsedUrl.hostname === 'i.ibb.co' || parsedUrl.hostname === 'ibb.co') {
          const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
          if (pathParts.length < 2) {
            console.error('Invalid ImgBB URL format:', url);
            return false;
          }
          return true;
        }

        // Validasi untuk Cloudinary
        if (parsedUrl.hostname === 'res.cloudinary.com') {
          return true;
        }
        
        console.error('Invalid image hostname:', parsedUrl.hostname);
        return false;
      } catch (error) {
        console.error('URL validation error:', error);
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

    // Validasi dan pilih URL terbaik
    const validUrls = [
      { url: thumb, priority: 1, type: 'thumb' },
      { url: medium, priority: 2, type: 'medium' },
      { url: display, priority: 3, type: 'display' },
      { url: original, priority: 4, type: 'original' },
      { url: legacyImage, priority: 5, type: 'legacy' }
    ].filter(item => isValidUrl(item.url))
      .sort((a, b) => a.priority - b.priority);

    // Jika tidak ada URL yang valid, return empty
    if (validUrls.length === 0) {
      console.error('No valid image URLs found for product:', product.title);
      return { primary: '', fallback: '' };
    }

    return {
      primary: validUrls[0].url,
      fallback: validUrls[1]?.url || validUrls[0].url
    };
  };

  const imageUrls = getImageUrls();

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
        {imageUrls.primary ? (
          <div className="relative w-10 h-10 rounded-md overflow-hidden">
            <SafeImage
              src={imageUrls.primary}
              alt={product.title}
              fill
              className="object-cover"
              sizes="40px"
              fallbackSrc={imageUrls.fallback}
              onError={(error) => {
                // Hanya log error jika benar-benar gagal
                if (!imageUrls.fallback) {
                  console.error(
                    "Image load error for product:",
                    {
                      title: product.title,
                      primaryUrl: imageUrls.primary,
                      fallbackUrl: imageUrls.fallback,
                      heroImage: product.heroImage,
                      heroImageUrls: product.heroImageUrls
                    }
                  );
                }
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleEditClick}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
