import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock3,
  Eye,
  FileText,
  Funnel,
  Heart,
  House,
  Image,
  Info,
  LoaderCircle,
  Menu,
  MoreHorizontal,
  Plus,
  Phone,
  Search,
  Settings2,
  Smile,
  SquarePlus,
  Star,
  Trash2,
  Upload,
  Volume2,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

const styleguideNavigation = [
  {
    title: "Fundação",
    items: [
      { name: "Visão geral", href: "#overview" },
      { name: "Cores", href: "#foundation" },
      { name: "Tipografia", href: "#typography" },
      { name: "Spacing e radius", href: "#geometry" },
      { name: "Shadows", href: "#elevation" },
      { name: "Iconografia", href: "#iconography" },
    ],
  },
  {
    title: "Componentes",
    items: [
      { name: "Buttons", href: "#buttons" },
      { name: "Forms", href: "#forms" },
      { name: "Images", href: "#images" },
      { name: "Feedback", href: "#feedback" },
      { name: "Data display", href: "#data-display" },
      { name: "Overlays", href: "#overlays" },
      { name: "Navigation", href: "#navigation" },
      { name: "Paginação", href: "#pagination" },
      { name: "Date and time", href: "#date-time" },
      { name: "Compositions", href: "#compositions" },
    ],
  },
] as const;

export function StyleguideLayout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("giro-styleguide-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("giro-styleguide-theme", dark ? "dark" : "light");

    return () => document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <div
      className={`min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[256px_1fr] ${dark ? "dark" : ""}`}
    >
      <aside className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-sidebar-border px-4 lg:px-6">
          <a className="flex items-center gap-3" href="#overview">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt=""
              aria-hidden="true"
            />
            <span>
              <span className="block font-display text-xl uppercase leading-none">
                Giro
              </span>
              <span className="block font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                Design system
              </span>
            </span>
          </a>
          <button
            className="grid size-9 place-items-center border border-sidebar-border hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ring"
            type="button"
            onClick={() => setDark((value) => !value)}
            aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
            title={dark ? "Tema claro" : "Tema escuro"}
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
        <nav
          className="flex gap-6 overflow-x-auto px-4 py-3 lg:flex-col lg:overflow-visible lg:px-6 lg:py-6"
          aria-label="Navegação do design system"
        >
          {styleguideNavigation.map((section) => (
            <div className="shrink-0" key={section.title}>
              <h2 className="mb-2 font-condensed text-[10px] font-bold uppercase text-muted-foreground">
                {section.title}
              </h2>
              <ul className="flex gap-1 lg:flex-col">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a
                      className="block whitespace-nowrap border-l-2 border-transparent px-3 py-2 font-condensed text-xs font-semibold uppercase transition-colors hover:border-sidebar-primary hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      href={item.href}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 lg:col-start-2">{children}</div>
    </div>
  );
}

const colors = [
  ["Marca", "bg-primary", "#dc2626"],
  ["Dados", "bg-info-foreground", "#2563eb"],
  ["Sucesso", "bg-success-foreground", "#16a34a"],
  ["Atenção", "bg-[#fff3c4]", "#fff3c4"],
  ["Manutenção", "bg-maintenance-foreground", "#ea580c"],
  ["Texto", "bg-foreground", "#1a1a1a"],
  ["Background", "bg-background", "#f7f7f7"],
  ["Surface", "bg-card", "#ffffff"],
] as const;

const colorScales = [
  {
    name: "Marca / Vermelho",
    values: [
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
    ],
  },
  {
    name: "Informação / Azul",
    values: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
    ],
  },
  {
    name: "Sucesso / Verde",
    values: [
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
    ],
  },
  {
    name: "Atenção / Amarelo",
    values: [
      "#fefce8",
      "#fef9c3",
      "#fef08a",
      "#fde047",
      "#facc15",
      "#eab308",
      "#ca8a04",
      "#a16207",
      "#854d0e",
      "#713f12",
    ],
  },
  {
    name: "Manutenção / Laranja",
    values: [
      "#fff7ed",
      "#ffedd5",
      "#fed7aa",
      "#fdba74",
      "#fb923c",
      "#f97316",
      "#ea580c",
      "#c2410c",
      "#9a3412",
      "#7c2d12",
    ],
  },
  {
    name: "Neutro",
    values: [
      "#fafafa",
      "#f5f5f5",
      "#e5e5e5",
      "#d4d4d4",
      "#a3a3a3",
      "#737373",
      "#525252",
      "#404040",
      "#262626",
      "#171717",
    ],
  },
] as const;

const scaleSteps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

const borderColors = [
  ["Sutil", "rgb(0 0 0 / 4%)", "Separadores e divisões internas"],
  ["Padrão", "rgb(0 0 0 / 6%)", "Cards, campos e tabelas"],
  ["Forte", "rgb(0 0 0 / 16%)", "Ênfase e hover neutro"],
  ["Foco", "#ef4444", "Foco visível e seleção"],
  ["Sucesso", "#16a34a", "Confirmação e estado positivo"],
  ["Atenção", "#facc15", "Pendência e advertência"],
  ["Informação", "#60a5fa", "Dados e orientação"],
  ["Perigo", "#b91c1c", "Erro e ação destrutiva"],
] as const;

const iconography = [
  ["Início", House],
  ["Filtro", Funnel],
  ["Excluir", Trash2],
  ["Visualizar", Eye],
  ["Favorito", Heart],
  ["Adicionar", SquarePlus],
  ["Notificação", Bell],
  ["Upload", Upload],
  ["Manual", BookOpen],
  ["Câmera", Camera],
  ["Calendário", CalendarDays],
  ["Menu", Menu],
  ["Cancelar", CircleX],
  ["Confirmar", CircleCheck],
  ["Horário", Clock3],
  ["Contato", Phone],
  ["Perfil", Smile],
  ["Imagem", Image],
] as const;

const statuses = [
  ["Operacional", "bg-success text-success-foreground", Check],
  ["Em manutenção", "bg-maintenance text-maintenance-foreground", Settings2],
  ["Pendente", "bg-warning text-warning-foreground", AlertTriangle],
  ["Informativo", "bg-info text-info-foreground", Info],
  ["Crítico", "bg-accent text-destructive", CircleAlert],
  ["Indisponível", "bg-neutral text-neutral-foreground", X],
] as const;

const vehicles = [
  {
    prefix: "UR-214",
    type: "Unidade de resgate",
    status: "Operacional",
    km: "48.291 km",
  },
  {
    prefix: "ABT-32",
    type: "Auto bomba tanque",
    status: "Em manutenção",
    km: "112.840 km",
  },
  {
    prefix: "ASA-08",
    type: "Auto salvamento",
    status: "Pendente",
    km: "76.095 km",
  },
] as const;

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 border-t border-border py-10 sm:py-14"
    >
      <header className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="font-condensed text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-display text-3xl uppercase sm:text-4xl">
            {title}
          </h2>
        </div>
        <span className="hidden font-mono text-[10px] text-muted-foreground sm:block">
          VELOCITY / LIGHT
        </span>
      </header>
      {children}
    </section>
  );
}

