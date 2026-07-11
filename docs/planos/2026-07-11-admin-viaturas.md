# Área administrativa de viaturas

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Aplicar o design system Velocity Light ao fluxo administrativo completo de viaturas, sem alterar suas regras de negócio.

## Critérios de sucesso

- Listagem, filtros, cards, detalhe, criação e edição usam apenas primitives e tokens do design system.
- Todos os dados, estados e validações atuais continuam funcionando.
- O fluxo está validado em desktop e mobile.

## Escopo

Inclui páginas e componentes do domínio de viaturas. Não inclui o shell administrativo, dashboard, manutenções ou guarita.

## Decisões

| Data       | Decisão                                 | Motivo                                                              | Consequência                                                              |
| ---------- | --------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 2026-07-11 | Tratar viaturas como um fluxo único     | Listagem, detalhe e formulário compartilham navegação e componentes | A entrega só termina quando criar, consultar e editar estiverem coerentes |
| 2026-07-11 | Preservar contratos e regras existentes | Esta iniciativa é exclusivamente visual                             | Nenhuma alteração no schema ou nas funções Convex                         |

## Etapas

- [ ] Migrar listagem, filtros, métricas e cards de viaturas.
- [ ] Migrar a página de detalhe e seus estados operacionais.
- [ ] Migrar os formulários de criação e edição.
- [ ] Validar o fluxo completo em desktop e mobile, executar lint e build e registrar a entrega.

## Testes e aceite

- Testar listagem vazia e preenchida, filtros, navegação, criação, edição, erros e conteúdo longo.
- Confirmar foco, labels, contraste e ausência de regressões funcionais.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Criar um inventário dos componentes de viaturas e mapear cada padrão para uma primitive do design system.
