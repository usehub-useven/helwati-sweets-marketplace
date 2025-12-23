import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/home");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success("تم تسجيل الدخول بنجاح!");
        navigate("/home");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("هذا البريد الإلكتروني مسجل بالفعل");
          } else {
            toast.error(error.message);
          }
          return;
        }

        // Create profile for new user
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: formData.fullName,
            role: "buyer",
          });
        }

        toast.success("تم إنشاء الحساب بنجاح!");
        navigate("/home");
      }
    } catch (error) {
      toast.error("حدث خطأ، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-primary flex flex-col items-center justify-center px-6 py-12">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-rose-deep/20 rounded-full blur-3xl" />

      {/* Logo */}
      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-gold shadow-elevated mb-4 animate-float">
          <span className="text-4xl">🧁</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">حلوتي</h1>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-elevated animate-fade-in-up">
        <h2 className="text-2xl font-bold text-center text-foreground mb-6">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                الاسم الكامل
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="pr-10 h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              البريد الإلكتروني
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pr-10 h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary"
                required
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">
              كلمة المرور
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pr-10 pl-10 h-12 rounded-xl border-border/50 bg-background/50 focus:border-primary"
                required
                minLength={6}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl gradient-gold text-accent-foreground font-bold shadow-soft hover:shadow-elevated transition-all duration-300"
          >
            {loading
              ? "جاري التحميل..."
              : isLogin
              ? "تسجيل الدخول"
              : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="mr-2 text-primary font-bold hover:underline"
            >
              {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
            </button>
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        بالتسجيل، أنت توافق على شروط الاستخدام 🍰
      </p>
    </div>
  );
};

export default Auth;
