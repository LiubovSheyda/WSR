const NotFound = { template: 'not-found' }
const Home = { template: 'home' }
const Flight = { template: 'flight' }
const Booking = { template: 'booking' }

const API_URL = 'http://localhost/api';
const CL_URL = 'http://localhost';

const routes = {
	'': Home,
	'flight' : Flight,
	'booking' : Booking
}

// Форма поиска - главная страница
Vue.component('home', {
	data: function() {
		return {
			fromC: 'Moscow',
            toC: 'Kazan',
            dateD: '2020-10-10',
            dateA: '2020-10-13',
            passA: 2,
            param: []
		}
	},
	template:
	`<section class="mt-5">
            <h2 class="mb-4">Flight search</h2>
            <form @submit.prevent="startSearch">
                <div class="row">
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3 pr-lg-0">
                        <input type="text" v-model="fromC" class="form-control test-0-fd w-100" placeholder="From where" value="">
                        <div id="fromC" class="invalid-feedback">Error message</div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-4 mt-3 col-xl-3 mt-sm-0 pr-lg-0">
                        <input type="text" v-model="toC" class="form-control test-0-fa w-100" placeholder="To where" value="">
                        <div class="invalid-feedback">Error message</div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 mt-3 col-xl-2 mt-lg-0 pr-lg-0">
                        <input type="text" v-model="dateD" class="form-control test-0-fdt" placeholder="Departing" value="">
                        <div class="invalid-feedback">Error message</div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 mt-3 col-xl-2 mt-lg-0 pr-xl-0">
                        <input type="text" v-model="dateA" class="form-control test-0-fat" placeholder="Returning" value="">
                        <div class="invalid-feedback">Error message</div>
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 mt-3 col-xl-1 mt-lg-0 pr-xl-0">
                        <select v-model="passA" class="form-control test-0-fnp" value="">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                        <div class="invalid-feedback">Error message</div>
                    </div>
                    <div class="col-12 col-xl-1 px-2 mt-3 mt-xl-0">
                        <button class="btn btn-success form-control test-0-fbs">Search</button>
                    </div>
                </div>
            </form>
        </section>

        <section class="mt-5">
            <h2 class="mb-4">Promotions</h2>

            <div class="row">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card">
                        <img src="assets/images/placeholder.jpg" class="card-img-top test-0-ai" alt="...">
                        <div class="card-body">
                            <h5 class="card-title test-0-an">Promotion 1</h5>
                            <p class="card-text test-0-ad">Promotion text</p>
                            <a href="#" class="btn btn-primary test-0-abm">More</a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card">
                        <img src="assets/images/placeholder.jpg" class="card-img-top test-0-ai" alt="...">
                        <div class="card-body">
                            <h5 class="card-title test-0-an">Promotion 1</h5>
                            <p class="card-text test-0-ad">Promotion text</p>
                            <a href="#" class="btn btn-primary test-0-abm">More</a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card">
                        <img src="assets/images/placeholder.jpg" class="card-img-top test-0-ai" alt="...">
                        <div class="card-body">
                            <h5 class="card-title test-0-an">Promotion 1</h5>
                            <p class="card-text test-0-ad">Promotion text</p>
                            <a href="#" class="btn btn-primary test-0-abm">More</a>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card">
                        <img src="assets/images/placeholder.jpg" class="card-img-top test-0-ai" alt="...">
                        <div class="card-body">
                            <h5 class="card-title test-0-an">Promotion 1</h5>
                            <p class="card-text test-0-ad">Promotion text</p>
                            <a href="#" class="btn btn-primary test-0-abm">More</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="mt-5">
            <h2 class="mb-4">Subscribe</h2>

            <form action="#">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <input type="email" class="form-control test-0-sie" placeholder="example@domain.com">
                    </div>
                    <div class="col-12 col-md-6">
                        <button class="btn btn-success w-100 test-0-sbs">Subscribe</button>
                    </div>
                </div>
            </form>
        </section>`,
	methods: {
		startSearch: function(){
            this.checkNameFrom();
        },
        checkNameFrom: function(){
            fetch(API_URL+'/airport'+'?query='+this.fromC, { method: 'GET' })
            .then(response => response.json())
            .then(commit => {this.fromC = commit.data.items[0].iata; this.checkNameto(); } )
            .catch((error) => {
                console.error('Error: ', error);
            });
        },
        checkNameto: function(){
            fetch(API_URL+'/airport'+'?query='+this.toC, { method: 'GET' })
            .then(response => response.json())
            .then(commit => {
            	this.toC = commit.data.items[0].iata; 
            	this.param.push(this.fromC, this.toC, this.dateD, this.dateA, this.passA);

            	//window.location.href = CL_URL+'/#flight?from='+this.fromC+'&to='+this.toC+'&date1='+this.dateD+'&date2='+this.dateA+'&passengers='+ this.passA;
            	window.location.href = CL_URL+'/#flight?param='+this.param;
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        },
	}
});

// Вывод рейсов
Vue.component('flight', {
	data: function() {
		return {
			flights: [],
			flight_from_data: [],
 			flight_back_data: [],			
            param: window.location.hash.replace('#', '').split('?param=')[1]
		}
	},
	created: function() {	
		
		//console.log('param => '+this.param);
		this.param = this.param.split(',');
		let fromC = this.param[0];
        let toC = this.param[1];
        let dateD = this.param[2];
        let dateA = this.param[3];
        let passA = this.param[4];

       	fetch(API_URL+'/flight?from='+fromC+'&to='+toC+'&date1='+dateD+'&date2='+dateA+'&passengers='+passA, {
              method: 'GET'
            })
            .then(response => response.json())
            .then(flights => {this.flights = flights;})
            .catch((error) => {
              console.error('Error:', error);
            });	
	},

	template:
	`<div v-for="flight in flights">
	<div class="card mb-5">
		  <div class="card-body">
		    <h3>From <span style="color: skyblue;">{{ flight.flights_to[0].from.city }}</span> To <span style="color: skyblue">{{ flight.flights_to[0].to.city }}</span> Flight date: <span style="color: lightgreen">{{ flight.flights_to[0].from.date }}</span></h3>

			<table border="1" cellpadding="20%">
				<tr>
				<th>Chosen flight</th>
				<th>Flight Code</th>
				<th>Airport</th>
				<th>Departure time</th>
				<th>Landing airport</th>
				<th>Arrival time</th>
				<th>Cost</th>
				<th>Available seats</th>
				</tr>
				<template v-for="fli in flight.flights_to">
				<tr>
				<td> <input type="radio" name="fromTo" :value="fli" v-model="flight_from_data"> </td>
				<td> {{ fli.flight_code }} </td>
				<td> {{ fli.from.airport }} ({{ fli.from.iata }}) </td>
				<td> {{ fli.from.time }} </td>
				<td> {{ fli.to.airport }} ({{ fli.to.iata }}) </td>
				<td> {{ fli.to.time }} </td>
				<td> {{ fli.cost }} </td>
				<td> {{ fli.availability }} </td>
				</tr>
				</template>
			</table>
			<h3>From <span style="color: skyblue;">{{ flight.flights_back[0].from.city }}</span> To <span style="color: skyblue">{{ flight.flights_back[0].to.city }}</span> Flight date: <span style="color: lightgreen">{{ flight.flights_back[0].from.date }}</span></h3>
			<table border="1" cellpadding="20%">
				<tr>
				<th>Chosen flight</th>
				<th>Flight Code</th>
				<th>Airport</th>
				<th>Departure time</th>
				<th>Landing airport</th>
				<th>Arrival time</th>
				<th>Cost</th>
				<th>Available seats</th>
				</tr>
				<template v-for="fli in flight.flights_back">
				<tr>
				<td> <input type="radio" name="backTo" :value="fli" v-model="flight_back_data"> </td>
				<td> {{ fli.flight_code }} </td>
				<td> {{ fli.from.airport }} ({{ fli.from.iata }}) </td>
				<td> {{ fli.from.time }} </td>
				<td> {{ fli.to.airport }} ({{ fli.to.iata }}) </td>
				<td> {{ fli.to.time }} </td>
				<td> {{ fli.cost }} </td>
				<td> {{ fli.availability }} </td>
				</tr>
				</template>
			</table>
		  </div>
		  <button v-on:click="startBooking" class="btn btn-primary">Go booking</button>
		</div>
		</div>`,
	methods: {
		startBooking: function() {
			//console.log('flight_from_data => '+this.flight_from_data);
			//console.log('flight_back_data => '+this.flight_back_data);
			this.param = [];
			this.param.push(this.flight_from_data.flight_id, this.flight_back_data.flight_id);
			window.location.href = CL_URL+'/#booking?param='+this.param;
		}
	}
});


// Оформление бронирования
Vue.component('booking', {
	data: function() {
		return {	
			param: window.location.hash.replace('#', '').split('?param=')[1],
			flight_from_id: '',
 			flight_back_id: '',		
		}
	},
	created: function() {
		console.log('param => '+this.param);
		this.param = this.param.split(',');
        this.flight_from_id = this.param[0];
 		this.flight_back_id = this.param[1];	
	},
	template:
	`
	<div>
		 <table class="table table-hover table-bordered">
                <tr>
                    <th>Flight</th>
                    <th>From where</th>
                    <th>Date and time of departure</th>
                    <th>To where</th>
                    <th>Flight time</th>
                    <th>Cost</th>
                </tr>
                <tr>
                    <td class="test-5-fc">{{ flight_from_id }}</td>
                    <td>
                        <span class="test-5-from-cn">Kazan</span>,
                        <span class="test-5-from-an">International airport</span> 
                    </td>
                    <td>
                        <span class="test-5-dd">10-09-2020</span>
                        at
                        <span class="test-5-dt">08:00</span>
                    </td>
                    <td class="test-5-to">
                        <span class="test-5-to-cn">Moscow</span>,
                        <span class="test-5-to-an">Sherementievo</span> 
                    </td>
                    <td class="test-5-at">09:30</td>
                    <td class="test-5-fp">8000</td>
                </tr>
                
                <tr>
                    <td class="test-5-fc">FC 2161</td>
                    <td class="test-5-from">
                        <span class="test-5-from-cn">Moscow</span>,
                        <span class="test-5-from-an">Sherementievo</span> 
                    </td>
                    <td>
                        <span class="test-5-dd">20-09-2020</span>
                        at
                        <span class="test-5-dt">10:00</span>
                    </td>
                    <td class="test-5-to">
                        <span class="test-5-to-cn">Kazan</span>,
                        <span class="test-5-to-an">International airport</span> 
                    </td>
                    <td class="test-5-at">11:30</td>
                    <td class="test-5-fp">9000</td>
                </tr>
                <tr>
                    <td colspan="5" class="text-right">
                        <b>Total cost</b>
                    </td>
                    <td colspan="1" class="text-right test-5-price">16000</td>
                </tr>
            </table>
		</div>
		`,
	methods: {
		Booking: function() {
			//window.location.href = CL_URL+'/#code?param='+this.param;
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
});