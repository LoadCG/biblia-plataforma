// Import direto do subcaminho, não do pacote inteiro — importar de
// "@expo/vector-icons" (o barrel) faz o Metro empacotar as fontes de
// TODAS as famílias de ícone (Zocial, SimpleLineIcons etc.), inflando o
// bundle por ~500KB à toa quando só MaterialIcons é usado.
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from "expo-router/ui";
import { forwardRef } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { useColorScheme } from "../../core/theme";

// Este projeto não tem @react-navigation/bottom-tabs disponível como
// pacote isolado (o Expo Router SDK 57 não depende mais dele
// diretamente — ver PLANO-NAVEGACAO.md item 1.9), então uma barra
// lateral de verdade no desktop não dá pra fazer via `screenOptions`
// do `<Tabs>` de arquivo único. A API headless `expo-router/ui`
// (`Tabs`/`TabList`/`TabTrigger`/`TabSlot`) resolve isso: ela só cuida
// da navegação, o layout visual é 100% nosso.
//
// Duas pegadinhas descobertas implementando isto:
// 1. `TabList`/`TabSlot` precisam ser filhos DIRETOS de `Tabs` (só filhos
//    diretos e Fragments são percorridos por `parseTriggersFromChildren`
//    pra descobrir as telas) — não dá pra envolver numa `View` própria.
// 2. `className` (NativeWind) só é interceptado em componentes host
//    (`View`/`Text`/`Pressable` etc.) usados diretamente no nosso JSX.
//    `TabList`/`TabSlot`/`Tabs` são componentes do expo-router — passar
//    `className` a eles não tem efeito (o Tailwind nunca chega no DOM).
//    Por isso essas três usam `style` inline com cores lidas na mão do
//    tema, e só o conteúdo *dentro* deles (`BotaoAba`) usa `className`.
const BREAKPOINT_DESKTOP = 768;

const CORES = {
  light: { fundo: "#faf8f4", elevado: "#ffffff", borda: "#e6ded0", texto: "#2a241c", ativo: "#8a5a2b", inativo: "#6b6153" },
  dark: { fundo: "#1b1712", elevado: "#262019", borda: "#3a3226", texto: "#ece5d8", ativo: "#e0a75e", inativo: "#b3a894" },
};

const ABAS = [
  { nome: "index", href: "/" as const, rotulo: "Início", icone: "home" as const },
  { nome: "biblia", href: "/biblia" as const, rotulo: "Bíblia", icone: "menu-book" as const },
  { nome: "pesquisa", href: "/pesquisa" as const, rotulo: "Descubra", icone: "search" as const },
  { nome: "voce", href: "/voce" as const, rotulo: "Você", icone: "person" as const },
];

type BotaoAbaProps = TabTriggerSlotProps & {
  rotulo: string;
  icone: keyof typeof MaterialIcons.glyphMap;
  sidebar: boolean;
};

