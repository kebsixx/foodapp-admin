import { z } from "zod";

export const createOrUpdateProductSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  maxQuantity: z.string().min(1, { message: "Max quantity is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  heroImage: z
    .any()
    .refine((file) => file.length === 1, "Hero image is required" ),
  variants: z.array(
      z.object({
        name: z.string().min(1, { message: "Variant name is required" }),
      })
    ).optional(),
  intent: z
    .enum(["create", "update"], {
      message: "Intent must be either 'create' or 'update'",
    })
    .optional(),
  slug: z.string().optional(),
});

export type CreateOrUpdateProductSchema = z.infer<
  typeof createOrUpdateProductSchema
>;

export const createProductSchemaServer = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  price: z.number().positive({ message: "Price is required" }),
  maxQuantity: z.number().positive({ message: "Max quantity is required" }),
  category: z.number().positive({ message: "Category is required" }),
  heroImage: z.string().url({ message: "Hero image is required" }),
});

export type CreateProductSchemaServer = z.infer<
  typeof createProductSchemaServer
>;

export type UpdateProductSchema = {
  category: number;
  heroImage: string;
  maxQuantity: number;
  price: number | null;
  slug: string;
  title: string;
};
