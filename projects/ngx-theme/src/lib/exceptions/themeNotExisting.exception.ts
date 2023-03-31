export class ThemeNotExistingException extends Error {
  constructor(theme: string) {
    super(`Theme ${theme} does not exist`);
  }
}
