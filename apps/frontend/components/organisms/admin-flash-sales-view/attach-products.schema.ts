import { z } from "zod";

export const attachProductsSchema = z.object({
  flashSaleId: z.string().min(1, "Flash sale selection is required"),
  productId: z.string().min(1, "Product selection is required"),
  skuId: z.string().min(1, "SKU selection is required"),
  salePrice: z
    .union([z.number(), z.string()])
    .refine((val) => Number(val) > 0, {
      message: "Sale price must be greater than 0",
    }),
  stock: z.union([z.number(), z.string()]).refine((val) => Number(val) > 0, {
    message: "Stock must be at least 1",
  }),
  orderLimit: z.union([z.number(), z.string()]).optional(),
});

export type AttachProductsData = z.infer<typeof attachProductsSchema>;
