import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client"; // ✅ مسار Lovable الصحيح
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Loader2, User as UserIcon, ChefHat, ShoppingBag } from "lucide-react"; // أيقونات جميلة

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [role, setRole] = useState<string>("buyer"); // الحالة المحلية للدور
  const [isSwitching, setIsSwitching] = useState(false); // حالة تحميل الزر
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 1. جلب المستخدم الحالي عند فتح الصفحة
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth"); // توجيه لصفحة الدخول إذا لم يكن مسجلاً
        return;
      }
      setUser(session.user);

      // جلب الدور الحالي
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();

      if (profile) {
        setRole(profile.role || "buyer");
      }
      setLoadingUser(false);
    };

    getUser();
  }, [navigate]);

  // 2. دالة التبديل الذكية (المصححة)
  const handleToggleRole = async () => {
    if (!user) return;

    setIsSwitching(true); // تشغيل السبينر
    const newRole = role === "seller" ? "buyer" : "seller";

    try {
      // إرسال التحديث لـ Supabase
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);

      if (error) throw error;

      // ✅ نجاح! نحدث الحالة المحلية فوراً
      setRole(newRole);

      // ✅ إجبار التطبيق على تحديث المعلومات في الخلفية (لإظهار/إخفاء الأزرار)
      await queryClient.invalidateQueries({ queryKey: ["profile"] });

      toast.success(newRole === "seller" ? "أهلاً بك في لوحة البائع! 👨‍🍳" : "تم التحويل لحساب مشتري 🛍️");
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء التبديل، حاول مرة أخرى");
    } finally {
      // ✅ الأهم: إيقاف السبينر مهما حدث
      setIsSwitching(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDF6F6]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F6] pb-24 pt-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* رأس الصفحة */}
        <div className="text-center space-y-2">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto border-4 border-white">
              {role === "seller" ? (
                <ChefHat className="w-10 h-10 text-primary" />
              ) : (
                <UserIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 bg-primary text-white text-xs px-2 py-1 rounded-full border-2 border-white">
              {role === "seller" ? "بائع" : "مشتري"}
            </span>
          </div>
          <h2 className="text-2xl font-bold font-tajawal text-gray-800">حسابي</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>

        {/* بطاقة التحكم */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 shadow-sm border border-white/50 space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
            <span className="text-gray-600 font-medium">نوع الحساب الحالي:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${role === "seller" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
            >
              {role === "seller" ? "تاجر حلويات 🧁" : "زبون 👤"}
            </span>
          </div>

          <button
            onClick={handleToggleRole}
            disabled={isSwitching}
            className="w-full relative overflow-hidden bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSwitching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جارٍ التبديل...
              </>
            ) : (
              <>
                {role === "seller" ? <ShoppingBag className="w-5 h-5" /> : <ChefHat className="w-5 h-5" />}
                {role === "seller" ? "التبديل إلى حساب مشتري" : "التبديل إلى حساب بائع"}
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">يمكنك التبديل بين الحسابين في أي وقت لتجربة التطبيق.</p>
        </div>
      </div>
    </div>
  );
}
