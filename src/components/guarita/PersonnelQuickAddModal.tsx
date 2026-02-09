import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { ConvexError } from "convex/values";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

interface PersonnelQuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const velInput: React.CSSProperties = {
  background: "#fff",
  border: "1.5px solid #e5e5e5",
  color: "#1a1a1a",
  fontFamily: "'Barlow', sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  padding: "11px 14px",
  width: "100%",
  outline: "none",
  clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
};

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

  const velLabel = "block text-[10px] text-[#999] tracking-[0.15em] uppercase font-semibold mb-1.5";
  const velLabelStyle: React.CSSProperties = { fontFamily: "'Barlow Condensed', sans-serif" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md light text-foreground">
        <div>
          <h2
            className="text-xl text-[#1a1a1a] tracking-[0.05em] uppercase"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            Cadastrar Novo Militar
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-0.5 w-6" style={{ background: "#dc2626" }} />
            <p className="text-[11px] text-[#999] tracking-wide">
              Adicione um novo militar ao sistema
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div
              className="px-4 py-3"
              style={{
                background: "rgba(220,38,38,0.04)",
                borderLeft: "2px solid #dc2626",
              }}
            >
              <p className="text-sm text-[#dc2626]">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className={velLabel} style={velLabelStyle}>
              Posto/Graduação <span className="text-[#dc2626]">*</span>
            </label>
            <input
              value={formData.rank}
              onChange={(e) =>
                setFormData({ ...formData, rank: e.target.value })
              }
              placeholder="Ex: SD, CB, SGT, TEN, CAP"
              required
              style={velInput}
            />
          </div>

          <div className="space-y-1.5">
            <label className={velLabel} style={velLabelStyle}>
              RG <span className="text-[#dc2626]">*</span>
            </label>
            <input
              type="number"
              value={formData.rg || ""}
              onChange={(e) =>
                setFormData({ ...formData, rg: parseInt(e.target.value) || 0 })
              }
              placeholder="Ex: 3892"
              required
              min={1000}
              style={velInput}
            />
          </div>

          <div className="space-y-1.5">
            <label className={velLabel} style={velLabelStyle}>
              Nome Completo <span className="text-[#dc2626]">*</span>
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: João da Silva"
              required
              style={velInput}
            />
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs text-[#999] tracking-wider uppercase hover:text-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-40"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                border: "1px solid rgba(0,0,0,0.08)",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs text-white tracking-wider uppercase transition-all hover:brightness-110 cursor-pointer disabled:opacity-40"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                background: "#dc2626",
                border: "none",
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
