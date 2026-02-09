import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Truck, Wrench, AlertTriangle, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/admin", Icon: LayoutDashboard },
  { name: "Viaturas", path: "/vehicles", Icon: Truck },
  { name: "Manutenções", path: "/maintenance", Icon: Wrench },
  { name: "Problemas", path: "/issues", Icon: AlertTriangle },
  { name: "Configurações", path: "/settings", Icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-[65px] h-[calc(100vh-65px)] w-60 overflow-y-auto"
      style={{
        background: "#fff",
        borderRight: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.Icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-xs tracking-[0.1em] uppercase transition-colors"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#dc2626" : "#999",
                background: isActive ? "rgba(220,38,38,0.04)" : "transparent",
                borderLeft: isActive ? "2px solid #dc2626" : "2px solid transparent",
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Guarita link at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Link
          to="/guarita"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs tracking-[0.15em] uppercase transition-colors"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            color: "#fff",
            background: "#dc2626",
            clipPath:
              "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          <Truck size={16} />
          Guarita
        </Link>
      </div>
    </aside>
  );
}
