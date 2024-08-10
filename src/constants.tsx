import { Theme } from "planby";
import {
  TbBrightnessFilled,
  TbBrightnessUpFilled,
  TbMoonFilled,
} from "react-icons/tb";

export const SESSION_WRAPPER_SELECTOR = "a.session__wrapper";
export const MSCC_WEBSITE_AGENDA_URL = "https://conference.mscc.mu/agenda/";
export const AGENDA_DATE_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss";
export const EXPORT_TIME_FORMAT = "HH:mm";
export const AGENDA_LIGHT_THEME: Theme = {
  primary: {
    600: "#d4d4d8",
    900: "#f5f5f5",
  },
  grey: {
    300: "#262626",
  },
  white: "#fff",
  green: {
    300: "#2c7a7b",
  },
  scrollbar: {
    border: "#ffffff",
    thumb: {
      bg: "#e1e1e1",
    },
  },
  loader: {
    teal: "#5DDADB",
    purple: "#3437A2",
    pink: "#F78EB6",
    bg: "#171923db",
  },
  gradient: {
    blue: {
      300: "#b2ffd8",
      600: "#a5ffd2",
      900: "#94ffc9",
    },
  },
  text: {
    grey: {
      300: "#353535",
      500: "#383838",
    },
  },
  timeline: {
    divider: {
      bg: "#52525b",
    },
  },
};
export const AGENDA_DARK_THEME: Theme = {
  primary: {
    600: "#222225",
    900: "#0e0e10",
  },
  grey: {
    300: "#d1d1d1",
  },
  white: "#fff",
  green: {
    300: "#2c7a7b",
  },
  scrollbar: {
    border: "#ffffff",
    thumb: {
      bg: "#e1e1e1",
    },
  },
  loader: {
    teal: "#5DDADB",
    purple: "#3437A2",
    pink: "#F78EB6",
    bg: "#171923db",
  },
  gradient: {
    blue: {
      300: "#063",
      600: "#004d26",
      900: "#032112",
    },
  },
  text: {
    grey: {
      300: "#a0aec0",
      500: "#a7b0be",
    },
  },
  timeline: {
    divider: {
      bg: "#718096",
    },
  },
};
export const APP_THEMES = [
  {
    key: "system",
    label: "System",
    icon: TbBrightnessFilled,
  },
  {
    key: "light",
    label: "Light",
    icon: TbBrightnessUpFilled,
  },
  {
    key: "dark",
    label: "Dark",
    icon: TbMoonFilled,
  },
] as const;
