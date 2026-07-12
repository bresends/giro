# Design system Velocity Light

**Criado em:** 2026-07-11
**Estado:** em andamento

## Objetivo

Construir a fundação reutilizável do Velocity Light sobre os componentes `shadcn` existentes, sem migrar páginas de produto neste plano.

Ao final, tokens, primitives e composições básicas devem estar prontos para serem usados pelo próximo plano: a remodelagem da área administrativa de viaturas.

## Critérios de sucesso

- Cores, tipografia, geometria, bordas, sombras e foco possuem tokens semânticos no tema.
- As primitives compartilhadas representam o Velocity Light sem estilos de marca repetidos nas páginas.
- Componentes recorrentes de página possuem APIs definidas e exemplos de uso.
- Uma rota disponível apenas em desenvolvimento permite revisar variantes, estados e responsividade.
- `npm run lint` e `npm run build` são concluídos sem erros.

## Escopo

### Incluído

- Fundação visual em `src/index.css`.
- Adaptação das primitives `shadcn` já usadas pela aplicação.
- Componentes compartilhados necessários para títulos, seções, estados e métricas.
- Showcase interno do design system.
- Validação isolada dos componentes em desktop e mobile.

### Fora do escopo

- Alterar `Layout`, `Header`, `Sidebar` ou login.
- Remodelar dashboard ou páginas de domínio.
- Alterar regras de negócio, rotas, consultas Convex ou formatos de dados.
- Suportar tema escuro.
- Criar um pacote separado ou adicionar Storybook.

## Contexto e referências

- [Referência visual Velocity Light](../referencias/01-velocity-light.md)
- Branch visual: `origin/feat/velocity-light-design-system`.
- O frontend usa Tailwind CSS 4, CVA e componentes `shadcn` locais em `src/components/ui/`.
- A fundação duplicada de `src/index.css` foi consolidada durante este plano.
- A branch visual demonstra a identidade, mas aplica grande parte dela diretamente nas páginas com estilos inline.

## Decisões

| Data       | Decisão                                          | Motivo                                                                     | Consequência                                                        |
| ---------- | ------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 2026-07-11 | Construir sobre `shadcn`, Tailwind e CVA         | Essas ferramentas já formam a base do frontend                             | Não será criada uma camada paralela de primitives                   |
| 2026-07-11 | Centralizar identidade em tokens CSS e variantes | Estilos inline repetidos dificultam manutenção e responsividade            | Páginas futuras consumirão APIs semânticas                          |
| 2026-07-11 | Implementar somente o tema claro                 | O piloto usa Velocity Light e precisa de escopo controlado                 | Tema escuro poderá ser tratado em iniciativa própria                |
| 2026-07-11 | Carregar Barlow e Bebas Neue pelo Google Fonts   | Mantém a identidade escolhida com configuração simples                     | As fontes precisam de fallbacks locais                              |
| 2026-07-11 | Usar uma rota interna como showcase              | Permite validar o sistema sem introduzir Storybook                         | A rota existirá somente quando `import.meta.env.DEV` for verdadeiro |
| 2026-07-11 | Explorar o sistema na rota antes das primitives  | Permite fechar a direção visual sem alterar componentes compartilhados     | O laboratório usa HTML semântico e tokens, depois orienta as APIs   |
| 2026-07-11 | Manter o tema escuro apenas como preview         | O styleguide precisa comparar contraste sem ampliar o escopo das páginas   | O toggle não representa suporte escuro liberado no produto          |
| 2026-07-11 | Não migrar páginas neste plano                   | Design system e remodelagem de páginas são entregas verificáveis distintas | Admin + Viaturas terá um plano próprio após esta entrega            |
| 2026-07-11 | Manter DesignSystemPage como um arquivo único    | Facilita a visualização global e condensa a exploração do laboratório      | A organização é feita estruturalmente no arquivo, em vez de módulos |

## Etapas

- [x] Consolidar tokens e estilos-base em `src/index.css`, incluindo fontes, estados semânticos e cantos chanfrados.
- [x] Criar o laboratório exploratório em `/design-system`, sem alterar as primitives compartilhadas.
- [x] Organizar estruturalmente o styleguide, consolidar taxonomia e refinar os exemplos visuais em arquivo único.
- [ ] **ATUAL:** Fechar tokens e comportamentos após validar o laboratório em tema claro, tema escuro, desktop e mobile.
- [ ] Adaptar primitives e composições compartilhadas, preservando APIs existentes e usando CVA.
- [ ] Converter o laboratório em showcase das APIs reais, validar build e acessibilidade e registrar a entrega.

## Interfaces previstas

- `Button`: variantes `default`, `secondary`, `outline`, `ghost`, `destructive` e `link`, preservando os tamanhos atuais.
- `Card`: superfície Velocity com geometria chanfrada configurável.
- `Badge` ou `StatusBadge`: tons `success`, `warning`, `danger`, `info` e `neutral`.
- `PageHeader`: título, descrição, ação e retorno opcionais.
- `SectionHeader`: label e marcador visual de seção.
- `EmptyState`: título, descrição, ícone e ação opcionais.
- Classe de geometria controlada pela variável `--corner-cut`.

