import { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { referenciaDoDia } from "../core/biblia/versiculoDoDia";
import type { CapituloTexto } from "../core/biblia/tipos";

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

  useEffect(() => {
    setCarregando(true);
    setErro(false);
    buscarReferencia(referencia)
      .then(setDados)
      .catch(() => setErro(true))
      .finally(() => setCarregando(false));
  }, [referencia]);

  if (erro) return null;

  const imageUrl = `https://picsum.photos/seed/${stringToSeed(referencia)}/600/800`;

  return (
    <View className="rounded-3xl overflow-hidden mb-4 shadow-sm bg-black">
      <ImageBackground source={{ uri: imageUrl }} className="w-full h-[450px]">
        {/* Gradiente escuro para dar contraste ao texto branco */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
          className="absolute inset-0"
        />
        
        <View className="p-5 flex-1 justify-between">
          {/* Header do Card */}
          <View>
            <Text className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-1">
              Versículo do Dia
            </Text>
            <Text className="text-white font-bold text-sm">
              {carregando ? "Carregando..." : dados?.referencia}
            </Text>
          </View>

          {/* Texto Bíblico */}
          <View className="flex-1 justify-center py-4">
            {carregando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-2xl" style={{ fontFamily: "serif", lineHeight: 34 }}>
                {dados?.texto}
              </Text>
            )}
          </View>

          {/* Actions & Footer */}
          <View>
            <View className="flex-row items-center justify-between mb-5 px-2">
              <View className="items-center">
                <MaterialIcons name="favorite-border" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Amém</Text>
              </View>
              <View className="items-center">
                <MaterialIcons name="chat-bubble-outline" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Anotar</Text>
              </View>
              <View className="items-center">
                <MaterialIcons name="share" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Enviar</Text>
              </View>
              <View className="items-center">
                <MaterialIcons name="more-horiz" size={24} color="white" />
                <Text className="text-white/80 text-xs mt-1">Mais</Text>
              </View>
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
    </View>
  );
}
