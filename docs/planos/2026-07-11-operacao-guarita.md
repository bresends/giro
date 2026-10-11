# Operação da guarita

**Criado em:** 2026-07-11
**Estado:** em andamento

## Objetivo

Remodelar a experiência operacional da guarita e seus modais sem comprometer velocidade, clareza ou validações de quilometragem.

Desde 2026-10-11 a referência visual é a direção "Placar" de `design/hero.pen` (frames `Guarita · Ícones Gravity UI` e `Guarita · Relatório do plantão · 2 Página`, mais a descrição `Descrição do estilo · GIRO`): flat, linear, Inter, cantos arredondados, base fria `#F5F7F9`, vermelho como acento, amarelo Vivo e cinza neutro só para estados, ícones Gravity UI, ilustrações isométricas das viaturas e o logo 2C·7 (`design/logo.pen`).

## Critérios de sucesso

- Layout, resumo, veículos e movimentações seguem a direção Placar de `design/hero.pen`.
- Saída, chegada, edição e cadastro rápido funcionam em desktop e mobile.
- Validações de KM e todas as regras operacionais permanecem intactas.

## Decisões

| Data       | Decisão                                             | Motivo                                                    | Consequência                                                         |
| ---------- | --------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| 2026-07-11 | Tratar guarita como experiência operacional própria | O público e o contexto de uso diferem do admin            | O layout pode variar, mas consumirá o mesmo design system            |
| 2026-07-11 | Priorizar mobile e ações frequentes                 | A operação exige rapidez e uso em diferentes dispositivos | Controles críticos terão tamanho e hierarquia apropriados para toque |
| 2026-10-11 | Implementar a direção Placar de `design/hero.pen` na guarita antes do piloto `/vehicles` | Pedido do usuário; a guarita é a tela mais usada e o desenho está fechado | O admin continua no Velocity por enquanto; tokens `giro-*` e Inter entram globalmente em `src/index.css` |
| 2026-10-11 | Estado dos cards em trânsito: até 2h neutro, acima de 2h amarelo, a partir de 24h vermelho (crítico) | A regra de 2h já estava fechada; o limite do crítico não estava definido | **A confirmar com o usuário** o limite de 24h |
| 2026-10-11 | Relatório do plantão vira página própria (`/guarita/relatorio`) com prévia do documento SEI e escolha de plantão | Desenho `Guarita · Relatório do plantão · 2 Página` | `listShiftMovements` ganha `startMs`/`endMs` opcionais, sem mudar o comportamento padrão; o HTML copiado passa a seguir a prévia |
| 2026-10-11 | Mostrar o usuário logado na topbar via consulta `auth.viewer` | Desenho da topbar; não havia consulta de usuário atual | Consulta nova em `convex/auth.ts` (módulo existente, sem codegen); requer publicar o backend |

## Etapas

- [ ] Aplicar a direção Placar: tokens e fonte, logo, `GuaritaLayout`, cabeçalho, placar de viaturas em trânsito, resumo do plantão e tabela de últimas saídas com versão mobile. *Implementado em 2026-10-11; build aprovado; falta validar no navegador.*
- [ ] Criar a página do relatório do plantão com prévia SEI, escolha de plantão e cópia. *Implementado; falta validar a colagem no SEI.*
- [ ] Restilizar os modais de saída, chegada, edição, cadastro rápido e exclusão sem alterar validações. *Implementado; falta validar fluxos.*
- [ ] **ATUAL:** Validar no navegador (desktop e celular) as jornadas de saída, chegada, edição, exclusão, cadastro rápido e relatório; regras de KM; e registrar a entrega.

## Estado atual

- Código novo: `src/components/giro/` (logo 2C·7, `GiroButton`, ilustrações, estilos de modal e campo), `src/lib/giro.ts` (plantão, estados, formatação), `src/components/guarita/{InTransitBoard,ShiftSummary,RecentMovements,shiftStats,shiftReport,types}`, `src/pages/ShiftReportPage.tsx` e a rota `/guarita/relatorio`.
- Ilustrações exportadas de `design/hero.pen` para `public/viaturas/{ur,abt,vtr,s10,suv,av}.png`. Mapa por tipo em `src/components/giro/VehicleIllustration.tsx`: UR → `ur`, ABT/ABTS → `abt`, ASA → `s10` e AV → `av` (correções do usuário em 2026-10-11); tipos sem desenho usam `vtr`. A AV (sedã de passeio, referência: foto da frota) foi criada no `design/hero.pen` como `Variação D · AV sedã de passeio` no frame `VTR · XL · Variações`, gerada no mesmo padrão isométrico e com a sombra padronizada. `suv` (Comando SUV) está exportada, mas sem tipo associado. A sombra da S10 no `design/hero.pen` (frame `VTR · XL · Variações`) foi padronizada com a da VTR (`#808B94` a 30%, mesma proporção); antes era `#999EA3` a 40% e maior que a das outras viaturas. A do Comando SUV (`#C8C9CC` sólido) também destoa e deve ser padronizada se ela for usada.
- Ícones: `@gravity-ui/icons` (MIT) adicionado às dependências.
- Backend: `auth.viewer` e janela opcional em `listShiftMovements` precisam ser publicados (`npm run dev` ou `npx convex deploy`) antes de abrir as telas.
- `npm run build` aprovado. O lint dos arquivos tocados não tem problemas novos; restam os preexistentes dos modais, de `App.tsx` e de `convex/vehicleMovements.ts`.

## Descobertas

- Em 2026-10-11 o arquivo de design `test.pen` (raiz) foi renomeado para `design/hero.pen`. As edições feitas depois da cópia (sombra da S10 e variação da AV) ficaram só no `test.pen` antigo; a sombra foi reaplicada no `hero.pen` e a variação da AV foi copiada forma por forma do arquivo antigo (114 nós). O `test.pen` da raiz ficou como cópia antiga e não é versionado.

- `EditMovementModal` montava a data em UTC e o horário em hora local: após as 21h (UTC−3) a data aparecia como o dia seguinte e salvar sem mexer gravava a data errada. Corrigido com data local; a prop `appearance="giro"` mantém o visual do admin em `/movements`.
- No modal de chegada, a confirmação era exigida acima de 500 km, mas o aviso e o rótulo "Confirmar mesmo assim" só apareciam acima de 1000 km; o aviso visual agora usa o mesmo limite de 500 km. A regra de envio não mudou.
- A exclusão passou de `alert()` para toast; o botão "Copiar" do cabeçalho foi para a página do relatório, que agora copia resumo e tabela no formato da prévia.
- O texto "Pendente" usa `#b45309` em vez de `#D9730D` do desenho, que tem contraste de cerca de 3:1 em texto de 12 px.

## Testes e aceite

- Testar saídas, chegadas, veículos em manutenção, erros e validações de KM.
- Validar fluxo completo por teclado e toque em desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Publicar o backend, abrir `/guarita` e `/guarita/relatorio` no navegador (desktop e celular) e validar as jornadas da etapa atual; confirmar com o usuário o limite de 24h do estado crítico.
