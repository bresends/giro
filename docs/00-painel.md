# Painel do projeto

**Última atualização:** 2026-07-11

Este é o ponto de entrada para entender o estado atual do GIRO. Detalhes de execução e decisões ficam nos planos vinculados, sem duplicação neste painel.

## Agora

### Design system Velocity Light

- **Estado:** em andamento
- **Plano:** [Design system Velocity Light](planos/2026-07-11-design-system-velocity-light.md)
- **Etapa atual:** Fechar tokens e comportamentos após validar o laboratório em tema claro, tema escuro, desktop e mobile.
- **Resultado esperado:** design system interno validado e pronto para ser consumido pelas páginas.

### Retomada

1. Ler a seção `Ponto de retomada` do plano atual.
2. Levantar cores literais no arquivo único `DesignSystemPage.tsx`.
3. Validar modos claro/escuro e responsividade.
4. Finalizar tokens antes de iniciar a adaptação dos componentes UI base.

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

- O laboratório cresceu em um único arquivo e precisa ser modularizado antes de continuar com segurança.
- `npm run lint` possui erros preexistentes fora do escopo do design system; o lint isolado do styleguide está aprovado.

## Referências rápidas

- [Visão do projeto](01-visao-do-projeto.md)
- [Guia de documentação](02-guia-de-documentacao.md)
- [Referência Velocity Light](referencias/01-velocity-light.md)
