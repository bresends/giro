# Visão do projeto

## Produto

O GIRO é uma aplicação de gestão de frota do CBMGO. Ela concentra o cadastro e acompanhamento de viaturas, movimentações, manutenções, problemas, checklists e a operação da guarita.

## Públicos

- **Administração:** acompanha a frota, cadastros, alertas, manutenções e problemas.
- **Guarita:** registra saídas, chegadas, condutores, quilometragem e ocorrências operacionais.
- **Equipes operacionais:** preenchem e consultam checklists das viaturas.

## Módulos atuais

- Dashboard administrativo e alertas.
- Viaturas e tipos de viatura.
- Movimentações de saída e chegada.
- Manutenções e registros com rich text.
- Problemas associados a viaturas.
- Checklists operacionais e administração de templates.
- Pessoal e autenticação.

## Plataforma

- React 19 e TypeScript.
- Vite e Tailwind CSS 4.
- Componentes shadcn mantidos localmente.
- Especificação visual do design system versionada em Pencil (`design/design-system.pen`).
- Convex para dados, funções de servidor e autenticação.
- React Router para navegação.

## Princípios de evolução

- Preservar regras de negócio durante mudanças visuais.
- Preferir os padrões e componentes já adotados pelo repositório.
- Migrar fluxos completos para evitar experiências parcialmente remodeladas.
- Tratar acessibilidade, responsividade e estados de interação como critérios de aceite.
- Separar decisão visual, tokens implementados e comportamento: Pencil orienta aparência, CSS fornece tokens e componentes UI governam o runtime.
- Manter documentação suficiente para que uma nova sessão de trabalho retome o contexto sem reconstruir decisões anteriores.
