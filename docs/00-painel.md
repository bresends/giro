# Painel do projeto

**Última atualização:** 2026-08-19

Este é o ponto de entrada para entender o estado atual do GIRO. Detalhes de execução e decisões ficam nos planos vinculados, sem duplicação neste painel.

## Agora

### Design system Velocity Light

- **Estado:** em andamento
- **Plano:** [Design system Velocity Light](planos/2026-07-11-design-system-velocity-light.md)
- **Etapa atual:** Implementar a [issue #13](https://github.com/bresends/giro/issues/13), ativando temas globais e alinhando os tokens usados pelo piloto `/vehicles`.
- **Resultado esperado:** design system interno validado na listagem de viaturas e pronto para orientar as próximas páginas.

### Retomada

1. Ler a seção `Ponto de retomada` do plano atual.
2. Executar `implement` sobre a issue #13.
3. Seguir para a issue #14 quando a #13 estiver concluída.
4. Executar as issues #15, #16 e #17 após a #14.
5. Integrar e validar o piloto na issue #18.

## Próximos planos

1. [Área administrativa de viaturas](planos/2026-07-11-admin-viaturas.md)
2. [Shell e dashboard administrativo](planos/2026-07-11-shell-e-dashboard-admin.md)
3. [Área administrativa de manutenções](planos/2026-07-11-admin-manutencoes.md)
4. [Área administrativa de problemas](planos/2026-07-11-admin-problemas.md)
5. [Área administrativa de movimentações](planos/2026-07-11-admin-movimentacoes.md)
6. [Operação da guarita](planos/2026-07-11-operacao-guarita.md)
7. [Checklist operacional](planos/2026-07-11-checklist-operacional.md)
8. [Administração de checklists](planos/2026-07-11-admin-checklists.md)
9. [Consolidação visual](planos/2026-07-11-consolidacao-visual.md)

## Bloqueios

- Pencil e frontend ainda divergem em alguns tokens; `info-foreground` Light é o caso conhecido.
- O laboratório React legado ainda duplica especificações que estão migrando para o Pencil.
- `npm run lint` possui erros preexistentes fora do escopo do design system; o lint isolado do styleguide está aprovado.

## Referências rápidas

- [Visão do projeto](01-visao-do-projeto.md)
- [Guia de documentação](02-guia-de-documentacao.md)
- [Referência Velocity Light](referencias/01-velocity-light.md)
- Especificação visual versionada: `design/design-system.pen`
