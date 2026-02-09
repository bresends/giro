import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Car,
  Check,
  Clock,
  Copy,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Loading } from "../components/common/Loading";
import { ArrivalModal } from "../components/guarita/ArrivalModal";
import { DepartureModal } from "../components/guarita/DepartureModal";
import { EditMovementModal } from "../components/guarita/EditMovementModal";
import { PersonnelQuickAddModal } from "../components/guarita/PersonnelQuickAddModal";

interface Movement {
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
  } | null;
  personnel: {
    _id: Id<"personnel">;
    rank: string;
    rg: number;
    name: string;
  } | null;
}

function generateShiftReportHTML(movements: Movement[]): string {
  // Calcular período baseado no horário atual
  const now = new Date();
  const currentHour = now.getHours();

  const today7am = new Date();
  today7am.setHours(7, 0, 0, 0);

  const yesterday7am = new Date(today7am);
  yesterday7am.setDate(yesterday7am.getDate() - 1);

  const tomorrow7am = new Date(today7am);
  tomorrow7am.setDate(tomorrow7am.getDate() + 1);

  let shiftStart: Date;
  let shiftEnd: Date;

  // Se antes das 7h, turno é de ontem 7h até hoje 7h
  // Se depois das 7h, turno é de hoje 7h até amanhã 7h
  if (currentHour < 7) {
    shiftStart = yesterday7am;
    shiftEnd = today7am;
  } else {
    shiftStart = today7am;
    shiftEnd = tomorrow7am;
  }

  const periodStart = shiftStart.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const periodEnd = shiftEnd.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Gerar linhas da tabela
  const tableRows = movements
    .map((movement) => {
      const distance = movement.arrivalKm
        ? movement.arrivalKm - movement.departureKm
        : null;

      // Calcular tempo fora
      let timeOutStr = "—";
      if (movement.arrivalTime) {
        const timeOutMinutes = Math.floor(
          (movement.arrivalTime - movement.departureTime) / (1000 * 60),
        );
        const hours = Math.floor(timeOutMinutes / 60);
        const minutes = timeOutMinutes % 60;
        timeOutStr = `${hours}h ${minutes.toString().padStart(2, "0")}min`;
      }

      return `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.vehicle?.operationalPrefix || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.rank || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.rg || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.personnel?.name || "-"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.destination}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${new Intl.NumberFormat("pt-BR").format(movement.departureKm)}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${movement.arrivalKm ? new Intl.NumberFormat("pt-BR").format(movement.arrivalKm) : "—"}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(movement.departureTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${movement.arrivalTime ? new Date(movement.arrivalTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${timeOutStr}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${distance !== null ? new Intl.NumberFormat("pt-BR").format(distance) + " km" : "—"}</td>
      </tr>
    `;
    })
    .join("");

  return `
<div style="font-family: 'Calibri', sans-serif; font-size: 12pt; line-height: 1.5;">
  <h2 style="text-align: center; margin-bottom: 16px;">Relatório de Movimentações de Viaturas</h2>
  <p style="text-align: center; margin-bottom: 24px;">
    <strong>Período:</strong> ${periodStart} até ${periodEnd}
  </p>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
    <thead>
      <tr style="background-color: #f5f5f5;">
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Viatura</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Posto/Grad</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">RG</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Motorista</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Destino</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">KM Saída</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">KM Chegada</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Horário Saída</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Horário Chegada</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Tempo Fora</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Distância Percorrida</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>

  <p style="margin-top: 24px; font-size: 10pt; color: #666;">
    <strong>Total de saídas:</strong> ${movements.length}
  </p>
</div>
  `.trim();
}

/* Velocity Light button styles */
const velBtnPrimary: React.CSSProperties = {
  background: "#dc2626",
  border: "none",
  color: "white",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "10px 20px",
  cursor: "pointer",
  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const velBtnOutline: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,0,0,0.08)",
  color: "#666",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "10px 20px",
  cursor: "pointer",
  clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
};

