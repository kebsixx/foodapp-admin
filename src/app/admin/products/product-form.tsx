import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category } from "@/app/admin/categories/categories.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash } from "lucide-react";
import { getPublicIdFromUrl, getCloudinaryUrl } from "@/lib/cloudinary";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { CloudinaryUpload } from "@/components/ui/CloudinaryUpload";
import { FormProductValues } from "@/app/admin/products/products.types";

type Props = {
  form: UseFormReturn<FormProductValues>;
  onSubmit: (data: FormProductValues) => void;
  categories: Category[];
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  isProductModalOpen: boolean;
  defaultValues: FormProductValues | null;
  name: string;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const ProductForm = ({
  form,
  onSubmit,
  categories,
  setIsProductModalOpen,
  isProductModalOpen,
  defaultValues,
  isLoading,
  setIsLoading,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (defaultValues) {
      console.log('Loading default values:', defaultValues);
      
      // Make sure we have proper heroImageUrls structure
      // Note: The database column is lowercase 'heroimageurls'
      let heroImageUrls = defaultValues.heroImageUrls || defaultValues.heroimageurls;
      
      // If we have a heroImage but no heroImageUrls, generate them
      if (defaultValues.heroImage && !heroImageUrls) {
        try {
          // Extract public ID if it's a Cloudinary URL
          const publicId = getPublicIdFromUrl(defaultValues.heroImage);
          
          if (publicId) {
            console.log('Generated heroImageUrls from publicId:', publicId);
            heroImageUrls = {
              original: defaultValues.heroImage,
              display: getCloudinaryUrl(publicId, { width: 800 }),
              medium: getCloudinaryUrl(publicId, { width: 400 }),
              thumb: getCloudinaryUrl(publicId, { width: 200 }),
            };
          } else {
            // Just use the heroImage for all URLs
            heroImageUrls = {
              original: defaultValues.heroImage,
              display: defaultValues.heroImage,
              medium: defaultValues.heroImage,
              thumb: defaultValues.heroImage,
            };
          }
        } catch (error) {
          console.error('Error generating heroImageUrls:', error);
        }
      }
      
      form.reset({
        ...defaultValues,
        heroImageUrls,
        variants:
          defaultValues.variants?.map((v) => ({
            id: v.id || crypto.randomUUID(),
            name: v.name,
            price: v.price.toString(),
            available: v.available,
          })) || [],
      });
    } else {
      form.reset({
        title: "",
        category: "",
        price: "",
        maxQuantity: "",
        heroImage: "",
        heroImageUrls: undefined,
        variants: [],
      });
    }
  }, [defaultValues, form]);

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsProductModalOpen(false);
      form.reset();
    }
  };

  // Helper function untuk mendapatkan preview image
  const getPreviewImage = () => {
    const currentHeroImage = form.watch("heroImage");
    const currentHeroImageUrls = form.watch("heroImageUrls");

    // Prioritas: medium > display > original
    return (
      currentHeroImageUrls?.medium ||
      currentHeroImageUrls?.display ||
      currentHeroImage ||
      defaultValues?.heroImageUrls?.medium ||
      defaultValues?.heroImageUrls?.display ||
      defaultValues?.heroImage
    );
  };

  return (
    <Dialog open={isProductModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] w-[calc(100%-2rem)] p-4 sm:p-6" aria-describedby="product-form-description">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Update Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription id="product-form-description">
            {defaultValues 
              ? "Update the details of your existing product"
              : "Fill in the details to add a new product to your catalog"}
          </DialogDescription>
        </DialogHeader>

        {isSubmitting && (
          <div className="absolute top-0 left-0 w-full z-50">
            <Progress value={33} className="h-1" />
          </div>
        )}

        <div
          className="max-h-[calc(90vh-200px)] overflow-y-auto pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e0 #f7fafc",
          }}>
          <Form {...form}>
            {" "}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Product Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        {...field}
                        disabled={isSubmitting}
                        className="focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isSubmitting}>
                        <SelectTrigger className="focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Default Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          disabled={isSubmitting}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Max Quantity <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          disabled={isSubmitting}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {form.watch("heroImage") && (
                    <div className="relative w-full sm:w-20 h-40 sm:h-20 rounded-md overflow-hidden">
                      <SafeImage
                        src={form.watch("heroImage") || ""}
                        alt="Product preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 80px"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <CloudinaryUpload
                      onSuccess={(result) => {
                        // Ensure URLs are properly trimmed
                        const secureUrl = result.secure_url.trim();
                        const publicId = result.public_id.trim();
                        
                        console.log('CloudinaryUpload success:', { 
                          secureUrl, 
                          publicId,
                          width: result.width,
                          height: result.height 
                        });
                        
                        // Set the values in the form
                        form.setValue("heroImage", secureUrl);
                        form.setValue("heroImageUrls", {
                          original: secureUrl,
                          display: getCloudinaryUrl(publicId, { width: 800 }),
                          medium: getCloudinaryUrl(publicId, { width: 400 }),
                          thumb: getCloudinaryUrl(publicId, { width: 200 }),
                        });
                      }}
                      onError={(error) => {
                        toast.error("Failed to upload image: " + error);
                      }}
                      className="w-full sm:w-auto"
                    />
                    {form.watch("heroImage") && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("heroImage", "");
                          form.setValue("heroImageUrls", undefined);
                        }}
                        className="w-full sm:w-auto"
                      >
                        Remove Image
                      </Button>
                    )}
                  </div>
                </div>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  If no image is provided, a default image will be used.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium">
                    Product Variants (Optional)
                  </FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentVariants = form.getValues("variants") || [];
                      form.setValue("variants", [
                        ...currentVariants,
                        {
                          id: crypto.randomUUID(),
                          name: "",
                          price: "0",
                          available: true,
                        },
                      ]);
                    }}
                    disabled={isSubmitting}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                {form.watch("variants")?.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="p-3 sm:p-4 border rounded-lg bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Variant {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const currentVariants =
                            form.getValues("variants") || [];
                          form.setValue(
                            "variants",
                            currentVariants.filter((_, i) => i !== index)
                          );
                        }}
                        disabled={isSubmitting}>
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              Variant Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Small, Medium, Large"
                                {...field}
                                disabled={isSubmitting}
                                className="focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                disabled={isSubmitting}
                                className="focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`variants.${index}.available`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value ?? true}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormLabel className="text-sm">
                            Available for sale
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto order-2 sm:order-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px] w-full sm:w-auto order-1 sm:order-2">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    (defaultValues ? "Update" : "Add") + " Product"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
