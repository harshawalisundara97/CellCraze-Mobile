"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/storefront/product-card";
import { useApi } from "@/hooks/use-api";
import { type ProductListResponse, toProductCardData } from "@/types/api";

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="px-[40px] py-10 text-muted">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const url =
    debounced.trim().length > 0
      ? `/api/products?search=${encodeURIComponent(debounced.trim())}&limit=1000`
      : "/api/products?limit=1000";
  const { data, loading } = useApi<ProductListResponse>(url);
  const results = (data?.products ?? []).map(toProductCardData);

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Search</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-6">Search</h1>

      <div className="max-w-[480px] mb-8">
        <Input
          variant="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      <div className="rule-top pt-6">
        <p className="text-[15px] text-muted mb-6">
          <span className="tnum font-[800] text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "result" : "results"}
          {query.trim() && (
            <>
              {" "}for &lsquo;<span className="text-ink font-semibold">{query.trim()}</span>&rsquo;
            </>
          )}
        </p>

        <div className="ruled-grid grid-cols-3 max-md:grid-cols-2">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {loading && (
          <p className="text-[15px] text-muted py-10 text-center">Searching...</p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-[15px] text-muted py-10 text-center">
            No products found. Try a different search term.
          </p>
        )}
      </div>
    </div>
  );
}
