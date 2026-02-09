export function Loading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div
          className="animate-spin h-8 w-8"
          style={{
            border: "2px solid #e5e5e5",
            borderTopColor: "#dc2626",
            clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
          }}
        />
        <p
          className="text-xs text-[#999] tracking-[0.15em] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
