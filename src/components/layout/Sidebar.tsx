import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Truck, ArrowLeftRight, Wrench, AlertTriangle, Settings, ClipboardList } from "lucide-react";

const navigation = [
  { name: "Dashboard", path: "/admin", Icon: LayoutDashboard },
  { name: "Viaturas", path: "/vehicles", Icon: Truck },
  { name: "Checklists", path: "/admin/checklists", Icon: ClipboardList },
  { name: "Movimentações", path: "/movements", Icon: ArrowLeftRight },
  { name: "Manutenções", path: "/maintenance", Icon: Wrench },
  { name: "Problemas", path: "/issues", Icon: AlertTriangle },
  { name: "Configurações", path: "/settings", Icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-sidebar border-b md:sticky md:top-16 md:h-sidebar-panel md:w-56 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
      <nav aria-label="Administração" className="flex gap-1 overflow-x-auto p-2 md:flex-col md:p-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path + "/"));
          const Icon = item.Icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex shrink-0 items-center gap-2 px-3 py-2 focus-visible:outline-2 focus-visible:outline-ring rounded-lg text-sm font-medium transition
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
