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

	const $form = document.querySelector('#form')
	const $home = document.querySelector('#home')
		const $featuringContainer = document.getElementById('featuring')

	function setAttributes($element, attributes){
		for(const attribute in attributes){
			$element.setAttribute(attribute, attributes[attribute])

		}
	}

	const BASE_API = 'https://yts.mx/api/v2/'

	function featuringTemplate(peli){
		return(
			`<div class="featuring">
		        <div class="featuring-image">
		          <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
		        </div>
		        <div class="featuring-content">
		          <p class="featuring-title">Pelicula encontrada</p>
		          <p class="featuring-album">${peli.title}/p>
		        </div>
		      </div>`
			)
	}

	$form.addEventListener('submit', async (event) => {
		event.preventDefault();
		$home.classList.add('search-active')
		$featuringContainer.style.display = 'grid'
		const $loader = document.createElement('img')
		setAttributes($loader, {
			src: 'src/images/loader.gif',
			height: 50,
			width: 50,
		})
		$featuringContainer.append($loader)

		const data = new FormData($form)
		const {
			data:{
				movies: pelis
			}
		} = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
		
		const HTMLString = featuringTemplate(pelis[0])
		$featuringContainer.innerHTML = HTMLString;

	})

	const {data: {movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
	const {data: {movies: dramaList} } = await getData(`${BASE_API}list_movies.json?genre=drama`)
	const {data: {movies: animationList} } = await getData(`${BASE_API}list_movies.json?genre=animation`)
	console.log(actionList, dramaList, animationList)

	function videoItemTemplate(movie, category){
		return (
			`<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
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

	function addEventClick($element){

		//con js

		$element.addEventListener('click', () => {
			showModal($element)
		})

		//con jquery

		// $('.element').on('click', function(){
		// 	alert('click')
		// })
	}

	function renderMovieList(list, $container, category){

		//actionList.data.movies
		$container.children[0].remove()
		list.forEach((movie) =>{
			const HTMLString = videoItemTemplate(movie, category)
			const movieElement = createTemplate(HTMLString)
			$container.append(movieElement)
			addEventClick(movieElement)
		})
	}

	const $actionContainer = document.querySelector('#action')
	renderMovieList(actionList, $actionContainer, 'action')

	const $dramaContainer = document.getElementById('drama')
	renderMovieList(dramaList, $dramaContainer, 'drama')

	const $animationContainer = document.querySelector('#animation')
	renderMovieList(animationList, $animationContainer, 'animation')




	
	


	const $modal = document.getElementById('modal')
	const $overlay = document.getElementById('overlay')
	const $hideModal = document.getElementById('hide-modal')


	const $modalTitle = $modal.querySelector('h1')
	const $modalImage = $modal.querySelector('img')
	const $modalDescription = $modal.querySelector('p')

	function finById(list, id){
		return list.find(movie => movie.id === parseInt(id, 10))
	}

	function findMovie(id, category){
		switch(category){
			case 'action': {
				return finById(actionList, id)
			}
			case 'drama':{
				return finById(dramaList, id)
			}
			default: {
				return finById(animationList, id)
			}
		}
	}

	function showModal($element){
		$overlay.classList.add('active')
		$modal.style.animation = 'modalIn .8s forwards'
		const id = $element.dataset.id
		const category = $element.dataset.category
		const data = findMovie(id, category)
		//debugger
		$modalTitle.textContent = data.title
	 	$modalImage.setAttribute('src', data.medium_cover_image)
		$modalDescription.textContent = data.description_full
	}

	$hideModal.addEventListener('click', hideModal)

	function hideModal(){
		setTimeout(()=>{
		$overlay.classList.toggle('active');
		},1000);
		$modal.style.animation = 'modalOut .8s forwards';
	}

})()