import { Injectable } from '@angular/core';
import {
  CannotRegisterBeforeSetUp,
  ThemeNotExistingException,
} from './exceptions';
import { Theme } from './models';
import { ThemeChangesCallback } from './models/temeChangesCallback.model';
import { ThemeListener } from './models/themeListener.model';

const defaultTheme = {
  name: 'default',
  defaultTheme: true,
  variables: {},
};

@Injectable({
  providedIn: 'root',
})
export class NgxThemeService {
  private defaultTheme: Theme = defaultTheme;
  private activeTheme: Theme = defaultTheme;
  private availableThemes: Map<string, Theme> = new Map();
  private listeners = new Map<string, ThemeListener>();

  constructor() {}

  public get currentTheme(): Theme {
    return this.activeTheme;
  }

  public registerThemes(...themes: Theme[]) {
    this.availableThemes = new Map<string, Theme>();
    themes.forEach((theme) => {
      this.availableThemes.set(theme.name, theme);
      if (theme.defaultTheme) {
        this.defaultTheme = theme;
        this.activeTheme = theme;
      }
    });
  }

  public themeChanges({
    triggers,
  }: {
    triggers: ThemeChangesCallback;
  }): ThemeListener {
    if (!this.activeTheme) {
      throw new CannotRegisterBeforeSetUp();
    }

    const newListenerUuid = crypto.randomUUID();

    this.listeners.set(newListenerUuid, {
      id: newListenerUuid,
      onChanges: triggers,
      disconnect: () => {
        this.disconnectListener(newListenerUuid);
      },
    });

    return this.listeners.get(newListenerUuid) as ThemeListener;
  }

  public changeTheme(theme: string): void {
    if (!this.availableThemes.has(theme)) {
      throw new ThemeNotExistingException(theme);
    }

    this.activeTheme = this.availableThemes.get(theme) ?? this.defaultTheme;
    this.updateThemeForElement(this.activeTheme);
  }

  private disconnectListener(id: string): void {
    this.listeners.delete(id);
  }

  public getSassVariable(variable: string): string {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(variable);
  }

  private updateThemeForElement(
    theme: Theme,
    element: HTMLElement = document.body
  ): void {
    // remove old theme
    this.availableThemes.forEach((t: Theme) =>
      element.classList.remove(`${t.name}-theme`)
    );

    Object.keys(theme.variables).forEach((key: string) => {
      element.style.setProperty(
        key,
        this.getSassVariable(theme.variables[key])
      );
    });

    // alias element with theme name
    element.classList.add(`${theme.name}-theme`);
  }
}
