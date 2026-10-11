# Design system Velocity Light

**Criado em:** 2026-07-11
**Estado:** em andamento

## Objetivo

Construir a fundação reutilizável do Velocity Light nos temas claro e escuro, especificá-la visualmente no Pencil e implementá-la sobre os componentes `shadcn` locais, validando-a na listagem `/vehicles` como página-piloto.

Ao final, tokens, primitives e composições básicas devem estar definidos no design, implementados no frontend e validados em uma superfície real antes da continuação da remodelagem da área administrativa de viaturas.

## Critérios de sucesso

- Cores, tipografia, geometria, bordas, sombras e foco possuem tokens semânticos para Light e Dark.
- `design/design-system.pen` contém fundações e catálogos visuais equivalentes nos dois temas.
- `src/components/ui/` é a fonte de verdade das APIs e comportamentos usados pela aplicação.
- Os showcases de desenvolvimento consomem os componentes reais, sem manter primitives paralelas.
- Tema claro, escuro e preferência do sistema podem ser selecionados e persistidos no frontend.
- Componentes são validados em desktop, mobile, teclado, contraste e estados de interação.
- A listagem `/vehicles` consome somente tokens, primitives e composições compartilhadas para aplicar o Velocity, preservando regras de negócio e navegação.
- `npm run build` é aprovado; débitos preexistentes do lint global permanecem identificados separadamente.

## Escopo

### Incluído

- Especificação visual versionada em `design/design-system.pen`.
- Tokens Light e Dark em `src/index.css`.
- Adaptação incremental das primitives `shadcn` já usadas pela aplicação.
- Mecanismo global de seleção e persistência de tema.
- Componentes compartilhados necessários para títulos, seções, estados e métricas.
- Showcases internos disponíveis somente em desenvolvimento.
- Validação isolada dos componentes em desktop e mobile.
- Migração da listagem `/vehicles` como piloto, dentro do shell atual e sem expandir seus destinos.

### Fora do escopo

- Remodelar detalhe, criação, edição ou exclusão de viaturas e quaisquer outras páginas de domínio.
- Remodelar dashboard, login, `Layout`, `Header` ou `Sidebar`.
- Alterar regras de negócio, rotas de produto, consultas Convex ou formatos de dados.
- Criar pacote separado ou adicionar Storybook.
- Gerar componentes de produção automaticamente a partir do Pencil sem revisão.

## Fontes de verdade

| Artefato                    | Responsabilidade                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `design/design-system.pen`  | Exploração, decisão visual, matrizes de variantes, estados e comparação Light/Dark |
| `src/index.css`             | Tokens implementados e disponíveis ao runtime                                      |
| `src/components/ui/`        | APIs, acessibilidade e comportamento real dos componentes                          |
| `/design-system` e subrotas | Validação isolada e executável da implementação em desenvolvimento                 |
| `/vehicles`                 | Validação integrada da fundação em uma superfície real                             |
| Este plano                  | Sequência, decisões, débitos e aceite da iniciativa                                |

O Pencil não substitui testes no navegador. Hover, active, focus-visible, teclado, responsividade e atributos ARIA só são aceitos após validação na implementação real.

## Contexto e referências

