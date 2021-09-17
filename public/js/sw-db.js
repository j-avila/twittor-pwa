//  utilities to save puchDB
const db = new PouchDB('mensajes')

const saveMsg = message => {
	message._id = new Date().toISOString()

	db.put(message).then(msj => {
		console.log('mensaje guardado para posterior posteo')
	})
}
