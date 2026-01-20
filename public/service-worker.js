/* eslint-disable no-restricted-globals */

// Versão do cache - alterar quando fizer deploy de novas versões
const CACHE_NAME = 'agaron-sales-v1';

// Arquivos para cachear
const urlsToCache = [
    '/',
    '/index.html',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/logo192.png',
    '/logo512.png',
    '/favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Agaron Sales: Cache aberto');
                return cache.addAll(urlsToCache).catch((error) => {
                    console.log('Agaron Sales: Alguns recursos não puderam ser cacheados', error);
                });
            })
    );
    // Força o SW a se tornar ativo imediatamente
    self.skipWaiting();
});

// Ativação - limpa caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Agaron Sales: Removendo cache antigo', cacheName);
                        return caches.delete(cacheName);
                    }
                    return null;
                })
            );
        })
    );
    // Toma controle de todas as páginas imediatamente
    self.clients.claim();
});

// Estratégia de fetch: Network First, fallback para cache
self.addEventListener('fetch', (event) => {
    // Ignora requisições não-GET
    if (event.request.method !== 'GET') return;

    // Ignora requisições para APIs
    if (event.request.url.includes('/api/')) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Se conseguiu buscar da rede, atualiza o cache
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Se falhou, tenta buscar do cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Se não tem no cache e é uma navegação, retorna a página principal
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    return null;
                });
            })
    );
});

// Listener para mensagens (útil para skip waiting)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
