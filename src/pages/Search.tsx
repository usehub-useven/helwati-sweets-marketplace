import React, { useState } from 'react';
import { Search as SearchIcon, MapPin, Filter, X, ShoppingBag, ChefHat, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "sonner"; // للتنبيهات

// ✅ 1. تحديث البيانات الوهمية لتشمل الولاية والتصنيف الصحيح
const MOCK_PRODUCTS = [
  { id: 1, name: "قلب اللوز محشي", chef: "أم سارة", price: "3,500 د.ج", image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?w=500", wilaya: "الجزائر", category: "تقليدي" },
  { id: 2, name: "مقروط العسل", chef: "أم سارة", price: "2,800 د.ج", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500", wilaya: "الجزائر", category: "تقليدي" },
  { id: 3, name: "بقلاوة تركية", chef: "شاف أحمد", price: "4,200 د.ج", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500", wilaya: "وهران", category: "برستيج" },
  { id: 4, name: "تارت الليمون", chef: "لينة سويت", price: "1,500 د.ج", image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=500", wilaya: "قسنطينة", category: "تارت" },
  { id: 5, name: "صابلي برستيج", chef: "حلويات مريم", price: "3,000 د.ج", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=500", wilaya: "سطيف", category: "برستيج" },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('الكل 🍰'); // حالة الفلتر النشط
  const navigate = useNavigate();

  const isSearching = searchQuery.trim().length > 0;

  // ✅ 2. منطق بحث ذكي يشمل (الاسم، الشيف، الولاية)
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.includes(q) || 
      p.chef.includes(q) || 
      p.wilaya.includes(q) // الآن البحث عن "وهران" سيعمل
    );
  });

  // معالجة زر Enter في الكيبورد
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة
    // هنا يمكن إضافة منطق إضافي، حالياً البحث فوري (Real-time)
    // يمكننا إخفاء الكيبورد في الموبايل:
    (document.activeElement as HTMLElement).blur();
  };

  // دالة زر الفلاتر (حالياً تظهر تنبيه فقط)
  const handleOpenFilters = () => {
    toast.info("الفلاتر المتقدمة ستتوفر قريباً! ⚙️");
  };

  return (
    <div className="min-h-screen bg-[#FDF6F6] pb-24 pt-6 px-4">
      
      {/* رأس الصفحة الثابت */}
      <div className="sticky top-0 z-50 bg-[#FDF6F6]/95 backdrop-blur-md pb-2 space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold font-tajawal">بحث 🔍</h1>
            {/* زر العودة للرئيسية */}
            <button onClick={() => navigate('/')} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary">
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
        
        {/* ✅ 3. إضافة Form لدعم زر Enter */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن حلوى، شاف أحمد، وهران..."
            className="w-full bg-white border border-gray-200 rounded-2xl py-4 pr-12 pl-12 text-right shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-tajawal outline-none"
            dir="rtl"
            enterKeyHint="search" // يظهر زر "بحث" في كيبورد الهاتف
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          
          {isSearching && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* الفلاتر (تختفي عند البحث) */}
      <AnimatePresence>
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* أزرار التصنيفات */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar pt-2" dir="rtl">
              {['الكل 🍰', 'تقليدي 🍪', 'برستيج 🎂', 'تارت 🥧', 'مملحات 🥐'].map((cat) => (
                <button 
                    key={cat} 
                    onClick={() => setActiveFilter(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm
                        ${activeFilter === cat 
                            ? 'bg-primary text-white border border-primary' 
                            : 'bg-white border border-gray-100 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            {/* زر الفلاتر والولاية */}
            <div className="flex items-center justify-between gap-2">
                <button className="flex-1 flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-gray-500 text-sm">
                    <span>الجزائر (كل الولايات)</span>
                    <MapPin className="text-primary w-4 h-4" />
                </button>
                <button 
                    onClick={handleOpenFilters}
                    className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500 hover:text-primary transition-colors"
                >
                    <Filter className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* منطقة النتائج */}
      <div className="mt-6">
        {isSearching ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-2">
              <span className="text-sm text-gray-500">
                نتائج البحث لـ "{searchQuery}" ({filteredProducts.length})
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  // ✅ 4. إضافة Link ليعمل النقر (ينقلك لصفحة المنتج)
                  <Link 
                    to={`/product/${product.id}`} 
                    key={product.id} 
                    className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow block"
                  >
                    {/* ✅ 5. إصلاح الصور: aspect-square يجعلها مربعة دائماً مهما كان حجمها */}
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-100 relative">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-600">
                            {product.wilaya}
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ChefHat className="w-3 h-3" /> 
                        <span className="truncate max-w-[60px]">{product.chef}</span>
                      </span>
                      <span className="text-xs font-bold text-primary">{product.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-4">
                <ShoppingBag className="w-16 h-16 opacity-20" />
                <p>لم نجد حلوى أو بائعة بهذا الاسم 😔</p>
                <button onClick={() => setSearchQuery('')} className="text-primary text-sm font-bold">
                    مسح البحث
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          // المحتوى الافتراضي (الأكثر طلباً)
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-right px-2 flex items-center gap-2">
                 الأكثر طلباً 🔥
            </h2>
            <div className="grid grid-cols-2 gap-4">
               {MOCK_PRODUCTS.slice(0, 4).map((product) => (
                  <Link 
                    to={`/product/${product.id}`} 
                    key={product.id} 
                    className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 block"
                  >
                    <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 bg-gray-100 relative">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                        />
                         <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-600">
                            {product.wilaya}
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm truncate">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <ChefHat className="w-3 h-3" /> {product.chef}
                      </span>
                      <span className="text-xs font-bold text-primary">{product.price}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
