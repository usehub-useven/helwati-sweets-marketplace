import { useParams, useNavigate, Link } from "react-router-dom";
import { products, categories } from "@/data/mockData";
import { ArrowRight, Heart, MapPin, MessageCircle, Share2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLike = () => {
    setIsAnimating(true);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleShare = async () => {
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
      // User cancelled share or clipboard failed
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">المنتج غير موجود</p>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.category);

  const whatsappMessage = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن ${product.title} بسعر ${product.price.toLocaleString()} د.ج`
  );
  const whatsappLink = `https://wa.me/${product.seller.phone.replace("+", "")}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Image Header */}
      <div className="relative">
        <div
          className={cn(
            "w-full aspect-square bg-muted",
            !imageLoaded && "animate-pulse"
          )}
        >
          <img
            src={product.image}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover",
              !imageLoaded && "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-3 rounded-full glass"
        >
          <ArrowRight className="h-5 w-5" />
        </button>

        {/* Actions */}
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={handleLike}
            className={cn(
              "p-3 rounded-full glass transition-all duration-300 flex items-center gap-1",
              liked && "text-destructive bg-destructive/20"
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
          <button onClick={handleShare} className="p-3 rounded-full glass">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full glass text-sm font-medium">
          {category?.icon} {category?.name}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
          <div className="gradient-gold text-accent-foreground px-4 py-2 rounded-xl text-lg font-bold whitespace-nowrap">
            {product.price.toLocaleString()} د.ج
          </div>
        </div>

        {/* Seller Card */}
        <Link
          to={`/seller/${product.seller.id}`}
          className="block glass-card rounded-2xl p-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{product.seller.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{product.seller.wilaya}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 text-accent fill-current" />
                <span className="text-sm font-medium">{product.seller.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.seller.totalProducts} منتج)
                </span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-180" />
          </div>
        </Link>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/50">
        <Button
          asChild
          className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg font-bold shadow-lg"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5 ml-2" />
            اطلب عبر واتساب
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
