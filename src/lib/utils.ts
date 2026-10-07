import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `Rs ${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CC-${num}`;
}

export function generatePONumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(100 + Math.random() * 9900).toString().padStart(4, "0");
  return `PO-${year}-${num}`;
}

export function generateGRNNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(100 + Math.random() * 9900).toString().padStart(4, "0");
  return `GRN-${year}-${num}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(100 + Math.random() * 9900).toString().padStart(4, "0");
  return `INV-${year}-${num}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStockStatus(quantity: number, threshold = 5) {
  if (quantity === 0) return { label: "Out of stock", color: "neutral-400" as const, urgent: true };
  if (quantity <= threshold) return { label: `Only ${quantity} left`, color: "accent" as const, urgent: true };
  return { label: "In stock", color: "ink" as const, urgent: false };
}
