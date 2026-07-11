# Operação da guarita

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Remodelar a experiência operacional da guarita e seus modais sem comprometer velocidade, clareza ou validações de quilometragem.

## Critérios de sucesso

- Layout, resumo, veículos e movimentações seguem o Velocity Light.
- Saída, chegada, edição e cadastro rápido funcionam em desktop e mobile.
- Validações de KM e todas as regras operacionais permanecem intactas.

## Decisões

| Data       | Decisão                                             | Motivo                                                    | Consequência                                                         |
| ---------- | --------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------- |
| 2026-07-11 | Tratar guarita como experiência operacional própria | O público e o contexto de uso diferem do admin            | O layout pode variar, mas consumirá o mesmo design system            |
| 2026-07-11 | Priorizar mobile e ações frequentes                 | A operação exige rapidez e uso em diferentes dispositivos | Controles críticos terão tamanho e hierarquia apropriados para toque |

## Etapas

- [ ] Migrar `GuaritaLayout`, navegação e resumo operacional.
- [ ] Migrar listas, tabelas e estados de veículos e movimentações.
- [ ] Migrar modais de saída, chegada, edição e cadastro rápido.
- [ ] Validar regras de KM, operação mobile, lint e build e registrar a entrega.

## Testes e aceite

- Testar saídas, chegadas, veículos em manutenção, erros e validações de KM.
- Validar fluxo completo por teclado e toque em desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Mapear jornadas críticas e validações presentes em cada modal.
