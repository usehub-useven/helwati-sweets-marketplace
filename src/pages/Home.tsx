import { useState, useMemo, useCallback } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { products as mockProducts, Product } from "@/data/mockData";
import { Bell, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productList, setProductList] = useState<Product[]>(mockProducts);

  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setProductList(shuffleArray(mockProducts));
      setIsRefreshing(false);
    }, 1500);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productList;
    return productList.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, productList]);

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
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="relative p-3 rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("h-5 w-5 text-foreground", isRefreshing && "animate-spin")} />
              </button>
              <button className="relative p-3 rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors">
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
              </button>
            </div>
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
        {isRefreshing ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

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
