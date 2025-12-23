import { Button } from "@/components/ui/button";
import { ChefHat, Heart, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: ChefHat,
    title: "صانعات محترفات",
    description: "تواصل مع أفضل صانعات الحلويات في الجزائر",
  },
  {
    icon: MapPin,
    title: "قريب منك",
    description: "اعثر على الحلويات اللذيذة في ولايتك",
  },
  {
    icon: MessageCircle,
    title: "تواصل مباشر",
    description: "اطلب مباشرة عبر واتساب بكل سهولة",
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

        {/* Illustration */}
        <div className="relative h-48 mb-12">
          <div className="absolute inset-0 flex items-center justify-center gap-4">
            {[
              "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200",
              "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200",
              "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200",
            ].map((img, i) => (
              <div
                key={i}
                className="w-28 h-28 rounded-2xl overflow-hidden shadow-elevated animate-fade-in-up"
                style={{ 
                  animationDelay: `${i * 200}ms`,
                  transform: `rotate(${(i - 1) * 8}deg)`,
                }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-4 flex items-center gap-4 animate-fade-in-up"
              style={{ animationDelay: `${(i + 3) * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/home")}
          className="w-full h-14 rounded-2xl gradient-gold text-accent-foreground text-lg font-bold shadow-elevated hover:shadow-soft transition-all duration-300 hover:scale-[1.02]"
        >
          <Heart className="h-5 w-5 ml-2" />
          ابدأ الآن
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          أكثر من 500+ صانعة حلويات في انتظارك 🍰
        </p>
      </div>
    </div>
  );
};

export default Landing;
