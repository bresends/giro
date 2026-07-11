# Consolidação visual

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Encerrar a remodelagem removendo resíduos do visual antigo e validando a aplicação completa de forma integrada.

## Critérios de sucesso

- Não existem estilos de identidade duplicados que tenham equivalentes no design system.
- Todas as rotas e jornadas críticas foram revisadas em desktop e mobile.
- Nenhuma funcionalidade da branch atual foi perdida durante a remodelagem.
- A documentação registra o resultado e as limitações conhecidas.

## Decisões

| Data       | Decisão                                      | Motivo                                                                  | Consequência                                      |
| ---------- | -------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| 2026-07-11 | Executar consolidação somente após os fluxos | Limpar antes pode remover estilos ainda necessários por páginas antigas | Este plano é o último da sequência de remodelagem |

## Etapas

- [ ] Inventariar estilos inline, cores literais e padrões antigos remanescentes.
- [ ] Remover duplicações e corrigir inconsistências sem alterar comportamento.
- [ ] Executar revisão integrada de rotas, responsividade e acessibilidade.
- [ ] Executar lint e build, registrar a entrega final e atualizar as referências.

## Testes e aceite

- Revisar login, admin, viaturas, manutenções, problemas, movimentações, guarita e checklists.
- Validar desktop, mobile, teclado, conteúdo longo, estados vazios e erros.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Iniciar o inventário somente depois que todos os planos de fluxo estiverem concluídos.
