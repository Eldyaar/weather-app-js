/**
 * @license MIT
 * @copyright eldiyarchess 2024 All rights reserved
 * @author eldiyarchess <thedolbekov2@gmail.com>
 */

'use strict'

import './public/styles/scss/styles.scss'

const modal = document.querySelector('.modal'),
      btnSubmit = document.querySelector('.modal_submit'),
      searchInput = document.querySelector('.modal_input'),
      modalCloseBtn = document.querySelector('.modal_close'),
      triggerModal = document.querySelector('.header-info__city'),
      forecastChart = document.querySelector('.content-forecast__chart'),
      activitiesWrap = document.querySelector('.content-activities__item')


const WEATHER_API = 'http://api.openweathermap.org/data/2.5/weather' 
const API_KEY = 'e417df62e04d3b1b111abeab19cea714'
let CITY_NAME = 'California'

const timeLabels = ['15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00', '12:00']
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let modalIsOpen = false


const fetchWeather = async CITY_NAME => {
  try { 
    const response = await fetch(`${WEATHER_API}?q=${CITY_NAME}&appid=${API_KEY}`)
    const data = await response.json()

    if (!response.ok) return null
    
    renderCurrentData(data)
  } catch (e) {
    console.error(`server error: ${e}`)
  }
}

/**
 * Gets the current date
 * @returns {string} Date string. formate: "Friday | 1 Mar 2024"
 */
function getCurrentDate() {
  const currentDate = new Date();
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  
  const dayOfMonth = currentDate.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[currentDate.getMonth()];

  const year = currentDate.getFullYear();

  const formattedDate = `${dayOfWeek} | ${dayOfMonth} ${month} ${year}`;

  return formattedDate;
}

/**
 * render current weather data
 * @param {Object} current weather data
 */
const renderCurrentData = (data) => {
  document.querySelector('.header-info__city_name').innerHTML = data.name
  document.querySelector('.header-info__description').innerHTML = data.weather[0].description
  document.querySelector('.header-info__values_degree').innerHTML = data?.main?.temp ? Math.round(data?.main?.temp - 273) + '&deg;C' : '...'
  document.querySelector('.header-info__values_date').innerHTML = getCurrentDate()

  let imgWeather = ''

  switch (true) {
    case data.weather[0].description.includes('rain'):
        imgWeather = '<i class="fa-solid fa-cloud-showers-heavy"></i>';
        break;
    case data.weather[0].description.includes('cloud'):
        imgWeather = '<i class="fa-solid fa-cloud"></i>';
        break;
    case data.weather[0].description.includes('sun'):
        imgWeather = '<i class="fa-solid fa-sun"></i>';
        break;
    case data.weather[0].description.includes('storm'):
        imgWeather = '<i class="fa-solid fa-cloud-bolt"></i>';
        break;
    case data.weather[0].description.includes('wind'):
        imgWeather = '<i class="fa-solid fa-wind"></i>';
        break;
    case data.weather[0].description.includes('snow'):
        imgWeather = '<i class="fa-regular fa-snowflake"></i>';
        break;
    case data.weather[0].description.includes('mist'):
        imgWeather = '<i class="fa-solid fa-smog"></i>';
        break;
    default:
        imgWeather = '<i class="fa-solid fa-cloud-moon"></i>';
  }
  
  document.querySelector('.header-cloud').innerHTML = imgWeather
}

const openModal = () => {
  modalIsOpen = !modalIsOpen
  modal.style.display = 'block'
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  modalIsOpen = !modalIsOpen
  modal.style.display = 'none'
  document.body.style.overflow = ''
}

const findCity = () => {
  forecastChart.innerHTML = ''
  CITY_NAME = searchInput.value
  fetchWeather(CITY_NAME)
  getHourlyWeather()
  closeModal()
  searchInput.value = ''
}

// === Forecast ===

/**
 * Retrieves and displays the hourly weather forecast.
 */
