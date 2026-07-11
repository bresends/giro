# Área administrativa de manutenções

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Aplicar o Velocity Light ao fluxo completo de manutenções, preservando alertas, estados e rich text.

## Critérios de sucesso

- Listagem, tabela, detalhe, criação e edição seguem o design system.
- TipTap e a renderização do conteúdo existente continuam funcionando.
- Estados e tipos de manutenção permanecem semanticamente claros.

## Decisões

| Data       | Decisão                              | Motivo                                               | Consequência                                            |
| ---------- | ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------- |
| 2026-07-11 | Preservar TipTap sem trocar o editor | A remodelagem não deve alterar a autoria de conteúdo | Somente container, toolbar e tipografia serão adaptados |

## Etapas

- [ ] Migrar listagem, filtros, tabela e badges.
- [ ] Migrar detalhe e renderização rich text.
- [ ] Migrar criação, edição e estados de validação.
- [ ] Validar o fluxo, lint e build e registrar a entrega.

## Testes e aceite

- Testar estados, tipos, conteúdo rich text, formulários e navegação.
- Validar desktop, mobile e conteúdo longo.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Inventariar estados e componentes específicos de manutenção.
