// this element does 100% exist
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = window.document.getElementById('app')!;

export function sendHeight() {
  window.electronAPI.sendHeight(container.offsetHeight);
}

export function registerSendHeightCallback() {
  window.electronAPI.registerHeightRequestCallback(() => {
    sendHeight();
  });
}
