import react from '@vitejs/plugin-react';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const assetsList = [
  'apple-touch-icon.png',
  'icon-maskable.png',
  'icon.svg',
  'manifest.json',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-styled-components'],
      },
    }),
    splitVendorChunkPlugin(),
    VitePWA({
      includeAssets: [
        ...assetsList.map((h) => `/assets/light/${h}`),
        ...assetsList.map((h) => `/assets/dark/${h}`),
      ],
      manifest: false,
      registerType: 'autoUpdate',
    }),
  ],
});
