export interface RoteiroSection {
  title: string;
  items: string[];
}

const HEADING = /^H[1-6]$/;

function clean(text: string | null | undefined) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/** Parágrafo que é só um texto em negrito funciona como título de seção no editor. */
function isBoldTitle(el: Element) {
  if (el.tagName !== "P") return false;
  const text = clean(el.textContent);
  if (!text) return false;
  const bold = Array.from(el.querySelectorAll("strong, b"))
    .map((b) => clean(b.textContent))
    .join(" ");
  return bold === text;
}

/**
 * Converte o HTML do template (Tiptap) em seções com itens numerados.
 * Títulos (h1–h6 ou parágrafo todo em negrito) abrem seções; itens de lista viram itens.
 * Retorna `null` quando não há listas: nesse caso a página mostra o texto rico original.
 */
export function parseRoteiro(html: string): RoteiroSection[] | null {
  if (typeof DOMParser === "undefined") return null;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const sections: RoteiroSection[] = [];
  let current: RoteiroSection | null = null;
  let itemCount = 0;

  const ensure = () => {
    if (!current) {
      current = { title: "Itens", items: [] };
      sections.push(current);
    }
    return current;
  };

  for (const el of Array.from(doc.body.children)) {
    if (HEADING.test(el.tagName) || isBoldTitle(el)) {
      const title = clean(el.textContent);
      if (title) {
        current = { title, items: [] };
        sections.push(current);
      }
      continue;
    }
    if (el.tagName === "UL" || el.tagName === "OL") {
      const target = ensure();
      for (const li of Array.from(el.querySelectorAll("li"))) {
        // Item com sublista: usa só o texto próprio; a sublista vira itens próprios
        const own = clean(
          Array.from(li.childNodes)
            .filter((n) => !(n instanceof Element && (n.tagName === "UL" || n.tagName === "OL")))
            .map((n) => n.textContent)
            .join(" "),
        );
        if (own) {
          target.items.push(own);
          itemCount++;
        }
      }
    }
  }

  if (itemCount === 0) return null;
  return sections.filter((s) => s.items.length > 0);
}
