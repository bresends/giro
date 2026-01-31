import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { IssueStatusBadge } from "./IssueStatusBadge";
import { IssueSeverityBadge } from "./IssueSeverityBadge";
import { Id } from "../../../convex/_generated/dataModel";

interface IssueCardProps {
  issue: {
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
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link to={`/issues/${issue._id}`}>
      <Card className="hover:shadow-md transition cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
              {issue.vehicle && (
                <p className="text-sm text-muted-foreground">
                  {issue.vehicle.operationalPrefix} - {issue.vehicle.plate}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 items-end">
              <IssueStatusBadge status={issue.status} />
              <IssueSeverityBadge severity={issue.severity} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {issue.description}
          </p>

          <div className="text-xs text-muted-foreground">
            Reportado em:{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
            }).format(new Date(issue.reportedDate))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
