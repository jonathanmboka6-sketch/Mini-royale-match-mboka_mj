// Définir le nom du cache et la liste des fichiers à mettre en cache.
const CACHE_NAME = 'mini-royal-match-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/fonts/luckiestguy.ttf', // Utilisez le chemin "/fonts/"
  // Ajoutez ici tous les autres fichiers de votre jeu (ex: images, fichiers js, css).
];

// Étape 1 : Installation du Service Worker et mise en cache des fichiers.
self.addEventListener('install', (evt) => {
  console.log('[Service Worker] Installation en cours...');
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des fichiers');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((err) => {
        console.error('[Service Worker] La mise en cache a échoué:', err);
      })
  );
  self.skipWaiting();
});

// Étape 2 : Activation du Service Worker et nettoyage des anciennes caches.
self.addEventListener('activate', (evt) => {
  console.log('[Service Worker] Activation en cours...');
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Suppression de l\'ancienne cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Étape 3 : Interception des requêtes.
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(evt.request);
      })
  );
});
