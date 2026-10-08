import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { IconeUI } from "./icone/IconeUI";
import { buscarReferencia } from "../core/biblia/BibliaAPI";
import { parseReferenciaVersiculo } from "../core/biblia/parseReferencia";
import { formatarReferenciaVersiculos } from "../core/biblia/formatarReferenciaVersiculos";
import { referenciaDoDia } from "../core/biblia/versiculoDoDia";
import type { CapituloTexto } from "../core/biblia/tipos";
import type { Nota } from "../core/types/leitura";
import { copiar, compartilhar } from "../core/estatisticas/compartilhador";
import { notasRepository, versiculosSalvosRepository } from "../core/repositories";
import { useColorScheme } from "../core/theme";
import { mensagemErroAmigavel } from "../core/util/erroAmigavel";
import { linkVersiculo } from "../core/util/linkVersiculo";
import { useOwnerId } from "../core/useOwnerId";
import { mostrarToast } from "../core/util/toast";
import { MenuAcoes, type AcaoMenu } from "./MenuAcoes";
import { BotaoMais } from "./BotaoMais";
import { continuarAudio, iniciarAudio, pausarAudio, pararAudio, suportaAudio, suportaPausaAudio, type EstadoAudio } from "../core/leitura/audio";
import { ModalNota } from "./ModalNota";
import { EstadoCarregando } from "./EstadoCarregando";
import { IlustracaoPeriodoDia } from "./IlustracaoPeriodoDia";
import type { PeriodoDoDia } from "../core/util/periodoDoDia";
import { useMovimentoReduzido } from "../core/util/useMovimentoReduzido";
import { FAMILIA_SERIFADA } from "../core/leitura/preferenciaFonte";

// Cores dos tokens de tema (tailwind.config.js) — precisam ser valores
// reais aqui (não className) porque `LinearGradient` e as ações do
// cartão precisam de paletas explícitas por tema. O IconeUI usa as
// mesmas cores semânticas para manter os traços legíveis no escuro.
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

type Props = {
  periodoDoDia: PeriodoDoDia;
};

type BotaoAcaoProps = {
  acessibilidade: string;
  ativo?: boolean;
  children: ReactNode;
  disabled?: boolean;
  movimentoReduzido: boolean;
  onPress: () => void;
  role?: "button" | "checkbox";
};

