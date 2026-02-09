import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "#999",
}: StatCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        padding: "20px",
        clipPath:
          "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className="text-[10px] text-[#999] tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            {title}
          </p>
          <p
            className="text-3xl text-[#1a1a1a] mt-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className="text-[11px] text-[#999] mt-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 40,
            height: 40,
            background: "rgba(220,38,38,0.04)",
            clipPath:
              "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
          }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
