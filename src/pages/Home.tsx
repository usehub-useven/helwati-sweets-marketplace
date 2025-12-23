import { useState, useMemo, useCallback } from "react";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { products as mockProducts, Product, categories } from "@/data/mockData";
import { Bell, BellOff, RefreshCw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", message: "تم قبول طلبك للكيكة بنجاح ✅", timeAgo: "منذ دقيقتين", isRead: false },
  { id: "2", message: "عرض خاص: تخفيض 20% على البقلاوة 🔥", timeAgo: "منذ ساعة", isRead: false },
  { id: "3", message: "أم سارة أضافت منتج جديد 🍰", timeAgo: "منذ 3 ساعات", isRead: true },
  { id: "4", message: "مرحباً بك في تطبيق حلوتي 👋", timeAgo: "منذ يوم", isRead: true },
];

export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let filtered = productList;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const categoryName = categories.find(c => c.id === p.category)?.name?.toLowerCase() || "";
        const categoryMatch = categoryName.includes(query);
        return titleMatch || categoryMatch;
      });
    }

    return filtered;
  }, [selectedCategory, productList, searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;

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
              
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="relative p-3 rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors"
                    onClick={markAllAsRead}
                  >
                    <Bell className="h-5 w-5 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent 
                  align="end" 
                  className="w-80 p-0 bg-card border border-border shadow-elevated rounded-2xl z-50"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-foreground">الإشعارات</h3>
                  </div>
                  
                  {notifications.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-b border-border/50 last:border-0 transition-colors hover:bg-muted/50",
                            !notification.isRead && "bg-primary/5"
                          )}
                        >
                          <p className="text-sm text-foreground leading-relaxed">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {notification.timeAgo}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 px-4 text-center">
                      <BellOff className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">
                        لا توجد إشعارات حالياً
                      </p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن حلوى..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-10 h-12 rounded-xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
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
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-foreground font-medium mb-2">
              {isSearchActive 
                ? "عذراً، لم نجد أي حلوى بهذا الاسم"
                : "لا توجد حلويات في هذه الفئة حالياً"
              }
            </p>
            <p className="text-muted-foreground text-sm mb-6">
              {isSearchActive 
                ? `لا توجد نتائج لـ "${searchQuery}"`
                : "جرب اختيار فئة أخرى"
              }
            </p>
            {isSearchActive && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="rounded-xl"
              >
                <X className="h-4 w-4 ml-2" />
                مسح البحث
              </Button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
