// Service Worker for Bumpit PWA
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // מאפשר לאפליקציה לעבוד גם במצב לא מקוון חלקי
});
