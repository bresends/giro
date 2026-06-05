import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Redo2, Undo2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChecklistTemplateEditorProps {
  initialValue: string;
  onSave: (content: string) => Promise<void>;
}

export function ChecklistTemplateEditor({ initialValue, onSave }: ChecklistTemplateEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue || "",
    editorProps: {
      attributes: {
        "aria-label": "Template do Checklist",
        class:
          "min-h-[350px] max-h-[500px] overflow-y-auto px-4 py-3 text-sm outline-none prose prose-sm dark:prose-invert max-w-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-6",
      },
    },
  });

  // Keep editor content in sync when initialValue changes
  useEffect(() => {
    if (editor && initialValue !== undefined) {
      // Avoid resetting content if the editor already matches the initialValue
      if (editor.getHTML() !== initialValue) {
        editor.commands.setContent(initialValue);
      }
    }
  }, [initialValue, editor]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const html = editor.getHTML();
      // If editor is empty or only contains an empty paragraph, send empty string
      const finalHtml = editor.isEmpty ? "" : html;
      await onSave(finalHtml);
    } finally {
      setIsSaving(false);
    }
  };

  const toolbarButtonClass = "size-8";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 p-2">
          <Button
            type="button"
            variant={editor?.isActive("bold") ? "secondary" : "ghost"}
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor?.can().chain().focus().toggleBold().run()}
            title="Negrito"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("italic") ? "secondary" : "ghost"}
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor?.can().chain().focus().toggleItalic().run()}
            title="Itálico"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button
            type="button"
            variant={editor?.isActive("bulletList") ? "secondary" : "ghost"}
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Lista com Marcadores"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant={editor?.isActive("orderedList") ? "secondary" : "ghost"}
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            title="Lista Numerada"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>

          <div className="mx-1 h-5 w-px bg-border" />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}
            title="Desfazer"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={toolbarButtonClass}
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}
            title="Refazer"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor Area */}
        <EditorContent editor={editor} className="bg-white dark:bg-input" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !editor} className="px-6">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Lista de Materiais"}
        </Button>
      </div>
    </div>
  );
}
