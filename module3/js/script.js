const NotFound = { template: 'not-found' }
const Home = { template: 'auth' }
const AddPhoto = { template: 'addphoto' }
const PhotoUser = { template: 'photouser' }
const EditPhoto = { template: 'editphoto' }
const FindUser = { template: 'finduser' }
const FindPhoto = { template: 'findphoto' }

const Authorization = { template: 'auth' }
const Registration = { template: 'registration' }

const API_URL = 'http://localhost/api';
const CL_URL = 'http://localhost';

const routes = {
	'': Home,
	'auth' : Authorization,
	'registration' : Registration,	
	'addphoto' : AddPhoto,
	'photouser': PhotoUser,
	'editphoto': EditPhoto,
	'finduser': FindUser,
	'findphoto': FindPhoto
}

// Авторизация
Vue.component('auth', {
	data: function() {
		return {
			phone: [],
			password: [],
			errors: null
		}
	},
	template:
	`<div class="row auth">
	<div class="col-12">
	<p class="title">Авторизуйтесь</p>
	<form @submit.prevent="login">
	<div class="form_group">
	<input type="text" v-model="phone" name="phone" class="input_login" placeholder="Логин"/>
	</div>
	<div class="form_group">
	<input type="password" v-model="password" name="password" class="input_password" placeholder="Пароль">
	</div>
	<div class="form_group">
	<input type="submit" name="" placeholder="Вход" class="input_submit" value="Вход">
	</div>
	</form>
	<p>{{errors}}</p>
	</div>
	</div>`,
	methods: {
		login: function() {
			var self = this;

			fetch(API_URL + '/login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					phone: self.phone,
					password: self.password
				}),
			})
			.then(function(response) {
				response.json().then(function(data) {			
					if(response.status == 200) {					
						if(data.errors) {
							self.errors = data.errors.login[0];
						} else {
							localStorage.setItem('token', data.token);
							window.location.href = CL_URL+"/#photouser";
						}
					}
					if (response.status == 422) {
						alert("Заполните правильно поля")
						window.location.reload();
					}
					if (response.status == 404) {
						alert("неверный логин или пароль")
						window.location.reload();
					}
				})
			})
		}
	}
});

// Регистрация
Vue.component('registration', {
	data: function() {
		return {
			first_name: [],
			surname: [],
			phone: [],
			password: [],
			errors: null
		}
	},
	template:
	`<div class="row auth">
	<div class="col-12">
	<p class="title">Регистрация</p>
	<form @submit.prevent="signup">
	<div class="form_group">
	<input type="text" v-model="first_name" name="first_name" class="input_login" placeholder="Имя"/>
	</div>
	<div class="form_group">
	<input type="text" v-model="surname" name="surname" class="input_login" placeholder="Фамилия"/>
	</div>
	<div class="form_group">
	<input type="text" v-model="phone" name="phone" class="input_login" placeholder="Телефон"/>
	</div>
	<div class="form_group">
	<input type="password" v-model="password" name="password" class="input_password" placeholder="Пароль">
	</div>
	<div class="form_group">
	<input type="submit" name="" placeholder="Зарегистрироваться" class="input_submit" value="Зарегистрироваться">
	</div>
	</form>
	<p>{{errors}}</p>
	</div>
	</div>`,
	methods: {
		signup: function() {
			var self = this;

			fetch(API_URL + '/signup', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					first_name: self.first_name,
					surname: self.surname,
					phone: self.phone,
					password: self.password
				}),
			})
			.then(function(response) {
				response.json().then(function(data) {
					// надо добавить ошибки status
					if(data.errors) {
						self.errors = data.errors.signup[0];
					} else {
						alert("Вы успешно зарегистрировались");
						window.location.href = CL_URL+"/#auth";
					}
				})
			})
		}
	}
});

// Добавить фото
Vue.component('addphoto', {
        data: function() {
            return {
                photo: []
            }
        },
        template:
		`<form>
		    <div>
		        <label>Выберите изображение для загрузки</label><br>
		        <input type="file" id="fileImage" accept="image/jpeg, image/jpg, image/png">
		    </div>
		    <br>
		    <button type="submit" id="upload">Отправить</button>
		</form>`,
        mounted: function() {
			const input = document.getElementById('fileImage');
			const submit = document.getElementById('upload');

			submit.addEventListener('click', () => {
			    uploadFile(input.files[0]);
			});

			const uploadFile = (file) => {

			    /*if(!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
			        alert('Разрешены только изображения.');
			        return;
			    }

			    if (file.size > 2 * 1024 * 1024) {
			        alert('Файл должен быть менее 2 МБ.');
			        return;
			    }*/
			    
			    const fData = new FormData();
			    fData.append('photo', file);

			    // отправляем `POST` запрос 
			    fetch(API_URL + '/photo', {
			        method: 'POST',
			        headers: {						
							'Authorization' : 'Bearer '+localStorage.getItem('token'),
							//'Content-Type': 'application/x-www-form-urlencoded' 
						},
			        body: fData
			    })
			    .then(function(response) {
				response.json().then(function(data) {
					if(response.status == 201) {						
						alert("Фото добавлено");
						//window.location.reload();
					}
					else if (response.status == 403) {
						alert("Для добавления фото Вам необходимо авторизоваться");	
						//alert(response.statusText);
						window.location.href = CL_URL+"/#auth";

					}
					else alert(response.statusText);					
				})
				//.catch(err => console.error(err));
			})			    
			}
        }
});

