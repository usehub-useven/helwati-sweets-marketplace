import { useState, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { WilayaSelect } from "@/components/WilayaSelect";
import { products } from "@/data/mockData";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.includes(searchQuery) ||
        p.description.includes(searchQuery) ||
        p.seller.name.includes(searchQuery);
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      const matchesWilaya =
        !selectedWilaya || selectedWilaya === "all" || p.seller.wilaya === selectedWilaya;
      return matchesSearch && matchesCategory && matchesWilaya;
    });
  }, [searchQuery, selectedCategory, selectedWilaya]);

  const hasFilters = selectedCategory || (selectedWilaya && selectedWilaya !== "all");

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">بحث 🔍</h1>

          {/* Search Input */}
          <div className="relative mb-4">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن حلوى أو صانعة..."
              className="w-full h-12 pr-12 pl-12 rounded-xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              hasFilters
                ? "bg-accent text-accent-foreground"
                : "bg-card text-muted-foreground"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>الفلاتر</span>
            {hasFilters && (
              <span className="w-5 h-5 rounded-full bg-accent-foreground/20 text-xs flex items-center justify-center">
                {(selectedCategory ? 1 : 0) + (selectedWilaya && selectedWilaya !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Filters Panel */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              showFilters ? "max-h-48 mt-4" : "max-h-0"
            )}
          >
            <div className="space-y-4">
              <WilayaSelect value={selectedWilaya} onChange={setSelectedWilaya} />
              <CategoryFilter
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="px-4 py-6">
        <p className="text-sm text-muted-foreground mb-4">
          {filteredProducts.length} نتيجة
        </p>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-muted-foreground">
              لم نجد نتائج مطابقة لبحثك
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
