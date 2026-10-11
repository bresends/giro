import { useEffect, useState } from "react";

/** Plantão de 24h que começa às 07:00 (horário local do navegador). */
export const SHIFT_START_HOUR = 7;

/** Limites do estado "em trânsito" (ver plano da guarita). */
export const WARNING_AFTER_MS = 2 * 60 * 60 * 1000;
export const CRITICAL_AFTER_MS = 24 * 60 * 60 * 1000;

export type TransitState = "normal" | "warning" | "critical";

export function transitState(elapsedMs: number): TransitState {
  if (elapsedMs >= CRITICAL_AFTER_MS) return "critical";
  if (elapsedMs > WARNING_AFTER_MS) return "warning";
  return "normal";
}

export interface ShiftWindow {
  startMs: number;
  endMs: number;
}

/** Janela do plantão que contém `at` (07:00 até 07:00 do dia seguinte). */
export function shiftWindowAt(at: Date = new Date()): ShiftWindow {
  const start = new Date(at);
  start.setHours(SHIFT_START_HOUR, 0, 0, 0);
  if (at.getHours() < SHIFT_START_HOUR) {
    start.setDate(start.getDate() - 1);
  }
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { startMs: start.getTime(), endMs: end.getTime() };
}

/** Plantões mais recentes, do atual para trás. */
export function recentShiftWindows(count: number, at: Date = new Date()): ShiftWindow[] {
  const current = shiftWindowAt(at);
  return Array.from({ length: count }, (_, i) => {
    const start = new Date(current.startMs);
    start.setDate(start.getDate() - i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { startMs: start.getTime(), endMs: end.getTime() };
  });
}

/** Re-renderiza periodicamente para manter relógios de "tempo fora" atualizados. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

export function formatNumber(value: number) {
  return numberFormat.format(value);
}

export function formatKm(value: number | null | undefined, withUnit = false) {
  if (value === null || value === undefined) return "—";
  return withUnit ? `${numberFormat.format(value)} km` : numberFormat.format(value);
}

/** "4d 10h", "2h 47min", "33min". */
export function formatDuration(ms: number) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  return `${minutes}min`;
}

export function formatTime(ms: number) {
  return new Date(ms).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDayMonth(ms: number) {
  return new Date(ms).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

/** "Quinta-feira, 9 de outubro" */
export function formatLongDate(ms: number) {
  const text = new Date(ms).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatShiftRange({ startMs, endMs }: ShiftWindow) {
  return `${formatDayMonth(startMs)} · ${formatTime(startMs)} até ${formatDayMonth(endMs)} · ${formatTime(endMs)}`;
}

export const DESTINATION_TYPE_LABELS: Record<string, string> = {
  ocorrencia: "Ocorrência",
  qrf: "QRF",
  ceman: "CEMAN",
  cal: "CAL",
  outro: "Outro",
};

export function destinationTypeLabel(type?: string | null) {
  if (!type) return null;
  return DESTINATION_TYPE_LABELS[type] ?? type;
}

export function formatRg(rg: number | string | null | undefined) {
  if (rg === null || rg === undefined || rg === "") return null;
  const n = typeof rg === "number" ? rg : Number(rg);
  return `RG ${Number.isFinite(n) ? numberFormat.format(n) : rg}`;
}

/** Iniciais para o avatar ("Cb BM Almeida" → "CA"; e-mail → duas primeiras letras). */
export function initials(text?: string | null) {
  if (!text) return "?";
  const base = text.includes("@") ? text.split("@")[0] : text;
  const words = base.split(/[\s._-]+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}
