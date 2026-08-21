import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { parseReferenciaVersiculo } from "../core/biblia/parseReferencia";
import { referenciaDoDia } from "../core/biblia/versiculoDoDia";
import type { CapituloTexto } from "../core/biblia/tipos";
import { compartilhar } from "../core/estatisticas/compartilhador";
import { notasRepository, versiculosSalvosRepository } from "../core/repositories";
import { useColorScheme } from "../core/theme";
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";
import { linkVersiculo } from "../core/util/linkVersiculo";
import { useOwnerId } from "../core/useOwnerId";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { ModalNota } from "./ModalNota";

// Cores dos tokens de tema (tailwind.config.js) — precisam ser valores
// reais aqui (não className) porque `LinearGradient` e o `color` do
// MaterialIcons não aceitam classes Tailwind/dark: então este card,
// diferente do resto do app, não muda de tema sozinho só com CSS.
const GRADIENTE = {
  claro: ["#f3e6d3", "#fdf9f2", "#faf8f4"] as const,
  escuro: ["#40331f", "#241d16", "#141210"] as const,
};
const GRADIENTE_ERRO = {
  claro: ["#f3e6d3", "#faf8f4", "#faf8f4"] as const,
  escuro: ["#332920", "#241d16", "#1b1712"] as const,
};
const COR_DESTAQUE = { claro: "#8a5a2b", escuro: "#e0a75e" };
const COR_ICONE_PADRAO = { claro: "#2a241c", escuro: "white" };

