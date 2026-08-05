import { useMemo, useState } from "react";
import type { TextStyle } from "react-native";
import { Text } from "react-native";
import { detectarReferencias } from "../core/biblia/detectarReferencias";
import { PopoverVersiculo } from "./PopoverVersiculo";

type Props = {
  texto: string;
  className?: string;
  style?: TextStyle;
};

// Mesmo texto de sempre, só que referências bíblicas ("Sl 22", "Rm
// 1:16-17") viram trechos tocáveis que abrem o versículo de verdade
// (ver core/biblia/detectarReferencias.ts e PopoverVersiculo).
export function TextoComReferencias({ texto, className, style }: Props) {
  const [aberta, setAberta] = useState<{ referencia: string; refCapitulo: string } | null>(null);
  const segmentos = useMemo(() => detectarReferencias(texto), [texto]);

  return (
    <>
      <Text className={className} style={style}>
        {segmentos.map((s, i) =>
          s.tipo === "texto" ? (
            <Text key={i}>{s.texto}</Text>
          ) : (
            <Text
              key={i}
              onPress={() => setAberta({ referencia: s.ref, refCapitulo: s.refCapitulo })}
              className="text-cor-destaque dark:text-cor-destaque-dark"
              style={{ textDecorationLine: "underline", textDecorationStyle: "dotted" }}
            >
              {s.texto}
            </Text>
          )
        )}
      </Text>
      {aberta ? (
        <PopoverVersiculo referencia={aberta.referencia} refCapitulo={aberta.refCapitulo} onFechar={() => setAberta(null)} />
      ) : null}
    </>
  );
}
