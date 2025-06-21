import type { CapacitorConfig } from '@capacitor/cli';
import { defaultConfig } from './capacitor.config'; // Importamos la configuración base

const productionConfig: CapacitorConfig = {
  ...defaultConfig, // Usamos la configuración base como punto de partida
  android: {
    ...defaultConfig.android,
    webContentsDebuggingEnabled: false, // Deshabilitamos el debugging
    allowMixedContent: false, // Forzamos HTTPS para mayor seguridad
  },
  server: {
    // En producción, nos aseguramos de no apuntar a un servidor de desarrollo
    url: undefined,
    hostname: undefined,
    cleartext: false
  }
};

export default productionConfig; 