import { Home, Search, PlusCircle, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/home" },
  { icon: Search, label: "بحث", path: "/search" },
  { icon: PlusCircle, label: "إضافة", path: "/add" },
  { icon: Heart, label: "المفضلة", path: "/favorites" },
  { icon: User, label: "حسابي", path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();

  // دالة الاهتزاز (Haptic Feedback)
  const handleNavClick = () => {
    // التحقق مما إذا كان المتصفح يدعم الاهتزاز
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15); // اهتزاز خفيف جداً لمدة 15ms
    }
  };

  return (
    // استخدام glass-nav التي قمنا بتحسينها في CSS
    // إضافة pb-6 لضمان مسافة أمان في هواتف الأيفون الحديثة
    // Hidden on desktop (md and up)
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
              {/* الخلفية المضيئة المتحركة (Active Glow) - تظهر فقط عند التفعيل */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-glow"
                  className="absolute inset-0 bg-accent/10 rounded-2xl -z-10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* الأيقونة مع حركة القفز */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0, // ترتفع قليلاً عند التفعيل
                }}
                whileTap={{ scale: 0.9 }} // تنكمش عند الضغط
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    isActive
                      ? "text-accent stroke-[2.5px]" // سميكة وملونة عند التفعيل
                      : "text-muted-foreground/80 stroke-2", // رمادية ونحيفة عند الخمول
                  )}
                />
              </motion.div>

              {/* النص أسفل الأيقونة */}
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
