import { Home, Search, PlusCircle, Heart, User, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "الرئيسية", path: "/home" },
  { icon: Search, label: "بحث", path: "/search" },
  { icon: LayoutDashboard, label: "لوحة التحكم", path: "/dashboard" },
  { icon: Heart, label: "المفضلة", path: "/favorites" },
  { icon: User, label: "حسابي", path: "/profile" },
];

export const DesktopNav = () => {
  const location = useLocation();

  return (
    // Only visible on md screens and up
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass-nav py-3 px-6 border-b border-white/20">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-accent">حلوتي</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-nav-active"
                    className="absolute inset-0 bg-accent/10 rounded-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive ? "text-accent" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
