// TODO (próximo passo, fora do escopo da estrutura inicial): portar os
// dados reais dos 66 livros. A fonte da verdade hoje é o projeto antigo:
//   - Resumo-dos-66-Livros-da-Biblia/scripts/gerar-site.js
//     (ALIASES_LIVRO, CAPITULOS_POR_LIVRO, generoDoLivro)
//   - Resumo-dos-66-Livros-da-Biblia/resumos-biblicos/**/*.md
//     (os 66 resumos históricos em si)
//
// O plano é gerar `livros.json` (dados estruturados) a partir desses
// arquivos .md num script de build, do mesmo jeito que o projeto atual já
// faz — só troca "gerar HTML" por "gerar dados tipados" que os
// componentes desta pasta app/ consomem.
import type { Livro } from "./tipos";

export const livros: Livro[] = [];
