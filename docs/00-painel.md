# Painel do projeto

**Última atualização:** 2026-10-11

Este é o ponto de entrada para entender o estado atual do GIRO. Detalhes de execução e decisões ficam nos planos vinculados, sem duplicação neste painel.

## Agora

### Design system Velocity Light

- **Estado:** em andamento
- **Plano:** [Design system Velocity Light](planos/2026-07-11-design-system-velocity-light.md)
- **Etapa atual:** Implementar a [issue #13](https://github.com/bresends/giro/issues/13), ativando temas globais e alinhando os tokens usados pelo piloto `/vehicles`.
- **Resultado esperado:** design system interno validado na listagem de viaturas e pronto para orientar as próximas páginas.
- **Paleta de cores:** amarelo de atenção `#F8D659` ("Vivo") e cinza neutro `#E4E7EA` escolhidos e transformados nos primeiros tokens `giro-warning*` e `giro-neutral*`; próximo: valores Dark e demais cores (ver seção `Paleta de cores` do plano).
- **Logo:** o logo atual será substituído; quatro direções em P&B (giroflex, rota pela cidade, rota + luz e pião) estão em `design/logo.pen`. Próximo: escolher uma ou duas variações para refinar.
- **Decisão pendente:** julgar os protótipos `Proto Linear` (login, viaturas e detalhe) em `design/design-system.pen`, que trocam o chanfro por geometria linear mantendo a paleta.

### Guarita e checklist na direção Placar

- **Estado:** em andamento (prioridade definida pelo usuário em 2026-10-11)
- **Planos:** [Operação da guarita](planos/2026-07-11-operacao-guarita.md) e [Checklist operacional](planos/2026-07-11-checklist-operacional.md)
- **Referência:** telas da guarita, do relatório do plantão e do checklist em `design/hero.pen`; logo 2C·7 em `design/logo.pen`.
- **Situação:** guarita, relatório do plantão, modais e checklist implementados; `npm run build` aprovado.
- **Próximo passo:** publicar o backend (`auth.viewer` e janela de `listShiftMovements`) e validar as telas no navegador, desktop e celular.

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
