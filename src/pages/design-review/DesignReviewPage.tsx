import { Link, useParams } from "react-router-dom";
import {
  ChecklistConferenceStep,
  ChecklistIdentifyStep,
  ChecklistSentStep,
} from "@/components/checklist/ChecklistSteps";
import { GuaritaHeader } from "@/components/guarita/GuaritaHeader";
import { InTransitBoard } from "@/components/guarita/InTransitBoard";
import { RecentMovements } from "@/components/guarita/RecentMovements";
import { ShiftReportView } from "@/components/guarita/ShiftReportView";
import { ShiftSummary } from "@/components/guarita/ShiftSummary";
import { GuaritaTopBar } from "@/components/layout/GuaritaTopBar";
import {
  CHART_NOW,
  CHECKLIST_VEHICLE,
  FLEET_SIZE,
  IN_GARAGE,
  IN_TRANSIT,
  MOTORISTA_SENT,
  NOW,
  RECENT,
  ROTEIRO,
  SHIFT,
  SHIFT_WINDOW,
  SUBMITTED_AT,
  USER,
} from "./fixtures";

const noop = () => {};

const SCREENS = ["guarita", "relatorio", "checklist-1", "checklist-2", "checklist-3"] as const;

/**
 * Telas da guarita e do checklist com os dados de `design/hero.pen`, para validação
 * visual contra o design. Rota somente de desenvolvimento, fora do login.
 */
export function DesignReviewPage() {
  const { screen } = useParams();
  const isChecklist = screen?.startsWith("checklist");

  let content: React.ReactNode;
  switch (screen) {
    case "guarita":
      content = (
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 pt-6 pb-14 sm:px-6 lg:px-10 lg:pt-8">
          <GuaritaHeader now={NOW} onAddPersonnel={noop} onDeparture={noop} />
          <InTransitBoard movements={IN_TRANSIT} now={NOW} onArrival={noop} />
          <ShiftSummary movements={SHIFT} window={SHIFT_WINDOW} now={CHART_NOW} fleetSize={FLEET_SIZE} inGarage={IN_GARAGE} />
          <RecentMovements movements={RECENT} now={NOW} onEdit={noop} onDelete={noop} />
        </div>
      );
      break;
    case "relatorio":
      content = (
        <ShiftReportView
          shift={SHIFT_WINDOW}
          shifts={[SHIFT_WINDOW]}
          selected={0}
          onSelectShift={noop}
          movements={RECENT}
          generatedAt={new Date(2025, 9, 9, 9, 48).getTime()}
          copied={false}
          onCopy={noop}
          now={NOW}
        />
      );
      break;
    case "checklist-1":
      content = (
        <ChecklistIdentifyStep
          fromQr
          picker={null}
          unlinkedFunctionName={null}
          vehicle={CHECKLIST_VEHICLE}
          role="comandante"
          onRoleChange={noop}
          submissions={{ comandante: null, motorista: MOTORISTA_SENT }}
          onStart={noop}
          onChooseManually={noop}
        />
      );
      break;
    case "checklist-2":
      content = (
        <ChecklistConferenceStep
          vehicle={CHECKLIST_VEHICLE}
          role="comandante"
          onBack={noop}
          template={{ content: "" }}
          roteiro={ROTEIRO}
          hasAlterations
          onAlterationsChange={noop}
          onSubmit={noop}
          submitting={false}
          canSubmit
        />
      );
      break;
    case "checklist-3":
      content = (
        <ChecklistSentStep
          vehicle={CHECKLIST_VEHICLE}
          role="comandante"
          submittedAt={SUBMITTED_AT}
          militar={USER}
          hasAlterations
          onDone={noop}
        />
      );
      break;
    default:
      return (
        <ul className="p-6 font-giro">
          {SCREENS.map((s) => (
            <li key={s}>
              <Link className="text-giro-accent underline" to={`/design-review/${s}`}>
                {s}
              </Link>
            </li>
          ))}
        </ul>
      );
  }

  return (
    <div className="giro-ui min-h-screen bg-giro-bg font-giro text-giro-fg antialiased">
      <GuaritaTopBar current={isChecklist ? "checklist" : "guarita"} userLabel={USER} onSignOut={noop} />
      <main>{content}</main>
    </div>
  );
}
