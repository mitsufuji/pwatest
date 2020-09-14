"use strict";
// ServiceWorker処理：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja
// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    '/pwatest/',
    '/pwatest/css/style.css',
    '/pwatest/images/app-icon-192.png',
    '/pwatest/js/drawer.js',
    '/pwatest/js/sw.js',
];
// インストール処理
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(urlsToCache);
    })());
});
// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function (event) {
    event.respondWith((async () => {
        var _a;
        return (_a = (await caches.match(event.request))) !== null && _a !== void 0 ? _a : await fetch(event.request);
    })());
});
//# sourceMappingURL=sw.js.map