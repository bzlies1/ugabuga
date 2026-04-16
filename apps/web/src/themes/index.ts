/** Selectable theme identifiers. */
export type ThemeId =
  | "system"
  | "default-light"
  | "catppuccin-latte"
  | "rose-pine-dawn"
  | "default-dark"
  | "nord"
  | "monokai"
  | "tokyo-night";

/** Resolved appearance after system preference is evaluated. */
export type ResolvedAppearance = "light" | "dark";

export interface ThemeDefinition {
  readonly id: Exclude<ThemeId, "system">;
  readonly label: string;
  readonly appearance: ResolvedAppearance;
  /** Browser / desktop chrome background color. */
  readonly chromeColor: string;
}

export interface SystemThemeDefinition {
  readonly id: "system";
  readonly label: string;
  readonly appearance: null;
  readonly chromeColor: null;
}

export const SYSTEM_THEME: SystemThemeDefinition = {
  id: "system",
  label: "System",
  appearance: null,
  chromeColor: null,
};

export const THEMES: readonly ThemeDefinition[] = [
  // Light
  { id: "default-light", label: "Default", appearance: "light", chromeColor: "#ffffff" },
  {
    id: "catppuccin-latte",
    label: "Catppuccin Latte",
    appearance: "light",
    chromeColor: "#eff1f5",
  },
  { id: "rose-pine-dawn", label: "Rose Pine Dawn", appearance: "light", chromeColor: "#faf4ed" },
  // Dark
  { id: "default-dark", label: "Default", appearance: "dark", chromeColor: "#161616" },
  { id: "nord", label: "Nord", appearance: "dark", chromeColor: "#2e3440" },
  { id: "monokai", label: "Monokai", appearance: "dark", chromeColor: "#272822" },
  { id: "tokyo-night", label: "Tokyo Night", appearance: "dark", chromeColor: "#1a1b26" },
];

export const LIGHT_THEMES = THEMES.filter((t) => t.appearance === "light");
export const DARK_THEMES = THEMES.filter((t) => t.appearance === "dark");
export const ALL_THEME_OPTIONS: readonly (ThemeDefinition | SystemThemeDefinition)[] = [
  SYSTEM_THEME,
  ...THEMES,
];

export function isValidThemeId(value: string): value is ThemeId {
  return value === "system" || THEMES.some((t) => t.id === value);
}

export function getThemeById(id: ThemeId): ThemeDefinition | SystemThemeDefinition {
  if (id === "system") return SYSTEM_THEME;
  return THEMES.find((t) => t.id === id) ?? THEMES[0]!;
}

/**
 * Resolve a ThemeId to a concrete ThemeDefinition.
 * "system" resolves to default-light or default-dark based on OS preference.
 */
export function resolveTheme(themeId: ThemeId, systemDark: boolean): ThemeDefinition {
  if (themeId === "system") {
    return systemDark
      ? (THEMES.find((t) => t.id === "default-dark") ?? THEMES[3]!)
      : (THEMES.find((t) => t.id === "default-light") ?? THEMES[0]!);
  }
  return THEMES.find((t) => t.id === themeId) ?? THEMES[0]!;
}
