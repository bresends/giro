import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    rg: "",
    name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        rank: "",
        rg: "",
        name: "",
      });
      setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.rank.trim() || !formData.rg.trim() || !formData.name.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPersonnel({
        rank: formData.rank,
        rg: formData.rg,
        name: formData.name,
      });

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar militar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md light text-foreground">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Militar</DialogTitle>
          <DialogDescription>
            Adicione um novo militar ao sistema para registrar saídas de viaturas.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rank">
              Posto/Graduação <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: e.target.value })
              }
              placeholder="Ex: SD, CB, SGT, TEN, CAP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rg">
              RG <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rg"
              value={formData.rg}
              onChange={(e) =>
                setFormData({ ...formData, rg: e.target.value })
              }
              placeholder="Ex: 123456"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: João da Silva"
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
