'use strict'

class Informer {
   // массив иконок (солнечно, облачно, дождь, снег)
   #imagesWeather = [
      {title: 'Clear', url: 'src="./images/sun.png" alt="sunny"'},
      {title: 'Clouds', url: 'src="./images/cloudy-sun.png" alt="cloudy"'},
      {title: 'Haze', url: 'src="./images/cloudy.png" alt="cloudy"'},
      {title: 'Rain', url: 'src="./images/rainy.png" alt="rainy"'},
      {title: 'Snow', url: 'src="./images/snow.png" alt="snowy"'},
   ];
 
   #data;
   #weatherData = [];

   constructor(container) {
      this.api = 'http://api.openweathermap.org/data/2.5/weather?q=Poltava&units=metric&APPID=f87bc2c36adb84eb70ac5df2593571c6';
      this.apiPoltava = 'https://api.openweathermap.org/data/2.5/forecast?lat=49.59&lon=34.54&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6';
      
      // Для температуры в градусах Цельсия и скорости ветра в метрах/сек после q=Poltava нужно добавить &units=metric (единицы=метрические)
      // По умолчанию используется температура в градусах Кельвина и скорость ветра в метрах/сек
      
      this.informer = document.querySelector(container);
      this.informerToday = this.informer.querySelector('.informer__today');
      this.informerForecast = this.informer.querySelector('.informer__forecast');
      this.search = document.querySelector('.header__search input');
      this.search = document.getElementById('search');
      this.tabsMenu = document.querySelector('.tabs-menu');
      this.tabToday = this.tabsMenu.querySelector('.tab-today');
      this.tabForecast = this.tabsMenu.querySelector('.tab-forecast');
   }

   getApi(city) {
      // let value = this.search.value;
      // console.log(value);
      return `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=f87bc2c36adb84eb70ac5df2593571c6`;
   }

   getWeather(api) {
      // fetch(api) // api города из поля поиска 
         // нужны координаты для почасового прогноза
      fetch(this.apiPoltava)
         .then(response => {
            if(response.ok) {
               return response.json();
            } else {
               throw 'Помилка HTTP: ' + response.status;
            }             
         })
         .then((response) => {           
            if(!response) {
               return
            } else {   
               this.#data = response;
               console.log(this.#data); 
               this.getWeatherData();
               console.log(this.#weatherData); 
               // this.renderInformer();
              
            }
         })
         .catch(() => this.renderErrorBlock()); 
   }

   // getDate() {
   get currentDate() {
      let date = new Date();
      let day = date.getDate().toString().padStart(2, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      let year = date.getFullYear().toString();
      
      let currentDate = `${day}.${month}.${year}`;
      // console.log(currentDate);
      return currentDate;
   }

   getWeatherData() {     
      this.#data.list.forEach((elem, index) => {
         let obj = {};         
         let date = new Date(elem.dt * 1000);
         
         obj.date = date.getDate(); 
         obj.month = date.toLocaleString('en-US', {month: 'short'}).toUpperCase();
         obj.day = date.toLocaleString('en-US', {weekday: 'long'}).toUpperCase();
         obj.dayShort = date.toLocaleString('en-US', {weekday: 'short'}).toUpperCase();
      
         obj.temp = Math.round(elem.main.temp);
         obj.tempFeel = Math.round(elem.main.feels_like);
         obj.descr = elem.weather[0].main;

         let time = date.getHours();
         if(time > 12) {
            obj.time = (time - 12) + 'pm';
         } else {
            obj.time = time + 'am';
         }

         let curWeather = elem.weather[0].main;
         let curClouds =  elem.clouds.all; 
         obj.image = this.getWeatherImg(curWeather, curClouds);

         obj.wind = Math.round(elem.wind.speed);
         obj.windDeg = this.getWindDirection(elem.wind.deg);
         
         // console.log(obj);
         // this.#weatherData[index] = obj;
         this.#weatherData[index] = obj;
      })
      console.log(this.#weatherData);
   }

   getWeatherImg(weather, clouds) {
      // соответствующая погоде картинка: 
      if(weather == 'Clear') return this.#imagesWeather[0].url;
      if(weather == 'Clouds' && clouds < 90) return this.#imagesWeather[1].url;
      if(weather == 'Clouds' && clouds > 90) return this.#imagesWeather[2].url;
      if(weather == 'Haze' || weather == 'Mist') return this.#imagesWeather[2].url;
      if(weather == 'Rain') return this.#imagesWeather[3].url;
      if(weather == 'Snow') {
         return this.#imagesWeather[4].url;
      }
      else {
         return this.#imagesWeather[1].url;
      } 
   }

   getWindDirection(deg) {
      if (deg < 25 && deg > 335) return 'N'; // NORTH (N)
      if (deg > 25 && deg < 65) return 'NE'; // северо-восток (NE)
      if (deg > 65 && deg < 115) return 'E'; // EAST (E)
      if (deg > 115 && deg < 155) return 'SE'; // юго-восток (SE)
      if (deg > 155 && deg < 205) return 'S'; // SOUTH (S)
      if (deg > 205 && deg < 245) return 'SW'; // юго-запад (SW)
      if (deg > 245 && deg < 295) return 'W'; // WEST (W)
      if (deg > 295 && deg < 335) return 'NW'; // северо-запад (NW)
   }

   renderInformer() {} 

   getWeatherForecast() {}

   renderErrorBlock() {
      let value = this.search.value;
      console.log(value);
      this. informer.innerHTML = `<div class="error">
                                       <img src="images/img_error.jpg" alt="">
                                       <p>${value} could not be found.</p>
                                       <p>Please enter a different location.</p>
                                   </div>`;
   }

   init() {
      this.getWeather(); 
      this.tabsMenu.addEventListener('click', this.getWeatherForecast.bind(this));
   }
 }


// const info = new Informer();
// info.init();
new Informer('.informer').init();

//--------------------------------------------------
// Определение геолокации

// function success(pos) {
//    var crd = pos.coords;

//    console.log(`Широта: ${crd.latitude}`); // Широта: 42.5237237
//    console.log(`Долгота: ${crd.longitude}`); // Долгота: -7.5219799
//    // console.log(`Плюс-минус ${crd.accuracy} метров.`);
// }

// function error(err) {
//    console.warn(`ERROR(${err.code}): ${err.message}`);
// }

// navigator.geolocation.getCurrentPosition(success, error);
