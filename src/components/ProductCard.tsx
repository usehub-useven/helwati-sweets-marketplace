import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { createLikeNotification } from "@/lib/notifications";
import { toast } from "sonner";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    category: string;
    seller: {
      id: string;
      name: string;
      avatar: string;
      wilaya: string;
    };
  };
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id || null);
    });

    // Check if user has liked this product and get like count
    const checkLikeStatus = async () => {
      const { data: likes, error } = await supabase
        .from("product_likes")
        .select("user_id")
        .eq("product_id", product.id);

      if (!error && likes) {
        setLikeCount(likes.length);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setLiked(likes.some(like => like.user_id === session.user.id));
        }
      }
    };

    checkLikeStatus();
  }, [product.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUserId) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setIsAnimating(true);
    
    if (liked) {
      // Unlike
      const { error } = await supabase
        .from("product_likes")
        .delete()
        .eq("product_id", product.id)
        .eq("user_id", currentUserId);

      if (!error) {
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      }
    } else {
      // Like
      const { error } = await supabase
        .from("product_likes")
        .insert({
          product_id: product.id,
          user_id: currentUserId,
        });

      if (!error) {
        setLiked(true);
        setLikeCount(prev => prev + 1);
        
        // Create notification for product owner
        await createLikeNotification({
          productOwnerId: product.seller.id,
          actorId: currentUserId,
          productTitle: product.title,
          productId: product.id,
        });
      }
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

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
            onClick={handleLike}
            className={cn(
              "absolute top-3 left-3 p-2 rounded-full glass transition-all duration-300 flex items-center gap-1",
              liked ? "text-destructive bg-destructive/20" : "text-foreground/70"
            )}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                liked && "fill-current",
                isAnimating && "scale-125"
              )}
            />
            <span className="text-xs font-medium">{likeCount}</span>
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
