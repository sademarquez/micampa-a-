
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.micampana.electoral2025',
  appName: 'MI CAMPAÑA 2025',
  webDir: 'dist',
  server: {
    url: 'https://0104ad57-5112-4547-bf3c-092c7fdb1b88.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
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
    allowsLinkPreview: false,
    handleApplicationURL: true
  }
};

export default config;
