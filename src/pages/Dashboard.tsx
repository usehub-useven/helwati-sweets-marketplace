import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { AppLayout } from "@/components/AppLayout";
import { products as mockProducts, sellers, categories } from "@/data/mockData";
import { 
  Coins, Eye, Heart, Pencil, Trash2, Plus, Share2, 
  Package, TrendingUp, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    }
  },
};

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    }
  }
};

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
}

const StatCard = ({ title, value, icon, gradient, glowColor }: StatCardProps) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -4 }}
    whileTap={{ scale: 0.98 }}
    className="relative group"
  >
    <div 
      className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl",
        glowColor
      )}
    />
    <div className="relative glass-card rounded-2xl p-5 border border-white/30 backdrop-blur-xl overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-20 blur-2xl", gradient)} />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
        </div>
        <div className={cn("p-3 rounded-xl", gradient)}>
          {icon}
        </div>
      </div>
    </div>
  </motion.div>
);

// Product List Item Component
interface ProductItemProps {
  product: typeof mockProducts[0];
  onEdit: () => void;
  onDelete: () => void;
}

const ProductItem = ({ product, onEdit, onDelete }: ProductItemProps) => {
  const [showActions, setShowActions] = useState(false);
  const [dragX, setDragX] = useState(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -50) {
      setShowActions(true);
    } else if (info.offset.x > 50) {
      setShowActions(false);
    }
    setDragX(0);
  };

  const categoryName = categories.find(c => c.id === product.category)?.name || product.category;

  return (
    <motion.div
      variants={itemVariants}
      className="relative overflow-hidden rounded-2xl"
    >
      {/* Action Buttons Background */}
      <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center gap-2 bg-gradient-to-r from-destructive/20 to-transparent">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="p-2.5 rounded-full bg-accent/20 text-accent backdrop-blur-sm"
        >
          <Pencil className="h-4 w-4" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="p-2.5 rounded-full bg-destructive/20 text-destructive backdrop-blur-sm"
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Product Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={{ x: showActions ? -80 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setShowActions(!showActions)}
        className="relative glass-card p-3 flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform"
      >
        {/* Product Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/20">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground text-sm truncate">{product.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{categoryName}</p>
          <p className="text-sm font-semibold text-accent mt-1">
            {product.price.toLocaleString()} د.ج
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            نشط
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <motion.div
    variants={itemVariants}
    className="text-center py-16 px-6"
  >
    <motion.div
      variants={floatVariants}
      initial="initial"
      animate="animate"
      className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center"
    >
      <Package className="h-12 w-12 text-accent" />
    </motion.div>
    <h3 className="text-lg font-bold text-foreground mb-2">مطبخك فارغ!</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto">
      ابدئي بنشر أول حلوى لك وابهري زبائنك
    </p>
    <Button
      onClick={onAdd}
      className="rounded-full bg-gradient-to-r from-accent to-gold px-6 py-3 text-white font-medium shadow-lg shadow-accent/30"
    >
      <Plus className="h-4 w-4 ml-2" />
      ابدئي الآن
    </Button>
  </motion.div>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("أم سارة");
  const [myProducts, setMyProducts] = useState(mockProducts.filter(p => p.sellerId === "1"));

  // Mock stats
  const stats = {
    earnings: 25000,
    views: 1284,
    likes: 342,
    orders: 18,
  };

  const handleEdit = (productId: string) => {
    // Navigate to edit page or show modal
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId: string) => {
    setMyProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleAddProduct = () => {
    navigate("/add");
  };

  const handleShareShop = () => {
    if (navigator.share) {
      navigator.share({
        title: `متجر ${sellerName} - حلوتي`,
        text: "تفضلوا بزيارة متجري على حلوتي!",
        url: window.location.origin + "/seller/1",
      });
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-32 md:pb-8 relative">
        {/* Noise Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none noise-texture" />

        {/* Header */}
        <header className="sticky top-0 md:top-16 z-40 glass-nav pt-safe">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 md:px-6 lg:px-8 py-4 max-w-7xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-foreground tracking-tight">لوحة التحكم</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  أهلاً بك،{" "}
                  <span className="font-semibold text-foreground">{sellerName}</span>
                  <motion.span
                    animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                    className="inline-block origin-bottom-right"
                  >
                    👋
                  </motion.span>
                </p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full bg-gradient-to-br from-accent/20 to-gold/20 text-accent"
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </div>
          </motion.div>
        </header>

        {/* Main Content */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="px-4 md:px-6 lg:px-8 py-6 max-w-7xl mx-auto space-y-8"
        >
          {/* Stats Grid */}
          <section>
            <motion.h2 
              variants={itemVariants}
              className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              إحصائياتي
            </motion.h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="أرباحي"
                value={`${stats.earnings.toLocaleString()} د.ج`}
                icon={<Coins className="h-5 w-5 text-white" />}
                gradient="bg-gradient-to-br from-amber-400 to-orange-500"
                glowColor="bg-amber-400/30"
              />
              <StatCard
                title="المشاهدات"
                value={stats.views.toLocaleString()}
                icon={<Eye className="h-5 w-5 text-white" />}
                gradient="bg-gradient-to-br from-sky-400 to-blue-500"
                glowColor="bg-sky-400/30"
              />
              <StatCard
                title="الإعجابات"
                value={stats.likes.toLocaleString()}
                icon={<Heart className="h-5 w-5 text-white" />}
                gradient="bg-gradient-to-br from-rose-400 to-pink-500"
                glowColor="bg-rose-400/30"
              />
              <StatCard
                title="الطلبات"
                value={stats.orders}
                icon={<Package className="h-5 w-5 text-white" />}
                gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
                glowColor="bg-emerald-400/30"
              />
            </div>
          </section>

          {/* Products Section */}
          <section>
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between mb-4"
            >
              <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                منتجاتي
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                  {myProducts.length}
                </span>
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddProduct}
                className="text-accent hover:text-accent hover:bg-accent/10 rounded-xl text-xs"
              >
                <Plus className="h-3.5 w-3.5 ml-1" />
                إضافة
              </Button>
            </motion.div>

            {myProducts.length > 0 ? (
              <div className="space-y-3">
                {myProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={() => handleEdit(product.id)}
                    onDelete={() => handleDelete(product.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onAdd={handleAddProduct} />
            )}
          </section>
        </motion.main>

        {/* Floating Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="glass-card px-2 py-2 rounded-full border border-white/30 shadow-elevated flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent to-gold text-white font-medium text-sm shadow-lg shadow-accent/30"
            >
              <Plus className="h-4 w-4" />
              إضافة منتج
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShareShop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-secondary/80 text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              <Share2 className="h-4 w-4" />
              شارك متجرك
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
