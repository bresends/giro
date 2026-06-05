import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DatePicker } from "../components/common/DatePicker";
import { SimpleSelect } from "../components/common/SimpleSelect";
import { ChecklistTemplateEditor } from "../components/checklists/ChecklistTemplateEditor";
import { Loading } from "../components/common/Loading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  ClipboardList, 
  FileText, 
  AlertTriangle, 
  Clock, 
  CalendarDays,
  FileCheck2
} from "lucide-react";
import { toast } from "sonner";

export function AdminChecklistsPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "templates">("submissions");
  const vehicles = useQuery(api.vehicles.list, {});
  const opFunctions = useQuery(api.vehicleChecklists.listOperationalFunctions, {});

  // Run seed on initialization
  const seedMutation = useMutation(api.vehicleChecklists.seed);
  useEffect(() => {
    seedMutation();
  }, [seedMutation]);

  // Date selection for daily submissions (default to today)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    // Reset time to local midnight
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calculate shift range (7:00 AM of selected day to 7:00 AM of next day)
  const getShiftRange = (date: Date) => {
    const tz = Temporal.Now.timeZoneId();
    const instant = Temporal.Instant.fromEpochMilliseconds(date.getTime());
    const zonedDateTime = instant.toZonedDateTimeISO(tz);

    const shiftStart = zonedDateTime.with({
      hour: 7,
      minute: 0,
      second: 0,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    });

    const shiftEnd = shiftStart.add({ days: 1 });

    return {
      startMs: shiftStart.epochMilliseconds,
      endMs: shiftEnd.epochMilliseconds,
    };
  };

  const { startMs, endMs } = getShiftRange(selectedDate);

  // Queries and mutations
  const dailyStatus = useQuery(api.vehicleChecklists.listDailyStatus, { startMs, endMs });
  
  // Template states
  const [selectedTemplateFunction, setSelectedTemplateFunction] = useState<Id<"operationalFunctions"> | "">("");
  const [selectedTemplateRole, setSelectedTemplateRole] = useState<"motorista" | "comandante" | "">("");
  
  const templateData = useQuery(
    api.vehicleChecklists.getTemplate,
    selectedTemplateFunction && selectedTemplateRole
      ? { operationalFunctionId: selectedTemplateFunction, role: selectedTemplateRole }
      : "skip"
  );
  
  const saveTemplateMutation = useMutation(api.vehicleChecklists.saveTemplate);
  const assignVehicleMutation = useMutation(api.vehicleChecklists.assignVehicle);
  const updateSeiDetailsMutation = useMutation(api.vehicleChecklists.updateSeiDetails);

  // SEI Modal state
  const [seiModalOpen, setSeiModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [seiFormData, setSeiFormData] = useState({
    seiProcessNumber: "",
    seiStatus: "pending" as "pending" | "in_progress" | "resolved" | "no_action_needed",
    adminNotes: "",
  });

  const handleOpenSeiModal = (submission: any) => {
    setSelectedSubmission(submission);
    setSeiFormData({
      seiProcessNumber: submission.seiProcessNumber || "",
      seiStatus: submission.seiStatus || "pending",
      adminNotes: submission.adminNotes || "",
    });
    setSeiModalOpen(true);
  };

  const handleSaveSeiDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      await updateSeiDetailsMutation({
        submissionId: selectedSubmission._id,
        seiProcessNumber: seiFormData.seiProcessNumber || undefined,
        seiStatus: seiFormData.seiStatus,
        adminNotes: seiFormData.adminNotes || undefined,
      });
      toast.success("Informações do processo SEI atualizadas!");
      setSeiModalOpen(false);
    } catch (err) {
      toast.error("Erro ao salvar detalhes do processo SEI");
    }
  };

  const handleSaveTemplate = async (content: string) => {
    if (!selectedTemplateFunction || !selectedTemplateRole) {
      toast.error("Função e papel de serviço inválidos");
      return;
    }

    try {
      await saveTemplateMutation({
        operationalFunctionId: selectedTemplateFunction,
        role: selectedTemplateRole,
        content,
      });
      toast.success("Lista de materiais salva com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar o template");
    }
  };

  const handleAssignVehicle = async (opFunctionId: Id<"operationalFunctions">, vehicleId: string) => {
    try {
      await assignVehicleMutation({
        operationalFunctionId: opFunctionId,
        vehicleId: vehicleId ? (vehicleId as Id<"vehicles">) : undefined,
      });
      toast.success("Viatura física vinculada com sucesso!");
    } catch (error) {
      toast.error("Erro ao vincular a viatura física à função.");
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checklists de Viaturas</h1>
          <p className="text-muted-foreground">
            Gerenciamento e controle de conferência de materiais operacionais
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "submissions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          Conferências do Dia
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 -mb-px transition-colors cursor-pointer ${
            activeTab === "templates"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Modelos de Checklist (Tiptap)
        </button>
      </div>

      {/* TAB 1: Submissions / Lançamentos Diários */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <Card className="shadow-xs border-border">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm font-semibold whitespace-nowrap">Selecione o Dia:</span>
                <div className="w-56">
                  <DatePicker
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500 block"></span>
                  <span>Concluído / Sem Alterações</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 block"></span>
                  <span>Com Alterações / Divergência</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-muted border block"></span>
                  <span>Pendente</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Bar */}
          {dailyStatus && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Total Viaturas</p>
                    <p className="text-2xl font-bold">{dailyStatus.length}</p>
                  </div>
                  <ClipboardList className="w-8 h-8 text-blue-500/20" />
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Motoristas OK</p>
                    <p className="text-2xl font-bold">
                      {dailyStatus.filter((s: any) => s.motorista).length} / {dailyStatus.length}
                    </p>
                  </div>
                  <FileCheck2 className="w-8 h-8 text-green-500/20" />
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Comandantes OK</p>
                    <p className="text-2xl font-bold">
                      {dailyStatus.filter((s: any) => s.comandante).length} / {dailyStatus.length}
                    </p>
                  </div>
                  <FileCheck2 className="w-8 h-8 text-green-500/20" />
                </CardContent>
              </Card>
              <Card className="shadow-xs">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Divergências</p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        dailyStatus.filter(
                          (s: any) => s.motorista?.hasAlterations || s.comandante?.hasAlterations
                        ).length
                      }
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500/20" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Submissions Grid */}
          {dailyStatus === undefined ? (
            <Loading text="Carregando status das viaturas..." />
          ) : dailyStatus.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhuma viatura cadastrada no sistema.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyStatus.map((item: any) => {
                const hasAlteration =
                  item.motorista?.hasAlterations || item.comandante?.hasAlterations;

                return (
                  <Card 
                    key={item.operationalFunctionId} 
                    className={`shadow-xs transition-all border-l-4 ${
                      hasAlteration
                        ? "border-l-red-500 bg-red-50/10 dark:bg-red-950/5"
                        : "border-l-border"
                    }`}
                  >
                    <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {item.currentVehicle
                            ? `${item.currentVehicle.model} • ${item.currentVehicle.operationalPrefix} (${item.currentVehicle.plate})`
                            : "Sem viatura vinculada"}
                        </CardDescription>
                      </div>
                      {hasAlteration && (
                        <Badge variant="destructive" className="flex gap-1 items-center">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Divergência</span>
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Viatura Física Dropdown */}
                      <div className="space-y-1 pb-3 border-b border-border/50">
                        <span className="font-semibold text-xs text-muted-foreground uppercase block">Vincular Viatura:</span>
                        <SimpleSelect
                          placeholder="Nenhuma viatura vinculada"
                          options={(vehicles || []).map((v) => ({
                            value: v._id,
                            label: `${v.operationalPrefix} (${v.plate})`,
                          }))}
                          value={item.currentVehicle?._id || ""}
                          onChange={(e) => handleAssignVehicle(item.operationalFunctionId, e.target.value)}
                        />
                      </div>

                      {/* Motorista Block */}
                      <div className="space-y-1.5 border-b pb-3 border-border/50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-xs text-muted-foreground uppercase">Motorista:</span>
                          {item.motorista ? (
                            <Badge 
                              variant={item.motorista.hasAlterations ? "destructive" : "outline"}
                              className={item.motorista.hasAlterations ? "text-[10px]" : "text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"}
                            >
                              {item.motorista.hasAlterations ? "Com Alterações" : "OK"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Pendente
                            </Badge>
                          )}
                        </div>
                        {item.motorista && (
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-foreground">{item.motorista.userName}</p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(item.motorista.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h</span>
                            </div>
                            {item.motorista.hasAlterations && (
                              <div className="pt-1.5 flex flex-wrap gap-1.5 items-center">
                                {item.motorista.seiProcessNumber ? (
                                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                    SEI: {item.motorista.seiProcessNumber}
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-red-500 font-bold">SEI pendente</span>
                                )}
                                <Button 
                                  size="xs" 
                                  variant="secondary"
                                  className="h-5 text-[9px] px-1.5"
                                  onClick={() => handleOpenSeiModal(item.motorista)}
                                >
                                  Gerenciar SEI
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comandante Block */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-xs text-muted-foreground uppercase">Comandante:</span>
                          {item.comandante ? (
                            <Badge 
                              variant={item.comandante.hasAlterations ? "destructive" : "outline"}
                              className={item.comandante.hasAlterations ? "text-[10px]" : "text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"}
                            >
                              {item.comandante.hasAlterations ? "Com Alterações" : "OK"}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Pendente
                            </Badge>
                          )}
                        </div>
                        {item.comandante && (
                          <div className="text-xs space-y-1">
                            <p className="font-medium text-foreground">{item.comandante.userName}</p>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(item.comandante.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}h</span>
                            </div>
                            {item.comandante.hasAlterations && (
                              <div className="pt-1.5 flex flex-wrap gap-1.5 items-center">
                                {item.comandante.seiProcessNumber ? (
                                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                                    SEI: {item.comandante.seiProcessNumber}
                                  </Badge>
                                ) : (
                                  <span className="text-[10px] text-red-500 font-bold">SEI pendente</span>
                                )}
                                <Button 
                                  size="xs" 
                                  variant="secondary"
                                  className="h-5 text-[9px] px-1.5"
                                  onClick={() => handleOpenSeiModal(item.comandante)}
                                >
                                  Gerenciar SEI
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Templates Manager / Modelos */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <Card className="shadow-xs border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Seleção do Modelo de Materiais</CardTitle>
              <CardDescription>
                Selecione a função operacional e o papel no serviço para editar a lista de materiais exigidos
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium leading-none">
                  Função Operacional <span className="text-red-500">*</span>
                </label>
                <Combobox
                  items={(opFunctions || []).map((f) => ({
                    value: f._id,
                    label: f.name,
                  }))}
                  value={
                    (opFunctions || [])
                      .map((f) => ({
                        value: f._id,
                        label: f.name,
                      }))
                      .find((f) => f.value === selectedTemplateFunction) || null
                  }
                  onValueChange={(f) =>
                    setSelectedTemplateFunction(f ? (f.value as Id<"operationalFunctions">) : "")
                  }
                >
                  <ComboboxInput placeholder="Selecione a função" />
                  <ComboboxContent>
                    <ComboboxEmpty>Nenhuma função encontrada.</ComboboxEmpty>
                    <ComboboxList>
                      {(f) => (
                        <ComboboxItem key={f.value} value={f}>
                          {f.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <SimpleSelect
                label="Papel no Serviço"
                placeholder="Selecione o papel"
                options={[
                  { value: "motorista", label: "Motorista" },
                  { value: "comandante", label: "Comandante" },
                ]}
                value={selectedTemplateRole}
                onChange={(e) => setSelectedTemplateRole(e.target.value as "motorista" | "comandante" | "")}
              />
            </CardContent>
          </Card>

          {selectedTemplateFunction && selectedTemplateRole ? (
            <Card className="shadow-xs border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Conteúdo da Lista de Materiais</span>
                  {templateData?.editorName && (
                    <span className="text-xs font-normal text-muted-foreground">
                      Última atualização por <strong>{templateData.editorName}</strong> em {new Date(templateData.updatedAt).toLocaleString("pt-BR")}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  Insira abaixo a descrição detalhada dos materiais que devem constar obrigatoriamente nesta função para conferência.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {templateData === undefined ? (
                  <Loading text="Carregando template..." />
                ) : (
                  <ChecklistTemplateEditor
                    initialValue={templateData?.content || ""}
                    onSave={handleSaveTemplate}
                  />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              Selecione a função operacional e o papel acima para visualizar e editar o checklist correspondente.
            </div>
          )}
        </div>
      )}

      {/* SEI Management Dialog */}
      <Dialog open={seiModalOpen} onOpenChange={setSeiModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FileText className="w-5 h-5 text-primary" />
              <span>Processo SEI Administrativo</span>
            </DialogTitle>
            <DialogDescription>
              Gerencie a numeração e andamento das divergências encontradas
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSeiDetails} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="seiProcessNumber">Número do Processo SEI</Label>
              <Input
                id="seiProcessNumber"
                placeholder="Ex: 202600005001234"
                value={seiFormData.seiProcessNumber}
                onChange={(e) => setSeiFormData((prev) => ({ ...prev, seiProcessNumber: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seiStatus">Status do Acompanhamento</Label>
              <SimpleSelect
                id="seiStatus"
                options={[
                  { value: "pending", label: "Pendente (Aguardando Registro)" },
                  { value: "in_progress", label: "Em Andamento (SGP)" },
                  { value: "resolved", label: "Resolvido (Faltas Sanadas)" },
                  { value: "no_action_needed", label: "Sem Providências Necessárias" },
                ]}
                value={seiFormData.seiStatus}
                onChange={(e: any) => setSeiFormData((prev) => ({ ...prev, seiStatus: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminNotes">Observações Internas (SGP)</Label>
              <Textarea
                id="adminNotes"
                placeholder="Notas internas ou andamento da reposição de materiais..."
                value={seiFormData.adminNotes}
                onChange={(e) => setSeiFormData((prev) => ({ ...prev, adminNotes: e.target.value }))}
                rows={3}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setSeiModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