- [Referência visual Velocity Light](../referencias/01-velocity-light.md)
- [Especificação executável do piloto `/vehicles`](https://github.com/bresends/giro/issues/12)
- Tickets executáveis: [#13](https://github.com/bresends/giro/issues/13), [#14](https://github.com/bresends/giro/issues/14), [#15](https://github.com/bresends/giro/issues/15), [#16](https://github.com/bresends/giro/issues/16), [#17](https://github.com/bresends/giro/issues/17) e [#18](https://github.com/bresends/giro/issues/18).
- Branch visual `feat/velocity-light-design-system`: removida em 2026-10-11 a pedido do usuário; a referência fica em `docs/referencias/01-velocity-light.md` e `design/design-system.pen`.
- O frontend usa React 19, Tailwind CSS 4, CVA e componentes `shadcn` locais.
- Pencil é usado pelo MCP e o arquivo `.pen` permanece versionado no repositório.
- A branch visual orienta composição e identidade, mas não deve substituir arquivos atuais nem ser copiada integralmente.

## Decisões

| Data       | Decisão                                                         | Motivo                                                                                                                                              | Consequência                                                                                                                  |
| ---------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-11 | Construir sobre `shadcn`, Tailwind e CVA                        | Essas ferramentas já formam a base do frontend                                                                                                      | Não será criada uma camada paralela de primitives                                                                             |
| 2026-07-11 | Centralizar identidade em tokens e variantes                    | Estilos repetidos dificultam manutenção e temas                                                                                                     | Páginas consumirão APIs e tokens semânticos                                                                                   |
| 2026-07-11 | ~~Não migrar páginas neste plano~~                              | Decisão inicial para separar fundação e produto                                                                                                     | **Substituída em 2026-08-19:** a listagem `/vehicles` passa a validar a fundação como piloto                                  |
| 2026-07-11 | ~~Implementar somente tema claro e manter Dark como preview~~   | Decisão inicial para limitar escopo                                                                                                                 | **Substituída em 2026-07-12:** Light e Dark passam a ser temas oficiais                                                       |
| 2026-07-11 | ~~Manter `DesignSystemPage.tsx` como laboratório visual único~~ | A exploração inicial cabia em uma rota                                                                                                              | **Substituída em 2026-07-12:** Pencil concentra a especificação e catálogos de componentes ganham subrotas executáveis        |
| 2026-07-12 | Adotar Light e Dark como parte do design system                 | O tema escuro foi aprovado visualmente e será oferecido no produto                                                                                  | Todo token e componente deve ser validado nos dois temas                                                                      |
| 2026-07-12 | Versionar a especificação em `design/design-system.pen`         | O canvas acelera comparação, estados e iteração visual                                                                                              | O `.pen` orienta o visual, mas não gera código sem revisão                                                                    |
| 2026-07-12 | Manter fontes de verdade por responsabilidade                   | Design, tokens e comportamento possuem necessidades diferentes                                                                                      | Pencil define aparência; CSS define tokens; `src/components/ui` define runtime                                                |
| 2026-07-12 | Manter fundações juntas e separar catálogos de componentes      | Fundações são uma leitura contínua; componentes possuem matrizes extensas                                                                           | `/design-system` mantém fundações; componentes usam subrotas como `/design-system/button`                                     |
| 2026-07-12 | Preservar APIs shadcn existentes durante a adaptação            | Reduz risco para consumidores atuais                                                                                                                | Novas variantes só entram quando visual e semanticamente justificadas                                                         |
| 2026-07-12 | Usar `#facc15` como amarelo forte de warning                    | O amarelo anterior foi rejeitado visualmente                                                                                                        | `vl-warning-strong` e `vl-border-warning` usam o mesmo valor em Light/Dark                                                    |
| 2026-08-19 | Validar a fundação restante por uma página-piloto               | A direção visual já está coberta no Pencil, enquanto o runtime permanece atrás                                                                      | A exploração abstrata é congelada; tokens, primitives e composições passam a ser endurecidos conforme a necessidade do piloto |
| 2026-08-19 | Limitar o piloto à listagem `/vehicles`                         | Uma superfície de leitura exercita a fundação sem misturar formulários e mutations                                                                  | Cadastro, detalhe, edição e exclusão permanecem temporariamente no visual legado                                              |
| 2026-10-09 | Adotar o amarelo "Vivo" `#F8D659` como cor de atenção           | O amarelo pêssego (`#FDF3E6`/`#8C4A11`) do Placar foi rejeitado; entre três intensidades derivadas da base HeroUI, a versão sólida foi a preferida  | O card em atenção usa a cor sólida como fundo com texto quase preto; os chips usam o tom claro; ver `Paleta de cores`         |
| 2026-10-09 | Adotar o cinza neutro `#E4E7EA` para o estado normal            | O cinza `#F1F3F5` ficou apagado ao lado do vermelho e do amarelo sólidos; o usuário preferiu variações de cinza a branco com barra, grafite ou azul | Card e badge normais usam `giro-neutral*`; ver `Paleta de cores`                                                              |
| 2026-10-11 | Descartar o logo atual (`public/logo.svg`) e criar um novo a partir do significado do nome | O usuário não sente que a forma vermelha com recorte de "play" represente o produto; GIRO remete a giroflex e a "dar um giro" pela cidade no atendimento de ocorrências | O logo será ícone + nome, sem vínculo obrigatório com o brasão do CBMGO, desenhado em P&B antes da cor; exploração em `design/logo.pen` |
| 2026-10-11 | Adotar o 2C·7 original (G com base) como símbolo do GIRO | Entre as variações de forma e cor, o usuário preferiu o desenho original: o G é a rota pela cidade e o ponto na boca é a base ou a luz | Variações do 2C·7 ficam como referência; a próxima decisão é a tipografia do nome, explorada no frame `Tipografia · GIRO` |

## Etapas

- [x] Consolidar a fundação inicial e criar o laboratório exploratório em `/design-system`.
- [x] Migrar a especificação visual para `design/design-system.pen`, incluindo fundações Light/Dark.
- [ ] ~~Concluir todos os catálogos restantes no Pencil antes de integrar uma página.~~ **SUBSTITUÍDA:** a fundação visual existente será validada por demanda no piloto.
- [x] Definir e validar o escopo executável da listagem `/vehicles` como página-piloto, incluindo o gate mínimo da fundação no runtime.
- [x] Decompor a especificação da issue #12 em tickets executáveis com dependências explícitas.
- [ ] **ATUAL:** Implementar a issue #13, ativando temas globais e alinhando os tokens do piloto.
- [ ] Implementar a estrutura da listagem na issue #14.
- [ ] Implementar métricas, filtros e cards nas issues #15, #16 e #17, liberadas após a #14.
- [ ] Integrar e validar o piloto na issue #18.
- [ ] Incorporar as descobertas do piloto ao design system e decidir a próxima superfície de produto.

## Estado atual

### Pencil

- Arquivo: `design/design-system.pen`.
- Fundações Light/Dark: cores semânticas, escalas, bordas, tipografia, geometria, elevação e iconografia.
- Catálogo Button Light/Dark: tamanhos, ícones, estados, variantes semânticas, loading, link e button groups.
- Catálogo Forms Light/Dark: inputs, labels, validação, select fechado/aberto, combobox fechado/aberto, checkbox, radio, toggle e composições de switches.
- Catálogo Images Light/Dark: Circle, Square, Rounded, Top, Bottom, Left e Right usando componentes reutilizáveis.
- Catálogo Feedback Light/Dark: Alert semântico, Badges operacionais de tabela (`Operacional`, `Em manutenção`, `Pendente`, `Informativo`, `Crítico` e `Indisponível`) e as composições de Card `default`, `interactive` e `metric`, em paridade com o laboratório React.
- Catálogo Overlays Light/Dark: Dialog de confirmação, Popover de filtros e callouts, Dropdown de ações, Overflow Menu e Tooltip light/dark nas quatro direções.
- Catálogo Navigation Light/Dark: seções independentes e tituladas para quatro top bars, bottom navigation com duas a cinco ações nas variantes icon-only e icon + text, matriz de tabs e composição de tabs de viatura.
- Catálogo Pagination, Data & Bars Light/Dark: paginação `default`, `compact` e `simple`; calendário mensal, date picker e resumo da data; sliders com valor, volume, barra segmentada e escala graduada.
- Catálogo Compositions Light/Dark: composição reutilizável `Frota administrativa`, formada por page header, section header e empty state, em paridade com o laboratório React.
- Primitives visuais são componentes reutilizáveis; catálogos usam instâncias e overrides.
- Exploração `Proto Linear` (2026-10-07): três protótipos de página abaixo do catálogo de Compositions, em estilo linear e sem chanfros, mantendo exatamente os tokens de cor atuais: `Proto Linear / Login` (split à la Untitled UI), `Proto Linear / Viaturas` (shell + métricas, filtros e cards do piloto) e `Proto Linear / Detalhe da viatura`. A primeira versão (Geist puro, sem imagens) foi julgada genérica; a versão atual recupera Bebas Neue para prefixos, números e marca, usa JetBrains Mono em eyebrows e placas, sidebar escura com indicador vermelho, cutouts PNG das viaturas gerados por IA (frame `Proto Linear / Assets`) e foto de garagem no login. Um quarto frame, `Proto Linear / Login B`, segue o frame importado `9 – Login` (Velocity/Figma): formulário leve à esquerda com labels em mono maiúsculo e foto noturna de trilhas de luz vermelhas na metade direita. Para comparação de shell, `Proto Linear / Viaturas (shadcn sidebar-04)` replica o bloco `sidebar-04` do shadcn (sidebar flutuante de 304 px com grupos e submenus, header de 64 px com trigger e breadcrumb) sobre o mesmo conteúdo da listagem, com uma variante `invertido` (sidebar branca sobre app em `vl-background`) porque a sidebar cinza sobre fundo branco pareceu apagada; as sidebars dos protótipos originais passaram a ser claras após o painel escuro ser rejeitado por contraste. `Proto Linear / Viaturas (isométrico)` testa cards mais compactos com a viatura em vista isométrica de frente, em um tile de 132 px à direita da identidade, permitindo três fileiras na mesma altura de página. Nenhum frame antigo foi alterado; a direção chanfrada permanece como referência até o julgamento.
- Exploração de logo (2026-10-11) em `design/logo.pen`, separada da especificação: briefing e quatro direções em P&B, cada variação testada em 64/32/16 px, invertida e com wordmark em Inter e em Bebas Neue. Direções: `01 · G de varredura` (1A suave, 1B angular, 1C farol), `02 · Rota que volta` (2A rota em G, 2B quarteirões, 2C ida e volta), `03 · Rota + luz` (3A cometa, 3B gerado por IA, 3C angular) e `04 · Pião` (4A gerado por IA, 4B geométrico). O usuário preferiu 1A e 2C; os frames `Refino 1A` e `Refino 2C` trazem sete variações de cada (peso, feixe, lâmpada, raios, ícone de app, posição da abertura, forma da base, pista, pontes entre as famílias) e uma faixa de variabilidade com o símbolo girando em passos de 45°. O usuário então podou o arquivo e manteve salvos apenas 1A, 1A·1, 1A·6, 2C, 2C·1, 2C·3 e 2C·7; as rodadas de seta e a primeira rodada de cor (que usava outros ícones) foram removidas. O frame `Cor · ícones salvos` aplica cor somente nesses ícones, como cópias exatas das formas: corpo em vermelho `#DC2626` e destaque (feixe ou base) em preto ou amarelo Vivo, solto sobre branco e em blocos vermelho, escuro e Vivo, além de topbar e favicon; o amarelo Vivo só se sustenta sobre vermelho ou escuro. Na rodada de cor o usuário preferiu o 2C·7 (G com base); o frame `Refino 2C·7 · G com base` traz oito variações (original, base maior, base menor, base na barra, leve, abertura baixa, quartel e luz acesa), cada uma em P&B, solta em vermelho e preto, nos blocos vermelho e escuro com a base em amarelo Vivo, em 32/16 px e com o wordmark. O frame `Tipografia · GIRO` fixa o 2C·7 original e testa o nome em 20 fontes (geométricas, neutras, condensadas, técnicas e expressivas), cada uma grande, em tamanho de topbar e em minúsculas, mais quatro construções: símbolo como G em Outfit e em Bebas Neue, versão empilhada e versão com descritor. Estilo escolhido para avaliação em contexto: 2C·7 em bloco vermelho (`#DC2626`), G branco e base em amarelo Vivo, com o nome em Inter 800 a 20 px e espaçamento −0,5; aplicado na topbar da tela `Placar · A · Logo GIRO (2C·7)` do `design/hero.pen`, cópia de `Placar · A · Viatura maior · 1 · L ao lado do tempo`. Uma versão de feixe largo foi descartada por lembrar um personagem conhecido de videogame. Método e critérios seguem o vídeo *My Process For Creating Memorable Logo Ideas* (Collect & Contrast): adequado ao estilo, simples, distinto, adaptável e variável.

### Frontend

- `src/components/ui/button.tsx` recebeu a identidade Velocity preservando a API existente e acrescentando a escala necessária ao catálogo.
- `/design-system/button` existe somente em desenvolvimento e consome o `Button` compartilhado.
- `/design-system` ainda contém a exploração legada e serve como referência durante a migração.
- A navegação do styleguide usa React Router para rotas e destinos absolutos para âncoras da página principal.
- O suporte global e persistente a tema escuro ainda não foi implementado.

### Paleta de cores

Primeiros tokens de cor criados a partir das explorações do Placar em `design/hero.pen`. O prefixo `giro-` separa a paleta nova das variáveis exploratórias (`rp-`, `sv-`, `sl-`) e de `warning-soft`/`warning-fg`, ainda usadas pela `Guarita — Desktop`.

**Atenção (amarelo)** — base HeroUI Theme Builder: `oklch(0.881 0.146 93.6)` ([link](https://heroui.com/en/themes?hue=93.64915091837305&chroma=0.14619988520400878&lightness=0.8811709763834866)).

| Token                          | Light     | OKLCH aprox.       | Uso                                                                                    | Contraste |
| ------------------------------ | --------- | ------------------ | -------------------------------------------------------------------------------------- | --------- |
| `giro-warning`                 | `#F8D659` | `0.881 0.146 93.6` | Fundo sólido do estado de atenção (ex.: card "em trânsito há muito tempo")             | —         |
| `giro-warning-foreground`      | `#312409` | `0.27 0.045 83.6`  | Texto e ícones sobre `giro-warning`                                                    | 10,6 : 1  |
| `giro-warning-soft`            | `#FCEFBD` | `0.950 0.066 ~94`  | Sem uso no momento; reservado para fundos claros secundários (base a 40% sobre branco) | —         |
| `giro-warning-soft-foreground` | `#312409` | `0.27 0.045 83.6`  | Texto sobre `giro-warning-soft`                                                        | 13,1 : 1  |

**Neutro (cinza)** — estado normal, ao lado do vermelho e do amarelo sólidos. O cinza anterior (`#F1F3F5`, texto secundário `#686D72`, botão rosado) ficou apagado ao lado deles; entre neutro, ardósia (`#CBD3DB`) e pedra (`#E5E0D7`), foi escolhido o neutro.

| Token                     | Light     | Uso                                          | Contraste |
| ------------------------- | --------- | -------------------------------------------- | --------- |
| `giro-neutral`            | `#E4E7EA` | Fundo do card e do badge em estado normal    | —         |
| `giro-neutral-foreground` | `#16191C` | Texto principal e placa sobre `giro-neutral` | 14,2 : 1  |
| `giro-neutral-muted`      | `#4F555B` | Texto secundário sobre `giro-neutral`        | 6,1 : 1   |

- O botão "Registrar chegada" sobre `giro-neutral` usa fundo branco com texto `rp-accent`, como no card crítico; a divisória interna usa `#0000001A`.

- Aplicado no frame `Placar · A · Ilustração do tipo de viatura · CBMGO` (`c7FQJv`); os demais Placares continuam nas variáveis antigas.
- Também foram comparadas as intensidades Suave (`#FEF8E4`) e Médio (`#FCEFBD`); a página de comparação foi removida do canvas após a escolha.
- **Regra de estado:** card e badge da mesma viatura usam a mesma cor, porque indicam o mesmo estado. Em trânsito até 2h → neutro (`giro-neutral` + `giro-neutral-foreground` no card e no badge); acima de 2h → atenção (`giro-warning` + `giro-warning-foreground` no card e no badge); crítico → vermelho. O amarelo nunca significa apenas "em trânsito".
- Pendente: valores Dark de `giro-warning*` e `giro-neutral*`, e se `#F8D659` substitui `#facc15` como warning forte em `design/design-system.pen`.

### Convenções visuais fechadas

- Canto chanfrado é assinatura visual e precisa acompanhar tamanho e função do controle.
- Bordas chanfradas exigem camadas ou paths; borda CSS simples não acompanha `clip-path`.
- Focus usa controle, gap de `1px` e ring externo de `2px` com primary a 25%, sem glow difuso.
- Warning forte e sua borda usam `#facc15`; o valor antigo `#e0b400` não deve retornar.
- Info geral usa `#2563eb` no Light e `#60a5fa` no Dark; a implementação ainda precisa resolver a divergência de `--info-foreground` Light (`#1d4ed8`).
- Switch Off em hover mantém aparência desligada, com fundo e borda discretos; o Dark reduz a intensidade do destaque.

## Débitos e riscos

- Pencil e frontend ainda divergem em alguns tokens, especialmente `info-foreground`, temas e variantes de componentes não implementadas.
- A matriz antiga de componentes permanece dentro de `DesignSystemPage.tsx` e não deve ser copiada para páginas de produto.
- `/design-system/button` ainda não cobre toda a especificação visual do Button no Pencil.
- Forms e Images possuem especificação no Pencil, mas ainda não possuem subrotas executáveis próprias.
- O tema escuro no frontend permanece restrito ao styleguide e não representa ainda a opção final do produto.
- Acessibilidade do Pencil é apenas indicativa; contraste, teclado, nomes acessíveis e estados disabled/loading exigem navegador.
- `npm run lint` global possui falhas preexistentes em Convex e páginas fora deste plano.
- O arquivo `.pen` pode sofrer edições simultâneas; antes de alterar via MCP, reler seleção, IDs e layout para preservar mudanças do usuário.

## Testes e aceite

- Comparar Light/Dark no Pencil e no navegador.
- Validar default, hover, active, focus-visible, disabled, loading, erro e conteúdo longo.
- Confirmar contraste, teclado, labels, ARIA e áreas de toque.
- Validar desktop e mobile.
- Confirmar que rotas do design system não sejam registradas em produção.
- Executar `npm run build` e lint isolado dos arquivos alterados.
- Registrar separadamente falhas preexistentes do lint global.
- Confirmar que nenhuma página de produto além da listagem `/vehicles` foi alterada e que suas regras de negócio e contratos Convex foram preservados.

## Descobertas

- A branch visual concentra identidade nas páginas; consolidar tokens e primitives antes da migração continua necessário.
- Pencil é mais eficiente para explorar matrizes extensas, mas o navegador permanece indispensável para comportamento e acessibilidade.
- Instâncias reutilizáveis e overrides evitam duplicar componentes no `.pen`.
- Paths precisam permanecer dentro do próprio `viewBox`; coordenadas externas distorcem a geometria no Pencil.
- Focus CSS com ring e offset precisa ser representado no Pencil por camadas geométricas explícitas, não por shadow com blur.
- Frames raiz do Pencil usam coordenadas absolutas; ao aumentar um catálogo, os frames seguintes precisam ser reposicionados para preservar o espaçamento.
- Tokens por papel (`warning-strong`, `table-header`, `input-disabled`, `toggle-hover`) evitam valores corretos em Light e incorretos em Dark.
- Alert, Badge e Card podem compartilhar primitives entre Light/Dark quando toda cor estrutural depende de tokens temáticos; os catálogos permanecem separados para comparação visual.
- Ao transportar uma família já definida em `DesignSystemPage.tsx`, o primeiro catálogo no Pencil deve preservar cores, estrutura, conteúdo e variantes existentes; explorações adicionais só entram depois da paridade explícita.
- Fundos semânticos translúcidos podem parecer diferentes no Pencil; para catálogos de comparação, usar a cor opaca resultante sobre `vl-background`, mantendo documentado o token runtime que ela representa.
- Controles lineares no Pencil precisam usar frames sem auto layout para sobrepor trilho, progresso, thumb e rótulo; manter o conjunto dentro do container de 908 px evita clipping e preserva a densidade do laboratório React.
- A sequência vertical dos catálogos segue a taxonomia do laboratório: Overlays, Navigation, Pagination/Data/Bars e Compositions; novas famílias devem deslocar as posteriores mantendo 56 px de intervalo.
- Famílias compostas como Navigation não devem ser condensadas em uma única matriz panorâmica; cada subfamília recebe título e frame próprios, preservando a densidade e as proporções da implementação React.
- A auditoria estrutural do `.pen` encontrou fundações Light/Dark, 158 variáveis, 86 componentes reutilizáveis e nenhum token referenciado sem definição; isso é suficiente para interromper a exploração abstrata e iniciar um piloto.
- A fundação visual está mais madura que o runtime: somente Button possui showcase baseado na primitive real, enquanto tema global e diversas primitives e composições ainda precisam ser consolidados.
- Referências Tailark (landing Quartz) e Untitled UI (log in pages) apontam para uma linguagem linear: bordas de 1px, raio pequeno, superfícies planas, hierarquia por peso tipográfico. Os protótipos `Proto Linear` testam se a identidade Velocity sobrevive à remoção do chanfro mantendo apenas a paleta.
- Protótipos só com tipografia neutra e bordas finas perdem a identidade Velocity; a personalidade volta com Bebas Neue nos números, imagens reais das viaturas e um painel escuro de contraste, mesmo sem o chanfro.
- Amarelo precisa de mais croma que vermelho ou verde para ser lido como amarelo na mesma luminosidade: a 16% sobre branco ele quase desaparece ao lado de cards brancos. Usado sólido, compete em peso com o vermelho crítico; a hierarquia passa a depender também do texto e do conteúdo do card.
- A listagem `/vehicles` é a menor superfície representativa já composta no Pencil: exercita cabeçalho, CTA, métricas, filtros, cards, badges e estado vazio sem introduzir mutations, formulários ou autenticação.

## Ponto de retomada

1. Implementar a issue #13, único ticket sem bloqueios na fronteira atual.
2. Após concluir a #13, implementar a estrutura da listagem na issue #14.
3. Com a #14 concluída, executar as issues #15, #16 e #17.
4. Integrar todas as fatias e executar o gate final na issue #18.
5. Usar as lacunas encontradas no piloto para priorizar o restante do design system.

## Próximo passo

Paleta de cores: definir os valores Dark de `giro-warning*` e `giro-neutral*`, decidir a relação com `#facc15` e seguir criando os tokens `giro-` das demais cores (vermelho, verde, azul) a partir dos Placares. Julgar os três protótipos `Proto Linear` no Pencil e decidir entre manter o chanfro ou adotar a geometria linear; a decisão altera a seção Geometria da referência e as issues #14 a #17. Em paralelo, executar `implement` sobre a issue #13, que não depende dessa decisão. Logo: escolher uma ou duas variações em `design/logo.pen`, refinar a forma em P&B e só então testar cor (vermelho da marca e amarelo "Vivo"); a escolha de acabamento (suave ou angular) acompanha a decisão chanfro × linear.
