import { useState } from "react";
import { motion } from "framer-motion";
import { products } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { triggerHaptic } from "@/lib/haptics";

const featuredProducts = products.slice(0, 3);

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle item
  const navigate = useNavigate();

  const handleItemClick = (index: number, productId: string) => {
    if (index === activeIndex) {
      // If clicking active item, navigate to product
      navigate(`/product/${productId}`);
    } else {
      // Otherwise, make it active
      triggerHaptic(5);
      setActiveIndex(index);
    }
  };

  // Responsive offset based on screen size
  const getOffset = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 180; // lg
      if (window.innerWidth >= 768) return 150; // md
    }
    return 120; // mobile
  };

  const getItemStyles = (index: number) => {
    const diff = index - activeIndex;
    const offset = getOffset();
    
    if (diff === 0) {
      // Active (center)
      return {
        x: 0,
        scale: 1,
        rotateY: 0,
        zIndex: 10,
        filter: "blur(0px) brightness(1)",
      };
    } else if (diff === -1 || (activeIndex === 0 && index === 2)) {
      // Left side
      return {
        x: -offset,
        scale: 0.8,
        rotateY: 25,
        zIndex: 5,
        filter: "blur(2px) brightness(0.8)",
      };
    } else {
      // Right side
      return {
        x: offset,
        scale: 0.8,
        rotateY: -25,
        zIndex: 5,
        filter: "blur(2px) brightness(0.8)",
      };
    }
  };

  return (
    <div 
      className="relative h-52 md:h-72 lg:h-80 w-full overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {featuredProducts.map((product, index) => {
          const styles = getItemStyles(index);
          const isActive = index === activeIndex;
          
          return (
            <motion.div
              key={product.id}
              className="absolute cursor-pointer"
              animate={styles}
              transition={springTransition}
              style={{ 
                zIndex: styles.zIndex,
                transformStyle: "preserve-3d",
              }}
              whileTap={{ scale: isActive ? 0.95 : 0.85 }}
              onClick={() => handleItemClick(index, product.id)}
            >
              <div className="relative">
                {/* Image Card */}
                <div className="w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-elevated ring-1 ring-white/20">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Product Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-bold text-sm truncate drop-shadow-md">
                      {product.title}
                    </h3>
                    <p className="text-xs opacity-90 drop-shadow-md">
                      {product.price.toLocaleString()} د.ج
                    </p>
                  </div>
                </div>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                  >
                    <div className="w-8 h-1 bg-accent rounded-full" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Pagination Dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredProducts.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              triggerHaptic(3);
              setActiveIndex(index);
            }}
            className="p-1"
            whileTap={{ scale: 0.8 }}
          >
            <motion.div
              animate={{
                width: index === activeIndex ? 20 : 6,
                backgroundColor: index === activeIndex 
                  ? "hsl(var(--accent))" 
                  : "hsl(var(--muted-foreground) / 0.3)",
              }}
              transition={springTransition}
              className="h-1.5 rounded-full"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

