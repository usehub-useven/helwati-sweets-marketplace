import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, ChefHat } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BottomNav = () => {
  const location = useLocation();

  // 1. جلب الدور بذكاء (نفس المفتاح 'profile' لضمان التزامن مع صفحة البروفايل)
  const { data: profile } = useQuery({
    queryKey: ["profile"], // ⚠️ مهم جداً: هذا المفتاح يربط هذا المكون بصفحة البروفايل
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();

      if (error) return null;
      return data;
    },
    staleTime: Infinity, // نحتفظ بالبيانات ولا نعيد الطلب إلا عند التعديل اليدوي (invalidate)
  });

  const isSeller = profile?.role === "seller";

  // وظيفة لتحديد هل الزر نشط أم لا
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <nav className="mx-auto max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl px-2 py-3 flex justify-around items-center transition-all duration-300">
        {/* الرئيسية */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive("/") ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Home className={`w-6 h-6 ${isActive("/") && "fill-current"}`} />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>

        {/* البحث */}
        <Link
          to="/search"
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive("/search") ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Search className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[10px] font-medium">بحث</span>
        </Link>

        {/* المفضلة */}
        <Link
          to="/favorites"
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive("/favorites") ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <Heart className={`w-6 h-6 ${isActive("/favorites") && "fill-current"}`} />
          <span className="text-[10px] font-medium">المفضلة</span>
        </Link>

        {/* ✨ الزر السحري: يظهر فقط للبائع ✨ */}
        {isSeller && (
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive("/dashboard") ? "text-orange-500 scale-110" : "text-gray-400 hover:text-orange-400"}`}
          >
            <div className={`p-1 rounded-full ${isActive("/dashboard") ? "bg-orange-100" : ""}`}>
              <ChefHat className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium text-orange-600">لوحتي</span>
          </Link>
        )}

        {/* حسابي */}
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive("/profile") ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"}`}
        >
          <User className={`w-6 h-6 ${isActive("/profile") && "fill-current"}`} />
          <span className="text-[10px] font-medium">حسابي</span>
        </Link>
      </nav>
    </div>
  );
};
