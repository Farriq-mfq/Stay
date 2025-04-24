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
  // server: {
  //   allowNavigation: ['res.cloudinary.com'],
  //   cleartext: true,
  //   // url: 'https://app.smk1pekalongan.sch.id',
  // },
};

export default config;
