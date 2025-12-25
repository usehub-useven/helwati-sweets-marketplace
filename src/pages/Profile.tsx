import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Role = "buyer" | "seller";

export default function Profile() {
  const [role, setRole] = useState<Role>("buyer");
  const [loading, setLoading] = useState(false);

  // جلب الدور عند فتح الصفحة
  useEffect(() => {
    const loadRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();

      if (data?.role) {
        setRole(data.role);
        localStorage.setItem("role", data.role);
      }
    };

    loadRole();
  }, []);

  const toggleRole = async () => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const newRole: Role = role === "buyer" ? "seller" : "buyer";

      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", user.id);

      if (error) throw error;

      setRole(newRole);
      localStorage.setItem("role", newRole);

      toast.success(`تم التحويل إلى ${newRole === "seller" ? "بائع" : "زبون"}`);
    } catch (e) {
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
