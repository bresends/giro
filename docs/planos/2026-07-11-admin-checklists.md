# Administração de checklists

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Remodelar a administração, consulta e edição de templates de checklist com uma interface densa e consistente.

## Critérios de sucesso

- Tabs, relatórios, tabelas, dialogs e estados usam o design system.
- O editor de templates permanece funcional e legível.
- A página suporta os dados e estados atuais sem regressões.

## Decisões

| Data       | Decisão                                      | Motivo                                                  | Consequência                                                          |
| ---------- | -------------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 2026-07-11 | Manter administração e editor no mesmo plano | O editor é parte direta do fluxo de gestão de templates | A entrega inclui criar, editar e consultar configurações de checklist |

## Etapas

- [ ] Migrar navegação, métricas, relatórios e tabelas.
- [ ] Migrar dialogs e operações administrativas.
- [ ] Migrar o editor de templates e seus estados.
- [ ] Validar dados densos, responsividade, lint e build e registrar a entrega.

## Testes e aceite

- Testar tabs, filtros, CRUD, editor, estados vazios e erros.
- Validar tabelas e dialogs em desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Separar os fluxos existentes da página e inventariar seus dialogs.
