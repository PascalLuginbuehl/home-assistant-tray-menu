import axios from 'axios';
import { app } from 'electron';

export interface IRelease {
  html_url: string;
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
}

export default async function checkForUpdates(): Promise<IRelease | null> {
  if (!app.isPackaged) return null;

  try {
    const { data: releases } = await axios.get<IRelease[]>('https://api.github.com/repos/pascalluginbuehl/home-assistant-tray-menu/releases');
    const latestVersion = releases.filter((release) => !release.prerelease)[0];

    if (`v${app.getVersion()}` !== latestVersion.tag_name) {
      return latestVersion;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
}
