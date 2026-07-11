# Shell e dashboard administrativo

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Remodelar a estrutura administrativa compartilhada e o dashboard, estabelecendo a experiência Velocity Light para todas as rotas administrativas.

## Critérios de sucesso

- Header, sidebar, layout, login e navegação funcionam em desktop e mobile.
- Dashboard, métricas, alertas e acesso à guarita usam o design system.
- Todas as rotas e regras de autenticação atuais são preservadas.

## Escopo

Inclui shell administrativo, login e dashboard. Não inclui o conteúdo interno das demais páginas de domínio.

## Decisões

| Data       | Decisão                                        | Motivo                                                | Consequência                                                                 |
| ---------- | ---------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| 2026-07-11 | Manter todas as rotas atuais                   | A branch visual não contém módulos recentes           | A navegação será remodelada sem copiar a sidebar de referência integralmente |
| 2026-07-11 | Usar somente a direção Velocity Light no login | A referência possui várias experiências experimentais | Será mantida uma única implementação de login                                |

## Etapas

- [ ] Migrar layout, header, sidebar e navegação responsiva.
- [ ] Migrar login e estados de autenticação.
- [ ] Migrar dashboard, métricas, alertas e acesso à guarita.
- [ ] Validar rotas, responsividade, autenticação, lint e build e registrar a entrega.

## Testes e aceite

- Testar navegação ativa, logout, estados autenticado e não autenticado e todas as rotas da sidebar.
- Validar sidebar e dashboard em desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Mapear dimensões, breakpoints e estados de navegação do shell atual.
