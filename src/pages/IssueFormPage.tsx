import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { IssueForm } from "../components/issues/IssueForm";
import { Loading } from "../components/common/Loading";
import { ArrowLeft } from "lucide-react";

const velPanel: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.06)",
  padding: "24px",
  clipPath:
    "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
};

const velBtnPrimary: React.CSSProperties = {
  background: "#dc2626",
  color: "#fff",
  padding: "8px 20px",
  border: "none",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  clipPath:
    "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const velBtnBack: React.CSSProperties = {
  background: "transparent",
  color: "#999",
  border: "none",
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 11,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: 0,
};

const velSectionLabel: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 600,
  fontSize: 10,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#999",
};

export function IssueFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const vehicles = useQuery(api.vehicles.list, {});
  const issue = useQuery(
    api.vehicleIssues.get,
    id ? { id: id as Id<"vehicleIssues"> } : "skip"
  );

  const createIssue = useMutation(api.vehicleIssues.create);
  const updateIssue = useMutation(api.vehicleIssues.update);

  const handleSubmit = async (data: any) => {
    try {
      if (isEdit && id) {
        await updateIssue({
          id: id as Id<"vehicleIssues">,
          ...data,
        });
        navigate(`/issues/${id}`);
      } else {
        const newId = await createIssue({
          vehicleId: data.vehicleId,
          title: data.title,
          description: data.description,
          severity: data.severity,
        });
        navigate(`/issues/${newId}`);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCancel = () => {
    if (isEdit && id) {
      navigate(`/issues/${id}`);
    } else {
      navigate("/issues");
    }
  };

  if (vehicles === undefined || (isEdit && issue === undefined)) {
    return <Loading text={isEdit ? "Carregando problema..." : "Carregando..."} />;
  }

  if (isEdit && issue === null) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#1a1a1a",
            marginBottom: 12,
          }}
        >
          Problema nao encontrado
        </h3>
        <button style={velBtnPrimary} onClick={() => navigate("/issues")}>
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 720 }}>
      {/* Header */}
      <div>
        <button style={velBtnBack} onClick={handleCancel}>
          <ArrowLeft size={14} />
          Voltar
        </button>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 28,
            color: "#1a1a1a",
            letterSpacing: "0.04em",
            margin: "8px 0 0 0",
          }}
        >
          {isEdit ? "Editar Problema" : "Novo Problema"}
        </h1>
        <p style={{ color: "#999", fontFamily: "'Barlow', sans-serif", fontSize: 14, marginTop: 4 }}>
          {isEdit
            ? "Atualize as informacoes do problema"
            : "Preencha os dados para registrar um novo problema"}
        </p>
      </div>

      {/* Form Panel */}
      <div style={velPanel}>
        <div style={{ marginBottom: 16 }}>
          <span style={velSectionLabel}>
            {isEdit ? "Dados do Problema" : "Cadastro de Problema"}
          </span>
          <div style={{ width: 24, height: 2, background: "#dc2626", marginTop: 6 }} />
        </div>
        <IssueForm
          initialData={
            isEdit && issue
              ? {
                  vehicleId: issue.vehicleId,
                  title: issue.title,
                  description: issue.description,
                  severity: issue.severity,
                  status: issue.status,
                }
              : undefined
          }
          vehicles={
            vehicles?.map((v) => ({
              _id: v._id,
              operationalPrefix: v.operationalPrefix,
              plate: v.plate,
            })) || []
          }
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
}
