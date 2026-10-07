import { z } from "zod";

export const createProductSchema = z.object({
  sku: z.string().min(1, "SKU is required").max(50),
  name: z.string().min(1, "Name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be URL-friendly"),
  description: z.string().max(5000).nullable().optional(),
  price: z.coerce
    .number()
    .min(0, "Price must be non-negative")
    .max(99_999_999, "Price is too high"),
  compareAtPrice: z.coerce.number().min(0).nullable().optional(),
  costPrice: z.coerce.number().min(0).default(0),
  categoryId: z.string().min(1, "Category is required"),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  reorderPoint: z.coerce.number().int().min(0).default(5),
  reorderQty: z.coerce.number().int().min(0).default(10),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  weight: z.coerce.number().min(0).nullable().optional(),
  brand: z.string().max(100).nullable().optional(),
  model: z.string().max(100).nullable().optional(),
  specifications: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().min(1, "Product ID is required"),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
