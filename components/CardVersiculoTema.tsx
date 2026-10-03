import { useEffect, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { EstadoCarregando } from "./EstadoCarregando";
import { EstadoErro } from "./EstadoErro";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { hrefReferenciaBiblica } from "../core/biblia/parseReferencia";
import type { CapituloTexto } from "../core/biblia/tipos";
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";
import { IconeUI } from "./icone/IconeUI";

export function CardVersiculoTema({ referencia }: { referencia: string }) {
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    setDados(null);
    setErro(null);
    buscarReferencia(referencia)
      .then((valor) => { if (ativo) setDados(valor); })
      .catch((e) => { if (ativo) setErro(mensagemErroAmigavel(e)); });
    return () => { ativo = false; };
  }, [referencia, tentativa]);

  const href = hrefReferenciaBiblica(referencia);

  const conteudo = (
    <View
      className="rounded-2xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark px-4 py-4 mb-3 shadow-sm"
      style={{ shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } }}
    >
      {erro ? (
        <EstadoErro titulo="Versículo indisponível" descricao={erro} aoTentarNovamente={() => setTentativa((valor) => valor + 1)} />
      ) : !dados ? (
        <EstadoCarregando rotulo="Carregando versículo" className="py-4" />
      ) : (
        <>
          <Text className="text-cor-texto dark:text-cor-texto-dark italic leading-6">{dados.texto}</Text>
          <View className="mt-3 pt-2.5 border-t border-cor-borda/70 dark:border-cor-borda-dark flex-row items-center justify-between gap-3">
            <Text className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark">
              {dados.referencia}
            </Text>
            {href ? <IconeUI name="open-book" size={18} /> : null}
          </View>
        </>
      )}
    </View>
  );

  if (href && dados) {
    return (
      <Link href={href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityHint={`Abre ${dados.referencia} na Bíblia`}
          className="active:opacity-80 focus-visible:ring-2 focus-visible:ring-cor-destaque dark:focus-visible:ring-cor-destaque-dark rounded-2xl"
        >
          {conteudo}
        </Pressable>
      </Link>
    );
  }

  return conteudo;
}
