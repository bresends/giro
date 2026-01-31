import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Truck, Wrench, AlertTriangle, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/dashboard", Icon: LayoutDashboard },
  { name: "Viaturas", path: "/vehicles", Icon: Truck },
  { name: "Manutenções", path: "/maintenance", Icon: Wrench },
  { name: "Problemas", path: "/issues", Icon: AlertTriangle },
  { name: "Configurações", path: "/settings", Icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-background border-r overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.Icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
