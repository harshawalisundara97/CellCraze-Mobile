/* ------------------------------------------------------------------
   CellCraze -- client-side type definitions
   Mirror the Prisma schema as plain objects (no Prisma runtime).
   ------------------------------------------------------------------ */

// ---- enums (re-declared so client code never imports @prisma/client) ----

export type Role = "CUSTOMER" | "MANAGER" | "ADMIN";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "STRIPE" | "COD" | "BANK_TRANSFER";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type InventoryTransactionType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT"
  | "RETURN"
  | "DAMAGE";
export type POStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_RECEIVED"
  | "FULLY_RECEIVED"
  | "CANCELLED";
export type GRNStatus = "DRAFT" | "CONFIRMED";
export type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

// ---- base models ----

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  costPrice: number;
  categoryId: string;
  stockQuantity: number;
  reorderPoint: number;
  reorderQty: number;
  isActive: boolean;
  isFeatured: boolean;
  weight: number | null;
  brand: string | null;
  model: string | null;
  specifications: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressSnapshot: Record<string, unknown>;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  status: PaymentStatus;
  amount: number;
  paidAt: string | null;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  status: POStatus;
  totalAmount: number;
  notes: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface POItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty: number;
}

export interface GRN {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  supplierId: string;
  status: GRNStatus;
  receivedDate: string;
  notes: string | null;
  createdById: string | null;
  createdAt: string;
}

export interface GRNItem {
  id: string;
  grnId: string;
  poItemId: string;
  productId: string;
  receivedQty: number;
  rejectedQty: number;
  notes: string | null;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ---- composite / "with" types ----

export interface ProductWithImages extends Product {
  images: ProductImage[];
  category: Category;
}

export interface CartItemWithProduct extends CartItem {
  product: Pick<Product, "id" | "name" | "slug" | "price" | "stockQuantity"> & {
    images: Pick<ProductImage, "url" | "altText">[];
  };
}

export interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}

export interface OrderItemWithProduct extends OrderItem {
  product: Pick<Product, "id" | "slug"> & {
    images: Pick<ProductImage, "url" | "altText">[];
  };
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
  payment: Payment | null;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
  parent?: Category | null;
}

export type SupplierType = Supplier;

export interface POItemWithProduct extends POItem {
  product: Pick<Product, "id" | "name" | "sku">;
}

export interface POWithItems extends PurchaseOrder {
  items: POItemWithProduct[];
  supplier: Supplier;
  createdBy?: Pick<User, "id" | "name"> | null;
}

export interface GRNItemWithProduct extends GRNItem {
  product: Pick<Product, "id" | "name" | "sku">;
  poItem: Pick<POItem, "id" | "quantity" | "unitCost">;
}

export interface GRNWithItems extends GRN {
  items: GRNItemWithProduct[];
  supplier: Supplier;
  purchaseOrder: Pick<PurchaseOrder, "id" | "poNumber">;
  createdBy?: Pick<User, "id" | "name"> | null;
}

export interface InvoiceWithItems extends Invoice {
  items: InvoiceItem[];
  order: Pick<Order, "id" | "orderNumber">;
}

// ---- admin dashboard ----

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockCount: number;
  revenueChange: number;
  ordersChange: number;
}

export interface SalesChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface LowStockItem {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
  reorderPoint: number;
  image: string | null;
}
