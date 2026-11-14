// Il service worker della radice non serve più: ogni viaggio ha il suo, nella sua cartella.
// Questa versione svuota le copie vecchie e si disinstalla, così le installazioni di prima non restano a metà.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (/^amsterdam-marzo-v/.test(k)) await caches.delete(k); // solo le copie dell'app di prima, non quelle degli altri viaggi
    await self.registration.unregister();
    const aperti = await self.clients.matchAll({ type: 'window' });
    aperti.forEach((c) => c.navigate(c.url));
  })());
});
