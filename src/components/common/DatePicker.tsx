import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

const velBtn: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "8px 12px",
  border: "1px solid #e5e5e5",
  background: "#fff",
  color: "#1a1a1a",
  fontSize: 14,
  fontFamily: "'Barlow', sans-serif",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  cursor: "pointer",
  textAlign: "left" as const,
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          style={{
            ...velBtn,
            color: value ? "#1a1a1a" : "#999",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <CalendarIcon size={16} style={{ color: "#999" }} />
          {value ? format(value, "PPP", { locale: ptBR }) : placeholder}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          locale={ptBR}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