// Фото пользователя
Vue.component('photouser', {
	data: function() {
		return {
			photos: []			
		}
	},
	template: `
	<div>
		<div class="title">Мои фото</div>
		<div v-for="photo in photos">
			<div class="row list__element ">			
				<div class="col-3 col-md-2 align-self-center">
				<img :src="photo.url" class="list__img">
				</div>
				<div class="col-6 col-md-8 align-self-center">
				<div class="list__description">
				{{photo.name}} <p class="d-none">(id {{photo.id}})</p><br>
				<a :href="CL_URL+'/#editphoto?id='+photo.id"><button>Редактировать</button></a>
				<button @click.prevent="delPhoto(photo.id)">Удалить</button>
				</div>
				</div>	
			</div>
		</div>
		</div>
	</div>`,
	beforeDestroy() {	
		clearInterval(this.interval)
	},
	created: function() {
		var self = this;
		
		//this.interval = setInterval(function() {
			// start
			fetch(API_URL + '/photo', {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) {
						self.photos = data;
					}						
					else if (response.status == 403) {
						alert("Для просмотра фото Вам необходимо авторизоваться");	
						//alert(response.statusText);
						window.location.href = CL_URL+"/#auth";
						window.location.reload();
					}
					else alert(response.statusText)
				})
			}) 
			// end			
		//}, 1000);
	},
	methods: {
		delPhoto: function(id) {
			var self = this;

			fetch(API_URL + '/photo/'+id, {
				method: 'delete',
				headers: {
					'Authorization' : 'Bearer '+localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 204) {
					}
					else if(response.status == 403)
						window.location.href = CL_URL+"/#auth";
					else 
						alert(response.statusText);
					//window.location.reload();
				})
			})
		}
	}
});

// Редактирование фото
Vue.component('editphoto', {
        data: function() {
            return {            	
            	name: null,
            	photo: null,            	
            	photoId: window.location.hash.replace('#', '').split('?id=')[1]
            }
        },
        template:
		`<div class="row auth">
		<div class="col-12">
		<p class="title">Изменить фото</p>
		<form @submit.prevent="updatePhoto">
		<div class="form_group">
		<input type="text" v-model="name" name="name" class="input_login" />
		</div>		
		<div class="form_group">
		<img :src="photo" class="list__img">
		</div>
		<div class="form_group">
		<input type="submit" name="" placeholder="Сохранить" class="input_submit" value="Сохранить">
		</div>
		</form>
		</div>
		</div>	    
		</form>`,
		created: function() {
			var self = this;	

			fetch(API_URL + '/photo/'+this.photoId, {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer '+localStorage.getItem('token'),
					'Content-Type': 'application/x-www-form-urlencoded' 
				},				
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) {						
						self.name = data.name;
						self.photo = data.url;
					}
					else if(response.status == 403)
						window.location.href = CL_URL+"/#auth";
					else 
						alert(response.statusText)
				})
			})
		},
		methods: {
			updatePhoto: function() {
				self = this;

				const fData = new FormData();
				fData.append('_method', 'patch');
				fData.append('name', self.name);		
			    fData.append('photo', self.photo);

				fetch(API_URL + '/photo/'+this.photoId, {
					method: 'post',
					headers: {
						'Authorization': 'Bearer ' + localStorage.getItem('token'),
						//'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: fData
				})
				.then(function(response) {
					response.json().then(function(data) {
						if(response.status == 200) {						
							alert("Имя фото обновлено");
							//window.location.reload();
							window.location.href = CL_URL+"/#photouser"
						}
						else if(response.status == 403)
							window.location.href = CL_URL+"/#auth";
						else 
							alert(response.statusText);

						if(data.errors) {
							self.errors = data.errors.updatePhoto[0];
							
						}		
					})
				})
			}
		}
});

