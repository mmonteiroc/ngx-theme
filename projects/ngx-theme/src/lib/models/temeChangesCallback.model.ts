interface ThemeChangesCallbackOptions {
  activeTheme: string;
}

export type ThemeChangesCallback = (
  changesOptions: ThemeChangesCallbackOptions
) => void;
