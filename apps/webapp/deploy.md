# CARA DEPLOY KE APLIKASI
## CARA DEPLOY KE ANDROID
1. Install Ionic Extension
2. EDIT android/app/src/main/java/.../MainActivity.java, 
    ```java
      // Allow mixed content
        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);

            WebView webView = (WebView) this.bridge.getWebView();
            WebSettings webSettings = webView.getSettings();

            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
    ```
3. SETTING android > buildOptions capacitor.config.ts atau capacitor.config.json
   - Generate KEYSTORE
    ```keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias```

    ```javascript
     android: {
        buildOptions: {
        keystorePath: 'path to key',
        keystoreAlias: 'isi dengan alias key',
        signingType: 'apksigner'
        },
    },
    ```
4. Lanjut Ke Ektensi Ionic
5. Klik Project > Build
6. Prepare Release