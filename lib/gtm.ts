export function initDataLayer() {
  window.dataLayer = window.dataLayer || [];
}

export function loadGoogleTagManager(gtmId: string) {
  if (!gtmId || typeof document === 'undefined') {
    return;
  }

  if (document.querySelector(`script[data-gtm-id="${gtmId}"]`)) {
    return;
  }

  initDataLayer();
  window.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  script.dataset.gtmId = gtmId;
  document.head.appendChild(script);

  if (document.querySelector(`iframe[data-gtm-id="${gtmId}"]`)) {
    return;
  }

  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
  iframe.height = '0';
  iframe.width = '0';
  iframe.style.cssText = 'display:none;visibility:hidden';
  iframe.dataset.gtmId = gtmId;
  noscript.appendChild(iframe);
  document.body.prepend(noscript);
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}
