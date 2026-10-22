# Relatório de qualidade de configurações e privacidade

Data: 2026-10-21
Frente: configurações, exportação local e transparência de privacidade

## Planejamento e checkpoints

| Checkpoint | Objetivo | Estado |
|---|---|---|
| CP1. Reconhecimento | Ler instruções do repositório e a referência exata do Expo SDK 57; mapear Configurações, Dados e privacidade e o fluxo de exportação/exclusão. | Concluído |
| CP2. Auditoria | Procurar falhas simples de UX, acessibilidade e segurança sem duplicar a frente anterior de concorrência na exclusão. | Concluído |
| CP3. Correções pequenas | Melhorar a retenção do arquivo exportado no navegador e explicar ao usuário que o backup pode conter dados pessoais. | Concluído |
| CP4. Verificação | Executar checagens direcionadas e registrar limites que ainda pedem validação manual. | Concluído para checks estáticos |

## Achados e alterações

1. **Exportação web:** `URL.revokeObjectURL` era chamado imediatamente após `link.click()`. Alguns navegadores ainda processam o download depois do clique, então a revogação imediata podia interromper a gravação. O link agora é anexado temporariamente ao documento, acionado e removido; a URL do objeto é revogada após um segundo.
2. **Aviso sobre o backup:** a página de privacidade explicava que os dados ficam no aparelho, mas não ajudava a proteger a cópia exportada. Foi incluída uma seção informando que o JSON pode conter notas, grifos, preferências e progresso, e recomendando guardar o arquivo em local privado.
3. **Exclusão local:** não foram feitas alterações nesta lógica, pois a correção concorrente está registrada separadamente em `docs/PLANO-CONFIGURACOES.md` e em `core/util/dadosPessoais.ts`.

## Verificações

| Comando | Resultado |
|---|---|
| `npm run typecheck` | Passou. |
| `npm run check:a11y` | Passou: 111 contratos críticos. |
| `npm run check:copy-ui` | Passou: 134 fontes verificadas, sem padrões internos sinalizados. |
| `git diff --check -- app/configuracoes.tsx app/privacidade.tsx` | Passou; Git emitiu apenas aviso de normalização LF/CRLF para `app/privacidade.tsx`. |

## Limites e próximos passos

- A checagem do download foi estática. O comportamento ainda deve ser conferido em pelo menos Chromium e Firefox, em desktop e em aparelho, incluindo o compartilhamento nativo.
- Não foi realizado teste com leitor de tela; os checks automáticos apenas confirmam contratos estruturais.
- A página é uma explicação funcional do armazenamento, não uma política jurídica nem uma promessa de segurança do diretório escolhido pelo usuário.
- O JSON exportado não é criptografado. A mensagem informa o conteúdo e recomenda cuidado, mas uma opção de senha exigiria decisão de produto e desenho próprio para recuperação da cópia.

Checkpoint concluído para auditoria e alterações pequenas. Não houve alteração de dependências, pacote ou schema de armazenamento.
