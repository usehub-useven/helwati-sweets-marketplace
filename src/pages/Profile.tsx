import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChefHat, LogIn, Mail, Lock, UserPlus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Profile = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">حسابي 👤</h1>
        </div>
      </header>

      <main className="px-4 py-8">
        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-6">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4">
              <ChefHat className="h-10 w-10 text-accent-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {isLogin ? "مرحباً بعودتك" : "انضم إلينا"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "سجّل دخولك للوصول إلى حسابك"
                : "أنشئ حسابك وابدأ البيع اليوم"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                isLogin
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground"
              )}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-medium transition-all",
                !isLogin
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground"
              )}
            >
              حساب جديد
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="h-12 pr-12 rounded-xl bg-card border-border/50 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pr-12 rounded-xl bg-card border-border/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-xl gradient-gold text-accent-foreground text-lg font-bold mt-6"
            >
              {isLogin ? (
                <>
                  <LogIn className="h-5 w-5 ml-2" />
                  تسجيل الدخول
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 ml-2" />
                  إنشاء حساب
                </>
              )}
            </Button>
          </form>

          {isLogin && (
            <button className="w-full text-center text-sm text-accent mt-4 hover:underline">
              نسيت كلمة المرور؟
            </button>
          )}
        </div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
