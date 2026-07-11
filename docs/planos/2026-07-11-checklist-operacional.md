# Checklist operacional

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Aplicar o Velocity Light ao preenchimento de checklists, mantendo o fluxo claro e eficiente em dispositivos móveis.

## Critérios de sucesso

- Seleção, preenchimento, orientações, estados e envio usam o design system.
- Conteúdo extenso e diferentes quantidades de itens não quebram o layout.
- Regras de preenchimento e validação atuais permanecem funcionais.

## Decisões

| Data       | Decisão                  | Motivo                                  | Consequência                                                             |
| ---------- | ------------------------ | --------------------------------------- | ------------------------------------------------------------------------ |
| 2026-07-11 | Priorizar o fluxo mobile | O checklist é uma atividade operacional | Layout, controles e mensagens serão validados primeiro em telas pequenas |

## Etapas

- [ ] Migrar seleção e contexto inicial do checklist.
- [ ] Migrar itens, campos, orientações e estados de validação.
- [ ] Migrar revisão, envio e feedback de conclusão.
- [ ] Validar conteúdo variável, mobile, lint e build e registrar a entrega.

## Testes e aceite

- Testar checklist vazio, parcial, completo, inválido e com conteúdo longo.
- Validar toque, teclado, rolagem e ausência de sobreposição.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Mapear etapas e estados possíveis do preenchimento atual.
