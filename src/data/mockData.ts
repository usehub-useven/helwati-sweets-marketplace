export const wilayas = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "البليدة", "سطيف", "باتنة", 
  "تلمسان", "بجاية", "سكيكدة", "تيزي وزو", "جيجل", "المسيلة", "ورقلة",
  "بسكرة", "الجلفة", "الشلف", "المدية", "تيارت", "بومرداس"
];

export const categories = [
  { id: "traditional", name: "تقليدي", icon: "🍪" },
  { id: "prestige", name: "برستيج", icon: "🎂" },
  { id: "tarts", name: "تارت", icon: "🥧" },
  { id: "savory", name: "مالح", icon: "🥐" },
];

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  wilaya: string;
  bio: string;
  rating: number;
  totalProducts: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sellerId: string;
  seller: Seller;
}

export const sellers: Seller[] = [
  {
    id: "1",
    name: "أم سارة",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    phone: "+213555123456",
    wilaya: "الجزائر",
    bio: "صانعة حلويات منذ 15 سنة، متخصصة في الحلويات التقليدية الجزائرية",
    rating: 4.9,
    totalProducts: 24,
  },
  {
    id: "2",
    name: "نورة الحلوانية",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    phone: "+213555654321",
    wilaya: "وهران",
    bio: "أقدم أفضل الحلويات للأعراس والمناسبات السعيدة",
    rating: 4.8,
    totalProducts: 18,
  },
  {
    id: "3",
    name: "فاطمة زهرة",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    phone: "+213555789012",
    wilaya: "قسنطينة",
    bio: "متخصصة في تارت الفواكه والحلويات العصرية",
    rating: 4.7,
    totalProducts: 31,
  },
];

export const products: Product[] = [
  {
    id: "1",
    title: "قلب اللوز",
    description: "حلوى تقليدية جزائرية بنكهة اللوز الطبيعي والعسل الصافي",
    price: 3500,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500",
    category: "traditional",
    sellerId: "1",
    seller: sellers[0],
  },
  {
    id: "2",
    title: "مقروط بالتمر",
    description: "مقروط محشو بتمر دقلة نور الفاخر",
    price: 2800,
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500",
    category: "traditional",
    sellerId: "1",
    seller: sellers[0],
  },
  {
    id: "3",
    title: "كيكة العرس",
    description: "كيكة فاخرة مزينة للأعراس والمناسبات الكبرى",
    price: 15000,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500",
    category: "prestige",
    sellerId: "2",
    seller: sellers[1],
  },
  {
    id: "4",
    title: "تارت الفراولة",
    description: "تارت طازجة بالفراولة الموسمية والكريمة",
    price: 4200,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500",
    category: "tarts",
    sellerId: "3",
    seller: sellers[2],
  },
  {
    id: "5",
    title: "بقلاوة فاخرة",
    description: "بقلاوة مغلفة بالعسل والمكسرات المشكلة",
    price: 4500,
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500",
    category: "traditional",
    sellerId: "1",
    seller: sellers[0],
  },
  {
    id: "6",
    title: "كرواسون بالشوكولاتة",
    description: "كرواسون محشو بالشوكولاتة البلجيكية الفاخرة",
    price: 180,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
    category: "savory",
    sellerId: "2",
    seller: sellers[1],
  },
  {
    id: "7",
    title: "تارت الليمون",
    description: "تارت منعشة بكريمة الليمون الطبيعي",
    price: 3800,
    image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500",
    category: "tarts",
    sellerId: "3",
    seller: sellers[2],
  },
  {
    id: "8",
    title: "طاجين الحلو",
    description: "طاجين حلو تقليدي بالفواكه الجافة",
    price: 5500,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500",
    category: "prestige",
    sellerId: "1",
    seller: sellers[0],
  },
];
