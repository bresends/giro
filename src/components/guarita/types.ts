import type { Id } from "../../../convex/_generated/dataModel";

/** Forma de `enrichMovements` (convex/vehicleMovements.ts) que chega às telas da guarita. */
export interface Movement {
  _id: Id<"vehicleMovements">;
  vehicleId: Id<"vehicles">;
  personnelId: Id<"personnel">;
  destination: string;
  destinationType?: string;
  departureKm: number;
  departureTime: number;
  arrivalKm?: number;
  arrivalTime?: number;
  status: string;
  notes?: string;
  vehicle: {
    _id: Id<"vehicles">;
    operationalPrefix: string;
    plate: string;
    type?: string;
    typeDescription?: string | null;
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: number;
    name: string;
  } | null;
}

export function driverName(m: Pick<Movement, "personnel">) {
  if (!m.personnel) return "—";
  return `${m.personnel.rank} ${m.personnel.name}`.trim();
}
