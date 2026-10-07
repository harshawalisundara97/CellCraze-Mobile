import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface CategoryCardData {
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
  index: number;
}

interface CategoryCardProps {
  category: CategoryCardData;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const indexLabel = String(category.index).padStart(2, "0");

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative p-5 flex flex-col gap-3"
    >
      {/* Index */}
      <span className="text-[12px] tnum text-ink/70">{indexLabel}</span>

      {/* Image well */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-contain grayscale"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </div>

      {/* Name + count */}
      <div>
        <span className="block text-[18px] font-[800] leading-tight text-ink group-hover:text-accent transition-colors">
          {category.name}
        </span>
        <span className="block text-[12px] text-muted mt-[2px]">
          {category.productCount} products
        </span>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={18}
        className="absolute bottom-5 right-5 text-ink/40 group-hover:text-accent transition-colors"
      />
    </Link>
  );
}
