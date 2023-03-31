import { ThemeChangesCallback } from './temeChangesCallback.model';

export interface ThemeListener {
  id: string;
  onChanges: ThemeChangesCallback;
  disconnect: () => void;
}
