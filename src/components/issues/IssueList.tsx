import { IssueCard } from "./IssueCard";
import { Id } from "../../../convex/_generated/dataModel";
import { AlertTriangle } from "lucide-react";

interface IssueListProps {
  issues: Array<{
    _id: Id<"vehicleIssues">;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    status: "open" | "in_progress" | "resolved" | "closed";
    reportedDate: number;
    vehicle: {
      _id: Id<"vehicles">;
      operationalPrefix: string;
      plate: string;
    } | null;
  }>;
}

export function IssueList({ issues }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Nenhum problema encontrado
        </h3>
        <p className="text-muted-foreground">
          Registre problemas para acompanhar os defeitos da frota
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue._id} issue={issue} />
      ))}
    </div>
  );
}
