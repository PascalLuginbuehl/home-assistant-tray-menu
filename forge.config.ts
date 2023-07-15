import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path from "path"
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    icon: path.resolve(__dirname, "./assets/home-assistant-icon-pretty"),
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: "https://raw.githubusercontent.com/pascalluginbuehl/home-assistant-tray-menu/main/assets/home-assistant-icon-pretty.ico",
      setupIcon: path.resolve(__dirname, "./assets/home-assistant-icon-pretty.ico"),
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({})
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/settings/index.html',
            js: './src/settings/renderer.tsx',
            name: 'settings_window',
            preload: {
              js: './src/preload.ts',
            },
          },
          {
            html: './src/tray/index.html',
            js: './src/tray/renderer.tsx',
            name: 'tray_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'pascalluginbuehl',
          name: 'home-assistant-tray-menu',
        },
        prerelease: true,
      },
    },
  ],
};

export default config;