export function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const openDialog = () => {
    document.querySelector<HTMLDialogElement>("#velocity-dialog")?.showModal();
  };

  return (
    <StyleguideLayout>
      <main className="min-h-screen bg-background text-foreground [--warning-foreground:#7a5700] [--warning-on-strong:#5c4500] [--warning-strong:#facc15] [--warning:#fff3c4] dark:[--warning-foreground:#fde047] dark:[--warning-on-strong:#422006] dark:[--warning-strong:#facc15] dark:[--warning:rgb(250_204_21/14%)]">
        <div className="border-b border-border bg-card">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <img
                className="h-9 w-auto"
                src="/logo.svg"
                alt=""
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-xl uppercase leading-none">
                  Giro
                </p>
                <p className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                  Sistema visual
                </p>
              </div>
            </div>
            <span className="border bg-warning px-2.5 py-1 font-condensed text-[10px] font-semibold uppercase text-warning-foreground border-(--warning-strong)">
              Laboratório
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header
            id="overview"
            className="grid min-h-90 scroll-mt-4 items-end gap-10 py-12 md:grid-cols-[1.4fr_0.6fr] md:py-16"
          >
            <div>
              <div className="mb-5 h-1 w-12 bg-primary" />
              <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.92] sm:text-7xl lg:text-8xl">
                Velocity <span className="text-primary">Light</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Linguagem clara, angular e operacional para gestão de frota.
                Esta página explora a direção visual antes da implementação nas
                primitives.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-px border border-border bg-border">
              {[
                ["Tema", "Claro"],
                ["Densidade", "Operacional"],
                ["Geometria", "Angular"],
                ["Estado", "Exploração"],
              ].map(([term, value]) => (
                <div className="bg-card p-4" key={term}>
                  <dt className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                    {term}
                  </dt>
                  <dd className="mt-1 font-condensed text-sm font-semibold uppercase">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <Section
            id="foundation"
            eyebrow="01 / Fundação"
            title="Cores e tipografia"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {colors.map(([name, color, value]) => (
                  <div className="border border-border bg-card p-3" key={name}>
                    <div
                      className={`corner-cut aspect-3/2 ${color} [--corner-cut:8px]`}
                    />
                    <p className="mt-3 font-condensed text-xs font-semibold uppercase">
                      {name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-l-4 border-primary bg-card p-6 sm:p-8">
                <p className="font-display text-5xl uppercase leading-none sm:text-6xl">
                  Bebas Neue
                </p>
                <p className="mt-6 font-condensed text-xl font-semibold uppercase">
                  Barlow Condensed / Navegação e labels
                </p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Barlow mantém textos, descrições e formulários legíveis mesmo
                  em fluxos densos e repetitivos.
                </p>
                <p className="mt-6 font-mono text-sm">
                  KM 048291 / PROC 2026-0711
                </p>
              </div>
            </div>
            <div className="mt-8 overflow-hidden border border-border bg-card">
              <div className="border-b border-border px-4 py-3 sm:px-5">
                <p className="font-condensed text-xs font-semibold uppercase">
                  Escalas de cor / 50–900
                </p>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-215">
                  {colorScales.map((scale) => (
                    <div
                      className="grid grid-cols-[150px_repeat(10,minmax(68px,1fr))] border-b border-border last:border-b-0"
                      key={scale.name}
                    >
                      <div className="flex items-center px-4 py-3 font-condensed text-[11px] font-semibold uppercase">
                        {scale.name}
                      </div>
                      {scale.values.map((value, index) => (
                        <div
                          className={`min-h-20 p-2 font-mono text-[9px] ${index >= 5 ? "text-white" : "text-foreground"}`}
                          key={value}
                          style={{ backgroundColor: value }}
                        >
                          <span className="block font-condensed text-[10px] font-semibold">
                            {scaleSteps[index]}
                          </span>
                          <span className="mt-7 block uppercase opacity-80">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 border border-border bg-card p-4 sm:p-5">
              <div className="mb-4">
                <p className="font-condensed text-xs font-semibold uppercase">
                  Cores de borda
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Papéis estruturais, interativos e semânticos.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {borderColors.map(([name, value, usage]) => (
                  <div className="bg-background p-3" key={name}>
                    <div
                      className="h-14 border-2 bg-card"
                      style={{ borderColor: value }}
                    />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-condensed text-xs font-semibold uppercase">
                          {name}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {usage}
                        </p>
                      </div>
                      <code className="shrink-0 text-[9px] text-muted-foreground">
                        {value}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section
            id="typography"
            eyebrow="02 / Tipografia"
            title="Escala e pesos"
          >
            <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="border border-border bg-card">
                <div className="border-b border-border px-5 py-3">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Heading sizes
                  </p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    [
                      "Display",
                      "text-6xl sm:text-7xl",
                      "60 / 72px",
                      "Título de destaque",
                    ],
                    ["H1", "text-5xl", "48px", "Título de página"],
                    ["H2", "text-4xl", "36px", "Título de seção"],
                    ["H3", "text-3xl", "30px", "Título de painel"],
                    ["H4", "text-2xl", "24px", "Título de grupo"],
                    ["H5", "text-xl", "20px", "Título compacto"],
                  ].map(([level, size, value, usage]) => (
                    <div
                      className="grid items-center gap-3 px-5 py-5 sm:grid-cols-[80px_1fr_150px]"
                      key={level}
                    >
                      <div>
                        <p className="font-condensed text-[10px] font-semibold uppercase text-primary">
                          {level}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground">
                          {value} / 400
                        </p>
                      </div>
                      <p
                        className={`font-display uppercase leading-none ${size}`}
                      >
                        Velocity
                      </p>
                      <p className="text-xs text-muted-foreground">{usage}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <div className="border border-border bg-card p-5">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Font weights / Barlow
                  </p>
                  <div className="mt-5 space-y-4">
                    {[
                      ["Light", "300", "font-light"],
                      ["Regular", "400", "font-normal"],
                      ["Medium", "500", "font-medium"],
                      ["Semibold", "600", "font-semibold"],
                      ["Bold", "700", "font-bold"],
                    ].map(([name, value, weight]) => (
                      <div
                        className="flex items-baseline justify-between gap-4"
                        key={name}
                      >
                        <span className={`text-lg ${weight}`}>{name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-border bg-card p-5">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Famílias
                  </p>
                  <dl className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Display</dt>
                      <dd className="font-display text-base uppercase">
                        Bebas Neue
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Interface</dt>
                      <dd>Barlow</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Labels</dt>
                      <dd className="font-condensed font-semibold uppercase">
                        Barlow Condensed
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Dados</dt>
                      <dd className="font-mono">Menlo</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-5 border border-border bg-card">
              <div className="border-b border-border px-5 py-3">
                <p className="font-condensed text-xs font-semibold uppercase">
                  Body text sizes
                </p>
              </div>
              <div className="grid divide-y divide-border lg:grid-cols-4 lg:divide-x lg:divide-y-0">
                {[
                  [
                    "Small",
                    "12px / 16px",
                    "text-xs",
                    "Metadados, apoio e conteúdo secundário.",
                  ],
                  [
                    "Compact",
                    "14px / 20px",
                    "text-sm",
                    "Tabelas, controles e interfaces densas.",
                  ],
                  [
                    "Base",
                    "16px / 24px",
                    "text-base",
                    "Leitura padrão e descrições de página.",
                  ],
                  [
                    "Large",
                    "18px / 28px",
                    "text-lg",
                    "Introduções e mensagens de destaque.",
                  ],
                ].map(([name, value, size, sample]) => (
                  <div className="p-5" key={name}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-condensed text-[10px] font-semibold uppercase text-primary">
                        {name}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground">
                        {value} / 400
                      </p>
                    </div>
                    <p className={`mt-4 text-foreground ${size}`}>{sample}</p>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          <Section
            id="geometry"
            eyebrow="03 / Geometria"
            title="Spacing e radius"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="border border-border bg-card p-5">
                <div className="mb-6">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Spacing scale
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Base de 4px para ritmo, alinhamento e densidade.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    ["1", "4px", "w-1"],
                    ["2", "8px", "w-2"],
                    ["3", "12px", "w-3"],
                    ["4", "16px", "w-4"],
                    ["6", "24px", "w-6"],
                    ["8", "32px", "w-8"],
                    ["10", "40px", "w-10"],
                    ["12", "48px", "w-12"],
                    ["16", "64px", "w-16"],
                    ["20", "80px", "w-20"],
                  ].map(([token, value, width]) => (
                    <div
                      className="grid grid-cols-[34px_48px_1fr] items-center gap-3"
                      key={token}
                    >
                      <span className="font-condensed text-[10px] font-semibold uppercase">
                        {token}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground">
                        {value}
                      </span>
                      <span className={`block h-3 bg-primary ${width}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <div className="border border-border bg-card p-5">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Border radius
                  </p>
                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {[
                      ["SM", "4px", "rounded-sm"],
                      ["MD", "6px", "rounded-md"],
                      ["LG", "8px", "rounded-lg"],
                      ["XL", "12px", "rounded-xl"],
                    ].map(([name, value, radius]) => (
                      <div key={name}>
                        <div
                          className={`aspect-square border-2 border-primary bg-accent ${radius}`}
                        />
                        <p className="mt-2 font-condensed text-[10px] font-semibold uppercase">
                          {name}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-border bg-card p-5">
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Corner cuts
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Geometria de assinatura para elementos de destaque.
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      ["Compacto", "4px"],
                      ["Controle", "8px"],
                      ["Painel", "12px"],
                    ].map(([name, value]) => (
                      <div key={name}>
                        <div
                          className="corner-cut aspect-4/3 bg-secondary"
                          style={
                            { "--corner-cut": value } as React.CSSProperties
                          }
                        />
                        <p className="mt-2 font-condensed text-[10px] font-semibold uppercase">
                          {name}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Section id="elevation" eyebrow="04 / Elevação" title="Shadows">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "XS",
                  "shadow-xs",
                  "0 1px 2px / 4%",
                  "Controles e separação mínima",
                ],
                ["SM", "shadow-sm", "0 2px 6px / 6%", "Card em hover"],
                ["MD", "shadow-md", "0 6px 16px / 8%", "Popover e menu"],
                [
                  "LG",
                  "shadow-lg",
                  "0 12px 28px / 10%",
                  "Dialog e elevação temporária",
                ],
              ].map(([name, shadow, value, usage]) => (
                <article
                  className={`flex min-h-52 flex-col justify-end border border-border bg-card p-5 ${shadow}`}
                  key={name}
                >
                  <p className="font-display text-4xl uppercase">{name}</p>
                  <p className="mt-2 font-mono text-[9px] text-muted-foreground">
                    {value}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">{usage}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Bordas definem a estrutura principal. Sombras comunicam apenas
              mudança temporária de elevação e não devem substituir hierarquia
              ou agrupamento.
            </p>
          </Section>

          <Section id="iconography" eyebrow="05 / Iconografia" title="Ícones">
            <div className="overflow-x-auto border border-border bg-card">
              <div className="min-w-190">
                <div className="grid grid-cols-[150px_repeat(3,1fr)] border-b border-border bg-muted/60 px-5 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                  <span>Nome</span>
                  <span>Large · 32px</span>
                  <span>Medium · 24px</span>
                  <span>Small · 16px</span>
                </div>
                <div className="grid lg:grid-cols-3">
                  {iconography.map(([name, Icon]) => (
                    <div
                      className="grid grid-cols-[110px_repeat(3,1fr)] items-center border-b border-border px-5 py-4 lg:border-r"
                      key={name}
                    >
                      <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        {name}
                      </span>
                      <Icon
                        className="size-8"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <Icon
                        className="size-6"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <Icon
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="border-l-2 border-primary pl-4">
                <p className="font-condensed text-xs font-bold uppercase">
                  Large
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Navegação principal e estados vazios.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-condensed text-xs font-bold uppercase">
                  Medium
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Botões, campos e ações recorrentes.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <p className="font-condensed text-xs font-bold uppercase">
                  Small
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Metadados e controles compactos.
                </p>
              </div>
            </div>
          </Section>

          <Section id="components" eyebrow="06 / Catálogo" title="Componentes">
            <div className="flex flex-col gap-10">
              <div id="buttons" className="scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Button</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    sizes · states · types · semantic variants
                  </code>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-170">
                        <div className="grid grid-cols-[86px_repeat(5,minmax(105px,1fr))] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                          <span>Size</span>
                          {["Giant", "Large", "Medium", "Small", "Tiny"].map(
                            (size) => (
                              <span className="text-center" key={size}>
                                {size}
                              </span>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-[86px_repeat(5,minmax(105px,1fr))] items-center px-4 py-5">
                          <span className="font-condensed text-xs font-semibold uppercase text-muted-foreground">
                            Button
                          </span>
                          {[
                            ["Giant", "h-14 px-7 text-sm [--corner-cut:10px]"],
                            ["Large", "h-12 px-6 text-xs [--corner-cut:9px]"],
                            [
                              "Medium",
                              "h-10 px-5 text-[10px] [--corner-cut:7px]",
                            ],
                            ["Small", "h-8 px-3 text-[9px] [--corner-cut:5px]"],
                            ["Tiny", "h-6 px-2 text-[8px] [--corner-cut:4px]"],
                          ].map(([label, size]) => (
                            <div className="flex justify-center" key={label}>
                              <button
                                className={`corner-cut bg-primary font-condensed font-bold uppercase text-primary-foreground ${size}`}
                              >
                                Button
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-120">
                        <div className="grid grid-cols-[86px_repeat(5,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                          <span>Size</span>
                          {["Giant", "Large", "Medium", "Small", "Tiny"].map(
                            (size) => (
                              <span key={size}>{size}</span>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-[86px_repeat(5,1fr)] items-center px-4 py-5">
                          <span className="font-condensed text-xs font-semibold uppercase text-muted-foreground">
                            Icon
                          </span>
                          {[
                            ["Giant", "size-14 [--corner-cut:10px]", "size-5"],
                            ["Large", "size-12 [--corner-cut:9px]", "size-4.5"],
                            ["Medium", "size-10 [--corner-cut:7px]", "size-4"],
                            ["Small", "size-8 [--corner-cut:5px]", "size-3.5"],
                            ["Tiny", "size-6 [--corner-cut:4px]", "size-3"],
                          ].map(([label, size, icon]) => (
                            <div key={label}>
                              <button
                                className={`corner-cut grid place-items-center bg-primary text-primary-foreground ${size}`}
                                aria-label={`${label} favorito`}
                              >
                                <Search className={icon} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr]">
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-[470px]">
                        <div className="grid grid-cols-[82px_repeat(3,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                          <span>State</span>
                          <span>Fill</span>
                          <span>Outline</span>
                          <span>Ghost</span>
                        </div>
                        {[
                          [
                            "Default",
                            "bg-primary text-primary-foreground",
                            "border border-primary text-primary",
                            "text-primary",
                          ],
                          [
                            "Hover",
                            "bg-[#ef4444] text-white",
                            "border border-primary bg-accent text-primary",
                            "bg-accent text-primary",
                          ],
                          [
                            "Active",
                            "bg-[#b91c1c] text-white",
                            "border border-[#b91c1c] bg-accent text-[#b91c1c]",
                            "bg-muted text-[#b91c1c]",
                          ],
                          [
                            "Focus",
                            "bg-primary text-white ring-2 ring-[#ef4444] ring-offset-2",
                            "border border-primary text-primary ring-2 ring-[#ef4444] ring-offset-2",
                            "text-primary ring-2 ring-[#ef4444] ring-offset-2",
                          ],
                          [
                            "Disabled",
                            "bg-muted text-muted-foreground opacity-55",
                            "border border-border text-muted-foreground opacity-55",
                            "text-muted-foreground opacity-55",
                          ],
                        ].map(([state, fill, outline, ghost]) => (
                          <div
                            className="grid grid-cols-[82px_repeat(3,1fr)] items-center border-b border-border px-4 py-3 last:border-b-0"
                            key={state}
                          >
                            <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                              {state}
                            </span>
                            {[fill, outline, ghost].map((style, index) => (
                              <div key={index}>
                                <button
                                  className={`min-h-8 min-w-20 px-3 font-condensed text-[9px] font-bold uppercase ${style}`}
                                  disabled={state === "Disabled"}
                                >
                                  {index === 2 ? state : "Button"}
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-[420px]">
                        <div className="grid grid-cols-[82px_repeat(3,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                          <span>State</span>
                          <span>Fill</span>
                          <span>Outline</span>
                          <span>Ghost</span>
                        </div>
                        {[
                          [
                            "Default",
                            "bg-primary text-white",
                            "border border-primary text-primary",
                            "text-primary",
                          ],
                          [
                            "Hover",
                            "bg-[#ef4444] text-white",
                            "border border-primary bg-accent text-primary",
                            "bg-accent text-primary",
                          ],
                          [
                            "Active",
                            "bg-[#b91c1c] text-white",
                            "border border-[#b91c1c] text-[#b91c1c]",
                            "bg-muted text-[#b91c1c]",
                          ],
                          [
                            "Focus",
                            "bg-primary text-white ring-2 ring-[#ef4444] ring-offset-2",
                            "border border-primary text-primary ring-2 ring-[#ef4444] ring-offset-2",
                            "text-primary ring-2 ring-[#ef4444] ring-offset-2",
                          ],
                          [
                            "Disabled",
                            "bg-muted text-muted-foreground opacity-55",
                            "border border-border text-muted-foreground opacity-55",
                            "text-muted-foreground opacity-55",
                          ],
                        ].map(([state, fill, outline, ghost]) => (
                          <div
                            className="grid grid-cols-[82px_repeat(3,1fr)] items-center border-b border-border px-4 py-3 last:border-b-0"
                            key={state}
                          >
                            <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                              {state}
                            </span>
                            {[fill, outline, ghost].map((style, index) => (
                              <div key={index}>
                                <button
                                  className={`grid size-8 place-items-center ${style}`}
                                  disabled={state === "Disabled"}
                                  aria-label={`${state} favorito`}
                                >
                                  <Search className="size-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-border bg-card">
                      <div className="grid grid-cols-[82px_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>Type</span>
                        <span>Button + icon</span>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="grid grid-cols-[82px_1fr] items-center">
                          <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                            Left
                          </span>
                          <button className="corner-cut h-9 w-fit min-w-28 justify-self-start bg-primary px-4 font-condensed text-[9px] font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [--corner-cut:7px]">
                            <Search className="mr-2 inline size-3.5" />
                            Button
                          </button>
                        </div>
                        <div className="grid grid-cols-[82px_1fr] items-center">
                          <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                            Right
                          </span>
                          <button className="corner-cut h-9 w-fit min-w-28 justify-self-start bg-primary px-4 font-condensed text-[9px] font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [--corner-cut:7px]">
                            Button
                            <Search className="ml-2 inline size-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-[82px_1fr] items-center">
                          <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                            None
                          </span>
                          <button className="corner-cut h-9 w-fit min-w-28 justify-self-start bg-primary px-4 font-condensed text-[9px] font-bold uppercase text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [--corner-cut:7px]">
                            Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto border border-border bg-card">
                    <div className="min-w-[520px]">
                      <div className="grid grid-cols-[140px_1fr_88px] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>Status</span>
                        <span>Button</span>
                        <span>Icon</span>
                      </div>
                      {[
                        [
                          "Primary",
                          "corner-cut bg-primary text-white [--corner-cut:7px]",
                        ],
                        [
                          "Success",
                          "corner-cut bg-success-foreground text-white [--corner-cut:7px]",
                        ],
                        [
                          "Warning",
                          "corner-cut bg-[var(--warning-strong)] text-[var(--warning-on-strong)] [--corner-cut:7px]",
                        ],
                        [
                          "Destructive",
                          "corner-cut bg-destructive text-white [--corner-cut:7px]",
                        ],
                        [
                          "Info",
                          "corner-cut bg-info-foreground text-white [--corner-cut:7px]",
                        ],
                        [
                          "Control",
                          "border-2 border-border bg-card text-foreground",
                        ],
                        ["Basic", "bg-muted text-foreground"],
                      ].map(([variant, color]) => (
                        <div
                          className="grid grid-cols-[140px_1fr_88px] items-center border-b border-border px-4 py-3 last:border-b-0"
                          key={variant}
                        >
                          <span className="font-condensed text-xs font-semibold uppercase text-muted-foreground">
                            {variant}
                          </span>
                          <div>
                            <button
                              className={`min-h-9 min-w-28 px-4 font-condensed text-[10px] font-bold uppercase ${color}`}
                            >
                              Button
                            </button>
                          </div>
                          <div>
                            <button
                              className={`grid size-9 place-items-center ${color}`}
                              aria-label={`${variant} favorito`}
                            >
                              <Search className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 border border-border bg-card p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl uppercase">
                      Link button
                    </h3>
                    <code className="font-mono text-[9px] text-muted-foreground">
                      default · hover · icon · disabled
                    </code>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <button className="font-condensed text-xs font-bold uppercase text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                      Link padrão
                    </button>
                    <button className="font-condensed text-xs font-bold uppercase text-primary underline underline-offset-4">
                      Link hover
                    </button>
                    <button className="inline-flex items-center gap-2 font-condensed text-xs font-bold uppercase text-primary">
                      <Search className="size-3.5" />
                      Buscar viatura
                    </button>
                    <button className="inline-flex items-center gap-2 font-condensed text-xs font-bold uppercase text-primary">
                      Ver detalhes
                      <ChevronRight className="size-3.5" />
                    </button>
                    <button
                      className="font-condensed text-xs font-bold uppercase text-muted-foreground opacity-50"
                      disabled
                    >
                      Link desabilitado
                    </button>
                  </div>
                </div>

                <div className="mt-4 border border-border bg-card p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl uppercase">
                      Loading state
                    </h3>
                    <code className="font-mono text-[9px] text-muted-foreground">
                      spinner · aria-busy · disabled
                    </code>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      [
                        "Processando",
                        "corner-cut bg-primary text-primary-foreground [--corner-cut:7px]",
                      ],
                      [
                        "Salvando",
                        "corner-cut bg-success-foreground text-white [--corner-cut:7px]",
                      ],
                      [
                        "Aguarde",
                        "corner-cut bg-[var(--warning-strong)] text-[var(--warning-on-strong)] [--corner-cut:7px]",
                      ],
                      [
                        "Carregando",
                        "corner-cut bg-info-foreground text-white [--corner-cut:7px]",
                      ],
                      [
                        "Consultando",
                        "border-2 border-border bg-card text-foreground",
                      ],
                    ].map(([label, color]) => (
                      <button
                        className={`inline-flex min-h-10 min-w-32 items-center justify-center gap-2 px-4 font-condensed text-[10px] font-bold uppercase opacity-80 ${color}`}
                        type="button"
                        aria-busy="true"
                        disabled
                        key={label}
                      >
                        <LoaderCircle className="size-4 animate-spin" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                    <h3 className="font-display text-2xl uppercase">
                      Button group
                    </h3>
                    <code className="font-mono text-[9px] text-muted-foreground">
                      style · size · state
                    </code>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr_0.75fr]">
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-[430px]">
                        <div className="grid grid-cols-[80px_repeat(3,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          <span>Style</span>
                          <span>Primary</span>
                          <span>Basic</span>
                          <span>Outline</span>
                        </div>
                        {[
                          ["Icon", false],
                          ["Text", true],
                        ].map(([type, text]) => (
                          <div
                            className="grid grid-cols-[80px_repeat(3,1fr)] items-center border-b border-border px-4 py-4 last:border-b-0"
                            key={type as string}
                          >
                            <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                              {type as string}
                            </span>
                            {["primary", "basic", "outline"].map((style) => (
                              <div className="flex" key={style}>
                                {["L", "M", "R"].map((item, index) => (
                                  <button
                                    className={`grid h-8 min-w-8 place-items-center border-r font-condensed text-[9px] font-bold last:border-r-0 ${style === "primary" ? "border-primary-foreground/20 bg-primary text-primary-foreground" : style === "basic" ? "border-border bg-muted text-foreground" : `border-primary text-primary ${index === 1 ? "bg-accent" : ""}`}`}
                                    key={item}
                                  >
                                    {text ? (
                                      item
                                    ) : (
                                      <Search className="size-3.5" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-[560px]">
                        <div className="grid grid-cols-[70px_repeat(5,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          <span>Size</span>
                          {["Giant", "Large", "Medium", "Small", "Tiny"].map(
                            (size) => (
                              <span key={size}>{size}</span>
                            ),
                          )}
                        </div>
                        {[
                          ["Icon", false],
                          ["Text", true],
                        ].map(([type, text]) => (
                          <div
                            className="grid grid-cols-[70px_repeat(5,1fr)] items-center border-b border-border px-4 py-4 last:border-b-0"
                            key={type as string}
                          >
                            <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                              {type as string}
                            </span>
                            {[
                              ["h-10", "px-2"],
                              ["h-9", "px-2"],
                              ["h-8", "px-1.5"],
                              ["h-7", "px-1"],
                              ["h-6", "px-0.5"],
                            ].map(([height, padding], sizeIndex) => (
                              <div className="flex" key={sizeIndex}>
                                {["L", "M", "R"].map((item) => (
                                  <button
                                    className={`${height} ${padding} min-w-6 border-r border-primary-foreground/20 bg-primary font-condensed text-[8px] font-bold text-primary-foreground last:border-r-0`}
                                    key={item}
                                  >
                                    {text ? (
                                      item
                                    ) : (
                                      <Search className="mx-auto size-3" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border border-border bg-card">
                      <div className="grid grid-cols-[80px_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        <span>State</span>
                        <span>Default</span>
                        <span>Active</span>
                      </div>
                      {[
                        [
                          "Primary",
                          "bg-primary text-white",
                          "bg-[#b91c1c] text-white",
                        ],
                        [
                          "Basic",
                          "bg-muted text-foreground",
                          "bg-neutral text-foreground",
                        ],
                        [
                          "Outline",
                          "border border-border text-muted-foreground",
                          "border border-primary bg-accent text-primary",
                        ],
                      ].map(([name, normal, active]) => (
                        <div
                          className="grid grid-cols-[80px_1fr_1fr] items-center border-b border-border px-4 py-4 last:border-b-0"
                          key={name}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {name}
                          </span>
                          <button
                            className={`grid size-8 place-items-center ${normal}`}
                            aria-label={`${name} padrão`}
                          >
                            <Search className="size-3.5" />
                          </button>
                          <button
                            className={`grid size-8 place-items-center ${active}`}
                            aria-label={`${name} ativo`}
                          >
                            <Search className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div id="images" className="mt-8 scroll-mt-4">
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                    <h3 className="font-display text-2xl uppercase">Images</h3>
                    <code className="font-mono text-[9px] text-muted-foreground">
                      image · shape
                    </code>
                  </div>
                  <div className="grid gap-4">
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="min-w-[680px]">
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          <span>Style</span>
                          <span>Circle</span>
                          <span>Square</span>
                          <span>Rounded</span>
                          <span>Top</span>
                          <span>Bottom</span>
                          <span>Left</span>
                          <span>Right</span>
                        </div>
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] items-center px-4 py-5">
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            Image
                          </span>
                          {[
                            "rounded-full",
                            "rounded-none",
                            "rounded-lg",
                            "rounded-t-lg",
                            "rounded-b-lg",
                            "rounded-l-lg",
                            "rounded-r-lg",
                          ].map((shape) => (
                            <div className="flex justify-center" key={shape}>
                              <span
                                className={`block aspect-square w-16 overflow-hidden border border-border bg-muted ${shape}`}
                              >
                                <img
                                  className="h-full w-full object-cover"
                                  src="https://picsum.photos/seed/design/200/150"
                                  alt="Placeholder"
                                />
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="forms" className="order-2 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">
                    Form controls
                  </h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    input · select · textarea · checkbox · error
                  </code>
                </div>
                <div className="mb-4 overflow-x-auto border border-border bg-card">
                  <div className="min-w-[680px]">
                    <div className="grid grid-cols-[110px_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      <span>State</span>
                      <span>Input</span>
                      <span>Input + icon</span>
                    </div>
                    {[
                      [
                        "Default",
                        "",
                        "Placeholder",
                        "border-border bg-input",
                        "text-muted-foreground",
                      ],
                      [
                        "Input text",
                        "Input text",
                        "",
                        "border-border bg-input",
                        "text-muted-foreground",
                      ],
                      [
                        "Hover",
                        "",
                        "Placeholder",
                        "border-foreground/20 bg-muted/60",
                        "text-muted-foreground",
                      ],
                      [
                        "Focus",
                        "Digitando...",
                        "",
                        "border-ring bg-input ring-2 ring-ring/15",
                        "text-primary",
                      ],
                      [
                        "Disabled",
                        "",
                        "Placeholder",
                        "border-border bg-muted opacity-50",
                        "text-muted-foreground",
                      ],
                    ].map(([state, value, placeholder, style, iconColor]) => (
                      <div
                        className="grid grid-cols-[110px_1fr_1fr] items-center gap-5 border-b border-border px-4 py-3 last:border-b-0"
                        key={state}
                      >
                        <span className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                          {state}
                        </span>
                        <input
                          className={`h-10 w-full border px-3 text-sm outline-none placeholder:text-muted-foreground ${style}`}
                          value={value}
                          placeholder={placeholder}
                          readOnly
                          disabled={state === "Disabled"}
                        />
                        <span className="relative">
                          <input
                            className={`h-10 w-full border py-2 pl-10 pr-3 text-sm outline-none placeholder:text-muted-foreground ${style}`}
                            value={value}
                            placeholder={placeholder}
                            readOnly
                            disabled={state === "Disabled"}
                          />
                          <Search
                            className={`pointer-events-none absolute left-3 top-3 size-4 ${iconColor}`}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <form
                  className="grid gap-5 bg-card p-5 sm:grid-cols-2"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <label className="grid gap-2">
                    <span className="font-condensed text-[11px] font-semibold uppercase">
                      Prefixo da viatura
                    </span>
                    <input
                      className="h-11 border border-border bg-input px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/15"
                      placeholder="Ex.: UR-214"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-condensed text-[11px] font-semibold uppercase">
                      Tipo
                    </span>
                    <span className="relative">
                      <select
                        className="h-11 w-full appearance-none border border-border bg-input px-3 pr-10 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Selecione um tipo
                        </option>
                        <option>Unidade de resgate</option>
                        <option>Auto bomba tanque</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-3.5 size-4 text-muted-foreground" />
                    </span>
                  </label>
                  <label className="grid gap-2">
                    <span className="font-condensed text-[11px] font-semibold uppercase text-destructive">
                      Quilometragem / erro
                    </span>
                    <input
                      className="h-11 border border-destructive bg-input px-3 font-mono text-sm outline-none focus:ring-2 focus:ring-destructive/15"
                      defaultValue="-120"
                      aria-invalid="true"
                    />
                    <span className="text-xs text-destructive">
                      Informe um valor maior que a leitura anterior.
                    </span>
                  </label>
                  <label className="grid gap-2">
                    <span className="font-condensed text-[11px] font-semibold uppercase">
                      Observações
                    </span>
                    <textarea
                      className="min-h-24 resize-y border border-border bg-input p-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                      placeholder="Registre informações relevantes."
                    />
                  </label>
                  <label className="flex items-center gap-3 text-sm sm:col-span-2">
                    <input
                      className="size-4 accent-primary"
                      type="checkbox"
                      defaultChecked
                    />
                    Viatura disponível para operação
                  </label>
                </form>
              </div>
              <div className="order-8">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Card</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    default · interactive · metric
                  </code>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="corner-cut bg-border p-[1px] [--corner-cut:10px]">
                    <article className="corner-cut h-full bg-card p-5">
                      <p className="font-condensed text-[10px] font-semibold uppercase text-primary">
                        Viatura
                      </p>
                      <h4 className="mt-2 font-display text-3xl uppercase">
                        UR-214
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Unidade de resgate disponível para operação.
                      </p>
                    </article>
                  </div>
                  <div className="corner-cut bg-border p-[1px] shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md [--corner-cut:10px]">
                    <article className="corner-cut h-full bg-card p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                              Próxima revisão
                            </p>
                            <h4 className="mt-2 font-display text-3xl uppercase">
                              1.240 km
                            </h4>
                          </div>
                          <Settings2 className="size-5 text-maintenance-foreground" />
                        </div>
                      </div>
                      <button className="mt-5 w-fit font-condensed text-xs font-semibold uppercase text-primary text-left">
                        Ver manutenção
                      </button>
                    </article>
                  </div>
                  <article className="corner-cut bg-secondary p-5 text-secondary-foreground [--corner-cut:10px]">
                    <p className="font-condensed text-[10px] font-semibold uppercase text-secondary-foreground/60">
                      Movimentações
                    </p>
                    <p className="mt-2 font-display text-5xl">128</p>
                    <p className="mt-1 text-xs text-secondary-foreground/60">
                      Nos últimos 30 dias
                    </p>
                  </article>
                </div>
              </div>

              <div className="order-6">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Badge</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    status · notification
                  </code>
                </div>
                <div className="grid gap-8 bg-card p-5">
                  <div className="flex flex-wrap gap-3">
                    {statuses.map(([label, color, Icon]) => (
                      <span
                        className={`corner-cut inline-flex items-center gap-1.5 px-2.5 py-1 font-condensed text-[10px] font-bold uppercase [--corner-cut:3px] ${color}`}
                        key={`component-${label}`}
                      >
                        <Icon className="size-3" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-border pt-5">
                    <p className="font-condensed text-[11px] font-semibold uppercase text-muted-foreground">
                      Notifications & Avatars
                    </p>
                    <div className="flex flex-wrap items-center gap-8">
                      {/* 1. Bell only */}
                      <div className="relative inline-flex">
                        <div className="grid size-12 place-items-center rounded-full bg-muted">
                          <Bell className="size-5 text-foreground" />
                        </div>
                      </div>

                      {/* 2. Photo + Red Dot */}
                      <div className="relative inline-flex">
                        <img
                          src="https://i.pravatar.cc/150?img=11"
                          alt="Avatar"
                          className="size-12 rounded-full object-cover ring-1 ring-border"
                        />
                        <span className="absolute right-0 top-0 size-3 rounded-full bg-destructive ring-2 ring-card" />
                      </div>

                      {/* 3. Photo + Red Dot */}
                      <div className="relative inline-flex">
                        <img
                          src="https://i.pravatar.cc/150?img=12"
                          alt="Avatar"
                          className="size-12 rounded-full object-cover ring-1 ring-border"
                        />
                        <span className="absolute right-0 top-0 size-3 rounded-full bg-destructive ring-2 ring-card" />
                      </div>

                      {/* 4. Icon + Red Dot */}
                      <div className="relative inline-flex">
                        <div className="grid size-12 place-items-center rounded-full bg-info/10">
                          <Bell className="size-5 text-info" />
                        </div>
                        <span className="absolute right-0 top-0 size-3 rounded-full bg-destructive ring-2 ring-card" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="feedback" className="order-7 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Alert</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    default · error · success · warning · info
                  </code>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    [
                      "Alerta padrão",
                      "Há uma informação importante para revisar.",
                      "border-foreground/30 bg-neutral text-foreground",
                      CircleAlert,
                    ],
                    [
                      "Informação operacional",
                      "A escala de serviço foi atualizada.",
                      "border-info-foreground bg-info text-info-foreground",
                      Info,
                    ],
                    [
                      "Registro concluído",
                      "A movimentação foi salva com sucesso.",
                      "border-success-foreground bg-success text-success-foreground",
                      Check,
                    ],
                    [
                      "Atenção necessária",
                      "Existe um checklist pendente.",
                      "bg-warning text-warning-foreground [border-color:var(--warning-strong)]",
                      AlertTriangle,
                    ],
                    [
                      "Não foi possível salvar",
                      "Revise os campos marcados e tente novamente.",
                      "border-destructive bg-accent text-destructive",
                      CircleX,
                    ],
                  ].map(([title, message, color, Icon]) => (
                    <div
                      className={`grid grid-cols-[20px_1fr] items-center gap-3 border-l-4 p-4 ${color as string}`}
                      role="alert"
                      key={title as string}
                    >
                      <Icon className="size-4" />
                      <div>
                        <p className="font-condensed text-xs font-semibold uppercase">
                          {title as string}
                        </p>
                        <p className="mt-1 text-sm">{message as string}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="selection-controls" className="order-3 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">
                    Selection controls
                  </h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    checkbox · radio button · toggle
                  </code>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="overflow-x-auto border border-border bg-card lg:col-span-2">
                    <div className="min-w-[560px]">
                      <div className="border-b border-border px-4 py-3">
                        <h4 className="font-condensed text-xs font-bold uppercase">
                          Checkbox
                        </h4>
                      </div>
                      <div className="grid grid-cols-[92px_repeat(4,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        <span>Status</span>
                        <span>Active</span>
                        <span>Unchecked</span>
                        <span>Indeterminate</span>
                        <span>Checkbox + label</span>
                      </div>
                      {[
                        [
                          "Default",
                          "bg-primary border-primary text-white",
                          "border-border",
                          "bg-primary border-primary text-white",
                          "",
                        ],
                        [
                          "Hover",
                          "bg-[#ef4444] border-[#ef4444] text-white",
                          "border-primary bg-accent",
                          "bg-[#ef4444] border-[#ef4444] text-white",
                          "",
                        ],
                        [
                          "Focus",
                          "bg-primary border-primary text-white ring-2 ring-ring/25 ring-offset-2",
                          "border-primary ring-2 ring-ring/25 ring-offset-2",
                          "bg-primary border-primary text-white ring-2 ring-ring/25 ring-offset-2",
                          "",
                        ],
                        [
                          "Disabled",
                          "bg-muted border-border text-muted-foreground opacity-50",
                          "border-border bg-muted opacity-50",
                          "bg-muted border-border text-muted-foreground opacity-50",
                          "opacity-50",
                        ],
                        [
                          "Success",
                          "bg-success-foreground border-success-foreground text-white",
                          "border-success-foreground bg-success",
                          "bg-success-foreground border-success-foreground text-white",
                          "",
                        ],
                        [
                          "Warning",
                          "bg-[var(--warning-strong)] text-[var(--warning-on-strong)] [border-color:var(--warning-strong)]",
                          "bg-warning [border-color:var(--warning-strong)]",
                          "bg-[var(--warning-strong)] text-[var(--warning-on-strong)] [border-color:var(--warning-strong)]",
                          "",
                        ],
                        [
                          "Danger",
                          "bg-destructive border-destructive text-white",
                          "border-destructive bg-accent",
                          "bg-destructive border-destructive text-white",
                          "",
                        ],
                        [
                          "Info",
                          "bg-info-foreground border-info-foreground text-white",
                          "border-info-foreground bg-info",
                          "bg-info-foreground border-info-foreground text-white",
                          "",
                        ],
                        [
                          "Control",
                          "bg-secondary border-secondary text-secondary-foreground",
                          "border-secondary",
                          "bg-secondary border-secondary text-secondary-foreground",
                          "",
                        ],
                      ].map(([state, active, unchecked, intermediate, row]) => (
                        <div
                          className={`grid grid-cols-[92px_repeat(4,1fr)] items-center border-b border-border px-4 py-3 last:border-b-0 ${row}`}
                          key={state}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {state}
                          </span>
                          <span
                            className={`grid size-4 place-items-center border ${active}`}
                          >
                            <Check className="size-2.5" />
                          </span>
                          <span className={`size-4 border ${unchecked}`} />
                          <span
                            className={`grid size-4 place-items-center border ${intermediate}`}
                          >
                            <span className="h-0.5 w-2 bg-current" />
                          </span>
                          <span className="flex items-center gap-2">
                            <span
                              className={`grid size-4 place-items-center border ${active}`}
                            >
                              <Check className="size-2.5" />
                            </span>
                            <span className="text-[10px]">Label</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-border bg-card">
                    <div className="min-w-[500px]">
                      <div className="border-b border-border px-4 py-3">
                        <h4 className="font-condensed text-xs font-bold uppercase">
                          Radio button
                        </h4>
                      </div>
                      <div className="grid grid-cols-[92px_repeat(3,1fr)] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        <span>Status</span>
                        <span>Active</span>
                        <span>Unchecked</span>
                        <span>Radio + label</span>
                      </div>
                      {[
                        [
                          "Default",
                          "border-primary after:bg-primary",
                          "border-border",
                          "",
                        ],
                        [
                          "Hover",
                          "border-[#ef4444] bg-accent after:bg-[#ef4444]",
                          "border-primary bg-accent",
                          "",
                        ],
                        [
                          "Focus",
                          "border-primary after:bg-primary ring-2 ring-ring/25 ring-offset-2",
                          "border-primary ring-2 ring-ring/25 ring-offset-2",
                          "",
                        ],
                        [
                          "Disabled",
                          "border-border bg-muted after:bg-muted-foreground opacity-50",
                          "border-border bg-muted opacity-50",
                          "opacity-50",
                        ],
                        [
                          "Success",
                          "border-success-foreground after:bg-success-foreground",
                          "border-success-foreground bg-success",
                          "",
                        ],
                        [
                          "Warning",
                          "[border-color:var(--warning-strong)] after:bg-[var(--warning-strong)]",
                          "bg-warning [border-color:var(--warning-strong)]",
                          "",
                        ],
                        [
                          "Danger",
                          "border-destructive after:bg-destructive",
                          "border-destructive bg-accent",
                          "",
                        ],
                        [
                          "Info",
                          "border-info-foreground after:bg-info-foreground",
                          "border-info-foreground bg-info",
                          "",
                        ],
                        [
                          "Control",
                          "border-secondary after:bg-secondary",
                          "border-secondary",
                          "",
                        ],
                      ].map(([state, active, unchecked, row]) => (
                        <div
                          className={`grid grid-cols-[92px_repeat(3,1fr)] items-center border-b border-border px-4 py-3 last:border-b-0 ${row}`}
                          key={state}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {state}
                          </span>
                          <span
                            className={`relative size-4 rounded-full border after:absolute after:inset-[3px] after:rounded-full ${active}`}
                          />
                          <span
                            className={`size-4 rounded-full border ${unchecked}`}
                          />
                          <span className="flex items-center gap-2">
                            <span
                              className={`relative size-4 rounded-full border after:absolute after:inset-[3px] after:rounded-full ${active}`}
                            />
                            <span className="text-[10px]">Label</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-border bg-card">
                    <div className="min-w-[300px]">
                      <div className="border-b border-border px-4 py-3">
                        <h4 className="font-condensed text-xs font-bold uppercase">
                          Toggle
                        </h4>
                      </div>
                      <div className="grid grid-cols-[92px_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        <span>Status</span>
                        <span>Off / On</span>
                      </div>
                      {[
                        ["Default", "bg-primary", ""],
                        ["Hover", "bg-[#ef4444]", ""],
                        [
                          "Focus",
                          "bg-primary ring-2 ring-ring/25 ring-offset-2",
                          "",
                        ],
                        [
                          "Disabled",
                          "bg-muted-foreground opacity-40",
                          "opacity-50",
                        ],
                        ["Success", "bg-success-foreground", ""],
                        ["Warning", "bg-[var(--warning-strong)]", ""],
                        ["Danger", "bg-destructive", ""],
                        ["Info", "bg-info-foreground", ""],
                        ["Control", "bg-secondary", ""],
                      ].map(([state, active, row]) => (
                        <div
                          className={`grid grid-cols-[92px_1fr] items-center border-b border-border px-4 py-3 last:border-b-0 ${row}`}
                          key={state}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {state}
                          </span>
                          <span className="flex items-center gap-3">
                            <span
                              className={`relative h-6 w-11 rounded-full border bg-muted after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-card ${state === "Hover" ? "border-primary bg-accent dark:border-primary/50 dark:bg-accent/50" : "border-border"}`}
                            />
                            <span
                              className={`relative h-6 w-11 rounded-full ${active} after:absolute after:right-1 after:top-1 after:size-4 after:rounded-full after:bg-white`}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div id="overlays" className="order-9 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Overlays</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    dialog · popover · dropdown menu
                  </code>
                </div>
                <div className="flex min-h-48 flex-wrap items-start gap-4 bg-card p-5">
                  <button
                    className="corner-cut min-h-10 bg-primary px-5 font-condensed text-xs font-semibold uppercase text-primary-foreground [--corner-cut:7px]"
                    onClick={openDialog}
                  >
                    Abrir dialog
                  </button>
                  <details className="relative">
                    <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 border border-border px-4 font-condensed text-xs font-semibold uppercase hover:bg-muted">
                      Abrir popover <ChevronDown className="size-4" />
                    </summary>
                    <div className="absolute left-0 top-12 z-10 w-72 border border-border bg-popover p-4 text-popover-foreground shadow-md">
                      <p className="font-condensed text-xs font-semibold uppercase">
                        Filtros rápidos
                      </p>
                      <label className="mt-4 flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="accent-primary"
                          defaultChecked
                        />{" "}
                        Somente operacionais
                      </label>
                      <label className="mt-3 flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-primary" /> Com
                        pendências
                      </label>
                    </div>
                  </details>
                  <details className="relative">
                    <summary
                      className="grid size-10 cursor-pointer list-none place-items-center border border-border hover:bg-muted"
                      aria-label="Abrir menu"
                    >
                      <MoreHorizontal className="size-5" />
                    </summary>
                    <div className="absolute right-0 top-12 z-10 w-48 border border-border bg-popover py-1 shadow-md">
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-muted">
                        Visualizar
                      </button>
                      <button className="block w-full px-4 py-2 text-left text-sm hover:bg-muted">
                        Editar
                      </button>
                      <div className="my-1 border-t border-border" />
                      <button className="block w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent">
                        Excluir
                      </button>
                    </div>
                  </details>
                </div>

                <div className="mt-10">
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                    <h3 className="font-display text-2xl uppercase">
                      Overflow Menu
                    </h3>
                    <code className="font-mono text-[9px] text-muted-foreground">
                      icon · icon + text
                    </code>
                  </div>
                  <div className="grid gap-4 xl:grid-cols-[1fr_1.5fr]">
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="grid grid-cols-[100px_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>Type</span>
                        <span>Icon</span>
                        <span>Icon + Text</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr_1fr] items-center px-4 py-4">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Default
                        </span>
                        <div>
                          <div className="flex flex-col gap-2 border border-border bg-card p-2 w-fit shadow-sm">
                            <Star
                              className="size-4 text-muted-foreground"
                              fill="currentColor"
                            />
                            <Star
                              className="size-4 text-muted-foreground"
                              fill="currentColor"
                            />
                            <Star
                              className="size-4 text-muted-foreground"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-col border border-border bg-card py-2 w-40 shadow-sm">
                            <div className="flex items-center gap-2 px-3 py-1 hover:bg-muted">
                              <Star
                                className="size-4 text-muted-foreground"
                                fill="currentColor"
                              />
                              <span className="text-xs">Menu item</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 hover:bg-muted">
                              <Star
                                className="size-4 text-muted-foreground"
                                fill="currentColor"
                              />
                              <span className="text-xs">Menu item</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 hover:bg-muted">
                              <Star
                                className="size-4 text-muted-foreground"
                                fill="currentColor"
                              />
                              <span className="text-xs">Menu item</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="grid grid-cols-[100px_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>State</span>
                        <span>Icon</span>
                        <span>Icon + Text</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr_1fr] items-center border-b border-border px-4 py-4">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Default
                        </span>
                        <div>
                          <div className="grid size-8 place-items-center bg-card shadow-sm border border-border">
                            <Star
                              className="size-4 text-muted-foreground"
                              fill="currentColor"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex h-8 w-40 items-center gap-2 bg-card px-3 shadow-sm border border-border">
                            <Star
                              className="size-4 text-muted-foreground"
                              fill="currentColor"
                            />
                            <span className="text-xs">Menu item</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[100px_1fr_1fr] items-center px-4 py-4">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Active
                        </span>
                        <div>
                          <div className="grid size-8 place-items-center bg-info-foreground text-white shadow-sm">
                            <Star className="size-4" fill="currentColor" />
                          </div>
                        </div>
                        <div>
                          <div className="flex h-8 w-40 items-center gap-2 bg-info-foreground px-3 text-white shadow-sm">
                            <Star className="size-4" fill="currentColor" />
                            <span className="text-xs">Menu Item</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-10 xl:grid-cols-2">
                  <div>
                    <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                      <h3 className="font-display text-2xl uppercase">
                        Tooltip
                      </h3>
                      <code className="font-mono text-[9px] text-muted-foreground">
                        light · dark
                      </code>
                    </div>
                    <div className="overflow-x-auto border border-border bg-card">
                      <div className="grid grid-cols-2 border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>Style</span>
                        <span>&nbsp;</span>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="grid gap-4 bg-muted/40 p-6">
                          <div className="relative mx-auto w-fit rounded bg-card px-3 py-1 text-center text-[10px] shadow-sm">
                            Tooltip top
                            <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-card" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-card px-3 py-1 text-center text-[10px] shadow-sm">
                            Tooltip bottom
                            <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-card" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-card px-3 py-1 text-center text-[10px] shadow-sm">
                            Tooltip left
                            <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-card" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-card px-3 py-1 text-center text-[10px] shadow-sm">
                            Tooltip right
                            <div className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-card" />
                          </div>
                        </div>
                        <div className="grid gap-4 bg-card p-6">
                          <div className="relative mx-auto w-fit rounded bg-foreground px-3 py-1 text-center text-[10px] text-background shadow-sm">
                            Tooltip top
                            <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-foreground px-3 py-1 text-center text-[10px] text-background shadow-sm">
                            Tooltip bottom
                            <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-foreground px-3 py-1 text-center text-[10px] text-background shadow-sm">
                            Tooltip left
                            <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-foreground" />
                          </div>
                          <div className="relative mx-auto w-fit rounded bg-foreground px-3 py-1 text-center text-[10px] text-background shadow-sm">
                            Tooltip right
                            <div className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rotate-45 bg-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                      <h3 className="font-display text-2xl uppercase">
                        Popover
                      </h3>
                      <code className="font-mono text-[9px] text-muted-foreground">
                        icon · text · icon + text
                      </code>
                    </div>
                    <div className="overflow-x-auto border border-border bg-card h-full">
                      <div className="grid grid-cols-[100px_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        <span>Type</span>
                        <span>Default</span>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] items-center border-b border-border px-4 py-5">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Icon
                        </span>
                        <div>
                          <div className="relative flex w-fit items-center gap-2 rounded bg-foreground p-2 text-background shadow-sm">
                            <Star className="size-4" fill="currentColor" />
                            <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] items-center border-b border-border px-4 py-5">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Text
                        </span>
                        <div>
                          <div className="relative flex w-fit items-center gap-2 rounded bg-foreground px-3 py-2 text-[10px] text-background shadow-sm">
                            Place your text here
                            <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-[100px_1fr] items-center px-4 py-5">
                        <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                          Icon + Text
                        </span>
                        <div>
                          <div className="relative flex w-fit items-center gap-2 rounded bg-foreground px-3 py-2 text-[10px] text-background shadow-sm">
                            <Star className="size-4" fill="currentColor" />
                            Place text here
                            <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div id="navigation" className="order-10 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Navegação</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    top bar · bottom navigation · tabs · pagination
                  </code>
                </div>
                <div className="mb-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                  <div className="border border-border bg-card">
                    <div className="grid grid-cols-[100px_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      <span>Top bar</span>
                      <span>Title + actions</span>
                    </div>
                    <div className="space-y-5 p-4">
                      {[
                        ["Uma linha / esquerda", false, false],
                        ["Uma linha / centro", true, false],
                        ["Duas linhas / esquerda", false, true],
                        ["Duas linhas / centro", true, true],
                      ].map(([label, centered, secondary]) => (
                        <div
                          className="grid grid-cols-[100px_1fr] items-center gap-3"
                          key={label as string}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {label as string}
                          </span>
                          <div className="grid min-h-12 grid-cols-[40px_1fr_80px] items-center border border-border bg-background px-1">
                            <button
                              className="grid size-9 place-items-center hover:bg-muted"
                              aria-label="Voltar"
                            >
                              <ArrowLeft className="size-4" />
                            </button>
                            <div
                              className={centered ? "text-center" : "text-left"}
                            >
                              <p className="font-condensed text-xs font-bold uppercase">
                                Viaturas
                              </p>
                              {secondary && (
                                <p className="text-[10px] text-muted-foreground">
                                  Gestão da frota
                                </p>
                              )}
                            </div>
                            <div className="flex justify-end">
                              <button
                                className="grid size-9 place-items-center hover:bg-muted"
                                aria-label="Buscar"
                              >
                                <Search className="size-4" />
                              </button>
                              <button
                                className="grid size-9 place-items-center hover:bg-muted"
                                aria-label="Mais opções"
                              >
                                <MoreHorizontal className="size-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-border bg-card">
                    <div className="grid grid-cols-[70px_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      <span>Bottom</span>
                      <span>Only icon</span>
                      <span>Icon + text</span>
                    </div>
                    <div className="space-y-3 p-4">
                      {[5, 4, 3, 2].map((count) => (
                        <div
                          className="grid grid-cols-[70px_1fr_1fr] items-center gap-4"
                          key={count}
                        >
                          <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                            {count} itens
                          </span>
                          <nav
                            className="grid h-12 border border-border bg-background"
                            style={{
                              gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                            }}
                            aria-label={`Navegação com ${count} ícones`}
                          >
                            {[Search, Settings2, Info, Check, MoreHorizontal]
                              .slice(0, count)
                              .map((Icon, index) => (
                                <button
                                  className={`grid place-items-center border-t-2 ${index === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                                  aria-label={`Destino ${index + 1}`}
                                  key={index}
                                >
                                  <Icon className="size-4" />
                                </button>
                              ))}
                          </nav>
                          <nav
                            className="grid h-14 border border-border bg-background"
                            style={{
                              gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                            }}
                            aria-label={`Navegação com ${count} ícones e texto`}
                          >
                            {[Search, Settings2, Info, Check, MoreHorizontal]
                              .slice(0, count)
                              .map((Icon, index) => (
                                <button
                                  className={`grid place-items-center content-center gap-0.5 border-t-2 ${index === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                                  key={index}
                                >
                                  <Icon className="size-3.5" />
                                  <span className="font-condensed text-[8px] font-semibold uppercase">
                                    Item
                                  </span>
                                </button>
                              ))}
                          </nav>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-4 overflow-x-auto border border-border bg-card">
                  <div className="min-w-[760px]">
                    <div className="grid grid-cols-[90px_1fr_1fr_1fr] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      <span>Tabs</span>
                      <span>Text</span>
                      <span>Icon</span>
                      <span>Icon + text</span>
                    </div>
                    <div className="grid grid-cols-[90px_1fr_1fr_1fr] items-end gap-5 px-4 py-5">
                      <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        Style
                      </span>
                      <div className="grid grid-cols-3 border-b border-border">
                        {["Item", "Ativo", "Item"].map((label, index) => (
                          <button
                            className={`min-h-10 border-b-2 font-condensed text-[10px] font-semibold uppercase ${index === 1 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                            key={`${label}-${index}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 border-b border-border">
                        {[0, 1, 2].map((index) => (
                          <button
                            className={`grid min-h-10 place-items-center border-b-2 ${index === 1 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                            aria-label={`Tab ${index + 1}`}
                            key={index}
                          >
                            <Search className="size-4" />
                          </button>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 border-b border-border">
                        {[0, 1, 2].map((index) => (
                          <button
                            className={`grid min-h-12 place-items-center content-center gap-0.5 border-b-2 ${index === 1 ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
                            key={index}
                          >
                            <Search className="size-3.5" />
                            <span className="font-condensed text-[9px] font-semibold uppercase">
                              Item
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-[90px_1fr_1fr] border-t border-border px-4 py-4">
                      <span className="font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                        State
                      </span>
                      <button className="min-h-10 border-b-2 border-primary font-condensed text-[10px] font-semibold uppercase text-primary">
                        Active
                      </button>
                      <button className="min-h-10 border-b-2 border-transparent font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                        Default
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 bg-card p-5">
                  <div>
                    <div
                      className="flex overflow-x-auto border-b border-border"
                      role="tablist"
                      aria-label="Detalhes da viatura"
                    >
                      {[
                        ["overview", "Visão geral"],
                        ["maintenance", "Manutenções"],
                        ["movements", "Movimentações"],
                      ].map(([value, label]) => (
                        <button
                          className={`min-h-11 shrink-0 border-b-2 px-4 font-condensed text-xs font-semibold uppercase ${activeTab === value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                          role="tab"
                          aria-selected={activeTab === value}
                          onClick={() => setActiveTab(value)}
                          key={value}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div
                      className="min-h-20 p-4 text-sm text-muted-foreground"
                      role="tabpanel"
                    >
                      Conteúdo de{" "}
                      {activeTab === "overview"
                        ? "visão geral"
                        : activeTab === "maintenance"
                          ? "manutenções"
                          : "movimentações"}
                      .
                    </div>
                  </div>
                </div>
              </div>

              <div id="pagination" className="order-11 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Paginação</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    default · compact · simple
                  </code>
                </div>
                <div className="grid gap-5 bg-card p-5 lg:grid-cols-3">
                  <div>
                    <p className="mb-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      Default
                    </p>
                    <nav
                      className="flex items-center gap-1"
                      aria-label="Paginação completa"
                    >
                      <button
                        className="grid size-9 place-items-center border border-border hover:bg-muted"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      {[1, 2, 3, 4].map((page) => (
                        <button
                          className={`size-9 font-condensed text-xs font-semibold ${page === 2 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                          aria-current={page === 2 ? "page" : undefined}
                          key={page}
                        >
                          {page}
                        </button>
                      ))}
                      <span className="grid size-9 place-items-center text-muted-foreground">
                        …
                      </span>
                      <button className="size-9 font-condensed text-xs font-semibold hover:bg-muted">
                        12
                      </button>
                      <button
                        className="grid size-9 place-items-center border border-border hover:bg-muted"
                        aria-label="Próxima página"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </nav>
                  </div>
                  <div>
                    <p className="mb-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      Compact
                    </p>
                    <nav
                      className="flex items-center gap-3"
                      aria-label="Paginação compacta"
                    >
                      <button
                        className="grid size-9 place-items-center border border-border hover:bg-muted"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <span className="font-condensed text-xs font-semibold uppercase">
                        2 de 12
                      </span>
                      <button
                        className="grid size-9 place-items-center border border-border hover:bg-muted"
                        aria-label="Próxima página"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </nav>
                  </div>
                  <div>
                    <p className="mb-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                      Simple
                    </p>
                    <nav
                      className="flex items-center justify-between gap-3"
                      aria-label="Paginação simples"
                    >
                      <button className="inline-flex min-h-9 items-center gap-1 border border-border px-3 font-condensed text-[10px] font-semibold uppercase hover:bg-muted">
                        <ChevronLeft className="size-3.5" />
                        Anterior
                      </button>
                      <span className="text-xs text-muted-foreground">
                        21–40 de 128
                      </span>
                      <button className="inline-flex min-h-9 items-center gap-1 border border-border px-3 font-condensed text-[10px] font-semibold uppercase hover:bg-muted">
                        Próxima
                        <ChevronRight className="size-3.5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="order-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Seleção</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    combobox · switch
                  </code>
                </div>
                <div className="grid gap-6 bg-card p-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="font-condensed text-[11px] font-semibold uppercase">
                      Combobox / viatura
                    </span>
                    <span className="relative">
                      <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
                      <input
                        className="h-11 w-full border border-border bg-input pl-10 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                        list="vehicle-options"
                        placeholder="Buscar viatura"
                      />
                      <datalist id="vehicle-options">
                        <option value="UR-214" />
                        <option value="ABT-32" />
                        <option value="ASA-08" />
                      </datalist>
                    </span>
                  </label>
                  <div>
                    <p className="font-condensed text-[11px] font-semibold uppercase">
                      Switches
                    </p>
                    <div className="mt-3 space-y-3">
                      {[
                        ["Notificações de manutenção", true],
                        ["Alertas por e-mail", false],
                      ].map(([label, checked]) => (
                        <label
                          className="flex items-center justify-between gap-4 text-sm"
                          key={label as string}
                        >
                          <span>{label as string}</span>
                          <span className="relative inline-flex">
                            <input
                              className="peer sr-only"
                              type="checkbox"
                              defaultChecked={checked as boolean}
                            />
                            <span className="h-6 w-11 cursor-pointer rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div id="sliders-bars" className="order-13 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">
                    Sliders & Bars
                  </h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    slider · progress bar
                  </code>
                </div>
                <div className="grid gap-12 bg-card p-10 md:px-20">
                  <div className="flex items-center gap-4">
                    <ChevronLeft className="size-4 cursor-pointer hover:text-primary" />
                    <div className="relative h-1.5 w-full rounded-full bg-muted">
                      <div className="absolute left-0 top-0 h-full w-[40%] rounded-full bg-destructive" />
                      <div className="absolute left-[40%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <span className="absolute bottom-full mb-2 whitespace-nowrap text-[10px] font-bold">
                          40%
                        </span>
                        <div className="size-3.5 cursor-pointer rounded-full bg-destructive shadow-md" />
                      </div>
                    </div>
                    <ChevronRight className="size-4 cursor-pointer hover:text-primary" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Volume2 className="size-4 text-muted-foreground" />
                    <div className="relative h-1.5 w-full rounded-full bg-muted">
                      <div className="absolute left-0 top-0 h-full w-[40%] rounded-full bg-destructive" />
                      <div className="absolute left-[40%] top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                        <div className="absolute bottom-full mb-2 whitespace-nowrap rounded bg-card px-2 py-1 text-[10px] font-bold shadow-md">
                          <span className="flex items-center gap-1">
                            <Volume2 className="size-3" /> 40%
                          </span>
                          <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-card" />
                        </div>
                        <div className="size-3.5 cursor-pointer rounded-full bg-destructive shadow-md" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Sun className="size-4 text-muted-foreground" />
                    <div className="flex h-6 w-full overflow-hidden rounded-md text-[10px] font-bold">
                      <div className="flex w-[40%] items-center justify-center bg-destructive text-white">
                        +40%
                      </div>
                      <div className="flex w-[60%] items-center justify-center bg-muted text-muted-foreground">
                        -60%
                      </div>
                    </div>
                  </div>

                  <div className="w-full">
                    <div className="relative h-1.5 w-full rounded-full bg-muted">
                      <div className="absolute left-0 top-0 h-full w-[50%] rounded-full bg-destructive" />
                      <div className="absolute left-[50%] top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-destructive shadow-md" />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] font-bold text-muted-foreground px-[5px]">
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((num) => (
                        <div key={num} className="flex flex-col items-center">
                          <div className="mb-1 h-1.5 w-[1px] bg-muted-foreground/30" />
                          <span>{num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div id="date-time" className="order-12 scroll-mt-4">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">Data</h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    calendar · date picker
                  </code>
                </div>
                <div className="grid gap-6 bg-card p-5 md:grid-cols-[320px_1fr]">
                  <div className="border border-border p-4">
                    <div className="flex items-center justify-between">
                      <button
                        className="grid size-8 place-items-center hover:bg-muted"
                        aria-label="Mês anterior"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <p className="font-condensed text-xs font-semibold uppercase">
                        Julho 2026
                      </p>
                      <button
                        className="grid size-8 place-items-center hover:bg-muted"
                        aria-label="Próximo mês"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-7 text-center font-condensed text-[9px] font-semibold uppercase text-muted-foreground">
                      {"DSTQQSS".split("").map((day, index) => (
                        <span className="py-2" key={`${day}-${index}`}>
                          {day}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 text-center text-xs">
                      {Array.from({ length: 35 }, (_, index) => {
                        const day = index - 2;
                        return (
                          <button
                            className={`aspect-square hover:bg-muted ${day === 11 ? "bg-primary text-primary-foreground" : day < 1 || day > 31 ? "text-transparent" : ""}`}
                            disabled={day < 1 || day > 31}
                            key={index}
                          >
                            {day > 0 && day <= 31 ? day : "0"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid content-start gap-5">
                    <label className="grid max-w-sm gap-2">
                      <span className="font-condensed text-[11px] font-semibold uppercase">
                        Date picker
                      </span>
                      <input
                        className="h-11 border border-border bg-input px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/15"
                        type="date"
                        defaultValue="2026-07-11"
                      />
                    </label>
                    <div className="border-l-4 border-info-foreground bg-info p-4 text-info-foreground">
                      <p className="font-condensed text-xs font-semibold uppercase">
                        Data selecionada
                      </p>
                      <p className="mt-1 text-sm">11 de julho de 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-5">
                <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h3 className="font-display text-2xl uppercase">
                    File uploader
                  </h3>
                  <code className="font-mono text-[9px] text-muted-foreground">
                    empty · selected · uploading · success · error · disabled
                  </code>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="grid min-h-52 cursor-pointer place-items-center border-2 border-dashed border-foreground/20 bg-card p-6 text-center transition-colors hover:border-primary hover:bg-accent focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring">
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/*,.pdf"
                    />
                    <span>
                      <span className="corner-cut mx-auto grid size-12 place-items-center bg-accent text-primary [--corner-cut:8px]">
                        <Upload className="size-5" />
                      </span>
                      <span className="mt-4 block font-condensed text-xs font-bold uppercase">
                        Arraste ou selecione um arquivo
                      </span>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        PDF, PNG ou JPG · máximo de 10 MB
                      </span>
                      <span className="mt-4 inline-block font-condensed text-[10px] font-bold uppercase text-primary">
                        Selecionar arquivo
                      </span>
                    </span>
                  </label>

                  <div className="grid min-h-52 content-center border-2 border-dashed border-primary bg-accent p-6 text-center">
                    <Upload className="mx-auto size-6 text-primary" />
                    <p className="mt-3 font-condensed text-xs font-bold uppercase text-primary">
                      Solte o arquivo para enviar
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      A área inteira está ativa.
                    </p>
                  </div>

                  {[
                    [
                      "selected",
                      "manual-viatura.pdf",
                      "2,4 MB",
                      "Arquivo selecionado",
                      "bg-muted",
                      "text-foreground",
                      "0%",
                    ],
                    [
                      "uploading",
                      "vistoria-frontal.jpg",
                      "4,8 MB",
                      "Enviando · 68%",
                      "bg-info",
                      "text-info-foreground",
                      "68%",
                    ],
                    [
                      "success",
                      "documento-crlv.pdf",
                      "1,2 MB",
                      "Upload concluído",
                      "bg-success",
                      "text-success-foreground",
                      "100%",
                    ],
                    [
                      "error",
                      "foto-danificada.jpg",
                      "12,7 MB",
                      "Arquivo excede o limite de 10 MB",
                      "bg-accent",
                      "text-destructive",
                      "35%",
                    ],
                  ].map(
                    ([
                      state,
                      name,
                      size,
                      status,
                      background,
                      foreground,
                      progress,
                    ]) => (
                      <div
                        className={`border border-border p-4 ${background}`}
                        key={state}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`grid size-10 shrink-0 place-items-center bg-card ${foreground}`}
                          >
                            <FileText className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {size}
                            </p>
                          </div>
                          <button
                            className="grid size-8 shrink-0 place-items-center hover:bg-card/70"
                            aria-label={`Remover ${name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-4 h-1.5 overflow-hidden bg-card">
                          <div
                            className={`h-full ${state === "error" ? "bg-destructive" : state === "success" ? "bg-success-foreground" : "bg-info-foreground"}`}
                            style={{ width: progress }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <p
                            className={`font-condensed text-[10px] font-bold uppercase ${foreground}`}
                          >
                            {status}
                          </p>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            {progress}
                          </span>
                        </div>
                      </div>
                    ),
                  )}

                  <label className="grid min-h-40 cursor-not-allowed place-items-center border-2 border-dashed border-border bg-muted p-5 text-center opacity-55">
                    <input className="sr-only" type="file" disabled />
                    <span>
                      <Upload className="mx-auto size-5 text-muted-foreground" />
                      <span className="mt-3 block font-condensed text-xs font-bold uppercase text-muted-foreground">
                        Upload indisponível
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="semantic-states"
            eyebrow="07 / Feedback"
            title="Estados semânticos"
          >
            <div className="flex flex-wrap gap-3">
              {statuses.map(([label, color, Icon]) => (
                <span
                  className={`corner-cut inline-flex items-center gap-1.5 px-2.5 py-1 font-condensed text-[10px] font-bold uppercase [--corner-cut:3px] ${color}`}
                  key={label}
                >
                  <Icon className="size-3" /> {label}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              <div className="grid grid-cols-[20px_1fr] gap-3 border-l-4 border-foreground/30 bg-neutral p-4 text-foreground">
                <CircleAlert className="mt-0.5 size-4" />
                <div>
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Alerta padrão
                  </p>
                  <p className="mt-1 text-sm">
                    Há uma informação importante para revisar.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-3 border-l-4 border-info-foreground bg-info p-4 text-info-foreground">
                <Info className="mt-0.5 size-4" />
                <div>
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Informação operacional
                  </p>
                  <p className="mt-1 text-sm">
                    A escala de serviço foi atualizada.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-3 border-l-4 border-success-foreground bg-success p-4 text-success-foreground">
                <Check className="mt-0.5 size-4" />
                <div>
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Operação confirmada
                  </p>
                  <p className="mt-1 text-sm">
                    A movimentação foi registrada com sucesso.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-3 border-l-4 bg-warning p-4 text-warning-foreground [border-color:var(--warning-strong)]">
                <AlertTriangle className="mt-0.5 size-4" />
                <div>
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Atenção necessária
                  </p>
                  <p className="mt-1 text-sm">
                    Há um checklist pendente para esta viatura.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[20px_1fr] gap-3 border-l-4 border-destructive bg-accent p-4 text-destructive md:col-span-2">
                <CircleX className="mt-0.5 size-4" />
                <div>
                  <p className="font-condensed text-xs font-semibold uppercase">
                    Falha na validação
                  </p>
                  <p className="mt-1 text-sm">
                    Revise os campos indicados antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="data-display"
            eyebrow="08 / Data display"
            title="Métricas e tabela"
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Viaturas", "42", "+3 no mês"],
                ["Operacionais", "31", "73,8% da frota"],
                ["Manutenção", "07", "2 críticas"],
                ["Movimentos", "128", "Últimos 30 dias"],
              ].map(([label, value, note], index) => (
                <article
                  className="corner-cut border border-border bg-card p-5 [--corner-cut:10px]"
                  key={label}
                >
                  <p className="font-condensed text-[11px] font-semibold uppercase text-muted-foreground">
                    {label}
                  </p>
                  <p
                    className={`mt-2 font-display text-5xl ${index === 2 ? "text-maintenance-foreground" : "text-foreground"}`}
                  >
                    {value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{note}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 overflow-x-auto border border-border bg-card">
              <table className="w-full min-w-170 border-collapse text-left">
                <thead className="border-b border-border bg-muted/60 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Prefixo</th>
                    <th className="px-4 py-3">Tipo</th>
                    <th className="px-4 py-3">Situação</th>
                    <th className="px-4 py-3">Quilometragem</th>
                    <th className="w-12 px-4 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {vehicles.map((vehicle) => (
                    <tr
                      className="transition-colors hover:bg-muted/50"
                      key={vehicle.prefix}
                    >
                      <td className="px-4 py-4 font-display text-xl">
                        {vehicle.prefix}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {vehicle.type}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-condensed text-xs font-semibold uppercase">
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">
                        {vehicle.km}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="grid size-8 place-items-center hover:bg-muted"
                          aria-label={`Ações de ${vehicle.prefix}`}
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section
            id="compositions"
            eyebrow="09 / Compositions"
            title="Composições"
          >
            <div className="space-y-6 bg-card p-5">
              <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
                <div>
                  <button className="mb-3 inline-flex items-center gap-1 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
                    <ArrowLeft className="size-3" /> Viaturas
                  </button>
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-1 bg-primary" />
                    <div>
                      <h4 className="font-display text-4xl uppercase">
                        Frota administrativa
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Cadastre e acompanhe as viaturas da unidade.
                      </p>
                    </div>
                  </div>
                </div>
                <button className="corner-cut min-h-10 bg-primary px-5 font-condensed text-xs font-semibold uppercase text-primary-foreground [--corner-cut:7px]">
                  <Plus className="mr-2 inline size-4" /> Nova viatura
                </button>
              </header>

              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-primary" />
                <h5 className="font-condensed text-xs font-semibold uppercase">
                  Viaturas recentes
                </h5>
                <span className="h-px flex-1 bg-border" />
              </div>

              <div className="grid min-h-56 place-items-center border border-dashed border-foreground/20 bg-background p-8 text-center">
                <div>
                  <span className="corner-cut mx-auto grid size-12 place-items-center bg-muted [--corner-cut:8px]">
                    <Search className="size-5 text-muted-foreground" />
                  </span>
                  <h5 className="mt-4 font-display text-2xl uppercase">
                    Nenhuma viatura encontrada
                  </h5>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Ajuste os filtros ou cadastre uma nova viatura para começar.
                  </p>
                  <button className="mt-5 font-condensed text-xs font-semibold uppercase text-primary">
                    Limpar filtros
                  </button>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <footer className="border-t border-border bg-foreground py-8 text-background">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <p className="font-display text-2xl uppercase">
              Giro / Velocity Light
            </p>
            <p className="font-condensed text-[10px] font-semibold uppercase text-background/60">
              Ambiente de desenvolvimento
            </p>
          </div>
        </footer>

        <dialog
          id="velocity-dialog"
          className="m-auto w-[calc(100%-2rem)] max-w-md bg-transparent backdrop:bg-foreground/55"
        >
          <div className="corner-cut bg-card p-6 text-card-foreground shadow-lg [--corner-cut:12px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-condensed text-[10px] font-semibold uppercase text-primary">
                  Confirmação
                </p>
                <h2 className="mt-1 font-display text-3xl uppercase">
                  Liberar viatura?
                </h2>
              </div>
              <button
                className="grid size-9 place-items-center hover:bg-muted"
                aria-label="Fechar"
                onClick={() =>
                  document
                    .querySelector<HTMLDialogElement>("#velocity-dialog")
                    ?.close()
                }
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A viatura UR-214 será marcada como disponível para uma nova
              movimentação.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button
                className="min-h-10 px-4 font-condensed text-xs font-semibold uppercase hover:bg-muted"
                onClick={() =>
                  document
                    .querySelector<HTMLDialogElement>("#velocity-dialog")
                    ?.close()
                }
              >
                Cancelar
              </button>
              <button
                className="corner-cut min-h-10 bg-primary px-5 font-condensed text-xs font-semibold uppercase text-primary-foreground [--corner-cut:7px]"
                onClick={() =>
                  document
                    .querySelector<HTMLDialogElement>("#velocity-dialog")
                    ?.close()
                }
              >
                Confirmar
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </StyleguideLayout>
  );
}
