'use strict'

class Informer {
   #imagesWeather = [
      {title: 'Clear', url: 'src="./images/sun.png" alt="sun"'},
      {title: 'Clouds', url: 'src="./images/cloud-sun.png" alt="clouds"'},
      {title: 'Haze', url: 'src="./images/clouds.png" alt="clouds"'},
      {title: 'Rain', url: 'src="./images/rain.png" alt="rain"'},
      {title: 'Snow', url: 'src="./images/snow3.png" alt="snow"'},
   ];
 
   #data;
   #weatherData = [];
   #apiCity = '';
   // #apiCoord = '';
   // dataCoord;

   constructor(container) {
      // this.api = 'http://api.openweathermap.org/data/2.5/weather?q=Poltava&units=metric&APPID=f87bc2c36adb84eb70ac5df2593571c6';
      this.apiPoltava = 'https://api.openweathermap.org/data/2.5/forecast?lat=49.59&lon=34.54&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6';

      // Для температуры в градусах Цельсия и скорости ветра в метрах/сек после q=Poltava нужно добавить &units=metric (единицы=метрические)
      // По умолчанию используется температура в градусах Кельвина и скорость ветра в метрах/сек
      
      this.informer = document.querySelector(container);
      this.search = document.getElementById('search');
      this.tabMenu = document.querySelector('.tab-menu');
      this.tabToday = this.tabMenu.querySelector('.tab-menu__today');
      this.tabForecast = this.tabMenu.querySelector('.tab-menu__forecast');
   }

   getApiCity() {
      let city = this.search.value.trim();
      console.log(city);
      if(city == '') {
         this.renderErrorBlock('none'); 
         return
      } 

      let api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=f87bc2c36adb84eb70ac5df2593571c6`;
      console.log(api);

      fetch(api)
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
               let data = response;
               // console.log(data); 
               let latCoord = data.coord.lat;
               let lonCoord = data.coord.lon;
               this.#apiCity = `https://api.openweathermap.org/data/2.5/forecast?lat=${latCoord}&lon=${lonCoord}&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6`;
               // api города из поля поиска c координатами для почасового прогноза
               console.log(this.#apiCity); 
               this.getWeather(this.#apiCity);               
            }
         })
         .catch(() => this.renderErrorBlock('city')); 
   }

   // getGeolocation() {
   //    let apiCoord;
   //    let latCoord;
   //    let lonCoord;
   //    let data;

   //   // Чтобы использовать Geolocation API, необходимо проверить, 
   //   // поддерживается ли он в текущем браузере:
   //    if (navigator.geolocation) {
   //       /* местоположение доступно */
   //       // let apiCoord;
   //       // let latCoord;
   //       // let lonCoord;
   //       // let data;

   //       navigator.geolocation.getCurrentPosition(success, error);

   //       function success(position) {
   //          latCoord = position.coords.latitude;
   //          lonCoord = position.coords.longitude; 
   //          apiCoord = `https://api.openweathermap.org/data/2.5/forecast?lat=${latCoord}&lon=${lonCoord}&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6`;
   //          // this.#apiCoord = `https://api.openweathermap.org/data/2.5/forecast?lat=${latCoord}&lon=${lonCoord}&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6`;
   //          console.log(apiCoord);  
   //          // console.log(this.#apiCoord);  
   //          console.log(latCoord);
   //          console.log(lonCoord);

   //          fetch(apiCoord)                
   //             .then(response => {
   //                console.log(apiCoord);   
   //                if(response.ok) {
   //                   return response.json();
   //                } else {
   //                   throw 'Помилка HTTP: ' + response.status;
   //                }             
   //             })
   //             .then((response) => {    
   //                console.log(response);       
   //                if(!response) {
   //                   return
   //                } else {   
   //                   // this.#data = response;
   //                   // console.log(this.#data);
   //                   console.log(response); 
   //                   data = response;
   //                   console.log(data);
   //                   // this.dataCoord = data;
   //                   // this.dataCoord = response;
   //                   // console.log(this.dataCoord);
   //                   // this.getWeatherData();
   //                   // console.log(this.#weatherData); 
   //                   // this.renderWeatherInformer();
   //                }
   //             })
   //             .catch(() => console.error('Помилка HTTP: ' + response.status))
   //       }
   //       function error(err) {
   //          console.warn(`ERROR(${err.code}): ${err.message}`);
   //          console.error('Невозможно получить ваше местоположение');
   //          return
   //       }
   //       // console.log(latCoord);
   //       // console.log(lonCoord);
   //       apiCoord = `https://api.openweathermap.org/data/2.5/forecast?lat=${latCoord}&lon=${lonCoord}&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6`;
   //       this.#apiCoord = `https://api.openweathermap.org/data/2.5/forecast?lat=${latCoord}&lon=${lonCoord}&units=metric&appid=f87bc2c36adb84eb70ac5df2593571c6`;
   //       // console.log(this.#apiCoord);    
   //       // console.log(apiCoord);    
   //       // console.log(data);
   //       // this.getWeather(this.#apiCity); 

   //    } else {
   //       /* местоположение НЕ доступно */
   //       console.error('Geolocation не поддерживается вашим браузером');
   //       return
   //    }
   //    // console.log(apiCoord);    
   //    console.log(data);
   //    // console.log(latCoord);
   //    // console.log(lonCoord);
   // }

   getWeather(api) {
      fetch(api)  
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
         .catch(() => {
            this.renderErrorBlock();
            this.search.value = '';
         }) 
   }

   get currentDate() {
      let date = new Date();
      let day = date.getDate().toString().padStart(2, '0');
      let month = (date.getMonth() + 1).toString().padStart(2, '0'); 
      let year = date.getFullYear().toString();
      
      let currentDate = `${day}.${month}.${year}`;
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
         this.#weatherData[index] = obj;
      })
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
      if (deg < 25 || deg >= 335) return 'N'; // NORTH (N)
      if (deg > 25 && deg < 65) return 'NE'; // северо-восток (NE)
      if (deg = 25) return 'NE'; 
      if (deg > 65 && deg < 115) return 'E'; // EAST (E)
      if (deg = 65) return 'E'; 
      if (deg > 115 && deg < 155) return 'SE'; // юго-восток (SE)
      if (deg = 115) return 'SE'; 
      if (deg > 155 && deg < 205) return 'S'; // SOUTH (S)
      if (deg = 155) return 'S';
      if (deg > 205 && deg < 245) return 'SW'; // юго-запад (SW)
      if (deg = 205) return 'SW'; 
      if (deg > 245 && deg < 295) return 'W'; // WEST (W)
      if (deg = 245) return 'W';
      if (deg > 295 && deg < 335) return 'NW'; // северо-запад (NW)
      if (deg = 295) return 'NW';
   }
   get sunrise() {
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
      let timestamp = this.#data.city.sunset * 1000;
      let date = new Date(timestamp);
      let hours = date.getHours();
      let minutes = date.getMinutes().toString().padStart(2, '0'); 
      let sunset = `${hours}:${minutes}`;
      return sunset;
   }

   get duration() {
      let seconds = this.#data.city.sunset - this.#data.city.sunrise;
      let hours = Math.trunc(seconds / 60 / 60); 
      let minutes = Math.round(seconds / 60 - hours * 60);
      let duration = `${hours}:${minutes}`
      return duration;
   }

   get informerToday() {
      return this.informer.querySelector('.informer__today');
   }

   get informerForecast() {
      return this.informer.querySelector('.informer__forecast');
   }

   get weatherForecast() {
      return this.informer.querySelector('.weatherForecast');
   }

   renderWeatherInformer() {
      this.informer.innerHTML = '';   
      this.renderCurWeatherBlock();
      this.renderHourlyBlock(this.#weatherData, this.informerToday, 'TODAY');
      this.renderNearbyPlacesBlock();
      this.getNearbyPlacesWeather();

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
      let timeForecast = '';
      let image = '';
      let description = '';
      let temp = '';
      let tempFeel = '';
      let wind = ''; 

      array.forEach((elem, index) => {
         if (index < 8) {
            timeForecast += `<p class="cell">${elem.time}</p>`;
            image += `<img class="hourlyWeather__img cell" ${elem.image}>`;
            description += `<p class="cell">${elem.descr}</p>`;
            temp += `<p class="cell">${elem.temp}°</p>`;
            tempFeel += `<p class="cell">${elem.tempFeel}°</p>`;
            wind += `<p class="cell">${elem.wind} ${elem.windDeg}</p>`;
         }
      })      
      let html = `<div class="hourlyWeather">
                     <h4 class="hourlyWeather__titleBlock">HOURLY</h4>                     
                     <div class="hourlyWeather__content">
                        <div class="hourlyWeather__time row">
                           <div class="title cell day">${day}</div>
                           ${timeForecast} 
                        </div>
                        <div class="hourlyWeather__images row">                      
                           <div class="hourlyWeather__img title cell empty"></div>
                           ${image}
                        </div>
                        <div class="hourlyWeather__forecast row">
                           <div class="title cell forecast">Forecast</div>
                           ${description}
                        </div>
                        <div class="hourlyWeather__temperature row">
                           <div class="title cell">Temp (°C)</div>
                           ${temp}
                        </div>
                        <div class="hourlyWeather__tempFeel row">
                           <div class="title cell">Real Feel</div>
                           ${tempFeel}
                        </div>
                        <div class="hourlyWeather__windDeg row">
                           <div class="title cell">Wind (km/h)</div>
                           ${wind}
                        </div>
                     </div>
                  </div>`;
      container.insertAdjacentHTML('beforeend', html); 
   }

   renderNearbyPlacesBlock() {
      let html = `<div class="nearby">
                     <h4 class="nearly__title">NEARBY PLACES</h4>
                     <div class="nearlyPlaces"></div>
                  </div>`;
      this.informerToday.insertAdjacentHTML('beforeend', html);
   }

   getNearbyPlacesWeather() {
      let nearlyPlaces = this.informer.querySelector('.nearlyPlaces');
      let cities = ['Kharkiv', 'Kremenchuk', 'Mirhorod', 'Krasnohrad'];
      // let cities = ['Харків', 'Кременчук', 'Миргород', 'Красноград'];

      cities.forEach(elem => {
         let cityApi = `http://api.openweathermap.org/data/2.5/weather?q=${elem}&units=metric&APPID=f87bc2c36adb84eb70ac5df2593571c6`;

         fetch(cityApi)
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
               // console.log(response);
               let cityTemp = response.main.temp; 
               let cityWeather = response.weather[0].main;
               // console.log(cityWeather);
               let cityClouds = response.clouds.all;
               // console.log(cityClouds);
               let html = `<div class="nearlyPlaces__place">
                              <p class="nearlyPlcses__name">${elem}</p>
                              <img class="nearlyPlaces__img" ${this.getWeatherImg(cityWeather, cityClouds)}>
                              <p class="nearlyPlaces__temp">${Math.round(cityTemp)} °C</p>
                           </div>`;
               nearlyPlaces.insertAdjacentHTML('beforeend', html);
            }
         })
         .catch((response) => console.error(response)); 
      })
   }


   getWeatherForecast(event) {
      if (event.target.matches('.tab-menu__today')) {
         this.tabForecast.classList.remove('active');
         this.tabToday.classList.add('active');        
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
      this.weatherForecast.addEventListener('click', this.getForecastHourly.bind(this));   
   }

   renderWeatherForecast() {
      this.informerToday.innerHTML = '';
      this.informerForecast.innerHTML = '<div class="weatherForecast"></div>';

      let date = new Date();
      let curDay = date.getDate();
      let day = 1;    

      for(let i = 1; i < 6; i++) {            
         let newArr = this.#weatherData.filter(elem => elem.date == (curDay + i));
         if(newArr.length == 0) {
            newArr = this.#weatherData.filter(elem => elem.date == day);
            day ++;
         }
         if(newArr.length == 0 && i == 5) {return}
         console.log(newArr);

         let html = `<div class="weatherForecast__block" id="${newArr[0].date}">
                  <h4 class="weatherForecast__day">${newArr[0].dayShort}</h4>
                  <p class="weatherForecast__date">${newArr[0].month} ${newArr[0].date}</p>
                  <img class="weatherForecast__img" ${newArr[0].image}>
                  <span class="weatherForecast__temp">${newArr[0].temp} °C</span>
                  <p class="curWeather__text">${newArr[0].descr}</p>
               </div>`;
         this.weatherForecast.insertAdjacentHTML('beforeend', html);
      }
      this.weatherForecast.querySelector('.weatherForecast__block').classList.add('activeBlock');
   }
   
   getForecastHourly(event) {
      let targetBlock = event.target.closest('.weatherForecast__block');
      let newArr = this.#weatherData.filter(elem => elem.date == (targetBlock.id));
      // console.log(newArr);

      let forecastBlocks = this.weatherForecast.querySelectorAll('.weatherForecast__block');
      forecastBlocks.forEach(elem => {
         elem.classList.remove('activeBlock');
      })
      targetBlock.classList.add('activeBlock');

      let wraper = this.informerForecast.querySelector('.hourlyWeather');
      if (wraper) wraper.remove();
      
      this.renderHourlyBlock(newArr, this.informerForecast, newArr[0].day);
   }

   renderForecastHourly() {
      let firstBlock = this.weatherForecast.querySelector('.weatherForecast__block');
      let newArray = this.#weatherData.filter(elem => elem.date == firstBlock.id);
      // console.log(newArray);
      this.renderHourlyBlock(newArray, this.informerForecast, newArray[0].day);
   }

   renderErrorBlock(val) {
      let value = this.search.value;
      console.log(value);      
      this.informer.innerHTML = `<div class="error">
                                       <img class="error__img" src="images/img_error.jpg" alt="">
                                       <p class="error__text">Not found</p>
                                 </div>`;
      let text = '';    
      if(val == 'none') {
         text = '<p class="error__text">Please enter a location</p>';
      }                           
      if(val == 'city') {
         text = `<p class="error__text">${value} could not be found.</p>
         <p class="error__text">Please enter a different location.</p>`;
      }                           
      this.informer.querySelector('.error').insertAdjacentHTML('beforeend', text);
                                   
   }

   init() {
      // this.getGeolocation();
      this.getWeather(this.apiPoltava); 
      this.tabMenu.addEventListener('click', this.getWeatherForecast.bind(this));
      this.search.addEventListener('change', this.getApiCity.bind(this));
   }
}

// const info = new Informer();
// info.init();
new Informer('.informer').init();  