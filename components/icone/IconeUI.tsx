import type { ComponentType } from "react";
import { cssInterop, useColorScheme } from "nativewind";
import type { IconProps, IconWeight } from "phosphor-react-native";
import { StyleSheet, type TextStyle } from "react-native";
import { ArrowLeftIcon as ArrowLeft } from "phosphor-react-native/src/icons/ArrowLeft";
import { ArrowRightIcon as ArrowRight } from "phosphor-react-native/src/icons/ArrowRight";
import { BellSimpleIcon as BellSimple } from "phosphor-react-native/src/icons/BellSimple";
import { BookmarkSimpleIcon as BookmarkSimple } from "phosphor-react-native/src/icons/BookmarkSimple";
import { BookOpenTextIcon as BookOpenText } from "phosphor-react-native/src/icons/BookOpenText";
import { BooksIcon as Books } from "phosphor-react-native/src/icons/Books";
import { CalendarDotsIcon as CalendarDots } from "phosphor-react-native/src/icons/CalendarDots";
import { CaretDownIcon as CaretDown } from "phosphor-react-native/src/icons/CaretDown";
import { CaretLeftIcon as CaretLeft } from "phosphor-react-native/src/icons/CaretLeft";
import { CaretRightIcon as CaretRight } from "phosphor-react-native/src/icons/CaretRight";
import { ChatCircleTextIcon as ChatCircleText } from "phosphor-react-native/src/icons/ChatCircleText";
import { CheckCircleIcon as CheckCircle } from "phosphor-react-native/src/icons/CheckCircle";
import { CircleIcon as Circle } from "phosphor-react-native/src/icons/Circle";
import { CopyIcon as Copy } from "phosphor-react-native/src/icons/Copy";
import { DotsThreeIcon as DotsThree } from "phosphor-react-native/src/icons/DotsThree";
import { DownloadSimpleIcon as DownloadSimple } from "phosphor-react-native/src/icons/DownloadSimple";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "phosphor-react-native/src/icons/EnvelopeSimple";
import { FlagIcon as Flag } from "phosphor-react-native/src/icons/Flag";
import { FeatherIcon as Feather } from "phosphor-react-native/src/icons/Feather";
import { FunnelXIcon as FunnelX } from "phosphor-react-native/src/icons/FunnelX";
import { GearSixIcon as GearSix } from "phosphor-react-native/src/icons/GearSix";
import { GlobeHemisphereWestIcon as GlobeHemisphereWest } from "phosphor-react-native/src/icons/GlobeHemisphereWest";
import { HeartIcon as Heart } from "phosphor-react-native/src/icons/Heart";
import { HouseIcon as House } from "phosphor-react-native/src/icons/House";
import { ImageIcon as Image } from "phosphor-react-native/src/icons/Image";
import { InfoIcon as Info } from "phosphor-react-native/src/icons/Info";
import { LightbulbIcon as Lightbulb } from "phosphor-react-native/src/icons/Lightbulb";
import { ListChecksIcon as ListChecks } from "phosphor-react-native/src/icons/ListChecks";
import { MagnifyingGlassIcon as MagnifyingGlass } from "phosphor-react-native/src/icons/MagnifyingGlass";
import { MegaphoneIcon as Megaphone } from "phosphor-react-native/src/icons/Megaphone";
import { MapPinIcon as MapPin } from "phosphor-react-native/src/icons/MapPin";
import { MoonStarsIcon as MoonStars } from "phosphor-react-native/src/icons/MoonStars";
import { NotePencilIcon as NotePencil } from "phosphor-react-native/src/icons/NotePencil";
import { PauseCircleIcon as PauseCircle } from "phosphor-react-native/src/icons/PauseCircle";
import { PencilSimpleIcon as PencilSimple } from "phosphor-react-native/src/icons/PencilSimple";
import { SealCheckIcon as SealCheck } from "phosphor-react-native/src/icons/SealCheck";
import { ShareNetworkIcon as ShareNetwork } from "phosphor-react-native/src/icons/ShareNetwork";
import { ScrollIcon as Scroll } from "phosphor-react-native/src/icons/Scroll";
import { SparkleIcon as Sparkle } from "phosphor-react-native/src/icons/Sparkle";
import { SpeakerHighIcon as SpeakerHigh } from "phosphor-react-native/src/icons/SpeakerHigh";
import { StarIcon as Star } from "phosphor-react-native/src/icons/Star";
import { SunIcon as Sun } from "phosphor-react-native/src/icons/Sun";
import { TrashIcon as Trash } from "phosphor-react-native/src/icons/Trash";
import { UserIcon as User } from "phosphor-react-native/src/icons/User";
import { WarningCircleIcon as WarningCircle } from "phosphor-react-native/src/icons/WarningCircle";
import { XIcon as X } from "phosphor-react-native/src/icons/X";

const ICONES = {
  back: ArrowLeft,
  next: ArrowRight,
  "book-collection": Books,
  "bookmark-outline": BookmarkSimple,
  bookmark: BookmarkSimple,
  "note-outline": ChatCircleText,
  note: ChatCircleText,
  complete: CheckCircle,
  previous: CaretLeft,
  "next-chevron": CaretRight,
  copy: Copy,
  "moon-stars": MoonStars,
  delete: Trash,
  download: DownloadSimple,
  letter: EnvelopeSimple,
  edit: PencilSimple,
  "edit-note": NotePencil,
  warning: WarningCircle,
  "reading-plan": CalendarDots,
  "chevron-down": CaretDown,
  favorite: Heart,
  "favorite-outline": Heart,
  milestone: Flag,
  "clear-filter": FunnelX,
  home: House,
  sun: Sun,
  wisdom: Lightbulb,
  "open-book": BookOpenText,
  more: DotsThree,
  notification: BellSimple,
  pause: PauseCircle,
  profile: User,
  location: MapPin,
  "select-many": ListChecks,
  world: GlobeHemisphereWest,
  search: MagnifyingGlass,
  settings: GearSix,
  share: ShareNetwork,
  featured: Star,
  feather: Feather,
  proclamation: Megaphone,
  scroll: Scroll,
  sparkle: Sparkle,
  verified: SealCheck,
  image: Image,
  info: Info,
  close: X,
  "circle-empty": Circle,
  audio: SpeakerHigh,
} satisfies Record<string, ComponentType<IconProps>>;

export type IconeUINome = keyof typeof ICONES;

type Props = Omit<IconProps, "weight"> & {
  name: IconeUINome;
  weight?: IconWeight;
  className?: string;
};

function IconeUIBase({ name, weight, color, style, ...props }: Props) {
  const { colorScheme } = useColorScheme();
  const Icone = ICONES[name];
  const peso: IconWeight = weight ?? (name === "favorite" || name === "note" || name === "bookmark" || name === "complete" || name === "verified" ? "fill" : "regular");
  const corResolvida = color ?? String(StyleSheet.flatten(style as TextStyle | undefined)?.color ?? (colorScheme === "dark" ? "#ece5d8" : "#2a241c"));
  return <Icone {...props} style={style} color={corResolvida} weight={peso} aria-hidden="true" />;
}

export const IconeUI = cssInterop(IconeUIBase, { className: "style" });
