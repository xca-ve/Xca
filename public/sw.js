importScripts('/dexie.js');
importScripts('/indexedDB.js');

let static_cache = 'static_v2'; //Archivos estaticos (App Shell)
let dynamic_cache = 'dynamic_v1'; //Archivos dinamicos
let inmutable_cache = 'inmutable_v1'; //Archivos inmutables

//Se agregan los archivos al cache static
let files_appShell = [
    "/",
    "index.html",
    "main.js",
    "not-found.html",
    "style.css",
    "manifest.json",
    "/images/logoMakeup.png",
    "/images/carrito.png",
    "/images/products/keyboard-1.jpg",
    "/images/products/keyboard-2.jpg",
    "/images/products/keyboard-3.jpg",
    "/images/products/keyboard-4.jpg",
    "/images/products/keyboard-5.jpg",
    "/icons/icon-192x192.png",
    "/icons/icon-256x256.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
    "/indexedDB.js","https://pwa-tere.vercel.app/productos"
];
//Se crea el cache inmutable
let inmutableFiles = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    '/dexie.js'
];

//intalacion del SW
self.addEventListener('install', result => {
    console.log("SW instalado")
    

    const openStatic = caches.open(static_cache).then(cache => {
        cache.addAll(files_appShell);
    });

    const openInmutable = caches.open(inmutable_cache).then(cache => {
        cache.addAll(inmutableFiles);
    });

    //Este metodo hace todas las promesas que esten dentro en una sola
    result.waitUntil(
        Promise.all([
            openStatic,
            openInmutable
        ])
    );

})
self.addEventListener('activate', event => {

    console.log("SW activado")
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!static_cache.includes(key) && key.includes('static')) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('V2 lista para manejar las recuperaciones!');
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request).then(
        cacheResponse => {
            //Si estuvo en cache, lo va a regresar
            if (cacheResponse) return cacheResponse;
            //Sino estuvo en cache, lo va a buscar a la red
            return fetch(event.request).then(
                networkResponse => {
                    caches.open(dynamic_cache).then(cache => {
                        cache.put(event.request, networkResponse.clone()).then();
                                return networkResponse;

                    })
                }
            )
        }
    ))

})

self.addEventListener('message', msj => {
    //Revisar si el msj tiene el mensaje skipWaiting
    if (msj.data.action == 'skipWaiting') {
        self.skipWaiting();

    }
})

self.addEventListener('sync',function(event) {
    if(event.tag=='Sicoronizacion'){
        sincronizar();
    }});
