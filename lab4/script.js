class WeatherApp {
    constructor() {
        this.currentLocationData = null;
        this.isGeoMode = true;
        this.additionalCities = [];
        this.init();
    }

    init() {
        this.cacheElements();
        this.loadFromStorage();
        this.bindEvents();


        if (!this.currentLocationData) {
            this.requestGeolocation();
        } else {
            this.showCurrentForecast();
            this.renderAdditionalCities();
        }
    }

    cacheElements() {
        this.refreshBtn = document.getElementById('refreshBtn');
        this.cityModal = document.getElementById('cityModal');
        this.cityInput = document.getElementById('cityInput');
        this.submitCityBtn = document.getElementById('submitCity');
        this.cancelCityBtn = document.getElementById('cancelCity');
        this.cityError = document.getElementById('cityError');
        this.currentForecast = document.getElementById('currentForecast');
        this.additionalCitiesSection = document.getElementById('additionalCities');
        this.citiesTagsContainer = document.getElementById('citiesTags');
        this.citiesForecastGrid = document.getElementById('citiesForecastGrid');
        this.addCityBtn = document.getElementById('addCityBtn');
        this.currentLocationTitle = document.querySelector('.current-location h2');
    }

    bindEvents() {
        this.refreshBtn.addEventListener('click', () => this.refreshWeather());
        this.submitCityBtn.addEventListener('click', () => this.handleCitySubmit());
        this.cancelCityBtn.addEventListener('click', () => this.closeModal());
        this.addCityBtn.addEventListener('click', () => this.openModal());

        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCitySubmit();
        });
    }

    requestGeolocation() {
        if (!navigator.geolocation) {
            this.showCityModal('Геолокация не поддерживается');
            return;
        }

        this.showLoading(this.currentForecast);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                this.showCityModal('Доступ к местоположению отклонен. Введите город вручную.');
            }
        );
    }

    async fetchWeatherByCoords(lat, lon, isAdditional = false) {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=3`;

            const response = await fetch(url);
            const data = await response.json();

            if (!isAdditional) {
                this.currentLocationData = {
                    name: 'Текущее местоположение',
                    data: data,
                    coords: { lat, lon }
                };
                this.isGeoMode = true;
                this.processWeatherData(data, 'Текущее местоположение', true);
            } else {
                return data;
            }

            this.saveToStorage();

        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            if (!isAdditional) {
                this.showCityModal('Ошибка загрузки погоды');
            }
        }
    }

    async fetchWeatherByCity(city, isAdditional = false) {
        try {
            const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru`;
            const geoResponse = await fetch(geoUrl);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                if (!isAdditional) {
                    this.showCityError('Город не найден. Примеры: Москва, London, Paris, Токио');
                }
                return null;
            }

            const location = geoData.results[0];

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=3`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            return {
                name: location.name,
                data: weatherData,
                coords: { lat: location.latitude, lon: location.longitude }
            };

        } catch (error) {
            console.error('❌ Ошибка поиска города:', error);
            if (!isAdditional) {
                this.showCityError('Ошибка загрузки. Проверьте интернет.');
            }
            return null;
        }
    }

    async handleCitySubmit() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showCityError('Введите название города');
            return;
        }

        this.cityError.style.display = 'none';

        const success = await this.addAdditionalCity(city);

        if (success) {
            this.cityInput.value = '';
            this.closeModal();
        }
    }

    async addAdditionalCity(cityName) {
        if (this.additionalCities.length >= 5) {
            alert('Максимальное количество дополнительных городов - 5');
            return false;
        }

        if (this.additionalCities.some(city => city.name.toLowerCase() === cityName.toLowerCase())) {
            this.showCityError('Этот город уже добавлен');
            return false;
        }

        const cityData = await this.fetchWeatherByCity(cityName, true);

        if (!cityData) {
            this.showCityError('Не удалось получить данные о городе');
            return false;
        }

        this.additionalCities.push(cityData);

        this.saveToStorage();
        this.renderAdditionalCities();

        return true;
    }

    removeAdditionalCity(index) {
        this.additionalCities.splice(index, 1);
        this.saveToStorage();
        this.renderAdditionalCities();
    }

    renderAdditionalCities() {
        if (!this.additionalCitiesSection) return;

        if (this.additionalCities.length === 0) {
            this.additionalCitiesSection.innerHTML = `
                <div class="weather-section">
                    <h2>📍 Дополнительные города</h2>
                    <div class="empty-cities">
                        <p>Добавьте города для сравнения погоды</p>
                        <button class="btn add-city-btn" id="addCityBtn">+ Добавить город</button>
                    </div>
                </div>
            `;
            document.getElementById('addCityBtn')?.addEventListener('click', () => this.openModal());
            return;
        }

        const tagsHtml = this.additionalCities.map((city, index) => `
            <div class="city-tag" data-index="${index}">
                <span>${city.name}</span>
                <span class="remove-city" onclick="weatherApp.removeAdditionalCity(${index})">✕</span>
            </div>
        `).join('');

        const cardsHtml = this.additionalCities.map((city, cityIndex) => {
            const daily = city.data.daily;

            const daysForecast = daily.time.slice(0, 3).map((date, dayIndex) => {
                const maxTemp = Math.round(daily.temperature_2m_max[dayIndex]);
                const minTemp = Math.round(daily.temperature_2m_min[dayIndex]);
                const code = daily.weathercode[dayIndex];
                const icon = this.getWeatherIcon(code);
                const desc = this.getWeatherDescription(code);
                const dayName = this.formatDate(date);

                return `
                    <div class="city-day-item">
                        <div class="city-day-name">${dayName}</div>
                        <div class="city-day-icon">${icon}</div>
                        <div class="city-day-temp">${maxTemp}°/${minTemp}°</div>
                        <div class="city-day-desc">${desc}</div>
                    </div>
                `;
            }).join('');

            return `
                <div class="city-forecast-card">
                    <div class="city-header">
                        <div class="city-title">
                            <span class="city-icon">📍</span>
                            <h3>${city.name}</h3>
                        </div>
                        <div class="remove-city-card" onclick="weatherApp.removeAdditionalCity(${cityIndex})">✕</div>
                    </div>
                    <div class="city-days-forecast">
                        ${daysForecast}
                    </div>
                </div>
            `;
        }).join('');

        this.additionalCitiesSection.innerHTML = `
            <div class="weather-section">
                <h2>Дополнительные города (${this.additionalCities.length})</h2>
                <div class="cities-tags">
                    ${tagsHtml}
                </div>
                <div class="cities-forecast-grid">
                    ${cardsHtml}
                </div>
                <div class="add-city-wrapper">
                    <button class="btn add-city-btn" id="addCityBtn">+ Добавить еще город</button>
                </div>
            </div>
        `;

        document.getElementById('addCityBtn')?.addEventListener('click', () => this.openModal());
    }

    processWeatherData(data, locationName, isCurrent) {
        if (!data.daily) {
            this.showCityError('Нет данных о погоде');
            return;
        }

        const daily = data.daily;
        const forecastHtml = daily.time.slice(0, 3).map((date, index) => {
            const maxTemp = Math.round(daily.temperature_2m_max[index]);
            const minTemp = Math.round(daily.temperature_2m_min[index]);
            const code = daily.weathercode[index];
            const icon = this.getWeatherIcon(code);
            const desc = this.getWeatherDescription(code);
            const dayName = this.formatDate(date);

            return `
                <div class="forecast-day">
                    <h3>${dayName}</h3>
                    <div class="weather-icon">${icon}</div>
                    <p class="temp">${maxTemp}° / ${minTemp}°</p>
                    <p class="description">${desc}</p>
                </div>
            `;
        }).join('');

        if (this.currentLocationTitle) {
            this.currentLocationTitle.textContent = locationName;
        }
        if (this.currentForecast) {
            this.currentForecast.innerHTML = forecastHtml;
        }

        this.closeModal();
    }

    getWeatherIcon(code) {
        const icons = {
            0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
            51: '🌦️', 53: '🌦️', 55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '⛈️',
            71: '🌨️', 73: '🌨️', 75: '❄️', 80: '🌦️', 95: '⛈️', 99: '🌪️'
        };
        return icons[code] || '🌤️';
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность',
            3: 'Облачно', 45: 'Туман', 48: 'Изморось', 51: 'Морось',
            61: 'Небольшой дождь', 63: 'Дождь', 65: 'Сильный дождь',
            71: 'Небольшой снег', 73: 'Снег', 75: 'Сильный снег',
            80: 'Грозы', 95: 'Гроза', 99: 'Торнадо'
        };
        return descriptions[code] || 'Неизвестно';
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);

        if (date.toDateString() === today.toDateString()) return 'Сегодня';
        if (date.toDateString() === tomorrow.toDateString()) return 'Завтра';
        if (date.toDateString() === dayAfter.toDateString()) return 'Послезавтра';

        return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    }

    showCityModal(message = '') {
        this.cityModal.style.display = 'flex';
        if (message) {
            this.showCityError(message);
        }
    }

    openModal() {
        this.cityModal.style.display = 'flex';
        this.cityError.style.display = 'none';
        this.cityInput.value = '';
        this.cityInput.focus();
    }

    closeModal() {
        this.cityModal.style.display = 'none';
        this.cityError.style.display = 'none';
        this.cityInput.value = '';
    }

    showCityError(message) {
        this.cityError.textContent = message;
        this.cityError.style.display = 'block';
    }

    showLoading(container) {
        if (container) {
            container.innerHTML = '<p class="loading">Загрузка прогноза погоды...</p>';
        }
    }

    async refreshWeather() {
        if (this.currentLocationData?.coords) {
            const { lat, lon } = this.currentLocationData.coords;
            await this.fetchWeatherByCoords(lat, lon);
        } else {
            this.requestGeolocation();
        }

        if (this.additionalCities.length > 0) {
            for (let i = 0; i < this.additionalCities.length; i++) {
                const city = this.additionalCities[i];
                const updatedCityData = await this.fetchWeatherByCity(city.name, true);
                if (updatedCityData) {
                    this.additionalCities[i] = updatedCityData;
                }
            }
            this.renderAdditionalCities();
        }

        this.saveToStorage();
    }

    saveToStorage() {
        const dataToSave = {
            currentLocationData: this.currentLocationData,
            isGeoMode: this.isGeoMode,
            additionalCities: this.additionalCities
        };
        localStorage.setItem('weatherApp', JSON.stringify(dataToSave));
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('weatherApp');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLocationData = data.currentLocationData;
                this.isGeoMode = data.isGeoMode || true;
                this.additionalCities = data.additionalCities || [];
            }
        } catch (e) {
            console.error('Ошибка загрузки из localStorage:', e);
        }
    }

    showCurrentForecast() {
        if (this.currentLocationData && this.currentLocationData.data) {
            this.currentLocationTitle.textContent = this.currentLocationData.name;
            this.processWeatherData(this.currentLocationData.data, this.currentLocationData.name, true);
        }
    }
}

let weatherApp;

document.addEventListener('DOMContentLoaded', () => {
    weatherApp = new WeatherApp();
    window.weatherApp = weatherApp;
});
