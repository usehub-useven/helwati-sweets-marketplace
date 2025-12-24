import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Lock,
  Loader2,
  ImagePlus,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  MapPin,
  Camera,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { categories, wilayas } from "@/data/mockData";
import { triggerHaptic } from "@/lib/haptics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1080;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          0.7
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    wilaya: "",
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
      if (!session?.user && !loading) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 2 ميجابايت");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    triggerHaptic(10);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!imageFile) {
      toast.error("يرجى إضافة صورة للمنتج");
      return;
    }

    setSubmitting(true);
    triggerHaptic(20);

    try {
      const compressedImage = await compressImage(imageFile);
      const fileName = `${user.id}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressedImage, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("products").getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("products").insert({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: publicUrl,
        user_id: user.id,
      });

      if (insertError) throw insertError;

      setShowSuccess(true);
      triggerHaptic(50);

      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 4));
    triggerHaptic(10);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
    triggerHaptic(10);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!imageFile;
      case 2:
        return formData.title.trim() && formData.price && formData.category;
      case 3:
        return formData.wilaya;
      case 4:
        return true;
      default:
        return false;
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-3xl p-8 text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-3">
            سجّل الدخول أولاً
          </h2>
          <p className="text-muted-foreground mb-6">
            لإضافة منتجاتك، يجب عليك تسجيل الدخول
          </p>
          <Button
            asChild
            className="gradient-gold text-accent-foreground font-bold px-8 h-12 rounded-xl"
          >
            <Link to="/auth">تسجيل الدخول</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
            className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-foreground mb-2"
          >
            تم نشر حلوياتك! 🎉
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground"
          >
            جاري التحويل للصفحة الرئيسية...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent/5 blur-3xl"
        />
      </div>

      {/* Close Button - Top Right Escape Hatch */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => {
          triggerHaptic(10);
          navigate("/home");
        }}
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full backdrop-blur-md bg-foreground/5 border border-border/30 flex items-center justify-center hover:bg-foreground/10 transition-colors"
      >
        <X className="h-5 w-5 text-foreground" />
      </motion.button>

      {/* Header with Progress */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/30">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-foreground text-center mb-4">
            إضافة حلوى جديدة
          </h1>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: step >= i ? "100%" : "0%",
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full gradient-gold"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-32 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Image */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  أرينا إبداعك ✨
                </h2>
                <p className="text-muted-foreground">
                  صورة واحدة تساوي ألف كلمة
                </p>
              </motion.div>

              <label className="block cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-3xl p-1 border-2 border-dashed border-border/50 hover:border-primary/50 transition-all"
                >
                  {imagePreview ? (
                    <div className="relative aspect-square rounded-2xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-cover"
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="glass px-4 py-2 rounded-full">
                          <span className="text-background font-bold flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            تغيير الصورة
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="aspect-square rounded-2xl bg-muted/30 flex flex-col items-center justify-center gap-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
                      >
                        <ImagePlus className="h-10 w-10 text-primary" />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-foreground font-medium mb-1">
                          اضغط لإضافة صورة
                        </p>
                        <p className="text-muted-foreground text-sm">
                          PNG, JPG (أقل من 2MB)
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </motion.div>
          )}

          {/* Step 2: Basics */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div variants={staggerItem} className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    المعلومات الأساسية
                  </h2>
                  <p className="text-muted-foreground">
                    أخبرنا عن حلوياتك اللذيذة
                  </p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    اسم الحلوى
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="مثال: قلب اللوز"
                    className="h-14 rounded-2xl border-border/50 bg-card text-lg"
                  />
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    السعر (د.ج)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="2500"
                    className="h-14 rounded-2xl border-border/50 bg-card text-lg"
                    dir="ltr"
                    min="0"
                  />
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    الفئة
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          triggerHaptic(5);
                        }}
                        className={`px-5 py-3 rounded-2xl font-medium transition-all ${
                          formData.category === cat.id
                            ? "gradient-gold text-accent-foreground border-2 border-accent"
                            : "glass-card border-2 border-transparent text-foreground"
                        }`}
                      >
                        {cat.icon} {cat.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Location & Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div variants={staggerItem} className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    أين يتواجد منتجك؟
                  </h2>
                  <p className="text-muted-foreground">
                    حدد موقعك ليجدك الزبائن
                  </p>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    الولاية
                  </label>
                  <Select
                    value={formData.wilaya}
                    onValueChange={(value) =>
                      setFormData({ ...formData, wilaya: value })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-border/50 bg-card text-lg">
                      <SelectValue placeholder="اختر الولاية" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border/50 rounded-xl max-h-64">
                      {wilayas.map((wilaya) => (
                        <SelectItem
                          key={wilaya}
                          value={wilaya}
                          className="rounded-lg"
                        >
                          {wilaya}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    وصف المنتج (اختياري)
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="أضف وصفاً شهياً لحلوياتك..."
                    className="min-h-[120px] rounded-2xl border-border/50 bg-card resize-none text-base"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                <motion.div variants={staggerItem} className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    مراجعة نهائية ✨
                  </h2>
                  <p className="text-muted-foreground">
                    تأكد من التفاصيل قبل النشر
                  </p>
                </motion.div>

                <motion.div
                  variants={staggerItem}
                  className="glass-card rounded-3xl overflow-hidden"
                >
                  {imagePreview && (
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="معاينة"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-foreground">
                        {formData.title || "اسم الحلوى"}
                      </h3>
                      <span className="text-lg font-bold text-accent">
                        {formData.price
                          ? `${Number(formData.price).toLocaleString()} د.ج`
                          : "السعر"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.category && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                          {categories.find((c) => c.id === formData.category)
                            ?.icon}{" "}
                          {
                            categories.find((c) => c.id === formData.category)
                              ?.name
                          }
                        </span>
                      )}
                      {formData.wilaya && (
                        <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {formData.wilaya}
                        </span>
                      )}
                    </div>

                    {formData.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-t border-border/30 p-4 safe-area-bottom">
        <div className="flex gap-3">
          {/* Back/Cancel Button - Always visible */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="outline"
              onClick={() => {
                triggerHaptic(10);
                if (step === 1) {
                  navigate("/home");
                } else {
                  prevStep();
                }
              }}
              className="h-14 px-6 rounded-2xl border-border/50"
            >
              {step === 1 ? (
                <span className="font-medium">إلغاء</span>
              ) : (
                <>
                  <ChevronRight className="h-5 w-5 ml-1" />
                  <span className="font-medium">سابق</span>
                </>
              )}
            </Button>
          </motion.div>

          {step < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 h-14 rounded-2xl gradient-gold text-accent-foreground font-bold text-lg disabled:opacity-50"
            >
              التالي
              <ChevronLeft className="h-5 w-5 mr-2" />
            </Button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 h-14 rounded-2xl bg-gradient-to-l from-green-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-500/30"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  جاري النشر...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  نشر الحلوى
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
