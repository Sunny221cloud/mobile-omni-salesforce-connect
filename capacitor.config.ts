
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.74ed55559a7e46ba92c6b6afaca99733',
  appName: 'OmniOut - Salesforce Mobile',
  webDir: 'dist',
  server: {
    url: 'https://74ed5555-9a7e-46ba-92c6-b6afaca99733.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;
