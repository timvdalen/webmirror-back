(function () {
	'use strict';

	var Forecast = require('forecast.io-bluebird'),
		WeatherUpdater,
		OPTIONS = {
			forecast: {
				exclude: 'hourly,flags,currently',
				units: 'auto'
			},
			// Update every 30 minutes
			interval: 1.8e+6
		};

	/**
	 * Special datasource that updates the weather
	 *
	 * @param {function} setWeather - Function that takes icon, text, temperature
	 */
	WeatherUpdater = function (setWeather) {
		var that = this,
			forecast,
			update;

		update = function () {
			forecast.fetch(process.env.LATITUDE, process.env.LONGITUDE, OPTIONS.forecast).then(function (result) {
				setWeather('wi-forecast-io-' + result.daily.data[0].icon, result.daily.data[0].summary, Math.round(result.daily.data[0].apparentTemperatureMax));
			})['catch'](function () {
				// Retry again in 30 seconds
				setTimeout(update, 30000);
			});
		};

		this.start = function () {
			// Update now
			update();

			// Plan updater
			setInterval(update, OPTIONS.interval);
		};

		(function () {
			// Setup API client
			forecast = new Forecast({
				key: process.env.FORECAST_API_KEY
			});
		}());
	};

	module.exports = WeatherUpdater;
}());
