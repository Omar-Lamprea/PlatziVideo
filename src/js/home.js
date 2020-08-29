// console.log('hola mundo!');

// //promesas

// const getUserAll = new Promise(function(todoBien, todoMal){
// 	//llamar a un api
// 	// setInterval() se ejecuta por intervalos de tiempo
// 	//setTimeout() se ejecuta una sola vez en determinado tiempo
// 	setTimeout(function(){
// 		//luego de 3 seg
// 		//todoBien();
// 		todoBien('se acabó el tiempo 5')
// 	}, 5000)
// })

// const getUser = new Promise(function(todoBien, todoMal){
	
// 	setTimeout(function(){
// 		todoBien('se acabó el tiempo 3')
// 	}, 3000)
// })

// /*getUser
// 	.then(function(){
// 		console.log('vamos bien!')
// 	})
// 	.catch(function (message){
// 		console.log(message)
// 	})
// */
// Promise.all([
// 	getUser,
// 	getUserAll
// ])
// .then(function(message){
// 	console.log(message)
// })
// .catch(function(message){
// 	console.log(message)
// })



// //XMLHttpRequest:
// // $.ajax('https://randomuser.me/api/',{
// // 	method:'GET',
// // 	success: function(data){
// // 		console.log(data)
// // 	},
// // 	error: function(error){
// // 		console.log(error)
// // 	}
// // })



//fetch




//funcion Playlist de amigos



//funcion asíncrona, lista de pelis

(async function load (){
	fetch('https://randomuser.me/api/?results=10')
	.then(function(response){
		//console.log(response)
		return response.json()
	})
	.then(function(user){
		const listFriends = document.getElementById('listFriends')
		user.results.forEach( u => {

			const templateUser = `
			  <a href="#">
			    <img src="${u.picture.thumbnail}" />
			    <span>
			      ${u.name.first} ${u.name.last}
			    </span>
			  </a>`
			const li = document.createElement('li')
			li.classList.add('playlistFriends-item')
			li.innerHTML = templateUser
			listFriends.appendChild(li)
			li.addEventListener('click', showFriendModal)

			function showFriendModal(){
				$overlay.classList.add('active')
				$modal.style.animation = 'modalIn .8s forwards'
				$modalImage.setAttribute('src', u.picture.large)
				$modalTitle.innerHTML = `${u.name.first} ${u.name.last}`
				$modalDescription.innerHTML = `City: ${u.location.city} <br> Email: ${u.email} <br> Phone: ${u.phone}`

			}
		})
	})
	.catch(function(error){
		console.log('algo falló')
	});
	//await 
	//generos: action, terror, animation
	async function getData(url){
		try{
			const response = await fetch(url)
			const data = await response.json()
			if(data.data.movie_count > 0){
				//fin de la función si hay peli
				return data;
			}
			// si no hay peli, acá sigue
			throw new Error('No se encontó ningún resultado')
		} catch(error){
			console.error('algo falló')
		}
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
		          <p class="featuring-album">${peli.title}</p>
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
		try {
		const {
			data:{
				movies: pelis
			}
		} = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
		
		const HTMLString = featuringTemplate(pelis[0])
		$featuringContainer.innerHTML = HTMLString;
		}catch(error){
			alert(error.message)
			$loader.remove()
			$home.classList.remove('search-active')
		}

	})

	//creacion de templates para la lista

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
			const image = movieElement.querySelector('img')
			image.addEventListener('load', (event)=>{
				event.srcElement.classList.add('fadeIn')
			})
			addEventClick(movieElement)
		})
	}

	//petición API y render templates

	const {data: {movies: actionList} } = await getData(`${BASE_API}list_movies.json?genre=action`)
	const $actionContainer = document.querySelector('#action')
	renderMovieList(actionList, $actionContainer, 'action')


	const {data: {movies: dramaList} } = await getData(`${BASE_API}list_movies.json?genre=drama`)
	const $dramaContainer = document.getElementById('drama')
	renderMovieList(dramaList, $dramaContainer, 'drama')


	const {data: {movies: animationList} } = await getData(`${BASE_API}list_movies.json?genre=animation`)
	const $animationContainer = document.querySelector('#animation')
	renderMovieList(animationList, $animationContainer, 'animation')


	//console.log('actionList: ',actionList, 'dramaList: ',dramaList, 'animationList: ', animationList)

	//modal x peli

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