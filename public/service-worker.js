const CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('install', event => {
    const staticAssets = [
        '/',
        '/index.html',
        '/manifest.json',
        '/favicon.ico',
        '/logo192.png',
        '/logo512.png',
        // 其他关键静态资源
    ];

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(staticAssets).then(() => {
                    return fetch('index.html')
                        .then(response => response.text())
                        .then(body => {
                            const urlsToCache = parseUrlsFromBody(body);
                            // 确保这些URL不重复
                            const uniqueUrlsToCache = [...new Set(urlsToCache)];
                            return cache.addAll(uniqueUrlsToCache);
                        });
                });
            })
    );
});

self.addEventListener('fetch', event => {
    // 跳过非HTTP/HTTPS请求，如chrome-extension请求
    if (!event.request.url.startsWith('http')) {
        return;
    }

    // ...其余的fetch事件处理逻辑
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(`Serving from cache: ${event.request.url}`);
                    return response;
                }

                return fetch(event.request).then(response => {
                    // ...检查响应有效性等
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                            console.log(`Caching new resource: ${event.request.url}`);
                        });

                    return response;
                });
            })
    );
});


function parseUrlsFromBody(body) {
    // 这里是解析HTML内容并提取URL的逻辑
    // 例如，您可以使用正则表达式匹配<script>和<link>标签中的URL
    // 这是一个非常基本的示例，可能需要根据您的实际HTML结构进行调整
    const urls = [];
    const scriptRegex = /<script.*?src="(.*?)"/g;
    const linkRegex = /<link.*?href="(.*?)"/g;
    let match;

    while ((match = scriptRegex.exec(body)) !== null) {
        urls.push(match[1]);
    }

    while ((match = linkRegex.exec(body)) !== null) {
        urls.push(match[1]);
    }

    return urls.filter(url => url.startsWith('http')); // 确保只返回有效的URL
}