const getHourlyWeather = async () => {
   
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY_NAME}&units=metric&appid=${API_KEY}`
  const hourlyData = []

  try {
    const response = await fetch(apiUrl)
    
    if (!response.ok) return null
    
    const data = await response.json()

    for (let i = 0; i < 8; i++) {
        hourlyData.push(data.list[i].main.temp)
    }

    hourlyData.forEach((temp, index) => {
        const bar = document.createElement('div')
        bar.className = 'bar'
        bar.style.height = `${Math.abs(temp) * 5}px`
    
        const img = './public/assets/img/forecast-icon 1.png'

        const barInfo = document.createElement('div')
        barInfo.className = 'bar__info'
        barInfo.innerHTML = `
          <div class="bar__info_degree">${Math.round(temp)}°</div>
          <div class="bar__info-more">
              <div style="background: url('${img}')" class="bar__info-more_icon"></div>
              <div class="bar__info-more_wind">0.9 km/h</div>
              <div class="bar__info-more_time">${timeLabels[index]}</div>
          </div>
        `
    
        bar.appendChild(barInfo)
        forecastChart.appendChild(bar)
    })

    // === render 5 day forecast info ===

    const hour = today.getHours() % 12 || 12
    const minute = today.getMinutes()
    const ampm = today.getHours() >= 12 ? 'PM' : 'AM'

    document.querySelector('#current-hour').innerHTML = `${hour}:${minute < 10 ? '0' : ''}${minute}${ampm} GMT`
    document.querySelector('.wind').innerHTML = `${data.list[0].wind.speed.toFixed(1)} km/hr`
    document.querySelector('.feel').innerHTML = `${Math.round(data.list[0].main.feels_like)}°`
    document.querySelector('.rain').innerHTML = `${data.list[0].pop}%`
    
  } catch (error) {
    console.error(`An error has occurred: ${error.message}`)
    return null
  }
}

// === / Forecast ===

// === Activities ===

/**
 * MOCKUPS
 */
const activities = [
  {
    "id": 1,
    "img": "./public/assets/img/Rectangle 15.png",
    "distance_m": 2000
  },
  {
    "id": 2,
    "img": "./public/assets/img/Rectangle 16.png",
    "distance_m": 1500
  },
  {
    "id": 3,
    "img": "./public/assets/img/Rectangle 17.png",
    "distance_m": 3000
  },
  {
    "id": 4,
    "img": "./public/assets/img/Rectangle 18.png",
    "distance_m": 500
  }
]

/**
 * @param {number} distance_m distance to the activity
 * @param {string} img url of the activity image
 * @returns {string} HTML markup representing the result
 */
const createActivityCard = ({ distance_m, img}) => {
  const distance = distance_m < 1000 ? `${distance_m}m` : `${distance_m / 1000}km`

  return (
    `<div style="background: url('${img}')" class="content-activities__item-card_img"></div>
    <div class="content-activities__item-card_desc">${distance}</div>`
  )
}

activities.forEach((activity) => {
  const activityCard = document.createElement('div')
  activityCard.className = 'content-activities__item-card'
  
  activityCard.innerHTML = createActivityCard(activity)
  activitiesWrap.appendChild(activityCard)
})

// === / Activities ===

// === 5 day forecast ===

const swiperWrapper = document.querySelector('.swiper-wrapper')

const daysWeekForecast = []
const dateDaysWeekForecast = []
const today = new Date();

/**
 * 
 * @param {Object} Date
 * @returns {string} Date. formate: "2024-03-02"
 */
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

for (let i = 0; i <= 4; i++) {
  daysWeekForecast.push(daysOfWeek[(today.getDay() + i) % 7])

  const currentDate = new Date(today)
  currentDate.setDate(today.getDate() + i)
  const formattedDate = formatDate(currentDate)
  
  dateDaysWeekForecast.push(formattedDate)
}

/**
 * Function for displaying days of the week
 */
const renderDaysWeekForecast = () => {
  for (let i = 0; i < dateDaysWeekForecast.length; i++) {
    const slideItem = document.createElement('div')
    slideItem.className = 'days-slide'
  
    slideItem.innerHTML = `
        <div class="days-slide__name">${daysWeekForecast[i].slice(0, 3).toUpperCase()}</div>
        ${daysWeekForecastIcons[i]}
    `
    
    swiperWrapper.appendChild(slideItem)
  }
}

const daysWeekForecastIcons = [
  `<i class="fa-solid fa-cloud-showers-heavy days-slide__icon"></i>`,
  `<i class="fa-solid fa-sun days-slide__icon"></i>`,
  `<i class="fa-solid fa-cloud-sun days-slide__icon"></i>`,
  `<i class="fa-solid fa-cloud-sun-rain days-slide__icon"></i>`,
  `<i class="fa-solid fa-cloud-bolt days-slide__icon"></i>`
]

// === / 5 day forecast ===


triggerModal.addEventListener('click', openModal)
modalCloseBtn.addEventListener('click', closeModal)

/**
 * Event handler for clicking the "Search" button
 */
btnSubmit.onclick = () => {
  if (searchInput.value.trim() === '') {
    alert('Please enter the city name.')
  } else {
    findCity()
  }
}

/**
 * Event handler for pressing thw "Enter" key in the input field
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && modalIsOpen) {
    findCity()
  }
})

modal.onclick = (event) => { 
  if (event.target === modal) closeModal()
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') closeModal()
})

fetchWeather(CITY_NAME)
getHourlyWeather()
renderDaysWeekForecast()