function BotaoAcaoVersiculo({ acessibilidade, ativo = false, children, disabled, movimentoReduzido, onPress, role = "button" }: BotaoAcaoProps) {
  const escala = useRef(new Animated.Value(1)).current;
  const usarDriverNativo = Platform.OS !== "web";

  function animar(toValue: number, mola = false) {
    if (movimentoReduzido) return;
    escala.stopAnimation();
    const animacao = mola
      ? Animated.spring(escala, { toValue, speed: 24, bounciness: 4, useNativeDriver: usarDriverNativo })
      : Animated.timing(escala, { toValue, duration: 85, easing: Easing.out(Easing.quad), useNativeDriver: usarDriverNativo });
    animacao.start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animar(0.96)}
      onPressOut={() => animar(1, true)}
      disabled={disabled}
      accessibilityRole={role}
      accessibilityLabel={acessibilidade}
      accessibilityState={{ disabled, ...(role === "checkbox" ? { checked: ativo } : {}) }}
      className={`flex-1 items-center justify-center py-1 ${disabled ? "opacity-45" : ""}`}
    >
      <Animated.View style={{ transform: [{ scale: escala }] }} className="items-center justify-center">
        <View className={`w-11 h-11 rounded-full items-center justify-center ${ativo ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""}`}>
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function CardVersiculoDia({ periodoDoDia }: Props) {
  const desktop = useWindowDimensions().width >= 1024;
  const [referencia] = useState(() => referenciaDoDia());
  const [dados, setDados] = useState<CapituloTexto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const ownerId = useOwnerId();
  const ref = parseReferenciaVersiculo(referencia);
  const [salvo, setSalvo] = useState(false);
  const [notaAberta, setNotaAberta] = useState(false);
  const [nota, setNota] = useState<Nota | null>(null);
  const notaTexto = nota?.texto ?? "";
  const [menuAberto, setMenuAberto] = useState(false);
  const [audioEstado, setAudioEstado] = useState<EstadoAudio>("ocioso");
  const [audioVersiculo, setAudioVersiculo] = useState<number | null>(null);
  const origemAudio = useRef({}).current;
  const [salvandoVersiculo, setSalvandoVersiculo] = useState(false);
  const salvamentoEmAndamento = useRef(false);
  const escalaAmem = useRef(new Animated.Value(1)).current;
  const movimentoReduzido = useMovimentoReduzido();
  const { colorScheme } = useColorScheme();
  const escuro = colorScheme === "dark";
  const corDestaque = escuro ? COR_DESTAQUE.escuro : COR_DESTAQUE.claro;
  const corIconePadrao = escuro ? COR_ICONE_PADRAO.escuro : COR_ICONE_PADRAO.claro;

  useFocusEffect(useCallback(() => () => pararAudio(false, origemAudio), [origemAudio]));

  function carregarVersiculo() {
    setCarregando(true);
    setErro(null);
    buscarReferencia(referencia)
      .then((valor) => { setDados(valor); })
      .catch((e) => setErro(mensagemErroAmigavel(e)))
      .finally(() => setCarregando(false));
  }

  useEffect(carregarVersiculo, [referencia]);

  useEffect(() => {
    if (!ownerId || !ref) return;
    let ativo = true;
    Promise.all([versiculosSalvosRepository.estaSalvo(ownerId, ref), notasRepository.buscar(ownerId, ref)])
      .then(([estaSalvo, nota]) => {
        if (!ativo) return;
        setSalvo(estaSalvo);
        setNota(nota);
      })
      .catch(() => {
        if (ativo) mostrarToast("Não foi possível carregar suas ações neste versículo", { severidade: "erro" });
      });
    return () => { ativo = false; };
  }, [ownerId, ref?.livroSlug, ref?.capitulo, ref?.versiculo]);

  async function alternarAmem() {
    if (!ownerId || !ref || salvamentoEmAndamento.current) return;
    salvamentoEmAndamento.current = true;
    setSalvandoVersiculo(true);
    try {
      const novoEstado = await versiculosSalvosRepository.alternar(ownerId, ref);
      setSalvo(novoEstado);
      mostrarToast(novoEstado ? "Versículo salvo" : "Versículo removido dos salvos", { severidade: "sucesso" });
      if (movimentoReduzido) return;
      escalaAmem.stopAnimation();
      escalaAmem.setValue(1);
      const useNativeDriver = Platform.OS !== "web";
      Animated.sequence([
        Animated.timing(escalaAmem, { toValue: 1.14, duration: 100, easing: Easing.out(Easing.quad), useNativeDriver }),
        Animated.timing(escalaAmem, { toValue: 1, duration: 130, easing: Easing.out(Easing.quad), useNativeDriver }),
      ]).start();
    } catch {
      mostrarToast("Não foi possível salvar este versículo", { severidade: "erro" });
    } finally {
      salvamentoEmAndamento.current = false;
      setSalvandoVersiculo(false);
    }
  }

  function textoParaCompartilhar(): string {
    const link = ref ? linkVersiculo(ref.livroSlug, ref.capitulo, ref.versiculo) : null;
    return `"${dados?.texto ?? ""}"\n\n${dados?.referencia ?? referencia}${link ? `\n${link}` : ""}`;
  }

  const observadorAudio = {
    aoMudarEstado: setAudioEstado,
    aoIniciarVersiculo: setAudioVersiculo,
    aoErro: (mensagem: string) => mostrarToast(mensagem, { severidade: "erro" }),
  };

  function ouvirVersiculoDoDia() {
    if (!dados?.texto) return;
    if (audioEstado === "reproduzindo") {
      pausarAudio();
    } else if (audioEstado === "pausado" || audioEstado === "interrompido" || audioEstado === "erro") {
      continuarAudio();
    } else {
      iniciarAudio([{ numero: ref?.versiculo ?? 1, texto: dados.texto }], observadorAudio, 0, origemAudio);
    }
  }

  const acaoAudio: AcaoMenu = audioEstado === "reproduzindo"
    ? { label: suportaPausaAudio() ? "Pausar leitura" : "Interromper leitura", icone: suportaPausaAudio() ? "pause" : "close", onPress: pausarAudio }
    : audioEstado === "pausado"
      ? { label: "Continuar leitura", icone: "audio", onPress: continuarAudio }
      : audioEstado === "interrompido"
        ? { label: `Continuar do início do versículo ${audioVersiculo ?? "atual"}`, icone: "audio", onPress: continuarAudio }
    : audioEstado === "erro"
      ? { label: "Tentar ouvir novamente", icone: "audio", onPress: continuarAudio }
      : { label: "Ouvir este versículo", icone: "audio", onPress: ouvirVersiculoDoDia };

  const rotuloEstadoAudio = audioEstado === "iniciando"
    ? "Preparando leitura em voz alta…"
    : audioEstado === "pausando"
      ? "Pausando leitura…"
      : audioEstado === "interrompendo"
        ? "Interrompendo leitura…"
    : audioEstado === "reproduzindo"
    ? `Ouvindo ${dados?.referencia ?? "versículo do dia"}`
    : audioEstado === "pausado"
      ? "Leitura pausada"
      : audioEstado === "interrompido"
        ? `Leitura interrompida · continua do início do versículo ${audioVersiculo ?? "atual"}`
        : audioEstado === "erro"
          ? "Não foi possível concluir a leitura"
          : "";

  const acoesMais: AcaoMenu[] = [
    ...(suportaAudio() && !["iniciando", "pausando", "interrompendo"].includes(audioEstado) ? [acaoAudio] : []),
    { label: "Copiar", icone: "copy", onPress: () => copiar(textoParaCompartilhar()) },
    ...(ref ? [{ label: "Ver capítulo inteiro", icone: "open-book" as const, onPress: () => router.push(`/biblia/${ref.livroSlug}/${ref.capitulo}?versiculo=${ref.versiculo}`) }] : []),
    ...(ref ? [{ label: "Resumo do livro", icone: "book-collection" as const, onPress: () => router.push(`/resumos/${ref.livroSlug}`) }] : []),
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
        className="w-full min-h-[360px] lg:min-h-[440px]"
      >

        <View className="p-5 flex-1 justify-between">
          {/* Header do Card */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-cor-texto/90 dark:text-white/90 text-xs font-semibold uppercase tracking-widest mb-1">
                Versículo do Dia
              </Text>
              <Text className="text-cor-texto dark:text-white font-bold text-sm">
                {carregando ? "Carregando..." : dados?.referencia}
              </Text>
            </View>
            {!desktop ? (
              <View aria-hidden={true} className="w-[116px] h-[72px] flex-shrink-0 items-center justify-center">
                <IlustracaoPeriodoDia periodoDoDia={periodoDoDia} escuro={escuro} />
              </View>
            ) : (
              <Text className="text-xs text-cor-texto-suave dark:text-white/70">
                {new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short" }).format(new Date())}
              </Text>
            )}
          </View>

          {desktop ? (
            <View aria-hidden={true} className="w-full h-[138px] -mx-0.5 my-2 items-center justify-center">
              <IlustracaoPeriodoDia periodoDoDia={periodoDoDia} escuro={escuro} panoramica />
            </View>
          ) : null}

          {/* Texto Bíblico */}
          <View className="flex-1 justify-center py-4">
            {carregando ? (
              <EstadoCarregando rotulo="Carregando versículo do dia" className="py-4" />
            ) : (
              <Text
                className="text-cor-texto dark:text-white text-xl"
                style={{
                  ...(desktop ? { fontFamily: FAMILIA_SERIFADA, fontSize: 25, lineHeight: 36 } : {}),
                  fontFamily: desktop ? FAMILIA_SERIFADA : "serif",
                  lineHeight: desktop ? 36 : 29,
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
            {audioEstado !== "ocioso" ? (
              <View className="flex-row items-center gap-2 rounded-2xl bg-black/5 dark:bg-white/10 px-3 py-2.5 mb-3">
                <IconeUI name="audio" size={18} color={corIconePadrao} />
                <Text accessibilityLiveRegion="polite" className="flex-1 text-xs font-semibold text-cor-texto dark:text-white">
                  {rotuloEstadoAudio}
                </Text>
                <Pressable
                  onPress={audioEstado === "reproduzindo" ? pausarAudio : continuarAudio}
                  disabled={audioEstado === "iniciando" || audioEstado === "pausando" || audioEstado === "interrompendo"}
                  accessibilityRole="button"
                  accessibilityLabel={audioEstado === "iniciando"
                    ? "Iniciando leitura do versículo"
                    : audioEstado === "pausando" ? "Pausando leitura do versículo"
                      : audioEstado === "interrompendo" ? "Interrompendo leitura do versículo"
                    : audioEstado === "reproduzindo"
                    ? suportaPausaAudio() ? "Pausar leitura do versículo" : "Interromper leitura do versículo"
                    : audioEstado === "interrompido"
                      ? `Continuar do início do versículo ${audioVersiculo ?? "atual"}`
                      : audioEstado === "erro" ? "Tentar ouvir o versículo novamente" : "Continuar leitura do versículo"}
                  accessibilityHint={audioEstado === "interrompido" ? "O versículo atual será repetido desde o começo." : undefined}
                  className="min-w-11 min-h-11 items-center justify-center rounded-full active:bg-black/10 dark:active:bg-white/10"
                >
                  <IconeUI name={audioEstado === "reproduzindo" && suportaPausaAudio() ? "pause" : audioEstado === "reproduzindo" ? "close" : "audio"} size={19} color={corIconePadrao} />
                </Pressable>
                <Pressable
                  onPress={() => pararAudio(true, origemAudio)}
                  accessibilityRole="button"
                  accessibilityLabel="Encerrar leitura em voz alta"
                  className="min-w-11 min-h-11 items-center justify-center rounded-full active:bg-black/10 dark:active:bg-white/10"
                >
                  <IconeUI name="close" size={18} color={corIconePadrao} />
                </Pressable>
              </View>
            ) : null}
            <View className="flex-row items-center justify-between mb-5 px-2">
              <BotaoAcaoVersiculo
                acessibilidade={salvo ? "Remover versículo dos salvos" : "Salvar versículo"}
                ativo={salvo}
                disabled={!ref || !ownerId || salvandoVersiculo}
                movimentoReduzido={movimentoReduzido}
                onPress={alternarAmem}
                role="checkbox"
              >
                <Animated.View style={{ transform: [{ scale: escalaAmem }] }}>
                  <IconeUI name={salvo ? "favorite" : "favorite-outline"} size={23} color={salvo ? corDestaque : corIconePadrao} />
                </Animated.View>
                <Text className={`text-[11px] mt-0.5 ${salvo ? "text-cor-destaque dark:text-cor-destaque-dark font-semibold" : "text-cor-texto-suave dark:text-white/80"}`}>
                  {salvandoVersiculo ? "Salvando" : salvo ? "Salvo" : "Salvar"}
                </Text>
              </BotaoAcaoVersiculo>
              <BotaoAcaoVersiculo
                acessibilidade={notaTexto ? "Editar nota deste versículo" : "Adicionar nota a este versículo"}
                ativo={Boolean(notaTexto)}
                disabled={!ref || !ownerId}
                movimentoReduzido={movimentoReduzido}
                onPress={() => setNotaAberta(true)}
              >
                <IconeUI name={notaTexto ? "note" : "note-outline"} size={23} color={notaTexto ? corDestaque : corIconePadrao} />
                <Text className={`text-[11px] mt-0.5 ${notaTexto ? "text-cor-destaque dark:text-cor-destaque-dark font-semibold" : "text-cor-texto-suave dark:text-white/80"}`}>
                  Anotar
                </Text>
              </BotaoAcaoVersiculo>
              <BotaoAcaoVersiculo
                acessibilidade="Compartilhar este versículo"
                disabled={!dados || carregando}
                movimentoReduzido={movimentoReduzido}
                onPress={() => compartilhar(textoParaCompartilhar())}
              >
                <IconeUI name="share" size={23} color={corIconePadrao} />
                <Text className="text-cor-texto-suave dark:text-white/80 text-[11px] mt-0.5">Enviar</Text>
              </BotaoAcaoVersiculo>
              <BotaoMais
                acessibilidade={`Mais ações para ${dados?.referencia ?? "o versículo do dia"}`}
                dica="Abre opções para copiar o versículo ou continuar a leitura."
                aoPressionar={() => setMenuAberto(true)}
                aberto={menuAberto}
                desabilitado={!dados || carregando}
                testID="botao-mais-versiculo-dia"
                rotulo="Mais"
                corIcone={corIconePadrao}
                classeTexto="text-cor-texto-suave dark:text-white/80"
                className="flex-1 py-1"
              />
            </View>

            {/* Mesmo raciocínio do sino da Início: sem servidor não dá
                pra mandar push no web (Web Push exige backend, ver
                TODO.md), então some de lá — um "em breve" sem previsão
                real só confundiria. No nativo o lembrete diário já é
                real (core/notifications/), leva pro toggle de verdade
                em Configurações em vez de ficar desabilitado. */}
            {Platform.OS !== "web" ? (
              <Pressable
                onPress={() => router.push("/configuracoes")}
                accessibilityRole="link"
                accessibilityLabel="Ativar lembrete diário de leitura"
                className="self-end bg-black/5 dark:bg-white/10 rounded-full px-3.5 py-1.5 items-center justify-center flex-row gap-1.5 active:opacity-70"
              >
                <IconeUI name="notification" size={14} color={corIconePadrao} />
                <Text className="text-cor-texto dark:text-white text-xs font-semibold">Lembrete diário</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </LinearGradient>

      <MenuAcoes acoes={acoesMais} aberto={menuAberto} contexto={dados?.referencia ? `Versículo do Dia · ${dados.referencia}` : "Versículo do Dia"} onFechar={() => setMenuAberto(false)} />

      {ref ? (
        <ModalNota
          key={nota?.grupoId ?? `${ref.livroSlug}-${ref.capitulo}-${ref.versiculo}`}
          visivel={notaAberta}
          referencias={nota?.referencias ?? [ref]}
          referencia={nota?.referencias && nota.referencias.length > 1
            ? formatarReferenciaVersiculos(nota.referencias)
            : dados?.referencia ?? referencia}
          textoInicial={notaTexto}
          onFechar={() => setNotaAberta(false)}
          onSalvar={async (texto) => {
            if (!ownerId) throw new Error("Identificação local indisponível");
            const salva = nota?.grupoId
              ? await notasRepository.salvarGrupo(ownerId, nota.grupoId, texto)
              : await notasRepository.salvar(ownerId, ref, texto);
            setNota(salva);
          }}
          onRemover={async () => {
            if (!ownerId) throw new Error("Identificação local indisponível");
            await notasRepository.remover(ownerId, ref);
            setNota(null);
          }}
        />
      ) : null}
    </View>
  );
}
