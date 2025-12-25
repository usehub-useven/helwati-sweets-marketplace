import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Role = "buyer" | "seller";

export default function Profile() {
  const [role, setRole] = useState<Role>("buyer");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // جلب الدور عند فتح الصفحة
  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      // Fetch from user_roles table
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data?.role && (data.role === "buyer" || data.role === "seller")) {
        setRole(data.role);
        localStorage.setItem("role", data.role);
      }
    };

    loadRole();
  }, []);

  const toggleRole = async () => {
    if (!userId) return;
    
    setLoading(true);

    try {
      const newRole: Role = role === "buyer" ? "seller" : "buyer";

      // Update in user_roles table
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      setRole(newRole);
      localStorage.setItem("role", newRole);

      toast.success(`تم التحويل إلى ${newRole === "seller" ? "بائع" : "زبون"}`);
    } catch (e) {
      console.error("Error switching role:", e);
      toast.error("حدث خطأ أثناء تغيير الدور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">حسابي</h1>

      <div className="bg-white/60 backdrop-blur rounded-xl p-4">
        <p className="mb-2">
          نوع الحساب الحالي:
          <strong className="mr-2">{role === "seller" ? "بائع" : "زبون"}</strong>
        </p>

        <button onClick={toggleRole} disabled={loading} className="w-full bg-black text-white py-2 rounded-lg">
          {loading ? "جاري التغيير..." : "تغيير نوع الحساب"}
        </button>
      </div>
    </div>
  );
}
