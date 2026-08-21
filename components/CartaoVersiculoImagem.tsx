import { forwardRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Versão nativa do cartão gerado via Canvas no web
// (`core/util/gerarImagemVersiculo.ts`) — aqui é uma View de verdade,
// capturada com `react-native-view-shot` (ver 5.2 do
// FUNCIONALIDADES.md). Mesma paleta/composição do cartão web, só que
// desenhada com componentes RN em vez de desenhada em Canvas.
const LADO = 360;

type Props = {
  texto: string;
  referencia: string;
};

export const CartaoVersiculoImagem = forwardRef<View, Props>(({ texto, referencia }, ref) => {
  return (
    <View ref={ref} collapsable={false} style={estilos.wrapper}>
      <LinearGradient colors={["#241c12", "#1b1712"]} style={estilos.gradiente}>
        <Text style={estilos.texto}>"{texto}"</Text>
        <Text style={estilos.referencia}>{referencia}</Text>
        <Text style={estilos.marca}>Bíblia Plataforma</Text>
      </LinearGradient>
    </View>
  );
});

CartaoVersiculoImagem.displayName = "CartaoVersiculoImagem";

const estilos = StyleSheet.create({
  wrapper: {
    width: LADO,
    height: LADO,
  },
  gradiente: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  texto: {
    fontFamily: "Georgia",
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 26,
    color: "#f3e6d3",
    textAlign: "center",
    marginBottom: 16,
  },
  referencia: {
    fontFamily: "Georgia",
    fontWeight: "700",
    fontSize: 13,
    color: "#e0a75e",
    marginBottom: 24,
  },
  marca: {
    position: "absolute",
    bottom: 16,
    fontFamily: "Georgia",
    fontWeight: "500",
    fontSize: 9,
    color: "#a89578",
  },
});
