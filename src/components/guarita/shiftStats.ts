import type { Movement } from "./types";

export interface ShiftStats {
  departures: number;
  returned: number;
  inTransit: number;
  occurrences: number;
  averageMs: number | null;
  kmDriven: number;
}

export function computeShiftStats(movements: Movement[]): ShiftStats {
  const concluded = movements.filter(
    (m) => m.arrivalTime !== undefined && m.arrivalKm !== undefined,
  );
  const totalMs = concluded.reduce((sum, m) => sum + (m.arrivalTime! - m.departureTime), 0);
  return {
    departures: movements.length,
    returned: concluded.length,
    inTransit: movements.filter((m) => m.status === "em_transito").length,
    occurrences: movements.filter((m) => m.destinationType === "ocorrencia").length,
    averageMs: concluded.length > 0 ? totalMs / concluded.length : null,
    kmDriven: concluded.reduce((sum, m) => sum + (m.arrivalKm! - m.departureKm), 0),
  };
}
