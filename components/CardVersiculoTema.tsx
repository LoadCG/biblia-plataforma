import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import type { CapituloTexto } from "../core/biblia/tipos";
import { livros } from "../core/content/livros";
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";

function getLinkHref(ref: string): any {
  const match = ref.match(/(.+?)\s+(\d+):(\d+)/);
  if (!match) return null;
  const nomeLivro = match[1].trim();
  const capitulo = match[2];
  const versiculo = match[3];

  const chaveNormalizada = nomeLivro.toLowerCase().replace(/[.\s]/g, "");
  
  const livro = livros.find(
    (l) => l.nome.toLowerCase() === nomeLivro.toLowerCase() || 
           (l.abreviacao && l.abreviacao === chaveNormalizada)
  );
  if (!livro) return null;

  return `/biblia/${livro.slug}/${capitulo}?versiculo=${versiculo}`;
}

export function CardVersiculoTema({ referencia }: { referencia: string }) {
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setDados(null);
    setErro(null);
    buscarReferencia(referencia)
      .then(setDados)
      .catch((e) => setErro(mensagemErroAmigavel(e)));
  }, [referencia]);

  const href = getLinkHref(referencia);

  const conteudo = (
    <View
      className="rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-3.5 mb-2.5 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      {erro ? (
        <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark">{erro}</Text>
      ) : !dados ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text className="text-cor-texto dark:text-cor-texto-dark italic leading-6">{dados.texto}</Text>
          <Text className="text-xs font-semibold text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1.5">
            {dados.referencia}
          </Text>
        </>
      )}
    </View>
  );

  if (href && dados) {
    return (
      <Link href={href} asChild>
        <Pressable>{conteudo}</Pressable>
      </Link>
    );
  }

  return conteudo;
}
