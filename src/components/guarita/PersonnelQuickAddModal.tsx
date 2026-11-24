import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { ConvexError } from "convex/values";
import { IconCadastrarMilitar } from "@/components/giro/icons";
import { GiroButton } from "@/components/giro/giro-button";
import {
  giroDialog,
  giroDialogDescription,
  giroDialogTitle,
  giroErrorBox,
  giroField,
  giroLabel,
} from "@/components/giro/styles";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

interface PersonnelQuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonnelQuickAddModal({
  open,
  onOpenChange,
}: PersonnelQuickAddModalProps) {
  const createPersonnel = useMutation(api.personnel.create);

  const [formData, setFormData] = useState({
    rank: "",
    rg: 0,
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        rank: "",
        rg: 0,
        name: "",
      });
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.rank.trim() ||
      !formData.rg ||
      formData.rg <= 0 ||
      !formData.name.trim()
    ) {
      setError("Preencha todos os campos");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPersonnel({
        rank: formData.rank.trim(),
        rg: formData.rg,
        name: formData.name.trim(),
      });

      toast.success("Militar cadastrado com sucesso!");

      onOpenChange(false);
    } catch (err) {
      const errorMessage =
        err instanceof ConvexError
          ? (err.data as string)
          : err instanceof Error
            ? err.message
            : "Erro ao cadastrar militar";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(giroDialog, "sm:max-w-md")}>
        <DialogHeader>
          <DialogTitle className={giroDialogTitle}>Cadastrar militar</DialogTitle>
          <DialogDescription className={giroDialogDescription}>
            Adicione um militar para poder registrar saídas com ele como motorista.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div role="alert" className={giroErrorBox}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="rank" className={giroLabel}>
              Posto/graduação <span className="text-giro-accent">*</span>
            </Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: e.target.value })
              }
              placeholder="Ex: SD, CB, SGT, TEN, CAP"
              required
              className={giroField}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="rg" className={giroLabel}>
              RG <span className="text-giro-accent">*</span>
            </Label>
            <Input
              id="rg"
              type="number"
              inputMode="numeric"
              value={formData.rg || ""}
              onChange={(e) =>
                setFormData({ ...formData, rg: parseInt(e.target.value) || 0 })
              }
              placeholder="Ex: 3892"
              required
              min={1000}
              className={giroField}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className={giroLabel}>
              Nome completo <span className="text-giro-accent">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: João da Silva"
              required
              className={giroField}
            />
          </div>

          <DialogFooter className="pt-1">
            <GiroButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </GiroButton>
            <GiroButton type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              <IconCadastrarMilitar />
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </GiroButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
