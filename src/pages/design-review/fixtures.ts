/**
 * Dados de exemplo copiados de `design/hero.pen`, para comparar as telas com o design
 * na rota de revisão (somente em desenvolvimento).
 */
import type { Movement } from "@/components/guarita/types";
import type { RoteiroSection } from "@/components/checklist/parseRoteiro";
import type { ChecklistVehicle } from "@/components/checklist/ChecklistSteps";

/** Quinta-feira, 9 de outubro de 2025, 09:45: horário em que o placar do design foi montado. */
export const NOW = new Date(2025, 9, 9, 9, 45).getTime();
/** O gráfico "Saídas por hora" do design vai até 15h. */
export const CHART_NOW = new Date(2025, 9, 9, 15, 30).getTime();

const TYPES: Record<string, string> = {
  UR: "Resgate",
  ABT: "Auto Bomba Tanque",
  VTR: "Administrativa",
  ASU: "Auto Socorro de Urgência",
};

let seq = 0;
function at(day: number, hour: number, minute: number) {
  return new Date(2025, 9, day, hour, minute).getTime();
}

function mv(o: {
  prefix: string;
  rank: string;
  name: string;
  rg: number;
  destination: string;
  destinationType: string;
  departure: number;
  departureKm: number;
  arrival?: number;
  arrivalKm?: number;
}): Movement {
  seq++;
  const type = o.prefix.split("-")[0];
  return {
    _id: `mv${seq}` as unknown as Movement["_id"],
    vehicleId: `vh-${o.prefix}` as unknown as Movement["vehicleId"],
    personnelId: `ps-${o.rg}` as unknown as Movement["personnelId"],
    destination: o.destination,
    destinationType: o.destinationType,
    departureKm: o.departureKm,
    departureTime: o.departure,
    arrivalKm: o.arrivalKm,
    arrivalTime: o.arrival,
    status: o.arrival === undefined ? "em_transito" : "concluido",
    vehicle: {
      _id: `vh-${o.prefix}` as unknown as Movement["vehicleId"],
      operationalPrefix: o.prefix,
      plate: "PQK-2J18",
      type,
      typeDescription: TYPES[type] ?? null,
    },
    personnel: {
      _id: `ps-${o.rg}` as unknown as Movement["personnelId"],
      rank: o.rank,
      rg: o.rg,
      name: o.name,
    },
  };
}

export const IN_TRANSIT: Movement[] = [
  mv({ prefix: "UR-0327", rank: "Sd BM", name: "Camargo", rg: 33410, destination: "Santo Antônio", destinationType: "ocorrencia", departure: at(4, 23, 45), departureKm: 120330 }),
  mv({ prefix: "ABT-0112", rank: "3º Sgt BM", name: "Ferreira", rg: 28417, destination: "Av. Anhanguera, 4510", destinationType: "ocorrencia", departure: at(9, 6, 58), departureKm: 48210 }),
  mv({ prefix: "UR-0345", rank: "Cb BM", name: "Nascimento", rg: 31204, destination: "Hospital de Urgências (HUGO)", destinationType: "qrf", departure: at(9, 8, 31), departureKm: 112904 }),
  mv({ prefix: "VTR-0560", rank: "Sd BM", name: "Ribeiro", rg: 34877, destination: "Troca de pastilhas", destinationType: "ceman", departure: at(9, 9, 12), departureKm: 63455 }),
];

