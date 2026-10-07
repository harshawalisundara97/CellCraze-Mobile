import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CellCraze — Mobile Phones & Accessories",
  description:
    "Shop the latest mobile phones, headphones, smartwatches and accessories at CellCraze. Genuine products with official warranty and island-wide delivery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${archivo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
