# biblia-plataforma

Reescrita da plataforma (site + app) como um código único, usando Expo
Router (React Native + Web). O plano completo de arquitetura — decisões,
motivos e o que ficou em aberto de propósito — está em
[`PLANO-PLATAFORMA.md`](./PLANO-PLATAFORMA.md), já copiado pra cá; é a
fonte de verdade única a partir de agora, o projeto antigo
(`Resumo-dos-66-Livros-da-Biblia`) continua com a cópia original só como
histórico.

## Rodando localmente

```bash
npm install
npm run web      # navegador
npm run android  # emulador/dispositivo Android
npm run ios      # simulador iOS (precisa de macOS)
```

**Atenção ao atualizar dependências:** `tailwindcss` está fixado em
`^3.4` (não v4) de propósito — o NativeWind 4.2.6 instalado aqui só
suporta Tailwind v3. Atualizar `tailwindcss` sem também atualizar o
NativeWind quebra o build (`Error: NativeWind only supports Tailwind CSS
v3`) de um jeito que não aparece no `npm install`, só ao rodar/exportar.

## Estrutura

```
app/                  Rotas (Expo Router — cada arquivo é uma tela)
  _layout.tsx          Layout raiz, importa global.css
  index.tsx             Home: lista os 66 livros
  resumos/[livro].tsx   Resumo histórico completo de um livro

core/                 Lógica e dados, sem depender de nenhuma tela
  types/leitura.ts      Tipos dos dados do usuário (Grifo, CapituloLido, Nota)
  owner.ts               Identidade anônima por dispositivo (vira conta depois)
  repositories/          Um arquivo de interface por entidade + implementações
    GrifosRepository.ts        (interface)
    ProgressoRepository.ts     (interface)
    NotasRepository.ts         (interface)
    local/                     implementações atuais (AsyncStorage), com fila
                                por chave (core/repositories/local/fila.ts)
                                pra evitar condição de corrida
    index.ts                   único ponto que decide qual implementação usar
  content/                Conteúdo fixo (os 66 livros e resumos)
    tipos.ts                Tipos (Livro, ResumoCompleto, Secao, FichaItem)
    livros.ts                API pública: `livros`, `obterLivro`, `obterResumo`
    dados/livros.json        Gerado — não editar à mão (ver abaixo)

resumos-biblicos/     Os 66 resumos em Markdown (fonte real do conteúdo)

scripts/
  gerar-conteudo.js    Lê resumos-biblicos/**/*.md e gera
                        core/content/dados/livros.json

components/            Componentes de UI reutilizáveis (ainda vazio)
```

### Atualizando o conteúdo

O conteúdo dos livros mora em `resumos-biblicos/**/*.md`. Depois de editar
qualquer resumo, rode:

```bash
npm run gerar-conteudo
```

Isso regenera `core/content/dados/livros.json`, que é o que o app de
fato lê (`core/content/livros.ts`). Nunca editar esse `.json` na mão —
ele é sobrescrito toda vez que o script roda.

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

1. ~~Portar os dados dos 66 livros e a tela de resumo.~~ Feito.
2. Tela de leitura bíblica: `app/biblia/[livro]/[capitulo].tsx`.
3. Rota de API (`app/api/versiculo/[ref]+api.ts`) como proxy/cache da
   bible-api.com.
4. Ligar as telas às funcionalidades de usuário (grifar, marcar como
   lido) usando os repositórios já prontos em `core/repositories`.
