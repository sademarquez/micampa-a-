import type { CapacitorConfig } from '@capacitor/cli';

export const defaultConfig: CapacitorConfig = {
  appId: 'com.micampana.electoral2025',
  appName: 'MI CAMPAÑA 2025',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#ffffff',
      launchAutoHide: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#1e40af',
      overlay: false
    },
    Keyboard: {
      resize: 'body',
      style: 'light',
      resizeOnFullScreen: true
    },
    App: {
      launchAutoHide: false
    },
    Device: {
      enabled: true
    },
    Network: {
      enabled: true
    },
    Storage: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug',
    minWebViewVersion: 60,
    flavor: 'main',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      releaseType: 'AAB',
      signingType: 'apksigner'
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    allowsLinkPreview: false
  }
};

export default defaultConfig;
