import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'sch.id.smk1pekalongan.app',
  appName: 'Skensa',
  webDir: 'dist',
  android: {
    buildOptions: {
      keystorePath: 'c:\Users\farriq\Documents\Projects\stay\apps\webapp\release-key.jks',
      keystoreAlias: 'smk1pkl',
      signingType: 'apksigner'
    },
  },
  server: {
    allowNavigation: ['res.cloudinary.com'],
    cleartext: true,
    // url: 'https://app.smk1pekalongan.sch.id',
    // url: 'http://192.168.117.151:8100',
  },
};

export default config;
