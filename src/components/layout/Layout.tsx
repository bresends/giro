import { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Force light theme
  useLayoutEffect(() => {
    const originalTheme = document.documentElement.classList.contains("dark");
    document.documentElement.classList.remove("dark");

    return () => {
      if (originalTheme) {
        document.documentElement.classList.add("dark");
      }
    };
  }, []);

  return (
    <div className="light min-h-screen" style={{ background: "#f7f7f7", fontFamily: "'Barlow', sans-serif" }}>
      {/* Subtle diagonal stripes background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(-45deg, transparent, transparent 80px, rgba(220,38,38,0.015) 80px, rgba(220,38,38,0.015) 82px)",
        }}
      />

      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-60 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
