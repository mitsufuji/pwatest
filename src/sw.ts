// ServiceWorker処理：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja

interface ExtendableEvent extends Event {
  waitUntil<T>(promise: Promise<T>): void;
}

interface FetchEvent extends Event {
  readonly clientId: string;
  readonly preloadResponse: Promise<Response>;
  readonly replacesClientId: string;
  readonly resultingClientId: string;
  readonly request: Request;
  respondWith(response: Response | Promise<Response>): void;
}

interface InstallEvent extends ExtendableEvent {
  readonly activeWorker: ServiceWorker;
}

interface Window {
  addEventListener(
    type: 'install',
    listener: (ev: InstallEvent) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: 'fetch',
    listener: (ev: FetchEvent) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  clients: {
    matchAll(): Promise<
      {
        postMessage(message: any): void;
      }[]
    >;
  };
}

// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
  '.',
  'css/style.css',
  'images/app-icon-192.png',
  'js/drawer.js',
  'js/sw.js',
].map(url => '/pwatest/' + url);

// インストール処理
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(urlsToCache);
    })()
  );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function (event) {
  event.respondWith(
    (async () => {
			log('fetch: ' + event.request.url);
      const cached = await caches.match(event.request);
      if (cached) {
        return cached;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request.clone(), response.clone());
      return response;
    })()
  );
});

async function log(text: string) {
  const clients = await self.clients.matchAll();
  for (const client of clients) {
    client.postMessage({text});
  }
}

self.addEventListener('message', event => {});
