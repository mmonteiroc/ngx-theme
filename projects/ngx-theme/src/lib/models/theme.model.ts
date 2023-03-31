export interface Theme {
  defaultTheme: boolean;
  name: string;
  variables: {
    [key: string]: string;
  };
}
