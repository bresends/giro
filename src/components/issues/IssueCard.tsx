import { Link } from "react-router-dom";
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
      <div
        className="h-full transition-shadow hover:shadow-md"
        style={{
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          borderLeft: "3px solid #dc2626",
          padding: 16,
          cursor: "pointer",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3
              className="text-sm font-semibold text-[#1a1a1a] mb-1"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              {issue.title}
            </h3>
            {issue.vehicle && (
              <p className="text-xs text-[#999]" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {issue.vehicle.operationalPrefix} - {issue.vehicle.plate}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 items-end">
            <IssueStatusBadge status={issue.status} />
            <IssueSeverityBadge severity={issue.severity} />
          </div>
        </div>

        <p
          className="text-xs text-[#999] mb-3"
          style={{
            fontFamily: "'Barlow', sans-serif",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {issue.description}
        </p>

        <div
          className="text-[10px] text-[#999] tracking-[0.1em] uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Reportado em:{" "}
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
          }).format(new Date(issue.reportedDate))}
        </div>
      </div>
    </Link>
  );
}
