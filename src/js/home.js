console.log('hola mundo!');
const noCambia = "Leonidas";

let cambia = "@LeonidasEsteban"

function cambiarNombre(nuevoNombre) {
  cambia = nuevoNombre
}


//promesas

const getUserAll = new Promise(function(todoBien, todoMal){
	//llamar a un api
	// setInterval() se ejecuta por intervalos de tiempo
	//setTimeout() se ejecuta una sola vez en determinado tiempo
	setTimeout(function(){
		//luego de 3 seg
		//todoBien();
		todoBien('se acabó el tiempo')
	}, 5000)
})

const getUser = new Promise(function(todoBien, todoMal){
	//llamar a un api
	// setInterval() se ejecuta por intervalos de tiempo
	//setTimeout() se ejecuta una sola vez en determinado tiempo
	setTimeout(function(){
		//luego de 3 seg
		//todoBien();
		todoBien('se acabó el tiempo 3')
	}, 3000)
})

/*getUser
	.then(function(){
		console.log('vamos bien!')
	})
	.catch(function (message){
		console.log(message)
	})
*/
Promise.race([
	getUser,
	getUserAll
])
.then(function(message){
	console.log(message)
})
.catch(function(message){
	console.log(message)
})



//XMLHttpRequest:
$.ajax('https://randomuser.me/api/dfgsdg',{
	method:'GET',
	success: function(data){
		console.log(data)
	},
	error: function(error){
		console.log(error)
	}
})

//fetch

fetch('https://randomuser.me/api/')
	.then(function(response){
		//console.log(response)
		return response.json()
	})
	.then(function(user){
		console.log('user',user.results[0].name.first)
	})
	.catch(function(){
		console.log('algo falló')
	});




//funcion asíncrona

(async function load (){
	//await 
	//generos: action, terror, animation
	async function getData(url){
		const response = await fetch(url)
		const data = await response.json()
		return data;
	}

	const actionList = await getData('https://yts.mx/api/v2/list_movies.json?genre=action')
	const dramaList = await getData('https://yts.mx/api/v2/list_movies.json?genre=drama')
	const animationList = await getData('https://yts.mx/api/v2/list_movies.json?genre=animation')
	console.log(actionList, dramaList, animationList)

	function videoItemTemplate(movie){
		return (
			`<div class="primaryPlaylistItem">
		        <div class="primaryPlaylistItem-image">
		          <img src="${movie.medium_cover_image}">
		        </div>
		        <h4 class="primaryPlaylistItem-title">
		          ${movie.title}
		        </h4>
		      </div>`
		)
	}

	function createTemplate(HTMLString){
		const $html = document.implementation.createHTMLDocument()
		$html.body.innerHTML = HTMLString
		return $html.body.children[0]
	}

	//console.log(videoItemTemplate('src/images/covers/bitcoin.jpg', 'bitcoin'))
	
	const $actionContainer = document.querySelector('#action')

	function renderMovieList(list, $container){

		//actionList.data.movies
		list.forEach((movie) =>{
			const HTMLString = videoItemTemplate(movie)
			const movieElement = createTemplate(HTMLString)
			$container.append(movieElement)
		})
	}

	//con promesas

	/*let terrorList; 
	getData('https://yts.mx/api/v2/list_movies.json?genre=terror')
		.then(function(data){
			console.log('terrorList', data);
			terrorList = data;
		})*/



	//selectores:

	//con Jquery:
		//const $home = $('.home')

	//con js
	const $dramaContainer = document.getElementById('#action')
	const $animationContainer = document.querySelector('#animation')


	const $featuringContainer = document.querySelector('#featuring')
	const $form = document.querySelector('#form')
	const $home = document.querySelector('#home')


	const $modal = document.getElementById('modal')
	const $overlay = document.getElementById('overlay')
	const $hideModal = document.getElementById('hide-modal')


	const $modalTitle = $modal.querySelector('h1')
	const $modalImage = $modal.querySelector('img')
	const $modalDescription = $modal.querySelector('p')

	

})()