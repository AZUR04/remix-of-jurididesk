import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.df0a8c1baed04c69bcdd5bd75615324a',
  appName: 'JuridiDesk',
  webDir: 'dist',
  server: {
    url: 'https://df0a8c1b-aed0-4c69-bcdd-5bd75615324a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    backgroundColor: '#1a1a2e'
  }
};

export default config;
