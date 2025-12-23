import { useParams, useNavigate } from "react-router-dom";
import { sellers, products } from "@/data/mockData";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const seller = sellers.find((s) => s.id === id);
  const sellerProducts = products.filter((p) => p.sellerId === id);

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">البائع غير موجود</p>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${seller.phone.replace("+", "")}`;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary pb-8">
        <div className="px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-full glass mb-4"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 text-center">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-elevated border-4 border-background/50"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {seller.name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span>{seller.wilaya}</span>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-accent fill-current" />
              <span className="font-bold">{seller.rating}</span>
            </div>
            <div className="w-px h-5 bg-border" />
            <span className="text-muted-foreground">
              {seller.totalProducts} منتج
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-4 -mt-4">
        <div className="glass-card rounded-2xl p-4 mb-6">
          <p className="text-foreground leading-relaxed">{seller.bio}</p>
        </div>
      </div>

      {/* Products */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-foreground mb-4">
          منتجات {seller.name}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {sellerProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {sellerProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">لا توجد منتجات حالياً</p>
          </div>
        )}
      </div>

      {/* Contact Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button
          asChild
          className="w-full h-14 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white text-lg font-bold shadow-lg"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Phone className="h-5 w-5 ml-2" />
            تواصل عبر واتساب
          </a>
        </Button>
      </div>
    </div>
  );
};

export default SellerProfile;
