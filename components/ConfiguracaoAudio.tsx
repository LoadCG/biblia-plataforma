import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { iniciarAudio, pararAudio, suportaAudio, type EstadoAudio } from "../core/leitura/audio";
import {
  carregarPreferenciaAudio,
  listarVozesAudio,
  salvarVelocidadeAudio,
  salvarVozAudio,
  VELOCIDADES_AUDIO,
  type VozAudio,
} from "../core/leitura/preferenciaAudio";
import { mostrarToast } from "../core/util/toast";
import { ativarComEspaco, navegarGrupoRadio } from "../core/util/ativarComEspaco";
import { PressableComTecladoWeb } from "../core/util/propsPressableWeb";

const TEXTO_PREVIA = "Prévia da leitura em voz alta. Esta voz está selecionada para a sua leitura.";

export function ConfiguracaoAudio() {
  const [vozes, setVozes] = useState<VozAudio[]>([]);
  const [vozId, setVozId] = useState<string | null>(null);
  const [velocidade, setVelocidade] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [atualizandoVozes, setAtualizandoVozes] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [listaAberta, setListaAberta] = useState(false);
  const [estadoPrevia, setEstadoPrevia] = useState<EstadoAudio>("ocioso");
  const origem = useRef({}).current;
  const salvamentoEmAndamento = useRef(false);

  useFocusEffect(useCallback(() => () => pararAudio(false, origem), [origem]));

  useEffect(() => {
    let ativo = true;
    void Promise.allSettled([carregarPreferenciaAudio(), listarVozesAudio()]).then(([preferencia, disponiveis]) => {
      if (!ativo) return;
      if (preferencia.status === "fulfilled") {
        setVozId(preferencia.value.vozId);
        setVelocidade(preferencia.value.velocidade);
      }
      if (disponiveis.status === "fulfilled") setVozes(disponiveis.value);
      if (preferencia.status === "rejected" || disponiveis.status === "rejected") {
        mostrarToast("Não foi possível carregar todas as opções de voz", { severidade: "erro" });
      }
    }).finally(() => {
      if (ativo) setCarregando(false);
    });

    if (Platform.OS === "web" && typeof window !== "undefined" && window.speechSynthesis) {
      const atualizar = () => {
        void listarVozesAudio().then((disponiveis) => {
          if (ativo) setVozes(disponiveis);
        }).catch(() => {});
      };
      window.speechSynthesis.addEventListener("voiceschanged", atualizar);
      return () => {
        ativo = false;
        window.speechSynthesis.removeEventListener("voiceschanged", atualizar);
      };
    }
    return () => { ativo = false; };
  }, []);

  async function escolherVoz(id: string | null) {
    if (salvamentoEmAndamento.current) return;
    salvamentoEmAndamento.current = true;
    pararAudio(false, origem);
    setSalvando(true);
    try {
      await salvarVozAudio(id);
      setVozId(id);
      setListaAberta(false);
    } catch {
      mostrarToast("Não foi possível salvar a voz escolhida", { severidade: "erro" });
    } finally {
      salvamentoEmAndamento.current = false;
      setSalvando(false);
    }
  }

  async function escolherVelocidade(valor: number) {
    if (salvamentoEmAndamento.current) return;
    salvamentoEmAndamento.current = true;
    pararAudio(false, origem);
    setSalvando(true);
    try {
      await salvarVelocidadeAudio(valor);
      setVelocidade(valor);
    } catch {
      mostrarToast("Não foi possível salvar a velocidade", { severidade: "erro" });
    } finally {
      salvamentoEmAndamento.current = false;
      setSalvando(false);
    }
  }

  async function atualizarVozes() {
    if (atualizandoVozes) return;
    setAtualizandoVozes(true);
    try {
      setVozes(await listarVozesAudio());
    } catch {
      mostrarToast("Não foi possível atualizar a lista de vozes", { severidade: "erro" });
    } finally {
      setAtualizandoVozes(false);
    }
  }

  function alternarPrevia() {
    if (estadoPrevia !== "ocioso" && estadoPrevia !== "erro") {
      pararAudio(false, origem);
      return;
    }
    iniciarAudio([{ numero: 1, texto: TEXTO_PREVIA }], {
      aoMudarEstado: setEstadoPrevia,
      aoIniciarVersiculo: () => {},
      aoErro: (mensagem) => mostrarToast(mensagem, { severidade: "erro" }),
    }, 0, origem, { vozId, velocidade });
  }

  const vozSelecionada = vozes.find((voz) => voz.id === vozId);
  const previaAtiva = estadoPrevia !== "ocioso" && estadoPrevia !== "erro";
  const opcoesVoz: Array<{ id: string | null; nome: string; qualidade: "padrao" | "aprimorada"; local?: boolean }> = [
    { id: null, nome: "Voz padrão do dispositivo", qualidade: "padrao" },
    ...vozes,
  ];

  return (
    <View className="px-4 py-4">
      <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">Voz da leitura</Text>
      <Text className="text-xs leading-5 text-cor-texto-suave dark:text-cor-texto-suave-dark mt-1 mb-3">
        As vozes disponíveis dependem deste dispositivo e navegador. Algumas podem usar serviços online. A escolha fica salva apenas aqui.
      </Text>
      {!suportaAudio() ? (
        <Text accessibilityRole="text" className="text-sm text-cor-texto-suave dark:text-cor-texto-suave-dark mb-3">
          Este navegador não oferece leitura em voz alta.
        </Text>
      ) : null}
      <Pressable
        onPress={() => setListaAberta((aberta) => !aberta)}
        disabled={carregando || salvando || !suportaAudio()}
        accessibilityRole="button"
        accessibilityLabel={`Escolher voz da leitura, atual: ${vozId ? vozSelecionada?.nome ?? "voz indisponível" : "voz padrão"}`}
        accessibilityState={{ expanded: listaAberta, disabled: carregando || salvando || !suportaAudio() }}
        className="min-h-11 rounded-xl border border-cor-borda dark:border-cor-borda-dark px-3 py-2 flex-row items-center justify-between active:opacity-70"
      >
        <Text className="text-cor-texto dark:text-cor-texto-dark flex-1">
          {carregando ? "Carregando vozes…" : vozId ? vozSelecionada?.nome ?? "Voz indisponível · será usada a padrão" : "Voz padrão do dispositivo"}
        </Text>
        <Text className="text-cor-texto-suave dark:text-cor-texto-suave-dark ml-2">{listaAberta ? "−" : "+"}</Text>
      </Pressable>
      {listaAberta ? (
        <View className="mt-2 gap-1">
          <View accessibilityRole="radiogroup" accessibilityLabel="Voz da leitura" className="gap-1">
            {opcoesVoz.map((voz, indice) => (
              <PressableComTecladoWeb
                key={voz.id ?? "padrao"}
                onPress={() => escolherVoz(voz.id)}
                onKeyDown={(event) => {
                  if (!navegarGrupoRadio(event, indice, opcoesVoz.length, (proximo) => escolherVoz(opcoesVoz[proximo].id))) {
                    ativarComEspaco(event, () => escolherVoz(voz.id));
                  }
                }}
                disabled={salvando}
                accessibilityRole="radio"
                accessibilityState={{ checked: vozId === voz.id, disabled: salvando }}
                accessibilityChecked={vozId === voz.id}
                className={`min-h-11 rounded-xl px-3 py-2 flex-row items-center justify-between active:opacity-70 ${vozId === voz.id ? "bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : ""}`}
              >
                <Text className="text-cor-texto dark:text-cor-texto-dark flex-1">
                  {voz.nome}{voz.qualidade === "aprimorada" ? " · aprimorada" : ""}{voz.local === false ? " · serviço online" : ""}
                </Text>
                {vozId === voz.id ? <Text className="text-cor-destaque dark:text-cor-destaque-dark ml-2">✓</Text> : null}
              </PressableComTecladoWeb>
            ))}
          </View>
          {vozes.length === 0 ? <Text className="text-xs text-cor-texto-suave dark:text-cor-texto-suave-dark px-3 py-2">Nenhuma voz pt-BR adicional disponível neste dispositivo.</Text> : null}
          {Platform.OS === "web" ? (
            <Pressable
              onPress={atualizarVozes}
              disabled={atualizandoVozes}
              accessibilityRole="button"
              accessibilityLabel="Atualizar lista de vozes"
              className="min-h-11 self-start justify-center px-3 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-cor-destaque dark:text-cor-destaque-dark">
                {atualizandoVozes ? "Atualizando…" : "Atualizar lista de vozes"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold mt-5 mb-2">Velocidade</Text>
      <View accessibilityRole="radiogroup" accessibilityLabel="Velocidade da leitura" className="flex-row flex-wrap gap-2">
        {VELOCIDADES_AUDIO.map((valor, indice) => (
          <PressableComTecladoWeb
            key={valor}
            onPress={() => escolherVelocidade(valor)}
            onKeyDown={(event) => {
              if (!navegarGrupoRadio(event, indice, VELOCIDADES_AUDIO.length, (proximo) => escolherVelocidade(VELOCIDADES_AUDIO[proximo]))) {
                ativarComEspaco(event, () => escolherVelocidade(valor));
              }
            }}
            disabled={salvando}
            accessibilityRole="radio"
            accessibilityLabel={valor === 1 ? "Velocidade normal" : `${valor} vezes a velocidade normal`}
            accessibilityState={{ checked: velocidade === valor, disabled: salvando }}
            accessibilityChecked={velocidade === valor}
            className={`min-h-11 min-w-16 items-center justify-center rounded-full border px-3 active:opacity-70 ${velocidade === valor ? "border-cor-destaque dark:border-cor-destaque-dark bg-cor-destaque-fundo dark:bg-cor-destaque-fundo-dark" : "border-cor-borda dark:border-cor-borda-dark"}`}
          >
            <Text className="text-cor-texto dark:text-cor-texto-dark">{valor.toFixed(1)}×</Text>
          </PressableComTecladoWeb>
        ))}
      </View>
      <Pressable
        onPress={alternarPrevia}
        disabled={!suportaAudio() || carregando || salvando || estadoPrevia === "iniciando"}
        accessibilityRole="button"
        accessibilityLabel={previaAtiva ? "Parar prévia da voz" : "Ouvir prévia da voz"}
        className="mt-4 self-start min-h-11 rounded-full border border-cor-borda dark:border-cor-borda-dark px-4 items-center justify-center active:opacity-70"
      >
        <Text className="text-cor-texto dark:text-cor-texto-dark font-semibold">{previaAtiva ? "Parar prévia" : "Ouvir prévia"}</Text>
      </Pressable>
    </View>
  );
}
