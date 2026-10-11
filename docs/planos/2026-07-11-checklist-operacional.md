# Checklist operacional

**Criado em:** 2026-07-11
**Estado:** em andamento

## Objetivo

Aplicar a direção Placar de `design/hero.pen` ao preenchimento de checklists, mantendo o fluxo claro e eficiente em dispositivos móveis. Referência: frames `Checklist · Mobile · 1 Viatura identificada`, `Checklist · 2 Conferência · B+A · Cartão da viatura` e `Checklist · 3 Enviado · Destaque 2 · Viatura`.

## Critérios de sucesso

- Seleção, preenchimento, orientações, estados e envio usam o design system.
- Conteúdo extenso e diferentes quantidades de itens não quebram o layout.
- Regras de preenchimento e validação atuais permanecem funcionais.

## Decisões

| Data       | Decisão                  | Motivo                                  | Consequência                                                             |
| ---------- | ------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| 2026-07-11 | Priorizar o fluxo mobile | O checklist é uma atividade operacional | Layout, controles e mensagens serão validados primeiro em telas pequenas |
| 2026-10-11 | Fluxo em três passos: viatura e papel → conferência → enviado | Desenho do `design/hero.pen` | A página passa a ter passos; regras de envio (`submitChecklist`) não mudam |
| 2026-10-11 | Mostrar "enviado às HH:MM por X" por papel usando `listDailyStatus` do plantão | A consulta já existe | Sem mudança de backend |
| 2026-10-11 | Exibir o roteiro como seções numeradas a partir do HTML do template (títulos → seções, itens de lista → itens) | O template é texto rico; o desenho mostra itens numerados | Se o template não tiver listas, o texto rico é exibido como antes; nada é persistido além do resultado |

## Etapas

- [ ] Migrar seleção da viatura (QR ou manual) e do papel com status do dia. *Implementado em 2026-10-11; falta validar no navegador.*
- [ ] Migrar conferência: cartão da viatura, orientações gerais (recolhíveis), roteiro, resultado e aviso SEI. *Implementado; falta validar com templates reais.*
- [ ] Migrar tela de enviado com resumo. *Implementado.*
- [ ] **ATUAL:** Validar no celular os três passos com templates reais (com e sem listas, conteúdo longo), QR code (`?vehicleId=`), função sem viatura e template ausente; registrar a entrega.

## Estado atual

- `src/pages/ChecklistPage.tsx` reescrita em três passos; `src/components/checklist/parseRoteiro.ts` converte o HTML do template em seções numeradas e devolve `null` quando não há listas (a página mostra o texto rico).
- O texto "Orientações gerais" foi mantido, recolhível, na conferência.
- O cartão da viatura usa `vehicles.list` (marca, ano, KM atual, próxima manutenção, situação); o status por papel usa `listDailyStatus` do plantão atual; o resumo mostra o usuário de `auth.viewer`.
- `npm run build` aprovado.

## Testes e aceite

- Testar checklist vazio, parcial, completo, inválido e com conteúdo longo.
- Validar toque, teclado, rolagem e ausência de sobreposição.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Publicar o backend e validar os três passos no celular com templates reais.
