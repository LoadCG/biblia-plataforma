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
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";
import { linkVersiculo } from "../core/util/linkVersiculo";
import { useOwnerId } from "../core/useOwnerId";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { ModalNota } from "./ModalNota";

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
    { label: "Copiar", onPress: () => compartilhar(textoParaCompartilhar()) },
    ...(ref ? [{ label: "Ver capítulo inteiro", onPress: () => router.push(`/biblia/${ref.livroSlug}/${ref.capitulo}?versiculo=${ref.versiculo}`) }] : []),
    ...(ref ? [{ label: "Resumo do livro", onPress: () => router.push(`/resumos/${ref.livroSlug}`) }] : []),
  ];

  if (erro) {
    return (
      <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-black">
        <LinearGradient
          colors={["#332920", "#241d16", "#1b1712"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-full p-5 items-start gap-3"
        >
          <Text className="text-white/90 text-xs font-semibold uppercase tracking-widest">Versículo do Dia</Text>
          <Text className="text-white/80 text-sm">{erro}</Text>
          <Pressable onPress={carregarVersiculo} className="px-4 py-2 rounded-full bg-white/10 active:opacity-70">
            <Text className="text-white font-semibold text-sm">Tentar novamente</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-black">
      {/* Fundo em gradiente de marca (mesma paleta "metalizada" dos
          cards de gamificação em /voce) — antes era uma foto aleatória
          via picsum.photos/Unsplash Source, que podia trazer qualquer
          imagem indexada (inclusive imprópria pro público do app, como
          reportado por um usuário). Sem fonte externa não curada,
          zero risco de conteúdo indevido aparecer aqui. */}
      <LinearGradient
        colors={["#332920", "#241d16", "#1b1712"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-[450px]"
      >

        <View className="p-5 flex-1 justify-between">
          {/* Header do Card */}
          <View>
            <Text 
              className="text-white/90 text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
            >
              Versículo do Dia
            </Text>
            <Text 
              className="text-white font-bold text-sm"
              style={{ textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}
            >
              {carregando ? "Carregando..." : dados?.referencia}
            </Text>
          </View>

          {/* Texto Bíblico */}
          <View className="flex-1 justify-center py-4">
            {carregando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text
                className="text-white text-xl"
                style={{
                  fontFamily: "serif",
                  lineHeight: 29,
                  textShadowColor: 'rgba(0, 0, 0, 0.9)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 8
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
                accessibilityLabel={salvo ? "Remover dos salvos" : "Salvar este versículo"}
                className="items-center active:opacity-60"
              >
                <MaterialIcons name={salvo ? "favorite" : "favorite-border"} size={24} color={salvo ? "#e0a75e" : "white"} />
                <Text className="text-white/80 text-xs mt-1">Amém</Text>
              </Pressable>
              <Pressable
                onPress={() => setNotaAberta(true)}
                disabled={!ref}
                accessibilityLabel="Anotar sobre este versículo"
                className="items-center active:opacity-60"
              >
                <MaterialIcons name={notaTexto ? "chat-bubble" : "chat-bubble-outline"} size={24} color={notaTexto ? "#e0a75e" : "white"} />
                <Text className="text-white/80 text-xs mt-1">Anotar</Text>
              </Pressable>
              <Pressable
                onPress={() => compartilhar(textoParaCompartilhar())}
                accessibilityLabel="Enviar este versículo"
                className="items-center active:opacity-60"
              >
                <MaterialIcons name="share" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Enviar</Text>
              </Pressable>
              <Pressable onPress={() => setMenuAberto(true)} accessibilityLabel="Mais opções" className="items-center active:opacity-60">
                <MaterialIcons name="more-horiz" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Mais</Text>
              </Pressable>
            </View>

            <Pressable
              disabled
              className="w-full bg-white/10 rounded-full py-3 items-center justify-center flex-row gap-2"
            >
              <MaterialIcons name="notifications-none" size={18} color="white" />
              <Text className="text-white text-sm font-semibold">Envie-me Diariamente</Text>
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
