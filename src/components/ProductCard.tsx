import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link
      to={`/product/${product.id}`}
      className="block animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="glass-card rounded-2xl overflow-hidden group hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-muted animate-pulse",
              imageLoaded && "hidden"
            )}
          />
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
              !imageLoaded && "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className={cn(
              "absolute top-3 left-3 p-2 rounded-full glass transition-all duration-300",
              liked ? "text-destructive bg-destructive/20" : "text-foreground/70"
            )}
          >
            <Heart
              className={cn("h-5 w-5", liked && "fill-current")}
            />
          </button>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 gradient-gold text-accent-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            {product.price.toLocaleString()} د.ج
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 text-foreground">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>{product.seller.name}</span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-muted-foreground text-xs">
            <MapPin className="h-3 w-3" />
            <span>{product.seller.wilaya}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
