import {
  destinationTypeLabel,
  formatDayMonth,
  formatDuration,
  formatKm,
  formatLongDate,
  formatTime,
  type ShiftWindow,
} from "@/lib/giro";
import { computeShiftStats } from "./shiftStats";
import type { Movement } from "./types";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fullDateTime(ms: number) {
  return new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shiftTitle(window: ShiftWindow) {
  return `${formatLongDate(window.startMs)} · Plantão das ${formatTime(window.startMs)} às ${formatTime(window.endMs)} de ${formatDayMonth(window.endMs)}`;
}

/** Ordem do documento: saídas mais antigas primeiro, como no livro da guarita. */
export function sortForReport(movements: Movement[]) {
  return [...movements].sort((a, b) => a.departureTime - b.departureTime);
}

/**
 * HTML com estilos inline para colar no editor do SEI.
 * Espelha a prévia da página do relatório: resumo + tabela de saídas e chegadas.
 */
export function generateShiftReportHTML(
  movements: Movement[],
  window: ShiftWindow,
  generatedAt: number,
): string {
  const stats = computeShiftStats(movements);
  const cell = "border: 1px solid #cfd4d9; padding: 6px 8px; vertical-align: top;";
  const right = `${cell} text-align: right;`;

  const rows = sortForReport(movements)
    .map((m) => {
      const distance = m.arrivalKm !== undefined ? m.arrivalKm - m.departureKm : null;
      const timeOut =
        m.arrivalTime !== undefined ? formatDuration(m.arrivalTime - m.departureTime) : "—";
      const driver = m.personnel
        ? `${escapeHtml(m.personnel.rank)} ${escapeHtml(m.personnel.name)}<br><span style="color: #555;">RG ${m.personnel.rg}</span>`
        : "—";
      const type = destinationTypeLabel(m.destinationType);
      return `
      <tr>
        <td style="${cell}">${formatTime(m.departureTime)}<br><span style="color: #555;">${formatDayMonth(m.departureTime)}</span></td>
        <td style="${cell}">${m.arrivalTime !== undefined ? `${formatTime(m.arrivalTime)}<br><span style="color: #555;">${formatDayMonth(m.arrivalTime)}</span>` : "Em trânsito"}</td>
        <td style="${cell}">${escapeHtml(m.vehicle?.operationalPrefix ?? "—")}</td>
        <td style="${cell}">${driver}</td>
        <td style="${cell}">${escapeHtml(m.destination)}${type ? `<br><span style="color: #555;">${escapeHtml(type)}</span>` : ""}</td>
        <td style="${right}">${formatKm(m.departureKm)}</td>
        <td style="${right}">${formatKm(m.arrivalKm)}</td>
        <td style="${right}">${timeOut}</td>
        <td style="${right}">${distance !== null ? formatKm(distance, true) : "—"}</td>
      </tr>`;
    })
    .join("");

  const head = (label: string, align: "left" | "right" = "left") =>
    `<th style="border: 1px solid #cfd4d9; padding: 6px 8px; text-align: ${align}; background-color: #f1f3f5;">${label}</th>`;

  return `
<div style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.4;">
  <h2 style="margin: 0 0 4px;">Relatório do plantão da guarita</h2>
  <p style="margin: 0 0 16px;"><strong>Período:</strong> ${fullDateTime(window.startMs)} até ${fullDateTime(window.endMs)}</p>

  <h3 style="margin: 0 0 6px;">Resumo do plantão</h3>
  <table style="border-collapse: collapse; margin-bottom: 16px;">
    <tbody>
      <tr><td style="${cell}">Saídas</td><td style="${right}"><strong>${stats.departures}</strong></td></tr>
      <tr><td style="${cell}">Chegadas</td><td style="${right}"><strong>${stats.returned}</strong></td></tr>
      <tr><td style="${cell}">Em trânsito</td><td style="${right}"><strong>${stats.inTransit}</strong></td></tr>
      <tr><td style="${cell}">Ocorrências</td><td style="${right}"><strong>${stats.occurrences}</strong></td></tr>
      <tr><td style="${cell}">Tempo médio fora</td><td style="${right}"><strong>${stats.averageMs !== null ? formatDuration(stats.averageMs) : "—"}</strong></td></tr>
      <tr><td style="${cell}">Km rodados</td><td style="${right}"><strong>${formatKm(stats.kmDriven, true)}</strong></td></tr>
    </tbody>
  </table>

  <h3 style="margin: 0 0 6px;">Saídas e chegadas (${movements.length})</h3>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
    <thead>
      <tr>
        ${head("Saída")}${head("Chegada")}${head("Viatura")}${head("Condutor")}${head("Destino")}${head("KM saída", "right")}${head("KM chegada", "right")}${head("Tempo fora", "right")}${head("Distância", "right")}
      </tr>
    </thead>
    <tbody>${rows || `<tr><td style="${cell}" colspan="9">Nenhuma saída registrada no plantão.</td></tr>`}
    </tbody>
  </table>

  <p style="margin: 0; font-size: 9pt; color: #555;">Gerado pelo GIRO em ${fullDateTime(generatedAt)}.</p>
</div>`.trim();
}
