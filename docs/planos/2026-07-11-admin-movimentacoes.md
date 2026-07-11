# Área administrativa de movimentações

**Criado em:** 2026-07-11
**Estado:** aguardando

## Objetivo

Aplicar o Velocity Light à consulta administrativa de movimentações, priorizando leitura e comparação de dados operacionais.

## Critérios de sucesso

- Métricas, filtros, tabela, ações e anomalias usam o design system.
- A tabela continua legível em telas menores sem perder ações essenciais.
- Edição, exclusão e estados atuais permanecem funcionais.

## Decisões

| Data       | Decisão                                           | Motivo                                    | Consequência                                                        |
| ---------- | ------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| 2026-07-11 | Tratar a tabela como superfície operacional densa | Comparação é a principal tarefa da página | Densidade e legibilidade terão prioridade sobre composição em cards |

## Etapas

- [ ] Migrar métricas e filtros.
- [ ] Migrar tabela, estados, anomalias e ações.
- [ ] Migrar dialogs associados à administração de movimentos.
- [ ] Validar dados densos, responsividade, lint e build e registrar a entrega.

## Testes e aceite

- Testar filtros, registros normais e anômalos, ações e estados vazios.
- Validar teclado, overflow e ações em desktop e mobile.
- Executar `npm run lint` e `npm run build`.

## Próximo passo

Identificar colunas obrigatórias e comportamento responsivo atual da tabela.
