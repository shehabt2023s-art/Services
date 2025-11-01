// ===========================
// 🔹 Service Worker (مستقبل الشرقية)
// ===========================
const CACHE_NAME = 'sharqia-app-v1';

// 🧩 الملفات اللي تتخزن مؤقتًا (كاش)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png'
];

// 1️⃣ التثبيت (Install)
self.addEventListener('install', event => {
  console.log('🟢 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2️⃣ التفعيل (Activate)
self.addEventListener('activate', event => {
  console.log('⚙️ Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🧹 Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// 3️⃣ الجلب (Fetch)
self.addEventListener('fetch', event => {
  const requestURL = event.request.url;

  // استثناءات (Firebase / Google Fonts / APIs)
  if (
    requestURL.includes('firebase') ||
    requestURL.includes('gstatic') ||
    requestURL.includes('googleapis')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('✅ Loaded from cache:', event.request.url);
          return response;
        }

        return fetch(event.request)
          .then(networkResponse => {
            // حفظ النسخة في الكاش عند الحاجة
            if (networkResponse && networkResponse.status === 200) {
              const clonedResponse = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, clonedResponse);
              });
            }
            return networkResponse;
          })
          .catch(() => caches.match('./offline.html')); // ✅ المسار النسبي
      })
  );
});
