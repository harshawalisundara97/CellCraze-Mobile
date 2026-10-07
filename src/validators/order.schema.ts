import { z } from "zod";

const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

const paymentMethodEnum = z.enum(["STRIPE", "COD", "BANK_TRANSFER"]);

export const createOrderSchema = z.object({
  addressId: z.string().min(1, "Shipping address is required"),
  paymentMethod: paymentMethodEnum,
  notes: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: orderStatusEnum,
  notes: z.string().max(500).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
