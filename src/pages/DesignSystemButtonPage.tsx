import { ArrowLeft, ArrowRight, LoaderCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { StyleguideLayout } from "@/pages/DesignSystemPage";

const variants = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const sizes = [
  { label: "Giant", button: "xl", icon: "icon-xl" },
  { label: "Large", button: "lg", icon: "icon-lg" },
  { label: "Medium", button: "default", icon: "icon" },
  { label: "Small", button: "sm", icon: "icon-sm" },
  { label: "Tiny", button: "xs", icon: "icon-xs" },
] as const;

export function DesignSystemButtonPage() {
  return (
    <StyleguideLayout>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <Button variant="link" asChild className="mb-6 px-0">
          <Link to="/design-system">
            <ArrowLeft /> Voltar às fundações
          </Link>
        </Button>

        <header className="mb-10 border-b border-border pb-6">
          <p className="font-condensed text-xs font-bold uppercase tracking-widest text-primary">
            Componente
          </p>
          <h1 className="font-display text-5xl uppercase">Button</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Esta página usa diretamente o componente compartilhado em
            <code className="ml-1 font-mono text-xs">
              src/components/ui/button.tsx
            </code>
            .
          </p>
        </header>

        <div className="space-y-8">
          <Showcase title="Variantes">
            {variants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </Showcase>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-3">
              <h2 className="font-display text-2xl uppercase">Tamanhos</h2>
              <code className="font-mono text-[9px] text-muted-foreground">
                giant · large · medium · small · tiny
              </code>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <SizeTable title="Button">
                {sizes.map((size) => (
                  <div className="flex justify-center" key={size.label}>
                    <Button size={size.button}>Button</Button>
                  </div>
                ))}
              </SizeTable>

              <SizeTable title="Icon">
                {sizes.map((size) => (
                  <div className="flex justify-center" key={size.label}>
                    <Button
                      size={size.icon}
                      aria-label={`Buscar — ${size.label}`}
                    >
                      <Search />
                    </Button>
                  </div>
                ))}
              </SizeTable>
            </div>
          </section>

          <Showcase title="Ícones e composição">
            <Button>
              <Search /> Buscar
            </Button>
            <Button variant="outline">
              Continuar <ArrowRight />
            </Button>
            <Button size="icon" aria-label="Buscar">
              <Search />
            </Button>
          </Showcase>

          <Showcase title="Estados">
            <Button disabled>Desabilitado</Button>
            <Button disabled aria-busy="true">
              <LoaderCircle className="animate-spin" /> Processando
            </Button>
          </Showcase>
        </div>
      </main>
    </StyleguideLayout>
  );
}

function Showcase({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-card p-5">
      <h2 className="mb-5 font-display text-2xl uppercase">{title}</h2>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </section>
  );
}

function SizeTable({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto border border-border bg-card">
      <div className="min-w-170">
        <div className="grid grid-cols-[86px_repeat(5,minmax(105px,1fr))] border-b border-border bg-muted/60 px-4 py-3 font-condensed text-[10px] font-semibold uppercase text-muted-foreground">
          <span>Size</span>
          {sizes.map((size) => (
            <span className="text-center" key={size.label}>
              {size.label}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-[86px_repeat(5,minmax(105px,1fr))] items-center px-4 py-5">
          <span className="font-condensed text-xs font-semibold uppercase text-muted-foreground">
            {title}
          </span>
          {children}
        </div>
      </div>
    </div>
  );
}
