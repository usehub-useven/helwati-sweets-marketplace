import { Button } from "@/components/ui/button";
import { ChefHat, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroCarousel } from "@/components/HeroCarousel";
import { motion } from "framer-motion";

const features = [
  {
    icon: ChefHat,
    title: "صانعات محترفات",
    description: "تواصل مع أفضل صانعات الحلويات في الجزائر",
    glowColor: "hover:border-amber-400 hover:shadow-amber-400/30",
    iconColor: "text-amber-500",
    bgGlow: "group-hover:bg-amber-400/10",
  },
  {
    icon: MapPin,
    title: "قريب منك",
    description: "اعثر على الحلويات اللذيذة في ولايتك",
    glowColor: "hover:border-sky-400 hover:shadow-sky-400/30",
    iconColor: "text-sky-500",
    bgGlow: "group-hover:bg-sky-400/10",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر",
    description: "اطلب مباشرة عبر واتساب بكل سهولة",
    glowColor: "hover:border-green-500 hover:shadow-green-500/30",
    iconColor: "text-green-500",
    bgGlow: "group-hover:bg-green-400/10",
  },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-primary overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-12">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-rose-deep/20 rounded-full blur-3xl" />
        
        {/* Logo & Title */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl gradient-gold shadow-elevated mb-6 animate-float">
            <span className="text-5xl">🧁</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3">
            حلوتي
          </h1>
          <p className="text-lg text-muted-foreground">
            أشهى الحلويات الجزائرية من بيتنا لبيتك
          </p>
        </div>

        {/* 3D Hero Carousel */}
        <div className="mb-12">
          <HeroCarousel />
        </div>

        {/* Interactive Feature Cards */}
        <div className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up cursor-pointer
                border-2 border-transparent transition-all duration-300 hover:shadow-lg
                ${feature.glowColor}`}
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <div className={`relative w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center transition-colors duration-300 ${feature.bgGlow}`}>
                <feature.icon className={`h-6 w-6 transition-colors duration-300 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Living Gradient CTA Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="animate-pulse-slow"
        >
          <Button
            onClick={() => navigate("/auth")}
            className="w-full h-14 rounded-full text-white text-lg font-bold shadow-lg shadow-rose-500/40
              bg-[length:200%_200%] animate-gradient-x transition-all duration-300
              hover:shadow-xl hover:shadow-purple-500/40"
            style={{
              background: "linear-gradient(90deg, #E11D48, #7C3AED, #F59E0B, #E11D48)",
              backgroundSize: "200% 200%",
            }}
          >
            ابدأ الآن
          </Button>
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          أكثر من 500+ صانعة حلويات في انتظارك 🍰
        </p>
      </div>
    </div>
  );
};

export default Landing;
