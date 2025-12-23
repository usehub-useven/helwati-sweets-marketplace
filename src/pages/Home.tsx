import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { CategoryFilter } from "@/components/CategoryFilter";
import { HeroCarousel } from "@/components/HeroCarousel";
import { products as mockProducts, Product, categories } from "@/data/mockData";
import { Bell, BellOff, RefreshCw, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

// إعدادات الحركة الفيزيائية للأزرار
const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 17,
};

// إعدادات ظهور القائمة (تتابع)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // كل عنصر يظهر بعد الآخر بـ 0.1 ثانية
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [productList, setProductList] = useState<Product[]>(mockProducts);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user logic
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications(currentUserId);

  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleRefresh = useCallback(() => {
    // تفعيل الاهتزاز عند التحديث
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(20);

    setIsRefreshing(true);
    setTimeout(() => {
      setProductList(shuffleArray(mockProducts));
      setIsRefreshing(false);
    }, 1500); // 1.5 seconds delay to show the beautiful skeleton
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsPopoverOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleSwipeEnd = (id: string, info: PanInfo) => {
    if (info.offset.x < -100) {
      deleteNotification(id);
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ar });
    } catch {
      return "";
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = productList;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(query);
        const categoryName = categories.find((c) => c.id === p.category)?.name?.toLowerCase() || "";
        const categoryMatch = categoryName.includes(query);
        return titleMatch || categoryMatch;
      });
    }

    return filtered;
  }, [selectedCategory, productList, searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header - Apple-style Glassmorphism */}
      <header className="sticky top-0 z-40 glass-nav pt-safe">
        <div className="px-4 py-3 space-y-4">
          {/* Top Row: Welcome & Actions */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold text-foreground tracking-tight">مرحباً بك 👋</h1>
              <p className="text-xs text-muted-foreground font-medium">اكتشف أشهى الحلويات اليوم</p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                transition={springTransition}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="relative p-2.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50"
              >
                <RefreshCw className={cn("h-5 w-5 text-foreground/80", isRefreshing && "animate-spin")} />
              </motion.button>

              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    transition={springTransition}
                    className="relative p-2.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    onClick={() => markAllAsRead()}
                  >
                    <Bell className="h-5 w-5 text-foreground/80" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse border border-white" />
                    )}
                  </motion.button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0 glass-card border-white/20 shadow-elevated rounded-2xl z-50 overflow-hidden mt-2"
                >
                  <div className="p-4 border-b border-border/10 bg-white/50 flex items-center justify-between backdrop-blur-md">
                    <h3 className="font-bold text-foreground text-sm">الإشعارات</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-destructive hover:text-destructive/80 transition-colors font-medium px-2 py-1 rounded-md hover:bg-destructive/10"
                      >
                        حذف الكل
                      </button>
                    )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                      <AnimatePresence mode="popLayout">
                        {notifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                            className="relative overflow-hidden"
                          >
                            {/* Swipe Delete Background */}
                            <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-6">
                              <Trash2 className="h-5 w-5 text-white" />
                            </div>

                            {/* Notification Card */}
                            <motion.div
                              drag="x"
                              dragDirectionLock
                              dragConstraints={{ left: -100, right: 0 }}
                              dragElastic={0.1}
                              onDragEnd={(_, info) => handleSwipeEnd(notification.id, info)}
                              className={cn(
                                "relative p-4 border-b border-border/40 last:border-0 transition-colors cursor-pointer bg-white/60 backdrop-blur-sm active:bg-white/80",
                                !notification.is_read && "bg-primary/5",
                              )}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex gap-3">
                                <div
                                  className="mt-1 h-2 w-2 rounded-full bg-accent shrink-0"
                                  style={{ opacity: notification.is_read ? 0 : 1 }}
                                />
                                <div>
                                  {notification.title && (
                                    <p className="text-sm font-semibold text-foreground mb-0.5">{notification.title}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <span className="text-[10px] text-muted-foreground/60 mt-1.5 block">
                                    {formatTimeAgo(notification.created_at)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="py-12 px-4 text-center bg-white/40">
                      <BellOff className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-xs">لا توجد إشعارات حالياً</p>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
            <Input
              type="text"
              placeholder="ابحث عن حلوى (بقلاوة، تارت)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-10 h-11 rounded-xl bg-secondary/50 border-transparent focus:border-accent/30 focus:bg-white/80 transition-all text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="pb-1">
            <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
        </div>
      </header>

      {/* Hero Carousel */}
      <section className="py-6">
        <HeroCarousel />
      </section>

      {/* Products Grid */}
      <main className="px-4">
        {isRefreshing ? (
          // Skeleton Loading Grid
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          // Real Products Grid with Staggered Animation
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-foreground font-bold mb-2">
              {isSearchActive ? "عذراً، لم نجد أي حلوى" : "لا توجد حلويات هنا"}
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-[200px] mx-auto">
              {isSearchActive ? `جرب البحث بكلمة أخرى غير "${searchQuery}"` : "جرب اختيار فئة أخرى أو عد لاحقاً"}
            </p>
            {isSearchActive && (
              <Button
                onClick={clearSearch}
                variant="outline"
                className="rounded-xl border-accent/20 text-accent hover:text-accent hover:bg-accent/5"
              >
                <X className="h-4 w-4 ml-2" />
                مسح البحث
              </Button>
            )}
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
