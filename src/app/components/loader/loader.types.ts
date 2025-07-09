/**
 * Tipos para el componente Loader
 */
export interface LoaderConfig {
  /** Indica si el loader está visible */
  isLoading: boolean;
  /** Mensaje a mostrar en el loader */
  message: string;
  /** Configuración opcional para el comportamiento del loader */
  options?: LoaderOptions;
}

export interface LoaderOptions {
  /** Tiempo mínimo de visualización del loader en ms */
  minDisplayTime?: number;
  /** Permite cancelar el loader */
  cancelable?: boolean;
  /** Callback cuando se cancela el loader */
  onCancel?: () => void;
}

export type LoaderState = Pick<LoaderConfig, 'isLoading' | 'message'>;
