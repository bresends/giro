# Referência visual Velocity Light

## Direção

Velocity Light é a linguagem visual escolhida para a remodelagem do GIRO. A branch `origin/feat/velocity-light-design-system` é uma referência de composição e identidade, não uma fonte para copiar componentes integralmente.

A estética é clara, plana, angular e inspirada em motorsport e interfaces táticas. A interface deve continuar sendo uma ferramenta operacional densa, legível e eficiente.

## Identidade

| Papel                 | Referência                                   |
| --------------------- | -------------------------------------------- |
| Fundo da página       | `#f7f7f7`, com listras diagonais muito sutis |
| Superfície            | `#ffffff`                                    |
| Marca e ação primária | `#dc2626`                                    |
| Hover da marca        | `#b91c1c`                                    |
| Dados e links         | `#2563eb`                                    |
| Texto primário        | `#1a1a1a`                                    |
| Texto secundário      | `#999999`                                    |
| Borda                 | `rgba(0, 0, 0, 0.06)`                        |
| Sucesso               | `#16a34a`                                    |
| Atenção               | `#ca8a04`                                    |
| Manutenção            | `#ea580c`                                    |
| Erro e criticidade    | `#dc2626`                                    |

Esses valores são referências de design. A implementação deve expô-los por tokens semânticos, sem espalhar hexadecimais pelos componentes.

## Tipografia

- **Bebas Neue:** marca, títulos de página, prefixos de viaturas e números de destaque.
- **Barlow:** corpo, descrições, formulários e conteúdo geral.
- **Barlow Condensed:** navegação, labels, badges e metadados.
- **Menlo ou fallback monospace:** quilometragem e números de processo.

Padrões principais:

- Título de página: Bebas Neue, aproximadamente 28px, acompanhado de marcador vermelho discreto.
- Label de seção: Barlow Condensed semibold, caixa alta e espaçamento amplo.
- Label de campo: Barlow Condensed semibold, aproximadamente 10px, caixa alta.
- Corpo: Barlow entre 13px e 15px.
- Número de métrica: Bebas Neue com destaque, sem redimensionamento baseado na largura da viewport.

## Geometria

O canto chanfrado é o elemento de assinatura. Ele deve ser implementado por uma classe CSS reutilizável e uma variável como `--corner-cut`, não por objetos inline repetidos.

Tamanhos de referência:

| Elemento                | Corte |
| ----------------------- | ----- |
| Badge                   | 4px   |
| Botão pequeno e ícone   | 6px   |
| Input e ação da sidebar | 8px   |
| Card e painel           | 10px  |
| Ação primária ampla     | 12px  |
| Painel de login         | 16px  |

Sombras não definem a estrutura. Superfícies usam borda sutil; sombra moderada pode indicar hover ou elevação temporária.

## Estados semânticos

| Tom        | Usos comuns                   | Fundo sugerido               | Texto sugerido |
| ---------- | ----------------------------- | ---------------------------- | -------------- |
| Sucesso    | ativa, concluída, resolvida   | verde com 8% de opacidade    | verde          |
| Atenção    | pendente, em andamento, média | amarelo com 8% de opacidade  | âmbar          |
| Manutenção | manutenção, corretiva, alta   | laranja com 8% de opacidade  | laranja        |
| Informação | operacional, baixa, dados     | azul com 8% de opacidade     | azul           |
| Neutro     | backup, fechado, indisponível | preto com 4% de opacidade    | cinza          |
| Perigo     | cancelada, crítica, erro      | vermelho com 8% de opacidade | vermelho       |

O significado deve ser representado por variantes como `success`, `warning`, `danger`, `info` e `neutral`. Componentes de domínio fazem o mapeamento entre seus estados e esses tons.

## Temas, comportamento e acessibilidade

- Tema claro e tema escuro fazem parte da entrega do design system.
- A preferência deve oferecer `claro`, `escuro` e `sistema`, com persistência e sem flash perceptível do tema incorreto.
- Tokens semânticos mantêm o mesmo papel entre temas; valores literais não devem ser espalhados pelos componentes.
- Foco visível deve ser mantido em todos os controles.
- Cor não pode ser o único indicador de estado.
- Áreas interativas devem manter tamanho adequado para toque.
- Conteúdo longo não pode deslocar controles nem ultrapassar seus containers.
- Fluxos administrativos devem privilegiar leitura, comparação e ações repetidas.
- As fontes serão carregadas pelo Google Fonts, com fallbacks locais funcionais.

## Relação entre design e implementação

- `design/design-system.pen` registra a especificação visual, matrizes de variantes e comparação Light/Dark.
- `src/index.css` contém os tokens efetivamente disponíveis no frontend.
- `src/components/ui/` contém as APIs, o comportamento e a acessibilidade dos componentes reais.
- As rotas `/design-system` validam a implementação e não substituem o Pencil como canvas de exploração.
- Nenhuma sincronização Pencil → código deve ser aceita sem revisão de diff e validação no navegador.

## Uso da branch de referência

Ao consultar `origin/feat/velocity-light-design-system`:

- Aproveite composição, hierarquia e direção visual.
- Não substitua arquivos atuais pelos da branch.
- Preserve recursos adicionados posteriormente, incluindo comboboxes, validações de KM, movimentações, checklists e rich text.
- Não copie as variantes experimentais de login; somente a direção Velocity Light é relevante.
- Prefira tokens, Tailwind e variantes CVA a estilos inline.
