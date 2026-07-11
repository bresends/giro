# Área administrativa de problemas

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Remodelar o fluxo de problemas de viaturas com estados e severidades consistentes com o design system.

## Critérios de sucesso

- Listagem, filtros, cards, detalhe e formulários usam os padrões Velocity Light.
- Status e severidade usam tons semânticos compartilhados.
- Comportamento e dados atuais são preservados.

## Decisões

| Data       | Decisão                                        | Motivo                                           | Consequência                                                     |
| ---------- | ---------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| 2026-07-11 | Mapear estados do domínio para tons semânticos | Evita variantes visuais específicas e duplicadas | Componentes do domínio controlam o mapeamento, não as primitives |

## Etapas

- [ ] Migrar badges, cards, listagem e filtros.
- [ ] Migrar a página de detalhe.
- [ ] Migrar formulários e estados de erro.
- [ ] Validar o fluxo, lint e build e registrar a entrega.

## Testes e aceite

- Testar todas as combinações de status e severidade.
- Validar criação, edição, conteúdo longo, desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Mapear status e severidades atuais para os tons do design system.
