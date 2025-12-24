import { useParams, useNavigate, Link } from "react-router-dom";
import { products, categories } from "@/data/mockData";
import { ArrowRight, ChevronLeft, Heart, MapPin, MessageCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
    },
  },
};

const sellerVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
};

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-background">
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
      {/* Layer 1: Immersive Hero Image */}
      <div className="relative">
        <motion.div
          layoutId={`product-image-${id}`}
          className={cn(
            "w-full h-[50vh] bg-muted relative overflow-hidden",
            !imageLoaded && "animate-pulse"
          )}
        >
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-700",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />
        </motion.div>

        {/* Floating Glass Back Button - Top Right */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-3 rounded-full backdrop-blur-md bg-white/30 border border-white/40 shadow-xl"
        >
          <ChevronLeft className="h-6 w-6 text-white rotate-180" />
        </motion.button>

        {/* Floating Action Buttons - Top Left */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute top-4 left-4 flex gap-3"
        >
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={cn(
              "p-3 rounded-full backdrop-blur-md border border-white/40 shadow-xl transition-all duration-300 flex items-center gap-1.5",
              liked ? "bg-destructive/30" : "bg-white/30"
            )}
          >
            <Heart 
              className={cn(
                "h-5 w-5 transition-all duration-300",
                liked ? "fill-white text-white scale-110" : "text-white"
              )} 
            />
            <span className="text-xs font-bold text-white">{likeCount}</span>
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleShare} 
            className="p-3 rounded-full backdrop-blur-md bg-white/30 border border-white/40 shadow-xl"
          >
            <Share2 className="h-5 w-5 text-white" />
          </motion.button>
        </motion.div>

        {/* Category Badge - Bottom */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="absolute bottom-16 right-6 px-4 py-2 rounded-full backdrop-blur-md bg-white/25 border border-white/40 text-sm font-bold text-white shadow-xl"
        >
          {category?.icon} {category?.name}
        </motion.div>
      </div>

      {/* Layer 2: Glass Sheet Content Container */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 120,
          delay: 0.15
        }}
        className="relative -mt-12 rounded-t-[32px] backdrop-blur-xl bg-background/80 border-t border-white/40 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.2)] pb-32 min-h-[60vh]"
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full" />
        </div>

        {/* Staggered Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-6 py-4 space-y-6"
        >
          {/* Title & Price Row */}
          <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-black text-foreground leading-tight">
                {product.title}
              </h1>
            </div>
            
            <div className="relative">
              {/* Glass Price Pill */}
              <div className="px-5 py-3 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/30">
                <span className="text-xl font-black text-white whitespace-nowrap">
                  {product.price.toLocaleString()} د.ج
                </span>
              </div>
              {/* Subtle glow */}
              <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-xl -z-10" />
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {product.description}
            </p>
          </motion.div>

          {/* Premium Seller Capsule */}
          <motion.div variants={sellerVariants}>
            <Link to={`/seller/${product.seller.id}`}>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                className="relative rounded-2xl p-4 backdrop-blur-lg bg-card/60 border border-border/60 shadow-lg overflow-hidden group"
              >
                {/* Inner glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                <div className="relative flex items-center gap-4">
                  {/* Avatar with ring */}
                  <div className="relative">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
                    />
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg truncate">
                      {product.seller.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
                      <span className="truncate">{product.seller.wilaya}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-foreground">
                        {product.seller.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({product.seller.totalProducts} منتج)
                      </span>
                    </div>
                  </div>
                  
                  {/* Chevron */}
                  <div className="p-2 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-colors">
                    <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Additional Info Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h4 className="font-bold text-foreground">معلومات إضافية</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 backdrop-blur-sm bg-card/50 border border-border/40 text-center">
                <p className="text-3xl mb-2">🍰</p>
                <p className="text-sm text-muted-foreground font-medium">صنع يدوي</p>
              </div>
              <div className="rounded-xl p-4 backdrop-blur-sm bg-card/50 border border-border/40 text-center">
                <p className="text-3xl mb-2">🚚</p>
                <p className="text-sm text-muted-foreground font-medium">توصيل متاح</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Layer 3: Sticky Glass CTA Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg bg-background/60 border-t border-white/20 z-50"
      >
        <motion.div
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="relative"
        >
          <Button
            asChild
            className="w-full h-14 rounded-full bg-gradient-to-r from-[#25D366] via-[#20BD5A] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6D] text-white text-lg font-bold shadow-xl shadow-[#25D366]/30 relative overflow-hidden"
            onClick={() => triggerHaptic(15)}
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              {/* Animated pulse ring */}
              <span className="absolute inset-0 rounded-full animate-[pulse_2s_ease-in-out_infinite] bg-white/10" />
              {/* Shine effect */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
              <MessageCircle className="h-6 w-6 ml-3 relative z-10" />
              <span className="relative z-10">اطلب عبر واتساب</span>
            </a>
          </Button>
          
          {/* Glow effect under button */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-[#25D366]/40 blur-xl rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
