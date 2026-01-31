export function Loading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-sm text-slate-600 dark:text-slate-400">{text}</p>
      </div>
    </div>
  );
}
