import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { generateShiftReportHTML, sortForReport } from "@/components/guarita/shiftReport";
import { ShiftReportView } from "@/components/guarita/ShiftReportView";
import { recentShiftWindows } from "@/lib/giro";
import { api } from "../../convex/_generated/api";

const SHIFT_OPTIONS = 14;

export function ShiftReportPage() {

  const shifts = useMemo(() => recentShiftWindows(SHIFT_OPTIONS), []);
  const [selected, setSelected] = useState(0);
  const shift = shifts[selected];
  const result = useQuery(api.vehicleMovements.listShiftMovements, {
    startMs: shift.startMs,
    endMs: shift.endMs,
  });
  const [copied, setCopied] = useState(false);
  const [generatedAt] = useState(() => Date.now());

  const movements = useMemo(() => (result ? sortForReport(result) : undefined), [result]);

  const handleCopy = async () => {
    if (!movements) return;
    const html = generateShiftReportHTML(movements, shift, Date.now());
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()], {
            type: "text/plain",
          }),
        }),
      ]);
      setCopied(true);
      toast.success("Relatório copiado. Cole no SEI com Ctrl+V.");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
      toast.error("Não foi possível copiar. Verifique a permissão da área de transferência.");
    }
  };

  return (
    <ShiftReportView
      shift={shift}
      shifts={shifts}
      selected={selected}
      onSelectShift={setSelected}
      movements={movements}
      generatedAt={generatedAt}
      copied={copied}
      onCopy={() => void handleCopy()}
    />
  );
}