// `TabTrigger asChild` clona este componente e injeta `isFocused` +
// os handlers de navegação (onPress etc.) — por isso ele precisa
// aceitar e repassar essas props pro `Pressable`, em vez de só receber
// `onPress` como qualquer botão comum.
const BotaoAba = forwardRef<View, BotaoAbaProps>(({ rotulo, icone, sidebar, isFocused, ...props }, ref) => {
  const { colorScheme } = useColorScheme();
  const cores = colorScheme === "dark" ? CORES.dark : CORES.light;

  return (
    <Pressable
      ref={ref}
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={rotulo}
      accessibilityState={{ selected: isFocused }}
      // @ts-expect-error accessibilitySelected é uma extensão do react-native-web, não existe nos tipos do React Native
      accessibilitySelected={isFocused}
      className={
        sidebar
          ? `flex-row items-center gap-3 rounded-xl px-3.5 py-2.5 mb-1 active:opacity-70 ${
              isFocused ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""
            }`
          : "flex-1 flex-col items-center justify-center py-1.5 active:opacity-60"
      }
    >
      <MaterialIcons name={icone} size={sidebar ? 22 : 26} color={isFocused ? cores.ativo : cores.inativo} />
      <Text
        className={`${sidebar ? "text-sm" : "text-[10px] mt-1 tracking-wide"} font-semibold ${
          isFocused ? "text-cor-destaque dark:text-cor-destaque-dark" : "text-cor-texto-suave dark:text-cor-texto-suave-dark"
        }`}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
});
BotaoAba.displayName = "BotaoAba";

import { createContext, useContext, useState } from "react";

// Sem consumidor no momento (2026-08-20) — a leitura de capítulo, único
// lugar que chamava `setOculta`, parou de esconder a tab bar do app
// depois de um refactor do sistema de auto-esconder durante a rolagem
// (ver o comentário grande em `aoRolar` de `[capitulo].tsx`): esconder
// a tab bar mudava a altura visível do ScrollView, alimentando um loop
// de realimentação que causava o "glitch" perto do fim da leitura.
// Mantido aqui (infraestrutura barata, já testada) pra uma tela futura
// que precise do mesmo controle — só que dessa vez implementando o
// próprio elemento a esconder como camada sobreposta (`position:
// absolute`/`fixed`), não como algo que participa do layout do
// conteúdo, senão o mesmo bug se repete.
export const NavbarContext = createContext({
  oculta: false,
  setOculta: (v: boolean) => {},
});

export function useNavbar() {
  return useContext(NavbarContext);
}

export default function TabsLayout() {
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const sidebar = width >= BREAKPOINT_DESKTOP;
  const cores = colorScheme === "dark" ? CORES.dark : CORES.light;
  const [oculta, setOculta] = useState(false);

  return (
    <NavbarContext.Provider value={{ oculta, setOculta }}>
      <Tabs style={{ flex: 1, flexDirection: sidebar ? "row" : "column", backgroundColor: cores.fundo }}>
        {sidebar ? (
          <TabList
            style={{
              width: 224,
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "flex-start",
              borderRightWidth: 1,
              borderRightColor: cores.borda,
              backgroundColor: cores.elevado,
              paddingHorizontal: 12,
              paddingTop: 32,
            }}
          >
            <Text style={{ color: cores.texto, fontSize: 18, fontWeight: "800", paddingHorizontal: 4, marginBottom: 24 }}>
              Resumo Bíblico
            </Text>
            {ABAS.map((aba) => (
              <TabTrigger key={aba.nome} name={aba.nome} href={aba.href} asChild>
                <BotaoAba rotulo={aba.rotulo} icone={aba.icone} sidebar />
              </TabTrigger>
            ))}
          </TabList>
        ) : null}

        <TabSlot style={{ flex: 1 }} />

        {/* Pegadinha 3 (bug real, reportado em 2026-08-20: "leitura
            bíblica está inutilizável no celular, quando começa a rolar
            para baixo a tela toda some, fica da cor do fundo do tema"):
            este TabList NÃO pode ser desmontado quando o Modo Foco
            esconde a barra. Os `TabTrigger` aqui dentro é que *definem*
            quais telas existem (`triggersToScreens`, ver pegadinha 1
            acima) — tirar o TabList da árvore zera a lista de telas, o
            `TabSlot` renderiza vazio e sobra só o `backgroundColor` do
            `<Tabs>` (#faf8f4 no claro, #1b1712 no escuro — exatamente o
            "off white ou marrom" relatado). Só acontecia no celular
            porque no desktop quem renderiza é a sidebar acima, que
            nunca é ocultada. Solução: manter sempre montado e esconder
            só visualmente com `display: "none"` (que também tira os
            botões da ordem de tabulação e do leitor de tela). */}
        {!sidebar ? (
          <TabList style={{
            display: oculta ? "none" : "flex",
            backgroundColor: cores.elevado,
            paddingTop: 8,
            paddingBottom: 8,
            borderTopWidth: 1,
            borderTopColor: cores.borda,
          }}>
            {ABAS.map((aba) => (
              <TabTrigger key={aba.nome} name={aba.nome} href={aba.href} asChild>
                <BotaoAba rotulo={aba.rotulo} icone={aba.icone} sidebar={false} />
              </TabTrigger>
            ))}
          </TabList>
        ) : null}
      </Tabs>
    </NavbarContext.Provider>
  );
}
