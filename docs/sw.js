const CACHE_NAME = 'mini-royal-match-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/fonts/luckiestguy.ttf',
  // ajoutez ici d'autres fichiers CSS, JS, images si vous en avez
];

// Installation : mise en cache des fichiers essentiels
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Mise en cache des fichiers');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciennes caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if(key !== CACHE_NAME){
          console.log('Suppression cache ancien:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Interception des requêtes : retourner depuis cache si possible, sinon fetch réseau
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
