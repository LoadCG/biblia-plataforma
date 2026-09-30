# Contrato editorial v1

O contrato editorial identifica conteúdo sem acoplar decisões de curadoria à
interface. Até a migração dos JSONs derivados, os campos são opcionais nos tipos
de compatibilidade e podem ser obtidos por `metadadosLegadosDoLivro`.

## Campos

| Campo | Regra |
|---|---|
| `id` | identificador estável e prefixado pelo tipo (`resumo:` ou `plano:`) |
| `versao` | inteiro positivo incrementado quando o conteúdo aprovado muda |
| `status` | `rascunho`, `em-revisao`, `aprovado`, `publicado` ou `arquivado` |
| `tags` | valores controlados, em minúsculas, sem duplicidade |
| `publico` | `iniciante`, `regular`, `tematico` ou `contexto`, quando aplicável |

## Regra de publicação

Somente itens com `status: publicado` podem ser expostos no catálogo. Os dois
planos legados recebem metadados de compatibilidade em `core/content/planos.ts`;
novos planos deverão declarar os campos na fonte antes da integração. A versão
deve ser rastreável ao arquivo-fonte e à decisão registrada na fila de revisão.
