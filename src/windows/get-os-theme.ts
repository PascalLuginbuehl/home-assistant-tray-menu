import os from 'os';
import store from '../store';

// From https://github.com/xanderfrangos/twinkle-tray/blob/d238796f2cbe3c521a12df46fabedff6adee115b/src/electron.js#L52C1-L53C76
const isReallyWin11 = parseInt(os.release()?.split('.')[2], 10) >= 22000;
const osTheme = isReallyWin11 ? 'win11' : 'win10';

export default function getComputedOsTheme() {
  const settings = store.get('settings');
  return settings.development.osTheme === 'system' ? osTheme : settings.development.osTheme;
}
