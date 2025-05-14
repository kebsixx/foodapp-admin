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
  DialogFooter,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Category } from "@/app/admin/categories/categories.types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash } from "lucide-react";
import { FormProductValues } from "@/app/admin/products/products.types";

type Props = {
  form: UseFormReturn<FormProductValues>;
  onSubmit: (data: FormProductValues) => void;
  categories: Category[];
  setIsProductModalOpen: Dispatch<SetStateAction<boolean>>;
  isProductModalOpen: boolean;
  defaultValues: FormProductValues | null;
  name: string;
};

export const ProductForm = ({
  form,
  onSubmit,
  categories,
  setIsProductModalOpen,
  isProductModalOpen,
  defaultValues,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...defaultValues,
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
        heroImage: undefined,
        variants: [],
      });
    }
  }, [defaultValues, form]);

  return (
    <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Update Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        {isSubmitting && (
          <div className="absolute top-0 left-0 w-full">
            <Progress value={33} className="h-1" />
          </div>
        )}

        <div
          className="max-h-[calc(100svh-200px)] overflow-y-auto"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* Internet Explorer 10+ */,
          }}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product title"
                        {...field}
                        className="col-span-3"
                        disabled={isSubmitting}
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger
                          disabled={isSubmitting}
                          className="col-span-3">
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

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Default Price</FormLabel>
                    <FormControl>
                      <Input
                        id="price"
                        type="number"
                        className="col-span-3"
                        placeholder="Default price (used if no variants)"
                        {...field}
                        disabled={isSubmitting}
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Max Quantity</FormLabel>
                    <FormControl>
                      <Input
                        id="maxQuantity"
                        type="number"
                        className="col-span-3"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Hero Image{" "}
                      {defaultValues && (
                        <span className="text-gray-500">(Optional)</span>
                      )}
                    </FormLabel>

                    {/* Preview Container */}
                    {defaultValues?.heroImage &&
                      typeof defaultValues.heroImage === "string" && (
                        <div className="mb-3 flex flex-col items-start">
                          <div className="relative h-32 w-32 border rounded-md overflow-hidden">
                            <Image
                              src={defaultValues.heroImage}
                              alt="Current hero image"
                              fill
                              className="object-cover"
                              sizes="128px"
                              priority
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Current image
                          </p>
                        </div>
                      )}

                    {/* File Input */}
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                          field.onChange(e.target.files?.[0] || field.value);

                          // Preview gambar baru yang dipilih
                          if (e.target.files?.[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              {
                                newImagePreview && (
                                  <div className="mb-3 flex flex-col items-start">
                                    <div className="relative h-32 w-32 border rounded-md overflow-hidden">
                                      <Image
                                        src={newImagePreview}
                                        alt="New image preview"
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                      />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                      New image preview
                                    </p>
                                  </div>
                                );
                              }
                            };
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Variants (Optional)</FormLabel>
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
                    className="grid grid-cols-2 gap-2 items-start">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Variant name"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Variant price"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.available`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value ?? true}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                className="h-4 w-4"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormLabel>Available</FormLabel>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
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
                  </div>
                ))}
              </div>

              <DialogFooter>
                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing...
                    </>
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