/** As 8 linhas de "Últimas saídas" e da tabela do relatório. */
export const RECENT: Movement[] = [
  mv({ prefix: "VTR-0560", rank: "Sd BM", name: "Ribeiro", rg: 34877, destination: "Troca de pastilhas", destinationType: "ceman", departure: at(9, 9, 12), departureKm: 63455 }),
  mv({ prefix: "UR-0345", rank: "Cb BM", name: "Nascimento", rg: 31204, destination: "Hospital de Urgências (HUGO)", destinationType: "qrf", departure: at(9, 8, 31), departureKm: 112904 }),
  mv({ prefix: "ASU-0201", rank: "2º Sgt BM", name: "Costa", rg: 26990, destination: "Setor Bueno", destinationType: "ocorrencia", departure: at(9, 7, 44), departureKm: 88032, arrival: at(9, 8, 36), arrivalKm: 88047 }),
  mv({ prefix: "UR-0349", rank: "Sd BM", name: "Moreira", rg: 35112, destination: "Abastecimento", destinationType: "cal", departure: at(9, 7, 20), departureKm: 97610, arrival: at(9, 7, 46), arrivalKm: 97618 }),
  mv({ prefix: "ABT-0112", rank: "3º Sgt BM", name: "Ferreira", rg: 28417, destination: "Av. Anhanguera, 4510", destinationType: "ocorrencia", departure: at(9, 6, 58), departureKm: 48210 }),
  mv({ prefix: "UR-0345", rank: "Cb BM", name: "Nascimento", rg: 31204, destination: "BR-153, km 498", destinationType: "ocorrencia", departure: at(8, 22, 15), departureKm: 112861, arrival: at(8, 23, 52), arrivalKm: 112904 }),
  mv({ prefix: "ABT-0108", rank: "1º Sgt BM", name: "Araújo", rg: 22305, destination: "Jardim América", destinationType: "ocorrencia", departure: at(8, 17, 40), departureKm: 71540, arrival: at(8, 19, 45), arrivalKm: 71562 }),
  mv({ prefix: "VTR-0560", rank: "Sd BM", name: "Ribeiro", rg: 34877, destination: "Comando Geral — entrega de ofício", destinationType: "outro", departure: at(8, 14, 2), departureKm: 63431, arrival: at(8, 15, 12), arrivalKm: 63455 }),
];

/**
 * Plantão do "Resumo do plantão": 14 saídas (11 retornaram), 9 ocorrências e
 * a distribuição por hora do gráfico (07h:1, 08h:3, 09h:2, 10h:4, 11h:1, 13h:2, 14h:1).
 */
export const SHIFT: Movement[] = (() => {
  const hours = [7, 8, 8, 8, 9, 9, 10, 10, 10, 10, 11, 13, 13, 14];
  return hours.map((h, i) => {
    const departure = at(9, h, 5 + i);
    const returned = i < 11;
    return mv({
      prefix: i % 2 ? "UR-0345" : "ABT-0112",
      rank: "Sd BM",
      name: "Ribeiro",
      rg: 34877,
      destination: "Setor Bueno",
      destinationType: i < 9 ? "ocorrencia" : "qrf",
      departure,
      departureKm: 1000,
      arrival: returned ? departure + 68 * 60_000 : undefined,
      arrivalKm: returned ? 1000 + (i < 10 ? 37 : 42) : undefined,
    });
  });
})();

export const FLEET_SIZE = 24;
export const IN_GARAGE = 18;

export const SHIFT_WINDOW = {
  startMs: new Date(2025, 9, 9, 7, 0).getTime(),
  endMs: new Date(2025, 9, 10, 7, 0).getTime(),
};

export const USER = "Cb BM Almeida";

export const CHECKLIST_VEHICLE: ChecklistVehicle = {
  prefix: "UR-0345",
  plate: "PQK-2J18",
  model: "Sprinter 416",
  subtitle: "Mercedes-Benz · 2022",
  type: "UR",
  currentKm: 48212,
  nextMaintenanceKm: 50000,
  situation: "Operacional",
};

export const ROTEIRO: RoteiroSection[] = [
  {
    title: "Cabine e documentação",
    items: ["Rádio HT com bateria reserva carregada", "CRLV e cartão de abastecimento", "Giroflex, sirene e iluminação"],
  },
  {
    title: "Salão de atendimento",
    items: ["Prancha longa com tirantes e head block", "Oxigênio: cilindro fixo acima de 100 bar", "Kit de trauma lacrado e DEA testado"],
  },
];

export const MOTORISTA_SENT = { createdAt: new Date(2025, 9, 9, 7, 38).getTime(), userName: "Sd BM Ribeiro" };
export const SUBMITTED_AT = new Date(2025, 9, 9, 7, 52).getTime();
