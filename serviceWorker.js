// 监听install事件, 将需要做缓存的资源添加到缓存中
	self.addEventListener('install', e => {
		e.waitUntil(
			caches.open('service-worker-demo-precache').then(res => {
				return res.addAll(['./index.htm','index.js','style.css'])
			}).cache(err => {
				console.log(err)
			})
		)
	})

	// 注册fetch拦截请求, 判断缓存是否存在,不存在则写入缓存再返回
	self.addEventListener('fetch', e => {
		return e.respondWith(
			caches.open('service-worker-demo-precache').then(res => {
				return res.match(e.request).then(matchres => {
					return matchres || fetch(e.request).then(fetchRes => {
						res.put(e.request, fetchRes.clone())
						return fetchRes
					})				
				})
				
			})
		)
	})