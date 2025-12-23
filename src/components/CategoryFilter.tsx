import { categories } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export const CategoryFilter = ({ selected, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
          selected === null
            ? "gradient-gold text-accent-foreground shadow-soft"
            : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
        )}
      >
        <span>🍰</span>
        <span>الكل</span>
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
            selected === category.id
              ? "gradient-gold text-accent-foreground shadow-soft"
              : "bg-card text-muted-foreground hover:bg-muted border border-border/50"
          )}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};
