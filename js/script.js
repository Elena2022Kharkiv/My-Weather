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
      this.search = document.getElementById('search');
      this.tabsMenu = document.querySelector('.tabs-menu');
      this.tabToday = this.tabsMenu.querySelector('.tab-menu__today');
      this.tabForecast = this.tabsMenu.querySelector('.tab-menu__forecast');
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
               this.renderWeatherInformer();
            }
         })
         .catch(() => this.renderErrorBlock()); 
         // написать разный текст ошибок
   }

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
      // console.log(this.#weatherData);
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
      if (deg < 25 || deg > 335) return 'N'; // NORTH (N)
      if (deg > 25 && deg < 65) return 'NE'; // северо-восток (NE)
      if (deg > 65 && deg < 115) return 'E'; // EAST (E)
      if (deg > 115 && deg < 155) return 'SE'; // юго-восток (SE)
      if (deg > 155 && deg < 205) return 'S'; // SOUTH (S)
      if (deg > 205 && deg < 245) return 'SW'; // юго-запад (SW)
      if (deg > 245 && deg < 295) return 'W'; // WEST (W)
      if (deg > 295 && deg < 335) return 'NW'; // северо-запад (NW)
   }
   get sunrise() {
      // let timestamp = this.#dataPoltava.sys.sunrise * 1000;
      let timestamp = this.#data.city.sunrise * 1000;
      // console.log(timestamp);
      let date = new Date(timestamp);
      // console.log(date);
      let hours = date.getHours();
      let minutes = date.getMinutes().toString().padStart(2, '0'); 
      let sunrise = `${hours}:${minutes}`;
      return sunrise;
   }

   get sunset() {
      // let timestamp = this.#dataPoltava.sys.sunset * 1000;
      let timestamp = this.#data.city.sunset * 1000;
      // console.log(timestamp);
      let date = new Date(timestamp);
      let hours = date.getHours();
      let minutes = date.getMinutes().toString().padStart(2, '0'); 
      let sunset = `${hours}:${minutes}`;
      return sunset;
   }

   get duration() {
      // let seconds = this.#dataPoltava.sys.sunset - this.#dataPoltava.sys.sunrise;
      let seconds = this.#data.city.sunset - this.#data.city.sunrise;
      // console.log(seconds);
      // console.log(seconds / 60); // всего минут
      let hours = Math.trunc(seconds / 60 / 60); 
      // console.log(hours);
      let minutes = Math.round(seconds / 60 - hours * 60);
      // console.log(minutes);
      let duration = `${hours}:${minutes}`
      return duration;
   }

   get informerToday() {
      return this.informer.querySelector('.informer__today');
   }

   get informerForecast() {
      return this.informer.querySelector('.informer__forecast');
   }

   renderWeatherInformer() {
      this.informer.innerHTML = '';
      this.renderCurWeatherBlock();
      this.renderHourlyBlock(this.#weatherData, this.informerToday, 'TODAY');
      // this.renderNearbyPlacesBlock();
      // this.getNearbyPlacesWeather();

   } 

   renderCurWeatherBlock() {
      let weather = this.#weatherData[0];
      // console.log(weather);
      let html = `<div class="informer__today">
                     <div class="curWeather">
                        <h4 class="curWeather__title">CURRENT WEATHER</h4>
                        <span class="curWeather__date">${this.currentDate}</span>
                        <div class="curWeather__content">
                           <div class="curWeather__main">
                              <img class="curWeather__img" ${weather.image}>
                              <p class="curWeather__description">${weather.descr}</p>
                           </div>
                           <div class="curWeather__tempBlock">
                              <span class="curWeather__temperature">${weather.temp}°C</span>
                              <p class="curWeather__tempFeel">Real Feel ${weather.tempFeel}°</p>
                           </div>
                           <div class="curWeather__sunInfo">
                              <p class="curWeather__sunrise">Sunrise: ${this.sunrise} AM</p>
                              <p class="curWeather__sunset">Sunset: ${this.sunset} PM</p>
                              <p class="curWeather__duration">Duration: ${this.duration} hr</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="informer__forecast"></div>`;
      this.informer.insertAdjacentHTML('afterbegin', html);
   }

   renderHourlyBlock(array, container, day) {
      // console.log(this.#weatherData);
      let timeForecast = '';
      let image = '';
      let description = '';
      let temp = '';
      let tempFeel = '';
      let wind = ''; 

      // this.#weatherData.forEach((elem, index) => {
      array.forEach((elem, index) => {
         if (index < 8) {
            timeForecast += `<p class="hourlyWeather__time">${elem.time}</p>`;
            image += `<img class="hourlyWeather__img" ${elem.image}>`;
            description += `<p class="hourlyWeather__description">${elem.descr}</p>`;
            temp += `<p class="hourlyWeather__temp">${elem.temp}°</p>`;
            tempFeel += `<p class="hourlyWeather__temp">${elem.tempFeel}°</p>`;
            wind += `<p class="hourlyWeather__windDeg">${elem.wind} ${elem.windDeg}</p>`;
         }
      })
      
      let html = `<div class="hourlyWeather">
                     <h4 class="hourlyWeather__title">HOURLY</h4>
                     <div class="hourlyWeather__content">
                        <p class="hourlyWeather__day">${day}</p>${timeForecast}                       
                        <p></p> ${image}
                        <p class="hourlyWeather__forecast">Forecast</p>${description}
                        <p class="hourlyWeather__temperature">Temp (°C)</p>${temp}
                        <p class="hourlyWeather__tempFeel">Real Feel</p>${tempFeel}
                        <p class="hourlyWeather__wind">Wind(km/h)</p>${wind}
                     </div>
                  </div>`;
      // this.informerToday.insertAdjacentHTML('beforeend', html); 
      container.insertAdjacentHTML('beforeend', html); 
   }

   getWeatherForecast(event) {
      if (event.target.matches('.tab-menu__today')) {
         this.tabForecast.classList.remove('active');
         this.tabToday.classList.add('active');        
         // this.getWeather(); 
         this.renderWeatherInformer();
      } 
      if (event.target.matches('.tab-menu__forecast')) {
         this.tabForecast.classList.add('active');
         this.tabToday.classList.remove('active');
         this.renderInformerForecast();
      }
   }

   renderInformerForecast() {
      this.renderWeatherForecast();
      this.renderForecastHourly();     
   }

   renderWeatherForecast() {
      this.informerToday.innerHTML = '';
      this.informerForecast.innerHTML = '<div class="weatherForecast"></div>';
      let weatherForecast = this.informer.querySelector('.weatherForecast');

      let date = new Date();
      let curDay = date.getDate();
      console.log(curDay + 1); // 19

      for(let i = 1; i < 6; i++) {
         let newArr = this.#weatherData.filter(elem => elem.date == (curDay + i));
         // console.log(newArr);
         let html = `<div class="weatherForecast__block" id="${curDay + i}">
                  <h4 class="weatherForecast__day">${newArr[0].dayShort}</h4>
                  <p class="weatheForecast__date">${newArr[0].month} ${curDay + i}</p>
                  <img class="weatheForecast__img" ${newArr[0].image}>
                  <span class="weatheForecast__temp">${newArr[0].temp} °C</span>
                  <p class="curWeather__text">${newArr[0].descr}</p>
               </div>`;
         weatherForecast.insertAdjacentHTML('beforeend', html);
      }
      document.getElementById(curDay + 1).classList.add('activeBlock');

      weatherForecast.addEventListener('click', this.getForecastHourly.bind(this));
   }
   
   getForecastHourly(event) {
      let targetBlock = event.target.closest('.weatherForecast__block');
      // console.log(targetBlock);
      console.log(targetBlock.id); // день 
      let newArr = this.#weatherData.filter(elem => elem.date == (targetBlock.id));
      console.log(newArr);

      let weatherForecast = this.informer.querySelector('.weatherForecast');
      let forecastBlocks = weatherForecast.querySelectorAll('.weatherForecast__block');
      forecastBlocks.forEach(elem => {
         elem.classList.remove('activeBlock');
      })
      targetBlock.classList.add('activeBlock');

      let wraper = this.informerForecast.querySelector('.hourlyWeather');
      wraper.remove();
      
      this.renderHourlyBlock(newArr, this.informerForecast, newArr[0].day);
   }

   renderForecastHourly() {
      let date = new Date();
      let curDay = date.getDate();
      console.log(curDay); // 18
      let newArr = this.#weatherData.filter(elem => elem.date == (curDay + 1));
      console.log(newArr);
      this.renderHourlyBlock(newArr, this.informerForecast, newArr[0].day);
   }

   renderErrorBlock() {
      let value = this.search.value;
      console.log(value);
      this. informer.innerHTML = `<div class="error">
                                       <img class="error__img" src="images/img_error.jpg" alt="">
                                       <p class="error__text">${value} could not be found.</p>
                                       <p class="error__text">Please enter a different location.</p>
                                   </div>`;
   }

   init() {
      this.getWeather();     
      // api по умолчанию this.apiPoltava и запрос геолокации !!!
      this.tabsMenu.addEventListener('click', this.getWeatherForecast.bind(this));
      // this.informer.addEventListener('click', this.getForecastHourly.bind(this));
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
