import { Button } from "@/components/ui/button";
import { ChefHat, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroCarousel } from "@/components/HeroCarousel";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const features = [
  {
    icon: ChefHat,
    title: "صانعات محترفات",
    description: "تواصل مع أفضل صانعات الحلويات في الجزائر",
    glowColor: "from-amber-500/30 to-orange-400/20",
    activeGlow: "from-amber-400 to-orange-500",
    iconColor: "text-amber-500",
    activeBorder: "border-amber-400",
    bgTint: "from-amber-950/40 via-amber-900/20 to-transparent",
  },
  {
    icon: MapPin,
    title: "قريب منك",
    description: "اعثر على الحلويات اللذيذة في ولايتك",
    glowColor: "from-sky-500/30 to-cyan-400/20",
    activeGlow: "from-sky-400 to-cyan-500",
    iconColor: "text-sky-500",
    activeBorder: "border-sky-400",
    bgTint: "from-sky-950/40 via-sky-900/20 to-transparent",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر",
    description: "اطلب مباشرة عبر واتساب بكل سهولة",
    glowColor: "from-emerald-500/30 to-green-400/20",
    activeGlow: "from-emerald-400 to-green-500",
    iconColor: "text-emerald-500",
    activeBorder: "border-emerald-400",
    bgTint: "from-emerald-950/40 via-emerald-900/20 to-transparent",
  },
];

export const Landing = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<number | null>(null);

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

        {/* Apple-Style Morphing Feature Cards */}
        <div className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              layout
              onClick={() => setActiveCard(activeCard === i ? null : i)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl
                animate-fade-in-up`}
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              {/* Glow Effect Behind Card */}
              <motion.div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${feature.glowColor} blur-xl`}
                animate={{
                  opacity: activeCard === i ? 1 : 0.4,
                  scale: activeCard === i ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              
              {/* Card Content */}
              <motion.div
                layout
                className={`relative p-4 backdrop-blur-xl rounded-2xl
                  border-2 transition-colors duration-300
                  ${activeCard === i 
                    ? `${feature.activeBorder} bg-gradient-to-br ${feature.bgTint}` 
                    : 'border-white/10 bg-white/5'
                  }`}
                style={{
                  boxShadow: activeCard === i 
                    ? `0 0 30px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)` 
                    : 'inset 0 1px 0 rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <motion.div 
                    layout
                    animate={{
                      scale: activeCard === i ? 1.2 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`relative flex items-center justify-center rounded-xl
                      ${activeCard === i ? 'w-14 h-14' : 'w-12 h-12'}
                      bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm
                      border border-white/20`}
                  >
                    {/* Icon Glow */}
                    {activeCard === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 bg-gradient-to-br ${feature.activeGlow} opacity-30 blur-md rounded-xl`}
                      />
                    )}
                    <feature.icon className={`h-6 w-6 relative z-10 transition-colors duration-300 ${feature.iconColor}`} />
                  </motion.div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{feature.title}</h3>
                    <motion.p 
                      layout
                      className="text-sm text-muted-foreground"
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {activeCard === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <p className="text-sm text-muted-foreground/80">
                        اضغط للمتابعة واكتشاف المزيد من الميزات الرائعة
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Liquid Gem CTA Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative"
        >
          {/* Button Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-glow-pulse"
            style={{
              background: "linear-gradient(135deg, #be123c 0%, #7e22ce 50%, #fda4af 100%)",
            }}
          />
          
          <Button
            onClick={() => navigate("/auth")}
            className="relative w-full h-16 rounded-full text-lg font-bold overflow-hidden
              animate-liquid"
            style={{
              background: "linear-gradient(135deg, #be123c 0%, #7e22ce 33%, #fda4af 66%, #be123c 100%)",
              backgroundSize: "300% 300%",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: "inset 0 2px 10px rgba(255,255,255,0.4), 0 10px 30px rgba(190, 18, 60, 0.4)",
            }}
          >
            <span 
              className="relative z-10 text-white"
              style={{
                textShadow: "0 2px 10px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              ابدأ الآن
            </span>
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
