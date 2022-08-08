
;(function($) {

	$.fn.openWeather  = function(options) {

		
		if(!this.length) {
			return this;
		}

		
		const defaults = {
			wrapperTarget: null,
			descriptionTarget: null,
			maxTemperatureTarget: null,
			minTemperatureTarget: null,
			windSpeedTarget: null,
			humidityTarget: null,
			sunriseTarget: null,
			sunsetTarget: null,
			placeTarget: null,
			iconTarget: null,
			customIcons: null,
			units: 'c',
			windSpeedUnit: 'km/h ',
			city: null,
			lat: null,
			lng: null,
			key: null,
			lang: 'es',
			success: function() {},
			error: function(message) {}
		}


		const plugin = this;


		const el = $(this);

		
		plugin.settings = {}


		plugin.settings = $.extend({}, defaults, options);

		
		const s = plugin.settings;


		const formatTime = function(unixTimestamp) {

		
			const milliseconds = unixTimestamp * 1000;

		
			const date = new Date(milliseconds);
s
			let hours = date.getHours();


			if(hours > 12) {

				
				let hoursRemaining = 24 - hours;

			
				hours = 12 - hoursRemaining;
			}

	
			let minutes = date.getMinutes();

			
			minutes = minutes.toString();


			if(minutes.length < 2) {

			
				minutes = 0 + minutes;
			}

		
			let time = hours + ':' + minutes;

			return time;
		}


		let apiURL = '//api.openweathermap.org/data/2.5/weather?lang='+s.lang;

		let weatherObj;

		let temperature;
		let minTemperature;
		let maxTemperature;
		let windSpeed;

	
		if(s.city != null) {

			
			apiURL += '&q='+s.city;

		} else if(s.lat != null && s.lng != null) {


			apiURL += '&lat='+s.lat+'&lon='+s.lng;
		}

		
		if(s.key != null) {

			
			apiURL += '&appid=' + s.key;
		}

		$.ajax({
			type: 'GET',
			url: apiURL,
			dataType: 'jsonp',
			success: function(data) {

				if(data) {

			
					if(s.units == 'f') {

				t
						temperature = Math.round(((data.main.temp - 273.15) * 1.8) + 32) + '°F';

			
						minTemperature = Math.round(((data.main.temp_min - 273.15) * 1.8) + 32) + '°F';

				it
						maxTemperature = Math.round(((data.main.temp_max - 273.15) * 1.8) + 32) + '°F';

					} else {

		
						temperature = Math.round(data.main.temp - 273.15) + '°C';

			
						minTemperature = Math.round(data.main.temp_min - 273.15) + '°C';

				
						maxTemperature = Math.round(data.main.temp_max - 273.15) + '°C';
					}

					windSpeed = (s.windSpeedUnit == 'km/h') ? data.wind.speed*3.6 : data.wind.speed;

					weatherObj = {
						city: `${data.name}, ${data.sys.country}`,
						temperature: {
							current: temperature,
							min: minTemperature,
							max: maxTemperature,
							units: s.units.toUpperCase()
						},
						description: data.weather[0].description,
						windspeed: `${Math.round(windSpeed)} ${ s.windSpeedUnit }`,
						humidity: `${data.main.humidity}%`,
						sunrise: `${formatTime(data.sys.sunrise)} AM`,
						sunset: `${formatTime(data.sys.sunset)} PM`
					};

	
					el.html(temperature);

	
					if(s.minTemperatureTarget != null) {

				
						$(s.minTemperatureTarget).text(minTemperature);
					}

			
					if(s.maxTemperatureTarget != null) {

	
						$(s.maxTemperatureTarget).text(maxTemperature);
					}

	
					$(s.descriptionTarget).text(weatherObj.description);


					if(s.iconTarget != null && data.weather[0].icon != null) {

						let iconURL;

						if(s.customIcons != null) {

				
							const defaultIconFileName = data.weather[0].icon;

							let timeOfDay;
							let iconName;


							if(defaultIconFileName.indexOf('d') != -1) {

							
								timeOfDay = 'day';

							} else {

						
								timeOfDay = 'night';
							}

					
							if(defaultIconFileName == '01d' || defaultIconFileName == '01n') {
								iconName = 'clear';
							}

			
							if(defaultIconFileName == '02d' || defaultIconFileName == '02n' || defaultIconFileName == '03d' || defaultIconFileName == '03n' || defaultIconFileName == '04d' || defaultIconFileName == '04n') {
								iconName = 'clouds';
							}

			
							if(defaultIconFileName == '09d' || defaultIconFileName == '09n' || defaultIconFileName == '10d' || defaultIconFileName == '10n') {
								iconName = 'rain';
							}

				
							if(defaultIconFileName == '11d' || defaultIconFileName == '11n') {
								iconName = 'storm';
							}

							if(defaultIconFileName == '13d' || defaultIconFileName == '13n') {

								iconName = 'snow';
							}

						
							if(defaultIconFileName == '50d' || defaultIconFileName == '50n') {
								iconName = 'mist';
							}

						
							iconURL = `${s.customIcons}${timeOfDay}/${iconName}.png`;

					
							$(s.wrapperTarget).addClass(timeOfDay);

						} else {

						
							iconURL = `//openweathermap.org/img/w/${data.weather[0].icon}.png`;
						}

						
						$(s.iconTarget).attr('src', iconURL);
					}

		
					if(s.placeTarget != null) {

			
						$(s.placeTarget).text(weatherObj.city);
					}

					if(s.windSpeedTarget != null) {

					
						$(s.windSpeedTarget).text(weatherObj.windspeed);
					}

		
					if(s.humidityTarget != null) {

		
						$(s.humidityTarget).text(weatherObj.humidity);
					}

				
					if(s.sunriseTarget != null) {

	
						$(s.sunriseTarget).text(weatherObj.sunrise);
					}


					if(s.sunsetTarget != null) {


						$(s.sunsetTarget).text(weatherObj.sunset);
					}

					s.success.call(this, weatherObj);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			
				s.error.call(this, {
					error: textStatus
				});
			}
		});
	}
})(jQuery);

