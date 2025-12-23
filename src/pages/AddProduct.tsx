import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";

export const AddProduct = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">إضافة منتج ✨</h1>
        </div>
      </header>

      <main className="px-4 py-12">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">
            سجّل الدخول أولاً
          </h2>
          <p className="text-muted-foreground mb-6">
            لإضافة منتجاتك، يجب عليك تسجيل الدخول إلى حسابك أو إنشاء حساب جديد
          </p>
          <Button
            asChild
            className="gradient-gold text-accent-foreground font-bold px-8 h-12 rounded-xl"
          >
            <Link to="/profile">
              تسجيل الدخول
            </Link>
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AddProduct;
