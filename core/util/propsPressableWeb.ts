import { createElement, type ComponentType } from "react";
import { Pressable, type PressableProps } from "react-native";

type PropsWeb = PressableProps & {
  onKeyDown?: (event: Pick<KeyboardEvent, "key" | "preventDefault"> & { nativeEvent?: { key?: string } }) => void;
  accessibilityChecked?: boolean;
};

/** Mantém as extensões específicas do RN Web num único limite tipado. */
export function PressableComTecladoWeb(props: PropsWeb) {
  return createElement(Pressable as ComponentType<PropsWeb>, props);
}
