import { useParams, useNavigate, Link } from "react-router-dom";
import { products, categories } from "@/data/mockData";
import { ArrowRight, Heart, MapPin, MessageCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    triggerHaptic(10);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    triggerHaptic(5);
    const shareData = {
      title: "Helwati",
      text: "اكتشف هذه الحلوى على حلواتي!",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "تمت المشاركة ✓",
          description: "تم مشاركة الرابط بنجاح",
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "تم النسخ ✓",
          description: "تم نسخ الرابط إلى الحافظة",
        });
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "تم النسخ ✓",
          description: "تم نسخ الرابط إلى الحافظة",
        });
      } catch {
        toast({
          title: "خطأ",
          description: "لم نتمكن من نسخ الرابط",
          variant: "destructive",
        });
      }
    }
  };

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl"
        >
          🍰
        </motion.div>
        <p className="text-xl font-bold text-foreground">المنتج غير موجود</p>
        <p className="text-muted-foreground text-center">
          عذراً، لم نتمكن من العثور على هذا المنتج
        </p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button onClick={() => navigate(-1)} className="rounded-xl">
            <ArrowRight className="h-4 w-4 ml-2" />
            العودة
          </Button>
        </motion.div>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن ${product.title} بسعر ${product.price.toLocaleString()} د.ج`
  );
  const whatsappLink = `https://wa.me/${product.seller.phone.replace("+", "")}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Immersive Hero Image */}
      <div className="relative">
        <motion.div
          layoutId={`product-image-${id}`}
          className={cn(
            "w-full aspect-[4/3] bg-muted relative overflow-hidden",
            !imageLoaded && "animate-pulse"
          )}
        >
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>

        {/* Floating Glass Back Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-3 rounded-full glass-nav shadow-lg"
        >
          <ArrowRight className="h-5 w-5 text-foreground" />
        </motion.button>

        {/* Floating Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 flex gap-2"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={cn(
              "p-3 rounded-full glass-nav shadow-lg transition-all duration-300 flex items-center gap-1.5",
              liked && "bg-destructive/20"
            )}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                liked ? "fill-destructive text-destructive scale-110" : "text-foreground"
              )} 
            />
            <span className={cn(
              "text-xs font-bold",
              liked ? "text-destructive" : "text-foreground"
            )}>{likeCount}</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleShare} 
            className="p-3 rounded-full glass-nav shadow-lg"
          >
            <Share2 className="h-5 w-5 text-foreground" />
          </motion.button>
        </motion.div>

        {/* Category Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-6 right-4 px-4 py-2 rounded-full glass-nav text-sm font-bold shadow-lg"
        >
          {category?.icon} {category?.name}
        </motion.div>
      </div>

      {/* Glassmorphic Content Sheet */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          delay: 0.1
        }}
        className="relative -mt-6 rounded-t-3xl glass-card border-t border-white/30 pb-32"
      >
        <div className="px-5 py-6 space-y-6">
          {/* Drag Handle */}
          <div className="flex justify-center">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>

          {/* Title & Price */}
          <div className="flex items-start justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="gradient-gold text-accent-foreground px-4 py-2.5 rounded-2xl text-lg font-bold whitespace-nowrap shadow-lg"
            >
              {product.price.toLocaleString()} د.ج
            </motion.div>
          </div>

          {/* Seller Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to={`/seller/${product.seller.id}`}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="glass-card rounded-2xl p-4 border border-border/50 shadow-sm active:shadow-inner transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg truncate">
                      {product.seller.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{product.seller.wilaya}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="h-4 w-4 text-accent fill-accent" />
                      <span className="text-sm font-bold text-foreground">
                        {product.seller.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({product.seller.totalProducts} منتج)
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180 flex-shrink-0" />
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            <h4 className="font-bold text-foreground">معلومات إضافية</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-2xl mb-1">🍰</p>
                <p className="text-xs text-muted-foreground">صنع يدوي</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-2xl mb-1">🚚</p>
                <p className="text-xs text-muted-foreground">توصيل متاح</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Sticky WhatsApp CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 p-4 glass-nav border-t border-white/20 z-50"
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            asChild
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6D] text-white text-lg font-bold shadow-xl relative overflow-hidden group"
            onClick={() => triggerHaptic(15)}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              {/* Pulse Animation */}
              <span className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
              <MessageCircle className="h-6 w-6 ml-3" />
              اطلب عبر واتساب
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
