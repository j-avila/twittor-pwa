// Guardar  en el cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
	if (res.ok) {
		return caches.open(dynamicCache).then(cache => {
			cache.put(req, res.clone())

			return res.clone()
		})
	} else {
		return res
	}
}

// Cache with network update
function actualizaCacheStatico(staticCache, req, APP_SHELL_INMUTABLE) {
	if (APP_SHELL_INMUTABLE.includes(req.url)) {
		// No hace falta actualizar el inmutable
		// console.log('existe en inmutable', req.url );
	} else {
		// console.log('actualizando', req.url );
		return fetch(req).then(res => {
			return actualizaCacheDinamico(staticCache, req, res)
		})
	}
}

// metwork with cache fallback
const apiMensajes = (cacheName, req) => {
	console.log(cacheName)

	if (req.clone().method === 'POST') {
		//  posteo de un nuevo mensaje
		req
			.clone()
			.text()
			.then(body => {
				const bodyObj = JSON.parse(body)
				saveMsg(bodyObj)
			})
		// guardado en indexDB
		return fetch(req)
	} else {
		fetch(req)
			.then(resp => {
				if (resp.ok) {
					actualizaCacheDinamico(cacheName, req, resp.clone())
					return resp.clone()
				} else {
					return caches.match(req)
				}
			})
			.catch(err => {
				return caches.match(req)
			})
	}
}