Os nomes finais podem ser ajustados durante a implementação para respeitar os padrões do repositório, desde que os comportamentos previstos sejam preservados.

## Testes e aceite

- Validar default, hover, focus-visible, disabled, loading, erro e conteúdo longo.
- Validar componentes e composições em desktop e mobile.
- Confirmar navegação por teclado, contraste, labels e áreas de toque.
- Confirmar que a rota `/design-system` não seja registrada em produção.
- Executar `npm run lint` e `npm run build`.
- Confirmar que nenhuma página de produto ou regra de negócio foi alterada.

## Estado atual do laboratório

### Rotas e estrutura

- `/design-system` é a única rota do laboratório, disponível apenas em desenvolvimento para usuários autenticados.
- `src/styleguide/navigation.ts` define a navegação lateral por âncoras.
- `src/styleguide/StyleguideLayout.tsx` fornece sidebar responsiva e preview claro/escuro.
- `src/pages/DesignSystemPage.tsx` concentra atualmente todo o conteúdo do laboratório.
- `public/logo.svg` contém a marca com recorte interno realmente transparente.

### Fundações representadas

- Paleta semântica e escalas de vermelho, azul, verde, amarelo, laranja e neutros.
- Background, surface e papéis de borda.
- Tipografia com Bebas Neue, Barlow, Barlow Condensed e mono.
- Escalas de heading, body, peso, spacing, radius, cantos chanfrados e sombras.
- Iconografia Lucide em `32px`, `24px` e `16px`.
- Preview de tema escuro restrito ao styleguide.

### Famílias representadas

- Button: tamanhos, fill, outline, ghost, semânticos, icon-only, ícones à esquerda/direita, link, loading e button group.
- Forms: inputs simples e com ícone, estados, select, textarea, checkbox, radio, toggle, combobox e validação.
- File uploader: vazio, drag ativo, selecionado, progresso, sucesso, erro e desabilitado.
- Selection Controls & Sliders: switches, checkboxes e variações de sliders e barras de progresso (dot-only thumb, ícones, métricas, marcações).
- Feedback & Avatars: alertas, badges, e avatares fotográficos genéricos com indicadores de notificação "dot-only".
- Card: padrão, interativo e métrica, garantindo recorte correto e continuidade da borda chanfrada.
- Images: variações geométricas de imagens aplicando recortes e bordas sobre fotos.
- Overlays: dialog, popover e dropdown.
- Navigation: top bar, bottom navigation, tabs e paginação separada.
- Data e tempo: calendário e date picker.
- Data display: métricas e tabela.
- Compositions: page header, section header e empty state em seção própria.

## Débitos antes de continuar

- Existem cores literais e tokens experimentais locais, principalmente nos estados `warning`, foco e hover.
- O tema escuro é apenas preview e ainda não foi revisado componente por componente.
- Algumas matrizes reproduzem estados visualmente, mas não representam componentes ou APIs reais.
- Os exemplos usam HTML semântico diretamente e não devem ser copiados para páginas de produto.
- A acessibilidade precisa de auditoria de contraste, teclado, nomes acessíveis e estados disabled/loading.
- `npm run build` está aprovado. O lint isolado do styleguide está aprovado.
- `npm run lint` completo falha por problemas preexistentes em Convex e páginas fora deste plano.

## Ponto de retomada

Não iniciar a adaptação das primitives shadcn antes de concluir:

1. Levantar todas as cores literais do laboratório e decidir quais viram tokens e quais são apenas amostras de escala.
2. Revisar o laboratório em responsividade e nos modos claro e escuro.
3. Fechar os comportamentos, padronizar espaçamentos e revisar a acessibilidade inicial.

## Descobertas

- A branch visual quase não adapta as primitives `shadcn`; a identidade está majoritariamente repetida nas páginas.
- Checklist, movimentações e recursos recentes não existem integralmente na referência visual, reforçando a necessidade de uma fundação antes das páginas.
- A configuração anterior mantinha dois temas claros concorrentes, um tema escuro fora do escopo e tokens autorreferentes; a fundação foi reduzida a uma única fonte de verdade para o tema claro.
- Manter o DesignSystemPage.tsx como arquivo único provou-se suficiente, eliminando a sobrecarga de gerenciar arquivos de "seções" prematuramente, focando apenas na ordem interna dos blocos.
- Bordas CSS cortadas com `clip-path` não acompanham a aresta da caixa. Usar um contêiner (wrapper) com fundo cor-de-borda e `padding: 1px` é uma solução elegante e escalável.

## Próximo passo

Revisar uso de cores literais, testar responsividade e tema escuro do laboratório, validando assim os tokens antes da codificação final dos componentes UI base.
