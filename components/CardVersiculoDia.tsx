import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { parseReferenciaVersiculo } from "../core/biblia/parseReferencia";
import { referenciaDoDia } from "../core/biblia/versiculoDoDia";
import type { CapituloTexto } from "../core/biblia/tipos";
import { compartilhar } from "../core/estatisticas/compartilhador";
import { notasRepository, versiculosSalvosRepository } from "../core/repositories";
import { linkVersiculo } from "../core/util/linkVersiculo";
import { useOwnerId } from "../core/useOwnerId";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { ModalNota } from "./ModalNota";

// Função simples para gerar um hash do texto pra usar como seed
function stringToSeed(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function CardVersiculoDia() {
  const [referencia] = useState(() => referenciaDoDia());
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const ownerId = useOwnerId();
  const ref = parseReferenciaVersiculo(referencia);
  const [salvo, setSalvo] = useState(false);
  const [notaAberta, setNotaAberta] = useState(false);
  const [notaTexto, setNotaTexto] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    setCarregando(true);
    setErro(false);
    buscarReferencia(referencia)
      .then(setDados)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [referencia]);

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

  if (erro) return null;

  const imageUrl = `https://picsum.photos/seed/${stringToSeed(referencia)}/600/800`;

  return (
    <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-black">
      <ImageBackground source={{ uri: imageUrl }} className="w-full h-[450px]">
        {/* Escurece a foto de fundo de verdade (não só a sombra do texto) —
            overlay bem mais escuro mesmo no topo do card, onde antes a
            foto ainda aparecia clara demais atrás do rótulo. */}
        <LinearGradient
          colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.9)', 'rgba(0,0,0,0.98)']}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        
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
                className="items-center"
              >
                <MaterialIcons name={salvo ? "favorite" : "favorite-border"} size={24} color={salvo ? "#e0a75e" : "white"} />
                <Text className="text-white/80 text-xs mt-1">Amém</Text>
              </Pressable>
              <Pressable
                onPress={() => setNotaAberta(true)}
                disabled={!ref}
                accessibilityLabel="Anotar sobre este versículo"
                className="items-center"
              >
                <MaterialIcons name={notaTexto ? "chat-bubble" : "chat-bubble-outline"} size={24} color={notaTexto ? "#e0a75e" : "white"} />
                <Text className="text-white/80 text-xs mt-1">Anotar</Text>
              </Pressable>
              <Pressable
                onPress={() => compartilhar(textoParaCompartilhar())}
                accessibilityLabel="Enviar este versículo"
                className="items-center"
              >
                <MaterialIcons name="share" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Enviar</Text>
              </Pressable>
              <Pressable onPress={() => setMenuAberto(true)} accessibilityLabel="Mais opções" className="items-center">
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
      </ImageBackground>

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
