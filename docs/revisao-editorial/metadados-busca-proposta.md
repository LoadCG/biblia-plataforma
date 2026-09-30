# Proposta de metadados editoriais e termos de busca

- **Status:** proposta conceitual; não integrada ao schema ou à interface
- **Escopo inicial:** 12 resumos revisados nos lotes C1/C2 e dois planos em
  rascunho (7 e 14 dias)
- **Data:** 2026-09-28
- **Revisão:** precisa de validação editorial e técnica antes da implementação

## Regras da taxonomia

- Usar identificadores estáveis em `kebab-case`, sem acentos; exibir rótulos
  em português com acentuação correta.
- Separar **tema** (ideia textual), **gênero** (forma literária), **pessoa**,
  **lugar** e **termo de busca**. Um sinônimo serve para encontrar um item,
  mas não vira necessariamente uma afirmação editorial sobre o texto.
- Associar tema a um livro quando houver presença relevante, não por menção
  isolada. O vínculo deve apontar para passagens representativas.
- Normalizar caixa e acentos durante a busca, preservando a grafia de exibição.
- Não inferir doutrina ou aplicação pessoal a partir de uma busca temática.
- Evitar recomendações automáticas de “leia também” antes de aprovar os
  vínculos e observar os resultados no app.

## Vocabulário controlado inicial

| ID | Rótulo | Termos de busca associados | Observação |
|---|---|---|---|
| alianca | Aliança | pacto, compromisso, nova aliança | Distinguir usos em tradições e textos diferentes. |
| apocaliptica | Literatura apocalíptica | apocalipse, visões, fim dos tempos | Gênero; não promete um cronograma escatológico único. |
| comunidade | Comunidade | povo, igreja, vida comunitária | “Igreja” não deve ser aplicado indistintamente a Israel antigo. |
| criacao | Criação | mundo, origem, nova criação | Pode referir-se a criação e renovação; preservar o subtipo no resultado. |
| culto | Culto e oração | adoração, oração, louvor, liturgia | Diferenciar poesia individual e prática comunitária. |
| discipulado | Discipulado | seguir Jesus, formação, missão | Principalmente textos cristãos do Novo Testamento. |
| esperanca | Esperança | consolo, restauração, futuro | Indicar passagem/contexto junto ao resultado. |
| exilio | Exílio e retorno | Babilônia, deportação, retorno | Não tratar todos os textos como se viessem do mesmo período. |
| fe | Fé e confiança | crer, confiança, fidelidade | Termo polissêmico; mostrar o contexto da passagem. |
| justiça | Justiça | equidade, direito, pobres, vulnerabilidade | Não converter resultados de busca em aconselhamento jurídico. |
| libertacao | Libertação | opressão, êxodo, resgate | Incluir contexto político, narrativo e teológico. |
| misericordia | Misericórdia | compaixão, perdão, cuidado | Manter referências e objeto da compaixão explícitos. |
| missao | Missão | envio, testemunho, anúncio | Termo de recepção e ação comunitária no contexto cristão. |
| oracao | Oração | lamento, súplica, gratidão, salmo | Lamento é categoria própria; não reduzir a oração a confiança positiva. |
| profecia | Profecia | profeta, oráculo, denúncia, promessa | Distinguir profecia antiga de previsão moderna. |
| reino | Reino de Deus | Reino dos céus, reinado, governo de Deus | “Reino dos céus” e “Reino de Deus” variam por livro/contexto. |
| sabedoria | Sabedoria | prudência, instrução, discernimento | Não transformar provérbios em promessas automáticas. |
| sofrimento | Sofrimento e lamento | dor, perda, medo, luto | Resultado deve evitar culpabilização e soluções clínicas. |
| vida | Vida | vida eterna, vida no Espírito, ressurreição | Subtipos devem evitar misturar usos distintos. |

## Mapa editorial proposto

| Livro | Temas principais propostos | Gênero / termos específicos |
|---|---|---|
| Gênesis | criação, promessa, família, aliança | narrativa, patriarcas, origens |
| Êxodo | libertação, aliança, justiça, culto | narrativa, lei, Pessach, tabernáculo |
| Salmos | oração, sofrimento, esperança, culto | poesia, lamento, louvor, Saltério |
| Provérbios | sabedoria, justiça, fala, escolhas | sabedoria, instrução, prudência |
| Isaías | justiça, profecia, exílio, esperança | oráculos, Servo, restauração |
| Jeremias | profecia, lamento, exílio, aliança | oráculos, Baruque, nova aliança |
| Mateus | Jesus, reino, discipulado, justiça | evangelho, Sermão do Monte, parábolas |
| João | Jesus, vida, fé, amor | evangelho, Palavra, sinais, discursos |
| Lucas | Jesus, misericórdia, pobres, oração | evangelho, parábolas, reversão |
| Atos | comunidade, missão, Espírito, pertencimento | narrativa, testemunho, Paulo, gentios |
| Romanos | fé, graça, justiça, Israel | carta, Paulo, gentios, Lei |
| Apocalipse | esperança, resistência, juízo, nova criação | apocalipse, visões, sete comunidades |

## Planos em rascunho

- **Primeiros passos: da criação à esperança (7 dias):** criação, promessa,
  libertação, oração, justiça, discipulado e ressurreição.
- **Justiça, cuidado e esperança (14 dias):** dignidade, libertação, justiça,
  descanso, lamento, aliança, misericórdia, comunidade e nova criação.

Os planos devem permanecer fora do catálogo até revisão independente. Seus
temas servem para descrever a trilha inteira; cada dia deve exibir suas próprias
referências para não sugerir que todos os temas aparecem em todos os trechos.

## Próxima validação técnica/editorial

1. Confirmar IDs, rótulos e separação entre tema/gênero com editores humanos.
2. Confirmar nomes de campo e compatibilidade com a busca offline existente.
3. Prototipar em fonte/derivado sem expor metadados de rascunhos ao catálogo.
4. Conferir resultados com consultas de usuário reais e sinônimos com falsos
   positivos; ajustar a taxonomia antes de recomendar conteúdos relacionados.
5. Registrar versão, responsável e referências representativas para cada
   vínculo aprovado.
