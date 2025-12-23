import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  created_at: string | null;
}

interface MyProductsSectionProps {
  userId: string;
}

export const MyProductsSection = ({ userId }: MyProductsSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, image_url, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchMyProducts();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">منشوراتي 📦</h3>
        <Button asChild size="sm" className="rounded-xl gradient-gold text-accent-foreground">
          <Link to="/add">
            <Plus className="h-4 w-4 ml-1" />
            إضافة
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              <div className="glass-card rounded-xl overflow-hidden hover:shadow-elevated transition-all duration-300">
                <div className="aspect-square bg-muted overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-foreground truncate">
                    {product.title}
                  </p>
                  {product.price && (
                    <p className="text-xs text-primary font-bold">
                      {product.price.toLocaleString()} د.ج
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm mb-4">
            لم تنشر أي منتجات بعد
          </p>
          <Button asChild className="rounded-xl gradient-gold text-accent-foreground">
            <Link to="/add">
              <Plus className="h-4 w-4 ml-2" />
              أضف منتجك الأول
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
