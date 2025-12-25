import React, { useState } from "react";
import { Search as SearchIcon, MapPin, Filter, X, ShoppingBag, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ⚠️ بيانات وهمية للتجربة (استبدلها لاحقاً ببيانات Supabase الحقيقية)
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "قلب اللوز",
    chef: "أم سارة",
    price: "3,500 د.ج",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?w=500",
  },
  {
    id: 2,
    name: "مقروط بالتمر",
    chef: "أم سارة",
    price: "2,800 د.ج",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500",
  },
  {
    id: 3,
    name: "بقلاوة فاخرة",
    chef: "شاف أحمد",
    price: "4,200 د.ج",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500",
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // هل المستخدم يبحث الآن؟ (أكثر من 0 حرف)
  const isSearching = searchQuery.trim().length > 0;

  // تصفية النتائج (بسيط جداً للتجربة)
  const filteredProducts = MOCK_PRODUCTS.filter((p) => p.name.includes(searchQuery) || p.chef.includes(searchQuery));

  return (
    <div className="min-h-screen bg-[#FDF6F6] pb-24 pt-6 px-4">
      {/* 1️⃣ رأس الصفحة وشريط البحث */}
      <div className="sticky top-0 z-50 bg-[#FDF6F6]/95 backdrop-blur-sm pb-4 space-y-4">
        <h1 className="text-2xl font-bold font-tajawal text-right">بحث 🔍</h1>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن حلوى، بائعة، أو ولاية..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pr-12 pl-12 text-right shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-tajawal outline-none"
            dir="rtl"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          {/* زر المسح (X) يظهر فقط عند الكتابة */}
          {isSearching && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2️⃣ منطقة الفلاتر (تختفي عند البحث) */}
      <AnimatePresence>
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* اختيار الولاية */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-gray-400 text-sm">اختر الولاية</span>
              <MapPin className="text-primary w-5 h-5" />
            </div>

            {/* التصنيفات (Chips) */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar" dir="rtl">
              {["الكل 🍰", "تقليدي 🍪", "برستيج 🎂", "تارت 🥧", "مملحات 🥐"].map((cat) => (
                <button
                  key={cat}
                  className="whitespace-nowrap px-6 py-2 bg-white border border-gray-100 rounded-full text-sm font-medium text-gray-600 shadow-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-gray-400 text-sm px-2">
              <span>الفلاتر</span>
              <Filter className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3️⃣ منطقة النتائج */}
      <div className="mt-6 space-y-6">
        {isSearching ? (
          // ✅ وضع البحث: نعرض النتائج فقط
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-sm text-gray-500">نتائج البحث ({filteredProducts.length})</span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                    <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ChefHat className="w-3 h-3" /> {product.chef}
                      </span>
                      <span className="text-xs font-bold text-primary">{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>لا توجد نتائج مطابقة 😔</p>
              </div>
            )}
          </motion.div>
        ) : (
          // ⏹️ الوضع العادي: اقتراحات أو الأكثر طلباً
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-right px-2">الأكثر طلباً 🔥</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* نفس الكود لعرض المنتجات الافتراضية */}
              {MOCK_PRODUCTS.map((product) => (
                <div key={product.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                  <h3 className="font-bold text-gray-800 text-sm">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ChefHat className="w-3 h-3" /> {product.chef}
                    </span>
                    <span className="text-xs font-bold text-primary">{product.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
