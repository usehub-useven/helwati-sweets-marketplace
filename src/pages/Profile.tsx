import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, User, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch profile
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();
        setProfile(data);
      }
      setLoading(false);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle();
          setProfile(data);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 glass border-b border-border/50">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">حسابي 👤</h1>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              مرحباً بك
            </h2>
            <p className="text-muted-foreground mb-6">
              سجّل دخولك للوصول إلى حسابك وإدارة منتجاتك
            </p>
            <Button
              asChild
              className="gradient-gold text-accent-foreground font-bold px-8 h-12 rounded-xl"
            >
              <Link to="/auth">تسجيل الدخول</Link>
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">حسابي 👤</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-6 text-center mb-6">
          <div className="w-24 h-24 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-accent-foreground" />
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {profile?.full_name || "مستخدم جديد"}
          </h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          {profile?.wilaya && (
            <p className="text-muted-foreground text-sm mt-1">
              📍 {profile.wilaya}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="h-5 w-5 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
