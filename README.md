# biblia-plataforma

Reescrita da plataforma (site + app) como um código único, usando Expo
Router (React Native + Web). O plano completo de arquitetura — decisões,
motivos e o que ficou em aberto de propósito — está em
[`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md) no repositório do projeto
atual (`Resumo-dos-66-Livros-da-Biblia`); copie esse arquivo para cá
quando for a fonte de verdade única.

## Rodando localmente

```bash
npm install
npm run web      # navegador
npm run android  # emulador/dispositivo Android
npm run ios      # simulador iOS (precisa de macOS)
```

## Estrutura

```
app/                  Rotas (Expo Router — cada arquivo é uma tela)
  _layout.tsx          Layout raiz, importa global.css
  index.tsx             Home (placeholder)

core/                 Lógica e dados, sem depender de nenhuma tela
  types/leitura.ts      Tipos dos dados do usuário (Grifo, CapituloLido, Nota)
  owner.ts               Identidade anônima por dispositivo (vira conta depois)
  repositories/          Um arquivo de interface por entidade + implementações
    GrifosRepository.ts        (interface)
    ProgressoRepository.ts     (interface)
    NotasRepository.ts         (interface)
    local/                     implementações atuais (AsyncStorage)
    index.ts                   único ponto que decide qual implementação usar
  content/                Conteúdo fixo (livros, capítulos) — dados ainda
                           não portados do projeto atual, ver TODO em
                           core/content/livros.ts

components/            Componentes de UI reutilizáveis (ainda vazio)
```

## Por que essa estrutura

- **Repositórios com interface fixa**: nenhuma tela fala diretamente com
  `AsyncStorage`. Toda leitura/escrita de dado do usuário passa por
  `core/repositories/index.ts`. Quando um banco de dados entrar, troca-se
  a implementação ali — nenhuma tela muda.
- **`ownerId` desde o início**: todo grifo/progresso/nota já nasce
  associado a um dono (hoje um UUID anônimo por dispositivo). Isso evita
  uma migração de schema dolorosa quando o login existir.
- **Sem monorepo por enquanto**: é um único app (site, iOS e Android a
  partir do mesmo código via Expo Router), então não há um segundo
  pacote pra separar — só reconsiderar se surgir um segundo app/serviço
  de verdade.

## Cores e tema

As cores em `tailwind.config.js` (prefixo `cor-*` e `genero-*`) foram
portadas 1:1 das variáveis CSS do site atual
(`docs/assets/style.css`, blocos `:root` e `:root[data-tema="escuro"]`).
Uso: `className="bg-cor-fundo dark:bg-cor-fundo-dark"`.

## Próximos passos (nesta ordem)

1. Portar os dados dos 66 livros (`core/content/livros.ts`) e os resumos
   em Markdown, reaproveitando a lógica de parsing de
   `Resumo-dos-66-Livros-da-Biblia/scripts/gerar-site.js`.
2. Telas de conteúdo: `app/resumos/[livro].tsx`,
   `app/biblia/[livro]/[capitulo].tsx`.
3. Rota de API (`app/api/versiculo/[ref]+api.ts`) como proxy/cache da
   bible-api.com.
4. Portar as funcionalidades de usuário (grifar, marcar como lido) para
   as telas, usando os repositórios já prontos em `core/repositories`.