const velPanel: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
  backdropFilter: "blur(12px)",
};

const velPanelSquare: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 100%)",
  border: "1px solid rgba(0,0,0,0.06)",
  backdropFilter: "blur(12px)",
};

export function GuaritaPage() {
  const inTransit = useQuery(api.vehicleMovements.listInTransit);
  const recentMovements = useQuery(api.vehicleMovements.listRecent);
  const shiftMovements = useQuery(api.vehicleMovements.listShiftMovements);
  const deleteMovement = useMutation(api.vehicleMovements.remove);

  const [departureModalOpen, setDepartureModalOpen] = useState(false);
  const [arrivalModalOpen, setArrivalModalOpen] = useState(false);
  const [personnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    movementId: Id<"vehicleMovements"> | null;
  }>({ open: false, movementId: null });

  const handleArrivalClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setArrivalModalOpen(true);
  };

  const handleCopyShiftReport = async () => {
    // Verificar se dados estão carregados
    if (!shiftMovements || shiftMovements.length === 0) {
      return;
    }

    // Gerar HTML
    const html = generateShiftReportHTML(shiftMovements);

    // Copiar para clipboard
    try {
      const blob = new Blob([html], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      await navigator.clipboard.write([clipboardItem]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const handleEditClick = (movement: Movement) => {
    setSelectedMovement(movement);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (movementId: Id<"vehicleMovements">) => {
    setDeleteConfirm({ open: true, movementId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.movementId) return;

    try {
      await deleteMovement({ id: deleteConfirm.movementId });
      setDeleteConfirm({ open: false, movementId: null });
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao deletar movimentação",
      );
    }
  };

  if (inTransit === undefined || recentMovements === undefined) {
    return <Loading text="Carregando movimentações..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative p-6" style={velPanel}>
        {/* Corner mark */}
        <div
          className="absolute top-0 right-0 w-3 h-3"
          style={{ background: "linear-gradient(225deg, rgba(220,38,38,0.4) 50%, transparent 50%)" }}
        />
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-3xl text-[#1a1a1a] tracking-[0.08em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              Guarita — Controle de Viaturas
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-0.5 w-8" style={{ background: "#dc2626" }} />
              <p
                className="text-[11px] text-[#999] tracking-[0.15em] uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyShiftReport}
              disabled={shiftMovements === undefined}
              className="flex items-center gap-2 transition-colors hover:text-[#1a1a1a] disabled:opacity-40"
              style={velBtnOutline}
              title="Copiar movimentações do turno"
            >
              {copied ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
              Copiar
            </button>
            <button
              onClick={() => setPersonnelModalOpen(true)}
              className="flex items-center gap-2 transition-colors hover:text-[#1a1a1a]"
              style={velBtnOutline}
            >
              <UserPlus size={14} />
              Cadastrar Militar
            </button>
            <button
              onClick={() => setDepartureModalOpen(true)}
              className="flex items-center gap-2 transition-all hover:brightness-110"
              style={velBtnPrimary}
            >
              <LogOut size={14} />
              Registrar Saída
            </button>
          </div>
        </div>
      </div>

      {/* In-Transit Vehicles */}
      {inTransit.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Car size={16} className="text-[#1a1a1a]" />
            <h2
              className="text-lg text-[#1a1a1a] tracking-[0.08em] uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              Viaturas em Trânsito
            </h2>
            <span
              className="text-[10px] text-white tracking-wider uppercase px-2 py-0.5 font-semibold"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                background: "#dc2626",
                clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
              }}
            >
              {inTransit.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inTransit.map((movement) => {
              const timeElapsed = Math.floor(
                (Date.now() - movement.departureTime) / (1000 * 60),
              );
              const hours = Math.floor(timeElapsed / 60);
              const minutes = timeElapsed % 60;

              return (
                <div
                  key={movement._id}
                  className="relative p-4 space-y-3"
                  style={{
                    ...velPanelSquare,
                    borderLeft: "3px solid #dc2626",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-xs font-semibold tracking-wider uppercase px-2 py-0.5 inline-block w-fit"
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          background: "rgba(220,38,38,0.08)",
                          color: "#dc2626",
                          clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))",
                        }}
                      >
                        {movement.vehicle?.operationalPrefix}
                      </span>
                      <span className="text-[11px] text-[#999]">
                        {movement.vehicle?.plate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#dc2626]">
                      <Clock size={13} />
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {hours > 0 ? `${hours}h ` : ""}
                        {minutes}min
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-[11px] text-[#999] tracking-wide uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Motorista
                      </span>
                      <span className="text-[13px] text-[#1a1a1a] font-medium">
                        {movement.personnel?.rank}{" "}
                        {movement.personnel?.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[11px] text-[#999] tracking-wide uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Destino
                      </span>
                      <span className="text-[13px] text-[#1a1a1a] font-medium">
                        {movement.destination}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[11px] text-[#999] tracking-wide uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                        Saída
                      </span>
                      <span className="text-[13px] text-[#1a1a1a] font-medium tabular-nums">
                        {new Date(
                          movement.departureTime,
                        ).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        ·{" "}
                        {new Intl.NumberFormat("pt-BR").format(
                          movement.departureKm,
                        )}{" "}
                        km
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full flex items-center justify-center gap-2 transition-all hover:brightness-110"
                    style={{
                      ...velBtnPrimary,
                      padding: "8px 16px",
                      fontSize: "12px",
                    }}
                    onClick={() => handleArrivalClick(movement)}
                  >
                    <LogIn size={13} />
                    Registrar Chegada
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {inTransit.length === 0 && (
        <div
          className="p-6 text-center"
          style={{
            ...velPanelSquare,
            borderLeft: "3px solid #16a34a",
          }}
        >
          <Car size={32} className="mx-auto mb-2 text-green-600" />
          <p
            className="text-green-700 tracking-[0.05em] uppercase font-semibold"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Todas as viaturas na unidade
          </p>
          <p className="text-[12px] text-[#999] mt-1">
            Nenhuma viatura em trânsito no momento
          </p>
        </div>
      )}

      {/* Recent Movements History */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2
            className="text-lg text-[#1a1a1a] tracking-[0.08em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            Últimas Saídas
          </h2>
          <div className="h-0.5 flex-1" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.06), transparent)" }} />
        </div>

        {recentMovements.length === 0 ? (
          <div className="text-center py-12" style={velPanelSquare}>
            <AlertCircle size={32} className="mx-auto mb-2 text-[#ccc]" />
            <p className="text-[#999] text-sm">Nenhuma movimentação registrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto" style={velPanelSquare}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                  {["Data", "Viatura", "Posto/Grad", "RG", "Motorista", "Destino"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                  {["KM Saída", "KM Chegada"].map((h) => (
                    <th
                      key={h}
                      className="text-right px-3 py-2.5 text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                  {["Saída", "Chegada"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2.5 text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                  {["Tempo", "Distância"].map((h) => (
                    <th
                      key={h}
                      className="text-right px-3 py-2.5 text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    className="text-right px-3 py-2.5 text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((movement) => {
                  const distance = movement.arrivalKm
                    ? movement.arrivalKm - movement.departureKm
                    : null;

                  const departureDate = new Date(movement.departureTime);
                  const dateStr = departureDate.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  });

                  // Calcular tempo fora
                  let timeOutStr = "—";
                  if (movement.arrivalTime) {
                    const timeOutMinutes = Math.floor(
                      (movement.arrivalTime - movement.departureTime) /
                        (1000 * 60),
                    );
                    const hours = Math.floor(timeOutMinutes / 60);
                    const minutes = timeOutMinutes % 60;
                    timeOutStr = `${hours}h ${minutes.toString().padStart(2, "0")}min`;
                  }

                  const isInTransit = movement.status === "em_transito";

                  return (
                    <tr
                      key={movement._id}
                      className="transition-colors hover:bg-black/[0.015]"
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.04)",
                        background: isInTransit ? "rgba(220,38,38,0.02)" : undefined,
                      }}
                    >
                      <td className="px-3 py-2.5 text-[#1a1a1a] font-medium tabular-nums">{dateStr}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 inline-block"
                          style={{
                            fontFamily: "'Barlow Condensed', sans-serif",
                            background: "rgba(220,38,38,0.06)",
                            color: "#b91c1c",
                            clipPath: "polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))",
                          }}
                        >
                          {movement.vehicle?.operationalPrefix}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[#666]">{movement.personnel?.rank}</td>
                      <td className="px-3 py-2.5 text-[#666] tabular-nums">{movement.personnel?.rg}</td>
                      <td className="px-3 py-2.5 text-[#1a1a1a]">{movement.personnel?.name}</td>
                      <td className="px-3 py-2.5 text-[#1a1a1a]">{movement.destination}</td>
                      <td className="px-3 py-2.5 text-right text-[#1a1a1a] tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {new Intl.NumberFormat("pt-BR").format(
                          movement.departureKm,
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {movement.arrivalKm ? (
                          <span className="text-[#1a1a1a]">
                            {new Intl.NumberFormat("pt-BR").format(
                              movement.arrivalKm,
                            )}
                          </span>
                        ) : (
                          <span className="text-[#dc2626] font-bold">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-[#1a1a1a] tabular-nums">
                        {new Date(movement.departureTime).toLocaleTimeString(
                          "pt-BR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="px-3 py-2.5 tabular-nums">
                        {movement.arrivalTime ? (
                          <span className="text-[#1a1a1a]">
                            {new Date(movement.arrivalTime).toLocaleTimeString(
                              "pt-BR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        ) : (
                          <span className="text-[#dc2626] font-bold">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {movement.arrivalTime ? (
                          <span className="text-[#2563eb]">
                            {timeOutStr}
                          </span>
                        ) : (
                          <span className="text-[#dc2626] font-bold">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular-nums" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        {distance !== null ? (
                          <span className="text-[#16a34a]">
                            {new Intl.NumberFormat("pt-BR").format(distance)}{" "}
                            km
                          </span>
                        ) : (
                          <span className="text-[#dc2626] font-bold">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex gap-1 justify-end">
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-7 w-7 text-[#999] hover:text-[#1a1a1a] transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(movement);
                            }}
                            title="Editar saída"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-7 w-7 text-[#ccc] hover:text-[#dc2626] transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(movement._id);
                            }}
                            title="Deletar saída"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <PersonnelQuickAddModal
        open={personnelModalOpen}
        onOpenChange={setPersonnelModalOpen}
      />
      <DepartureModal
        open={departureModalOpen}
        onOpenChange={setDepartureModalOpen}
      />
      <ArrivalModal
        open={arrivalModalOpen}
        onOpenChange={setArrivalModalOpen}
        movement={selectedMovement}
      />
      <EditMovementModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        movement={selectedMovement}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDeleteConfirm({ open: false, movementId: null })}
          />
          <div
            className="relative z-10 w-full max-w-md p-6"
            style={{
              ...velPanel,
              background: "white",
              boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-3 h-3"
              style={{ background: "linear-gradient(225deg, rgba(220,38,38,0.4) 50%, transparent 50%)" }}
            />
            <h3
              className="text-lg text-[#1a1a1a] tracking-[0.05em] uppercase mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-[#999] mb-6">
              Tem certeza que deseja deletar esta movimentação? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="transition-colors hover:text-[#1a1a1a]"
                style={velBtnOutline}
                onClick={() =>
                  setDeleteConfirm({ open: false, movementId: null })
                }
              >
                Cancelar
              </button>
              <button
                className="transition-all hover:brightness-110"
                style={velBtnPrimary}
                onClick={handleConfirmDelete}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
