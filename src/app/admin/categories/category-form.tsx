"use client";

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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Category } from "@/app/admin/categories/categories.types";
import { CategoryImageUpload } from "@/components/ui/CategoryImageUpload";

type Props = {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  setIsCategoryModalOpen: (open: boolean) => void;
  isCategoryModalOpen: boolean;
  defaultValues: Category | null;
};

export const CategoryForm = ({
  form,
  onSubmit,
  setIsCategoryModalOpen,
  isCategoryModalOpen,
  defaultValues,
}: Props) => {
  const isSubmitting = form.formState.isSubmitting;

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsCategoryModalOpen(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="absolute top-0 left-0 w-full z-50">
          <Progress value={33} className="h-1" />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Category Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name"
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
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Category Image
                </FormLabel>
                <FormControl>
                  <CategoryImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange("")}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? defaultValues
                  ? "Updating..."
                  : "Creating..."
                : defaultValues
                ? "Update Category"
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};
