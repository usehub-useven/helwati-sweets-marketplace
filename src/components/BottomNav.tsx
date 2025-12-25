import { Home, Search, Heart, User, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const baseNavItems = [
  { icon: Home, label: "الرئيسية", path: "/home" },
  { icon: Search, label: "بحث", path: "/search" },
  { icon: Heart, label: "المفضلة", path: "/favorites" },
  { icon: User, label: "حسابي", path: "/profile" },
];

const sellerNavItem = { icon: LayoutDashboard, label: "لوحتي", path: "/dashboard" };

export const BottomNav = () => {
  const location = useLocation();
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();
        
        setIsSeller(profile?.role === "seller");
      }
    };

    checkUserRole();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .maybeSingle();
          
          setIsSeller(profile?.role === "seller");
        } else {
          setIsSeller(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Build nav items based on role
  const navItems = isSeller 
    ? [...baseNavItems.slice(0, 3), sellerNavItem, baseNavItems[3]]
    : baseNavItems;

  // دالة الاهتزاز (Haptic Feedback)
  const handleNavClick = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav pb-6 pt-2 border-t border-white/20 md:hidden">
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className="relative flex flex-col items-center justify-center w-16 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-glow"
                  className="absolute inset-0 bg-accent/10 rounded-2xl -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    isActive
                      ? "text-accent stroke-[2.5px]"
                      : "text-muted-foreground/80 stroke-2",
                  )}
                />
              </motion.div>

              <motion.span
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.9,
                }}
                className={cn(
                  "text-[10px] font-medium mt-1 transition-colors duration-300",
                  isActive ? "text-accent" : "text-muted-foreground",
                )}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
