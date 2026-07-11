# Guia de documentação

## Objetivo

A pasta `docs/` registra o estado do projeto, os planos ativos, as decisões tomadas dentro desses planos, referências duradouras e resumos de entregas. Ela não deve funcionar como diário de sessões nem repetir informação disponível no código.

## Onde registrar cada informação

| Informação                                         | Local                    |
| -------------------------------------------------- | ------------------------ |
| Prioridade e próxima ação                          | `00-painel.md`           |
| Objetivo e limites duradouros do produto           | `01-visao-do-projeto.md` |
| Contexto, decisões e etapas de uma iniciativa      | `planos/`                |
| Especificação estável consultada por vários planos | `referencias/`           |
| Resultado de uma iniciativa concluída              | `entregas/`              |

Decisões nunca recebem um arquivo próprio. Elas permanecem no plano que fornece seu contexto.

## Convenções de nomes

Planos usam a data de criação, que não muda durante sua execução:

```text
AAAA-MM-DD-nome-do-plano.md
```

Entregas usam a data de conclusão:

```text
AAAA-MM-DD-nome-da-entrega.md
```

Documentos estruturais usam prefixos numéricos. Todos os nomes usam letras minúsculas, ASCII e hifens.

## Quando criar um plano

Crie um plano para features, remodelagens, migrações e refactors substanciais. Não crie um plano para uma correção pequena e localizada; registre-a no plano existente apenas quando ela afetar a iniciativa atual.

Cada plano deve produzir uma entrega fechada e verificável. Não use um único plano como roadmap de várias áreas ou páginas independentes. Quando uma iniciativa puder ser entregue, validada ou revertida separadamente, ela deve ter seu próprio plano.

Planos futuros podem ser preparados antecipadamente quando a sequência de entregas já estiver definida. Nesse caso, devem usar o estado `aguardando`, permanecer pequenos e aparecer em ordem na seção `Próximos planos` de `00-painel.md`. Antes de iniciar cada um, revise seu contexto e suas decisões à luz do que foi aprendido nos planos anteriores.

## Modelo de plano

```md
# Nome da iniciativa

**Criado em:** AAAA-MM-DD
**Estado:** aguardando | planejando | em andamento | bloqueado | concluído

## Objetivo

## Critérios de sucesso

## Escopo

### Incluído

### Fora do escopo

## Contexto e referências

## Decisões

| Data | Decisão | Motivo | Consequência |
| ---- | ------- | ------ | ------------ |

## Etapas

- [ ] **ATUAL:** Ação em andamento
- [ ] Próxima ação

## Testes e aceite

## Descobertas

## Próximo passo
```

O plano deve ter somente uma etapa marcada como `ATUAL`. Decisões substituídas não são apagadas: devem ser riscadas ou marcadas como substituídas, com referência para a escolha nova.

As etapas também devem ser atômicas: cada item precisa representar uma mudança implementável e validável. Um plano deve preferencialmente ter entre três e seis etapas; se precisar de muito mais, divida a entrega em novos planos.

## Atualização durante o trabalho

1. Antes de implementar, confirme que o plano ainda representa o trabalho necessário.
2. Registre apenas descobertas que alterem escopo, abordagem ou validação.
3. Atualize checkboxes assim que cada etapa for validada.
4. Ao encerrar uma sessão, identifique a etapa atual e escreva um próximo passo executável.
5. Atualize `00-painel.md` quando prioridade, estado, bloqueio ou próximo passo mudarem.

## Encerramento

Quando todos os critérios de sucesso forem atendidos:

1. Crie um resumo em `entregas/` com objetivo, resultado, mudanças principais, validações e decisões relevantes.
2. Transfira para `referencias/` somente conhecimento que continuará orientando outras iniciativas.
3. Remova o plano operacional de `planos/`.
4. Atualize o painel com a próxima iniciativa.

O checklist detalhado não precisa ser preservado depois da entrega. O resumo deve explicar o que mudou e por que as decisões relevantes foram tomadas.
