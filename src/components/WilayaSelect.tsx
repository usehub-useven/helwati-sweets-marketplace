import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { wilayas } from "@/data/mockData";
import { MapPin } from "lucide-react";

interface WilayaSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const WilayaSelect = ({ value, onChange }: WilayaSelectProps) => {
  return (
    <Select value={value || ""} onValueChange={(v) => onChange(v || null)}>
      <SelectTrigger className="w-full bg-card border-border/50 rounded-xl h-12">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-accent" />
          <SelectValue placeholder="اختر الولاية" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-card border-border/50 rounded-xl">
        <SelectItem value="all" className="rounded-lg">
          كل الولايات
        </SelectItem>
        {wilayas.map((wilaya) => (
          <SelectItem key={wilaya} value={wilaya} className="rounded-lg">
            {wilaya}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
