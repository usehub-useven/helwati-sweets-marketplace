import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Upload, Loader2, ImagePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";
import { triggerHaptic } from "@/lib/haptics";

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

export const AddProduct = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
        
        // Redirect to auth if not logged in
        if (!session?.user && !loading) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!imageFile) {
      toast.error("يرجى إضافة صورة للمنتج");
      return;
    }

    setSubmitting(true);

    try {
      // Compress and upload image
      const compressedImage = await compressImage(imageFile);
      const fileName = `${user.id}/${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, compressedImage, {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      // Insert product
      const { error: insertError } = await supabase.from("products").insert({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: publicUrl,
        user_id: user.id,
      });

      if (insertError) throw insertError;

      // Trigger haptic feedback on success
      triggerHaptic(10);
      toast.success("تم إضافة المنتج بنجاح!");
      navigate("/profile");
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setSubmitting(false);
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
      <div className="min-h-screen bg-background pb-24">
        <header className="sticky top-0 z-40 glass border-b border-border/50">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-foreground">إضافة منتج ✨</h1>
          </div>
        </header>

        <main className="px-4 py-12">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-3">
              سجّل الدخول أولاً
            </h2>
            <p className="text-muted-foreground mb-6">
              لإضافة منتجاتك، يجب عليك تسجيل الدخول إلى حسابك أو إنشاء حساب جديد
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
          <h1 className="text-2xl font-bold text-foreground">إضافة منتج ✨</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-foreground">صورة المنتج</Label>
            <label className="block cursor-pointer">
              <div className="glass-card rounded-2xl p-4 border-2 border-dashed border-border hover:border-primary transition-colors">
                {imagePreview ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="معاينة"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-background font-bold">تغيير الصورة</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl bg-muted flex flex-col items-center justify-center gap-3">
                    <ImagePlus className="h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                      اضغط لإضافة صورة (أقل من 2MB)
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              اسم المنتج
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="مثال: قلب اللوز"
              className="h-12 rounded-xl border-border/50 bg-card"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              وصف المنتج
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="اكتب وصفاً مختصراً للمنتج..."
              className="min-h-[100px] rounded-xl border-border/50 bg-card resize-none"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">
              السعر (دج)
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="مثال: 2500"
              className="h-12 rounded-xl border-border/50 bg-card"
              required
              min="0"
              dir="ltr"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-foreground">الفئة</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger className="h-12 rounded-xl border-border/50 bg-card">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-xl gradient-gold text-accent-foreground text-lg font-bold"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin ml-2" />
                جاري الإضافة...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 ml-2" />
                نشر المنتج
              </>
            )}
          </Button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};

export default AddProduct;
