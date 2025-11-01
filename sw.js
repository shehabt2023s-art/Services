const CACHE_NAME = 'sharqia-app-v1';

// قائمة الملفات الأساسية التي يتم تخزينها مؤقتًا
const urlsToCache = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/offline.html' // صفحة تظهر عند انقطاع الإنترنت
];

// 1. التثبيت (Install)
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // التفعيل الفوري
  );
});

// 2. التفعيل (Activate)
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Removing old cache...');
            return caches.delete(cache);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

// 3. الجلب (Fetch)
self.addEventListener('fetch', event => {
  const requestURL = event.request.url;

  // استثناء طلبات Firebase و Google
  if (requestURL.includes('firebase') || requestURL.includes('gstatic')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إن وُجد الملف في الكاش
        if (response) {
          return response;
        }

        // تحميل الملف من الشبكة وتخزينه (اختياري)
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200) {
              return caches.match('/offline.html');
            }
            return networkResponse;
          });
      })
      .catch(() => caches.match('/offline.html')) // لو فشل كل شيء
  );
});
