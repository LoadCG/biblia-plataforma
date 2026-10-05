import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { IconeUI } from "./icone/IconeUI";
import type { Perfil } from "../core/repositories/PerfilRepository";
import { mostrarToast } from "../core/util/toast";

type Props = {
  visivel: boolean;
  perfilAtual: Perfil;
  onFechar: () => void;
  onSalvar: (perfil: Perfil) => void | Promise<void>;
};

// Editor de perfil local (nome + foto), sem conta — ver
// PerfilRepository. Foto guardada como data URI (base64), simples de
// exibir em qualquer plataforma sem gerenciar arquivo/caminho.
export function ModalPerfil({ visivel, perfilAtual, onFechar, onSalvar }: Props) {
  const [nome, setNome] = useState(perfilAtual.nome);
  const [avatarUri, setAvatarUri] = useState(perfilAtual.avatarUri);
  const [salvando, setSalvando] = useState(false);
  const alterado = nome.trim() !== perfilAtual.nome || avatarUri !== perfilAtual.avatarUri;

  async function escolherFoto() {
    try {
      const permissao = Platform.OS === "web" ? null : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissao && !permissao.granted) {
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
    } catch {
      mostrarToast("Não foi possível escolher uma foto", { severidade: "erro" });
    }
  }

  async function salvar() {
    if (salvando || !alterado) return;
    const nomeFinal = nome.trim() || "Visitante";
    setSalvando(true);
    try {
      await onSalvar({ nome: nomeFinal, avatarUri });
    } catch {
      mostrarToast("Não foi possível salvar seu perfil", { severidade: "erro" });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={() => { if (!salvando) onFechar(); }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
      <Pressable className="flex-1 items-center justify-center bg-black/50 px-4 py-6" onPress={() => { if (!salvando) onFechar(); }}>
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full max-w-sm max-h-full rounded-3xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo-elevado dark:bg-cor-fundo-elevado-dark overflow-hidden">
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
          <View className="flex-row items-start justify-between mb-5">
            <View className="flex-1 pr-3">
              <Text accessibilityRole="header" className="text-xl font-extrabold text-cor-texto dark:text-cor-texto-dark">Editar perfil</Text>
              <Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1">Escolha como você aparece neste dispositivo.</Text>
            </View>
            <Pressable onPress={onFechar} disabled={salvando} accessibilityRole="button" accessibilityLabel="Fechar edição do perfil" className="w-11 h-11 items-center justify-center rounded-full bg-cor-fundo dark:bg-cor-fundo-dark active:opacity-70"><IconeUI name="close" size={19} /></Pressable>
          </View>

          <Pressable onPress={escolherFoto} disabled={salvando} accessibilityRole="button" accessibilityLabel={avatarUri ? "Trocar foto do perfil" : "Adicionar foto ao perfil"} className="self-center mb-2 active:opacity-70">
            <View className="w-24 h-24 rounded-full bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark items-center justify-center overflow-hidden border-2 border-cor-destaque dark:border-cor-destaque-dark">
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} className="w-full h-full" />
              ) : (
                <IconeUI name="profile" size={38} className="text-cor-destaque dark:text-cor-destaque-dark" />
              )}
            </View>
            <Text className="text-sm font-bold text-cor-destaque dark:text-cor-destaque-dark text-center mt-2">
              {avatarUri ? "Trocar foto" : "Adicionar foto"}
            </Text>
          </Pressable>
          {avatarUri ? <Pressable onPress={() => setAvatarUri(null)} disabled={salvando} accessibilityRole="button" className="self-center min-h-11 justify-center px-3 mb-2 active:opacity-70"><Text className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark">Remover foto</Text></Pressable> : <View className="h-6" />}

          <Text className="text-xs font-semibold uppercase tracking-wide text-cor-texto-suave dark:text-cor-texto-suave-dark mb-1.5">
            Nome
          </Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            accessibilityLabel="Nome do perfil"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            placeholder="Como quer ser chamado?"
            placeholderTextColor="#8c8273"
            maxLength={40}
            className="min-h-12 px-4 py-3 rounded-xl border border-cor-borda dark:border-cor-borda-dark bg-cor-fundo dark:bg-cor-fundo-dark text-cor-texto dark:text-cor-texto-dark mb-2"
          />
          <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark mb-5">Este nome aparece apenas no seu perfil.</Text>

          <View className="flex-row gap-3">
            <Pressable onPress={onFechar} disabled={salvando} accessibilityRole="button" className="flex-1 min-h-12 items-center justify-center rounded-xl border border-cor-borda dark:border-cor-borda-dark active:opacity-70">
              <Text className="font-semibold text-cor-texto dark:text-cor-texto-dark">Cancelar</Text>
            </Pressable>
            <Pressable onPress={salvar} disabled={salvando || !alterado} accessibilityRole="button" accessibilityState={{ disabled: salvando || !alterado }} className={`flex-1 min-h-12 items-center justify-center rounded-xl bg-cor-destaque dark:bg-cor-destaque-dark active:opacity-70 ${salvando || !alterado ? "opacity-50" : ""}`}>
              <Text className="text-white dark:text-cor-fundo font-bold">{salvando ? "Salvando..." : "Salvar alterações"}</Text>
            </Pressable>
          </View>
          </ScrollView>
        </Pressable>
      </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