// Выбор фото для шаринга
Vue.component('findphoto', {
	data: function() {
		return {
			photos: []			
		}
	},
	template: `
	<div>
		<div class="title">Выбор фото</div>
		<div v-for="photo in photos" href="#photos">
			<div class="row list__element ">			
				<div class="col-3 col-md-2 align-self-center">
				<img :src="photo.url" class="list__img">
				</div>
				<div class="col-6 col-md-8 align-self-center">
				<div class="list__description">
				{{photo.name}} <p class="d-none">(id {{photo.id}})</p><br>
				<a :href="CL_URL+'/#finduser?id='+photo.id"><button>Выбрать</button></a>
				</div>
				</div>	
			</div>
		</div>
		</div>
	</div>`,
	beforeDestroy() {	
		clearInterval(this.interval)
	},
	created: function() {
		var self = this;
		
		//this.interval = setInterval(function() {
			// start
			fetch(API_URL + '/photo', {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) {
						self.photos = data;
					}						
					else if (response.status == 403) {
						alert("Для просмотра фото Вам необходимо авторизоваться");	
						//alert(response.statusText);
						window.location.href = CL_URL+"/#auth";
					}
					else alert(response.statusText)
				})
			}) 
			// end			
		//}, 1000);
	},
});

// Поиск пользователя для шаринга
Vue.component('finduser', {
	data: function() {
		return {
			users: [],
			findword: null,
			errors: null,
			photoId: window.location.hash.replace('#', '').split('?id=')[1]
		}
	},
	template:
	`<div class="row auth">
	<div class="col-12">
	<p class="title">Поиск</p>
	<form @submit.prevent="find">
	<p>Введите поисковый запрос</p>
	<div class="form_group">
	<input type="text" v-model="findword" name="findword" class="input_login" placeholder="Пользователь" />
	</div>
	<div class="form_group">
	<input type="submit" name="" placeholder="Поиск" class="input_submit" value="Поиск">
	</div>
	</form>
	<div class="d-none" id="infouser">
	<div v-for="user in users">
		Имя пользователя - {{user.first_name}}<br>
		Фамилия пользователя - {{user.surname}}<br>
		Телефон пользователя - {{user.phone}}<br>
		<button @click.prevent="sharephoto(user.id)">Расшарить</button>
	</div>
	</div>
	<p>{{errors}}</p>
	</div>
	</div>`,
	methods: {
		find: function() {
			var self = this;
			// localStorage.setItem('photoId', self.photoId);
			const showInfoUser = document.getElementById('infouser');

			/*fetch(API_URL + '/user?search='+self.findword, {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer '+localStorage.getItem('token'),
					'Content-Type': 'application/json'
				}
			})*/
			var url = new URL(API_URL + '/user');
			var params = { search: self.findword };
			url.search = new URLSearchParams(params).toString();
			fetch(url, {
				method: 'get',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
			})
			.then(function(response) {
				response.json().then(function(data) {
					if(response.status == 200) {
						self.users = data;
						showInfoUser.classList.remove("d-none");
					}
					else if(response.status == 403)
						window.location.href = CL_URL+"/#auth";
					else 
						alert(response.statusText)
				})
			})

		},
		sharephoto: function(id) {
			var self = this;

			fetch(API_URL + '/user/'+id+'/share', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					photos: self.photoId
				}),
			})
			.then(function(response) {
				response.json().then(function(data) {
					// надо добавить ошибки status
					if(data.errors) {
						self.errors = data.errors.finduser[0];
					} else {
						alert("Вы успешно расшарили фото");
						window.location.href = CL_URL+"/#findphoto";
						window.location.reload();
					}
				})
			})
		}
	}

});

// Страница не найдена
Vue.component('not-found', {
	template: `<center><h1>Page not found</h1></center>`
});

var app = new Vue({
	el: '#app',
	data: {
		currentRoute: window.location.hash.replace('#', '').split('?')[0],
	},
	computed: {
		ViewComponent() {
			return routes[this.currentRoute] || NotFound
		}
	},
	render: function (h) {
		return h(this.ViewComponent.template);
	}
})

window.addEventListener('popstate', () => {
	app.currentRoute = window.location.hash.replace('#', '').split('?')[0];
	changeMenuState();
});

document.getElementById('logout').onclick = function() {
	localStorage.removeItem('token');
	/*fetch(API_URL + '/logout', {
				method: 'post',
				headers: {
					'Authorization' : 'Bearer ' + localStorage.getItem('token')
				}
			});*/
	window.location.href = CL_URL+"/#auth";
};

changeMenuState = function() {
	if(app.currentRoute != '' && app.currentRoute != 'auth' && app.currentRoute != '#') {
		document.getElementById('menu').classList.add('back');
	} else {
		document.getElementById('menu').classList.remove('back');
	}
}

//шторка
for (i = 0; i < document.querySelectorAll('.menu-close').length; ++i) {
	document.querySelectorAll('.menu-close')[i].addEventListener("click", function() {
		var slide = document.getElementById('slide');
		if(slide.style.visibility == 'visible') {
			slide.style.visibility = 'hidden';
			slide.style.marginLeft = '-300px';
		}
	})
};

document.getElementById('menu').onclick = function(e) {
	var slide = document.getElementById('slide');

	if(!this.classList.contains('back') && slide.style.visibility == 'hidden'){
		slide.style.visibility = 'visible';
		slide.style.marginLeft = '0';
	} else {
		history.back('1');
	}
}