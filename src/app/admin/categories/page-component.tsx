"use client";

import { FC, useState, useCallback, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { PlusCircle, ArrowUpDown } from "lucide-react"; // Tambahkan ArrowUpDown
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CategoryTableRow } from "@/components/category";
import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/app/admin/categories/create-category.schema";
import { CategoriesWithProductsResponse } from "@/app/admin/categories/categories.types";
import { CategoryForm } from "@/app/admin/categories/category-form";
import {
  createCategory,
  deleteCategory,
  imageUploadHandler,
  updateCategory,
} from "@/actions/categories";
import slugify from "slugify";

type Props = {
  categories: CategoriesWithProductsResponse;
};

const CategoriesPageComponent: FC<Props> = ({ categories }) => {
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<CreateCategorySchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "created_at" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      image: undefined,
    },
  });

  const router = useRouter();

  const sortedCategories = useMemo(() => {
    if (!sortBy) return categories;

    return [...categories].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === "created_at") {
        return sortOrder === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [categories, sortBy, sortOrder]);

  const submitCategoryHandler: SubmitHandler<CreateCategorySchema> = async (
    data
  ) => {
    setIsLoading(true);
    const { image, name, intent = "create" } = data;

    const handleImageUpload = async (): Promise<string | null> => {
      if (!image || image.length === 0) return null;
      const uniqueId = uuid();
      const fileName = `category/category-${uniqueId}`;
      const file = new File([image[0]], fileName);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const url = await imageUploadHandler(formData);
        return url || null;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Error uploading image");
      }
    };

    let imageUrl: string | null = null;

    try {
      imageUrl = await handleImageUpload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
      setIsLoading(false);
      return;
    }

    switch (intent) {
      case "create": {
        if (!imageUrl) {
          toast.error("Image is required");
          setIsLoading(false);
          return;
        }

        await createCategory({
          imageUrl,
          name,
        });
        break;
      }
      case "update": {
        if (currentCategory?.slug) {
          const newSlug =
            currentCategory.name === name
              ? currentCategory.slug
              : slugify(name, { lower: true });

          const finalImageUrl = imageUrl || currentCategory.imageUrl || "";

          await updateCategory({
            imageUrl: finalImageUrl,
            name,
            slug: newSlug,
          });
        }
        break;
      }
      default:
        console.log("Invalid intent");
    }

    form.reset();
    router.refresh();
    setIsCreateCategoryModalOpen(false);
    toast.success(
      `Category ${intent === "create" ? "created" : "updated"} successfully`
    );
    setIsLoading(false);
  };

  const deleteCategoryHandler = useCallback(
    async (id: number) => {
      setIsLoading(true);
      await deleteCategory(id);
      router.refresh();
      toast.success("Category deleted successfully");
      setIsLoading(false);
    },
    [router]
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      {isLoading && <div className="loading">Loading...</div>}

      <Card className="overflow-x-auto">
        <CardHeader>
          <div className="flex justify-between items-center gap-2">
            <CardTitle>Categories</CardTitle>
            <Dialog
              open={isCreateCategoryModalOpen}
              onOpenChange={setIsCreateCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() => setCurrentCategory(null)}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Category
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <CategoryForm
                  form={form}
                  onSubmit={submitCategoryHandler}
                  defaultValues={currentCategory}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("name");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}>
                    <div className="flex items-center gap-2">
                      <span className={sortBy === "name" ? "font-bold" : ""}>
                        Name
                      </span>
                      <ArrowUpDown className="h-4 w-4" /> {/* Ikon sorting */}
                    </div>
                  </Button>
                </TableHead>
                <TableHead className="md:table-cell">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSortBy("created_at");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}>
                    <div className="flex items-center gap-2">
                      <span
                        className={sortBy === "created_at" ? "font-bold" : ""}>
                        Created at
                      </span>
                      <ArrowUpDown className="h-4 w-4" /> {/* Ikon sorting */}
                    </div>
                  </Button>
                </TableHead>
                <TableHead className="md:table-cell">Products</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCategories.map((category) => (
                <CategoryTableRow
                  key={category.id}
                  category={category}
                  setCurrentCategory={setCurrentCategory}
                  setIsCreateCategoryModalOpen={setIsCreateCategoryModalOpen}
                  deleteCategoryHandler={deleteCategoryHandler}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default CategoriesPageComponent;
