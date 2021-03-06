var url = window.location.href
var swLocation = '/twittor/sw.js'

if (navigator.serviceWorker) {
	if (url.includes('localhost')) {
		swLocation = '/sw.js'
	}

	navigator.serviceWorker.register(swLocation)
}

// Referencias de jQuery

var titulo = $('#titulo')
var nuevoBtn = $('#nuevo-btn')
var salirBtn = $('#salir-btn')
var cancelarBtn = $('#cancel-btn')
var postBtn = $('#post-btn')
var avatarSel = $('#seleccion')
var timeline = $('#timeline')

var modal = $('#modal')
var modalAvatar = $('#modal-avatar')
var avatarBtns = $('.seleccion-avatar')
var txtMensaje = $('#txtMensaje')

// El usuario, contiene el ID del hÃ©roe seleccionado
var usuario

// ===== Codigo de la aplicaciÃ³n

function crearMensajeHTML(mensaje, personaje) {
	var content = `
    <li class="animated fadeIn fast">
        <div class="avatar">
            <img src="img/avatars/${personaje}.jpg">
        </div>
        <div class="bubble-container">
            <div class="bubble">
                <h3>@${personaje}</h3>
                <br/>
                ${mensaje}
            </div>
            
            <div class="arrow"></div>
        </div>
    </li>
    `

	timeline.prepend(content)
	cancelarBtn.click()
}

// Globals
function logIn(ingreso) {
	if (ingreso) {
		nuevoBtn.removeClass('oculto')
		salirBtn.removeClass('oculto')
		timeline.removeClass('oculto')
		avatarSel.addClass('oculto')
		modalAvatar.attr('src', 'img/avatars/' + usuario + '.jpg')
	} else {
		nuevoBtn.addClass('oculto')
		salirBtn.addClass('oculto')
		timeline.addClass('oculto')
		avatarSel.removeClass('oculto')

		titulo.text('Seleccione Personaje')
	}
}

// Seleccion de personaje
avatarBtns.on('click', function () {
	usuario = $(this).data('user')

	titulo.text('@' + usuario)

	logIn(true)
})

// Boton de salir
salirBtn.on('click', function () {
	logIn(false)
})

// Boton de nuevo mensaje
nuevoBtn.on('click', function () {
	modal.removeClass('oculto')
	modal.animate(
		{
			marginTop: '-=1000px',
			opacity: 1,
		},
		200
	)
})

// Boton de cancelar mensaje
cancelarBtn.on('click', function () {
	if (!modal.hasClass('oculto')) {
		modal.animate(
			{
				marginTop: '+=1000px',
				opacity: 0,
			},
			200,
			function () {
				modal.addClass('oculto')
				txtMensaje.val('')
			}
		)
	}
})

// Boton de enviar mensaje
postBtn.on('click', function () {
	var mensaje = txtMensaje.val()
	if (mensaje.length === 0) {
		cancelarBtn.click()
		return
	}

	const data = {
		mensaje: mensaje,
		user: usuario,
	}
	// console.log('la data', data)
	fetch('api', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	})
		.then(resp => resp.json())
		.then(resp => console.log('app.js', resp))
		.catch(err => console.log('app.js error:', err))

	crearMensajeHTML(mensaje, usuario)
})

// api functions
const getMesanjes = () => {
	fetch('/api').then(resp =>
		resp.json().then(posts => {
			posts.map(post => crearMensajeHTML(post.mensaje, post.user))
		})
	)
}

const isOnline = () => {
	if (navigator.onLine) {
		console.log('working online')
		mdtoast('working online', {
			interaction: true,
			interactionTimeout: 1000,
			actionText: 'ok!',
		})
	} else {
		console.log('working offline')
		mdtoast('working offline', {
			interaction: true,
			actionText: 'ok',
			type: 'warning',
		})
	}
}

window.addEventListener('online', isOnline)
window.addEventListener('offline', isOnline)

isOnline()
getMesanjes()