export function CardVersiculoDia() {
  const [referencia] = useState(() => referenciaDoDia());
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const ownerId = useOwnerId();
  const ref = parseReferenciaVersiculo(referencia);
  const [salvo, setSalvo] = useState(false);
  const [notaAberta, setNotaAberta] = useState(false);
  const [notaTexto, setNotaTexto] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const corDestaque = escuro ? COR_DESTAQUE.escuro : COR_DESTAQUE.claro;
  const corIconePadrao = escuro ? COR_ICONE_PADRAO.escuro : COR_ICONE_PADRAO.claro;

  function carregarVersiculo() {
    setCarregando(true);
    setErro(null);
    buscarReferencia(referencia)
      .then(setDados)
      .catch((e) => setErro(mensagemErroAmigavel(e)))
      .finally(() => setCarregando(false));
  }

  useEffect(carregarVersiculo, [referencia]);

  useEffect(() => {
    if (!ownerId || !ref) return;
    versiculosSalvosRepository.estaSalvo(ownerId, ref).then(setSalvo);
    notasRepository.buscar(ownerId, ref).then((nota) => setNotaTexto(nota?.texto ?? ""));
  }, [ownerId, ref?.livroSlug, ref?.capitulo, ref?.versiculo]);

  async function alternarAmem() {
    if (!ownerId || !ref) return;
    setSalvo(await versiculosSalvosRepository.alternar(ownerId, ref));
  }

  function textoParaCompartilhar(): string {
    const link = ref ? linkVersiculo(ref.livroSlug, ref.capitulo, ref.versiculo) : null;
    return `"${dados?.texto ?? ""}"\n\n${dados?.referencia ?? referencia}${link ? `\n${link}` : ""}`;
  }

  const acoesMais: AcaoMenu[] = [
    { label: "Copiar", icone: "content-copy", onPress: () => compartilhar(textoParaCompartilhar()) },
    ...(ref ? [{ label: "Ver capítulo inteiro", icone: "menu-book" as const, onPress: () => router.push(`/biblia/${ref.livroSlug}/${ref.capitulo}?versiculo=${ref.versiculo}`) }] : []),
    ...(ref ? [{ label: "Resumo do livro", icone: "auto-stories" as const, onPress: () => router.push(`/resumos/${ref.livroSlug}`) }] : []),
  ];

  if (erro) {
    return (
      <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-cor-fundo-elevado dark:bg-black">
        <LinearGradient
          colors={escuro ? GRADIENTE_ERRO.escuro : GRADIENTE_ERRO.claro}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full p-5 items-start gap-3"
        >
          <Text className="text-cor-texto/90 dark:text-white/90 text-xs font-semibold uppercase tracking-widest">Versículo do Dia</Text>
          <Text className="text-cor-texto-suave dark:text-white/80 text-sm">{erro}</Text>
          <Pressable onPress={carregarVersiculo} accessibilityRole="button" accessibilityLabel="Tentar novamente" className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 active:opacity-70">
            <Text className="text-cor-texto dark:text-white font-semibold text-sm">Tentar novamente</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-cor-fundo-elevado dark:bg-black">
      {/* Fundo em gradiente de marca, sensível ao tema (claro: creme
          suave a partir de cor-destaque-fundo; escuro: paleta
          "metalizada" original) — antes era uma foto aleatória via
          picsum.photos/Unsplash Source, que podia trazer qualquer
          imagem indexada (inclusive imprópria pro público do app, como
          reportado por um usuário). Sem fonte externa não curada,
          zero risco de conteúdo indevido aparecer aqui. Cores em hex
          (não className) porque LinearGradient não aceita `dark:`. */}
      <LinearGradient
        colors={escuro ? GRADIENTE.escuro : GRADIENTE.claro}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        className="w-full h-[450px]"
      >

        <View className="p-5 flex-1 justify-between">
          {/* Header do Card */}
          <View>
            <Text className="text-cor-texto/90 dark:text-white/90 text-xs font-semibold uppercase tracking-widest mb-1">
              Versículo do Dia
            </Text>
            <Text className="text-cor-texto dark:text-white font-bold text-sm">
              {carregando ? "Carregando..." : dados?.referencia}
            </Text>
          </View>

          {/* Texto Bíblico */}
          <View className="flex-1 justify-center py-4">
            {carregando ? (
              <ActivityIndicator color={corIconePadrao} />
            ) : (
              <Text
                className="text-cor-texto dark:text-white text-xl"
                style={{
                  fontFamily: "serif",
                  lineHeight: 29,
                  ...(escuro
                    ? { textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }
                    : {}),
                }}
              >
                {dados?.texto}
              </Text>
            )}
          </View>

          {/* Actions & Footer */}
          <View>
            <View className="flex-row items-center justify-between mb-5 px-2">
              <Pressable
                onPress={alternarAmem}
                disabled={!ref}
                accessibilityRole="checkbox"
                accessibilityLabel="Salvar este versículo"
                accessibilityState={{ checked: salvo }}
                // @ts-expect-error accessibilityChecked é uma extensão do react-native-web, não existe nos tipos do React Native
                accessibilityChecked={salvo}
                className="flex-1 items-center py-1 active:opacity-60"
              >
                <MaterialIcons name={salvo ? "favorite" : "favorite-border"} size={24} color={salvo ? corDestaque : corIconePadrao} />
                <Text className="text-cor-texto-suave dark:text-white/80 text-xs mt-1">Amém</Text>
              </Pressable>
              <Pressable
                onPress={() => setNotaAberta(true)}
                disabled={!ref}
                accessibilityRole="button"
                accessibilityLabel="Anotar sobre este versículo"
                className="flex-1 items-center py-1 active:opacity-60"
              >
                <MaterialIcons name={notaTexto ? "chat-bubble" : "chat-bubble-outline"} size={24} color={notaTexto ? corDestaque : corIconePadrao} />
                <Text className="text-cor-texto-suave dark:text-white/80 text-xs mt-1">Anotar</Text>
              </Pressable>
              <Pressable
                onPress={() => compartilhar(textoParaCompartilhar())}
                accessibilityRole="button"
                accessibilityLabel="Enviar este versículo"
                className="flex-1 items-center py-1 active:opacity-60"
              >
                <MaterialIcons name="share" size={24} color={corIconePadrao} />
                <Text className="text-cor-texto-suave dark:text-white/80 text-xs mt-1">Enviar</Text>
              </Pressable>
              <Pressable onPress={() => setMenuAberto(true)} accessibilityRole="button" accessibilityLabel="Mais opções" className="flex-1 items-center py-1 active:opacity-60">
                <MaterialIcons name="more-horiz" size={24} color={corIconePadrao} />
                <Text className="text-cor-texto-suave dark:text-white/80 text-xs mt-1">Mais</Text>
              </Pressable>
            </View>

            <Pressable
              disabled
              accessibilityRole="button"
              accessibilityLabel="Enviar versículo diariamente (em breve)"
              accessibilityState={{ disabled: true }}
              className="self-end bg-black/5 dark:bg-white/10 rounded-full px-3.5 py-1.5 items-center justify-center flex-row gap-1.5 opacity-40"
            >
              <MaterialIcons name="notifications-none" size={14} color={corIconePadrao} />
              <Text className="text-cor-texto dark:text-white text-xs font-semibold">Envie-me diariamente (em breve)</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <MenuAcoes acoes={acoesMais} aberto={menuAberto} onFechar={() => setMenuAberto(false)} />

      {ref ? (
        <ModalNota
          visivel={notaAberta}
          versiculo={ref.versiculo}
          textoInicial={notaTexto}
          onFechar={() => setNotaAberta(false)}
          onSalvar={async (texto) => {
            if (!ownerId) return;
            if (texto) {
              await notasRepository.salvar(ownerId, ref, texto);
              setNotaTexto(texto);
            } else {
              await notasRepository.remover(ownerId, ref);
              setNotaTexto("");
            }
            setNotaAberta(false);
          }}
          onRemover={async () => {
            if (!ownerId) return;
            await notasRepository.remover(ownerId, ref);
            setNotaTexto("");
            setNotaAberta(false);
          }}
        />
      ) : null}
    </View>
  );
}
