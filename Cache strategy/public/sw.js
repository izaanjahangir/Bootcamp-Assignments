const files = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    'https://bootswatch.com/4/cosmo/bootstrap.min.css'
]
self.addEventListener('install',(e)=>{
    console.log('Service worker installed');
    e.waitUntil(
        caches.open('static')
            .then((cache)=>{
                return cache.addAll(files);
            })
    )
});

self.addEventListener('activate',()=>{
    console.log('Service worker activated');
})

self.addEventListener('fetch',(e)=>{

    console.log(e.request.url)
    console.log(e.request.url === 'https://izaan-test-2.herokuapp.com/todos');
    if(e.request.url === 'https://izaan-test-2.herokuapp.com/todos'){
        fetch(e.request)
        .then(response => {
            return caches.open('todos')
                .then(cache => {
                    console.log('Caching new data...')
                    cache.put(e.request,response.clone());
                    return response;
                })
        })
    }else{
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request).catch(err => console.log(err));
            })
        )
    }
    // e.respondWith(
    //     caches.match(e.request).then(function(response) {
    //         return response || fetch(e.request).catch(err => console.log(err));
    //     })
    // )

})