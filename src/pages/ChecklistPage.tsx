import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ClipboardList,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SimpleSelect } from "../components/common/SimpleSelect";

export function ChecklistPage() {
  const [searchParams] = useSearchParams();
  const vehicles = useQuery(api.vehicles.list, {});
  const submitChecklist = useMutation(api.vehicleChecklists.submitChecklist);

  const [formData, setFormData] = useState({
    vehicleId: "" as Id<"vehicles"> | "",
    role: "" as "motorista" | "comandante" | "",
    hasAlterations: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-select vehicle if vehicleId is passed in search params (e.g., from QR code)
  useEffect(() => {
    const paramVehicleId = searchParams.get("vehicleId");
    if (paramVehicleId) {
      setFormData((prev) => ({
        ...prev,
        vehicleId: paramVehicleId as Id<"vehicles">,
      }));
    }
  }, [searchParams]);

  // Query template for selected vehicle and role
  const template = useQuery(
    api.vehicleChecklists.getTemplate,
    formData.vehicleId && formData.role
      ? { vehicleId: formData.vehicleId, role: formData.role }
      : "skip",
  );

  const vehicleOptions = (vehicles || []).map((v) => ({
    value: v._id,
    label: `${v.operationalPrefix} (${v.plate})`,
  }));

  const roleOptions = [
    { value: "motorista", label: "Motorista" },
    { value: "comandante", label: "Comandante" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId || !formData.role) {
      toast.error("Selecione a viatura e a função");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitChecklist({
        vehicleId: formData.vehicleId,
        role: formData.role,
        hasAlterations: formData.hasAlterations,
      });
      toast.success("Checklist enviado com sucesso!");
      setIsSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar checklist",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const selectedVehicle = vehicles?.find((v) => v._id === formData.vehicleId);
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center">
        <Card className="border-t-4 border-t-green-500 shadow-md">
          <CardContent className="pt-6 space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                Checklist Registrado!
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                A conferência da viatura{" "}
                <strong>{selectedVehicle?.operationalPrefix}</strong> (
                {formData.role === "motorista" ? "Motorista" : "Comandante"})
                foi salva com sucesso no sistema.
              </CardDescription>
            </div>

            {formData.hasAlterations ? (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Ação Obrigatória do SEI</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  Como você registrou <strong>COM ALTERAÇÕES</strong>, é
                  obrigatório confeccionar o documento oficial no SEI relatando
                  todas as inconsistências e encaminhar ao Chefe da SGP.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 text-left">
                <p className="text-xs text-green-800 dark:text-green-300 text-center font-medium">
                  Procedimento concluído. Viatura liberada sem alterações!
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    hasAlterations: false,
                  }));
                  setIsSubmitted(false);
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar / Novo Registro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ClipboardList className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Checklist de Viatura
          </h2>
          <p className="text-sm text-muted-foreground">
            Conferência descritiva diária de materiais
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-xs border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Dados da Viatura e Função</CardTitle>
            <CardDescription>
              Selecione a viatura e o seu papel de serviço
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleSelect
              label="Viatura"
              placeholder="Selecione a viatura"
              options={vehicleOptions}
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicleId: e.target.value as Id<"vehicles">,
                }))
              }
              required
            />

            <SimpleSelect
              label="Função"
              placeholder="Selecione sua função"
              options={roleOptions}
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value as "motorista" | "comandante" | "",
                }))
              }
              required
            />
          </CardContent>
        </Card>

        {/* Display Materials Template */}
        <Card className="shadow-xs border-border">
          <CardHeader>
            <CardTitle className="text-lg">Lista de Materiais</CardTitle>
            <CardDescription>
              Verifique fisicamente a presença e estado dos itens listados
              abaixo
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-32 flex flex-col justify-center bg-muted/20 dark:bg-muted/5 rounded-lg p-4">
            {!formData.vehicleId || !formData.role ? (
              <p className="text-sm text-muted-foreground text-center">
                Selecione a viatura e a função para carregar a lista de
                materiais.
              </p>
            ) : template === undefined ? (
              <p className="text-sm text-muted-foreground text-center">
                Carregando lista de materiais...
              </p>
            ) : template === null ? (
              <p className="text-sm text-destructive dark:text-red-400 text-center font-medium">
                Nenhum checklist cadastrado para esta viatura e função.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-lg border border-blue-100 dark:border-blue-900 text-center">
                  <span>
                    📅 <strong>Última atualização do checklist:</strong>{" "}
                    {new Date(template.updatedAt).toLocaleDateString("pt-BR")}{" "}
                    às{" "}
                    {new Date(template.updatedAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    h
                  </span>
                </div>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-sm wrap-break-word leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: template.content }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alteration Selector */}
        {formData.vehicleId && formData.role && template && (
          <Card className="shadow-xs border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                Resultado da Conferência
              </CardTitle>
              <CardDescription>
                Existem materiais faltantes, danificados ou divergências?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, hasAlterations: false }))
                  }
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    !formData.hasAlterations
                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/10 text-green-700 dark:text-green-400"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">Sem Alterações</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, hasAlterations: true }))
                  }
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    formData.hasAlterations
                      ? "border-red-500 bg-red-50/50 dark:bg-red-950/10 text-red-700 dark:text-red-400 font-semibold"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <AlertTriangle className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">Com Alterações</span>
                </button>
              </div>

              {formData.hasAlterations && (
                <div className="flex gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4 text-red-800 dark:text-red-400">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">
                      Registro de Processo Obrigatório
                    </h4>
                    <p className="text-xs leading-relaxed text-red-800/95 dark:text-red-300">
                      Caso sejam identificadas inconsistências, avarias,
                      extravios, substituições ou ausência de materiais, você
                      deve <strong>obrigatoriamente</strong> abrir um novo
                      processo no SEI direcionado ao Chefe da SGP relatando a
                      situação.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Button
          type="submit"
          className="w-full text-base py-6 font-semibold"
          disabled={
            isSubmitting || !formData.vehicleId || !formData.role || !template
          }
        >
          {isSubmitting ? "Enviando..." : "Enviar Checklist"}
        </Button>
      </form>
    </div>
  );
}
