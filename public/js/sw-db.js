//  utilities to save puchDB
const db = new PouchDB('mensajes')

const saveMsg = message => {
	message._id = new Date().toISOString()

	return db.put(message).then(() => {
		self.registration.sync.register('nuevo-post')
		const newResp = { ok: true, offline: true }

		return new Response(JSON.stringify(newResp))
	})
}

// posting message  to api
const postingMessage = () => {
	const posts = []
	return db.allDocs({ include_docs: true }).then(docs => {
		docs.rows.map(row => {
			const { doc } = row

			const fetchProm = fetch('api', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(doc),
			}).then(res => {
				return db.remove(doc)
			})

			posts.push(fetchProm)
		}) // end of the map

		return Promise.all(posts)
	})
}
