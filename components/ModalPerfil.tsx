import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import type { Perfil } from "../core/repositories/PerfilRepository";

type Props = {
  visivel: boolean;
  perfilAtual: Perfil;
  onFechar: () => void;
  onSalvar: (perfil: Perfil) => void;
};

// Editor de perfil local (nome + foto), sem conta — ver
// PerfilRepository. Foto guardada como data URI (base64), simples de
// exibir em qualquer plataforma sem gerenciar arquivo/caminho.
export function ModalPerfil({ visivel, perfilAtual, onFechar, onSalvar }: Props) {
  const [nome, setNome] = useState(perfilAtual.nome);
  const [avatarUri, setAvatarUri] = useState(perfilAtual.avatarUri);

  async function escolherFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso às suas fotos pra trocar o avatar.");
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (resultado.canceled || !resultado.assets[0]) return;
    const asset = resultado.assets[0];
    setAvatarUri(asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri);
  }

  function salvar() {
    const nomeFinal = nome.trim() || "Visitante";
    onSalvar({ nome: nomeFinal, avatarUri });
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <Pressable className="flex-1 items-center justify-center bg-black/40 px-6" onPress={onFechar}>
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark p-6">
          <Text className="text-lg font-bold text-cor-texto dark:text-cor-texto-dark mb-4">Editar perfil</Text>

          <Pressable onPress={escolherFoto} accessibilityLabel="Trocar foto" className="self-center mb-5 active:opacity-70">
            <View className="w-20 h-20 rounded-full bg-cor-borda dark:bg-cor-borda-dark items-center justify-center overflow-hidden border-2 border-cor-destaque dark:border-cor-destaque-dark">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} className="w-full h-full" />
              ) : (
                <Text className="text-3xl">🙂</Text>
              )}
            </View>
            <Text className="text-xs font-semibold text-cor-destaque dark:text-cor-destaque-dark text-center mt-1.5">
              Trocar foto
            </Text>
          </Pressable>

          <Text className="text-xs font-semibold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1.5">
            Nome
          </Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor="#9ca3af"
            maxLength={40}
            className="px-4 py-3 rounded-xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark text-cor-texto dark:text-cor-texto-dark mb-5"
          />

          <View className="flex-row justify-end gap-2">
            <Pressable onPress={onFechar} className="px-4 py-2 rounded-full border border-cor-borda dark:border-cor-borda-dark active:opacity-70">
              <Text className="text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
            </Pressable>
            <Pressable onPress={salvar} className="px-4 py-2 rounded-full bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70">
              <Text className="text-white font-semibold">Salvar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
