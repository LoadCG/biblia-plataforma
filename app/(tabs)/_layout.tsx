// Import direto do subcaminho, não do pacote inteiro — importar de
// "@expo/vector-icons" (o barrel) faz o Metro empacotar as fontes de
// TODAS as famílias de ícone (Zocial, SimpleLineIcons etc.), inflando o
// bundle por ~500KB à toa quando só MaterialIcons é usado.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { useColorScheme } from "../../core/theme";

// Cores replicadas de tailwind.config.js (cor-fundo-elevado, cor-destaque,
// cor-texto-suave, cor-borda) — a barra de abas é configurada via opções
// do React Navigation, que não aceita className do NativeWind.
const CORES = {
  light: { fundo: "#ffffff", ativo: "#8a5a2b", inativo: "#6b6153", borda: "#e6ded0" },
  dark: { fundo: "#262019", ativo: "#e0a75e", inativo: "#b3a894", borda: "#3a3226" },
};

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const cores = colorScheme === "dark" ? CORES.dark : CORES.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.ativo,
        tabBarInactiveTintColor: cores.inativo,
        tabBarStyle: { backgroundColor: cores.fundo, borderTopColor: cores.borda },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="biblia"
        options={{
          title: "Bíblia",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="menu-book" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pesquisa"
        options={{
          title: "Pesquisa",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="search" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voce"
        options={{
          title: "Você",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
