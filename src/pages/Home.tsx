import { useState, useMemo } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { products } from "@/data/mockData";
import { Bell } from "lucide-react";

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                مرحباً بك 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                اكتشف أشهى الحلويات اليوم
              </p>
            </div>
            <button className="relative p-3 rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>

          {/* Categories */}
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </header>

      {/* Products Grid */}
      <main className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🍰</span>
            <p className="text-muted-foreground">
              لا توجد حلويات في هذه الفئة حالياً
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
