# Design system Velocity Light

**Criado em:** 2026-07-11
**Estado:** planejando

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
- O `src/index.css` atual possui definições globais duplicadas.
- A branch visual demonstra a identidade, mas aplica grande parte dela diretamente nas páginas com estilos inline.

## Decisões

| Data       | Decisão                                          | Motivo                                                                     | Consequência                                                        |
| ---------- | ------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 2026-07-11 | Construir sobre `shadcn`, Tailwind e CVA         | Essas ferramentas já formam a base do frontend                             | Não será criada uma camada paralela de primitives                   |
| 2026-07-11 | Centralizar identidade em tokens CSS e variantes | Estilos inline repetidos dificultam manutenção e responsividade            | Páginas futuras consumirão APIs semânticas                          |
| 2026-07-11 | Implementar somente o tema claro                 | O piloto usa Velocity Light e precisa de escopo controlado                 | Tema escuro poderá ser tratado em iniciativa própria                |
| 2026-07-11 | Carregar Barlow e Bebas Neue pelo Google Fonts   | Mantém a identidade escolhida com configuração simples                     | As fontes precisam de fallbacks locais                              |
| 2026-07-11 | Usar uma rota interna como showcase              | Permite validar o sistema sem introduzir Storybook                         | A rota existirá somente quando `import.meta.env.DEV` for verdadeiro |
| 2026-07-11 | Não migrar páginas neste plano                   | Design system e remodelagem de páginas são entregas verificáveis distintas | Admin + Viaturas terá um plano próprio após esta entrega            |

## Etapas

- [ ] **ATUAL:** Consolidar tokens e estilos-base em `src/index.css`, incluindo fontes, estados semânticos e cantos chanfrados.
- [ ] Adaptar as primitives compartilhadas, preservando suas APIs sempre que possível e adicionando variantes com CVA.
- [ ] Criar `PageHeader`, `SectionHeader`, `StatusBadge` e `EmptyState`, além de alinhar `StatCard` à nova fundação.
- [ ] Criar `/design-system` com exemplos das variantes, estados e composições implementadas.
- [ ] Validar acessibilidade básica, desktop, mobile, lint e build; registrar a entrega e atualizar o painel.

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

## Descobertas

- A branch visual quase não adapta as primitives `shadcn`; a identidade está majoritariamente repetida nas páginas.
- Checklist, movimentações e recursos recentes não existem integralmente na referência visual, reforçando a necessidade de uma fundação antes das páginas.

## Próximo passo

Revisar `src/index.css` e as primitives atuais para definir o conjunto mínimo de tokens e variantes antes de editar arquivos.
