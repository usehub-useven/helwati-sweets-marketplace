import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ArrowRight, Heart, HeartCrack, Trash2 } from "lucide-react";
import { products } from "@/data/mockData";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { triggerHaptic } from "@/lib/haptics";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    }
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      scale: { duration: 0.2 },
      opacity: { duration: 0.2 },
      height: { delay: 0.2, duration: 0.3 },
      marginBottom: { delay: 0.2, duration: 0.3 },
    }
  }
};

const emptyStateVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const Favorites = () => {
  // Simulate favorites with first 4 mock products
  const [favorites, setFavorites] = useState(products.slice(0, 4));

  const handleRemoveFavorite = (productId: string) => {
    triggerHaptic(50);
    setFavorites(prev => prev.filter(p => p.id !== productId));
  };

  const handleClearAll = () => {
    triggerHaptic(100);
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-nav px-4 py-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">مفضلاتي</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              الحلويات التي نالت إعجابك
            </p>
          </div>
          
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                مسح الكل
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <main className="px-4 pt-6">
        <AnimatePresence mode="popLayout">
          {favorites.length > 0 ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {favorites.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout
                    className="relative"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="glass-card rounded-2xl overflow-hidden group">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Price Badge */}
                          <div className="absolute bottom-2 right-2 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <span className="text-sm font-bold text-primary-foreground">
                              {product.price.toLocaleString()} د.ج
                            </span>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-3">
                          <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                            {product.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <img
                              src={product.seller.avatar}
                              alt={product.seller.name}
                              className="w-5 h-5 rounded-full object-cover ring-1 ring-border"
                            />
                            <span className="text-xs text-muted-foreground truncate">
                              {product.seller.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Remove Button - Solid Red Heart */}
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveFavorite(product.id);
                      }}
                      className="absolute top-2 left-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty"
              variants={emptyStateVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-6"
              >
                <HeartCrack className="h-12 w-12 text-muted-foreground/60" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-bold text-foreground mb-2"
              >
                لم تختر حلوياتك المفضلة بعد
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-8"
              >
                ابدأ باستكشاف الحلويات وأضف ما يعجبك هنا
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link to="/home">
                  <Button 
                    size="lg" 
                    className="gap-2 px-8 py-6 text-base rounded-full"
                  >
                    تصفح الحلويات
                    <ArrowRight className="h-5 w-5 rotate-180" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default Favorites;