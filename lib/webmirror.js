(function () {
	'use strict';

	var _ = require('underscore'),
		http = require('http'),
		WSServer = require('ws').Server,
		WebMirror,
		EVENT_LIMIT = 10;

	/**
	 * Represents a mirror instance
	 */
	WebMirror = function () {
		var that = this,
			http_server,
			server,
			events,
			weather,
			sendUpdate,
			sendWeather,
			broadcastUpdate,
			broadcastWeather,
			addEvent;

		/**
		 * Updates a single client about updated events
		 *
		 * @param {WebSocket} socket - Client to send the update to
		 */
		sendUpdate = function (socket) {
			socket.send(JSON.stringify({
				type: 'update',
				data: events
			}));
		};

		/**
		 * Updates a single client about updated weather
		 *
		 * @param {WebSocket} socket - Client to send the update to
		 */
		sendWeather = function (socket) {
			socket.send(JSON.stringify({
				type: 'weather',
				data: weather
			}));
		};

		/**
		 * Updates all clients about updated events
		 */
		broadcastUpdate = function () {
			server.clients.forEach(function each(socket) {
				sendUpdate(socket);
			});
		};

		/**
		 * Updates all clients about updated weather
		 */
		broadcastWeather = function () {
			server.clients.forEach(function each(socket) {
				sendWeather(socket);
			});
		};

		/**
		 * Adds an event to the event list
		 *
		 * @param {string} key - Unique key for the event. If the key exists, the old event will be replaced
		 * @param {string} icon - CSS class for the icon that belongs to this event
		 * @param {string} text - Text to show on the screen
		 */
		addEvent = function (key, icon, text) {
			// See if this event already exists and update it if so
			var existing = _.findWhere(events, {key: key});
			if (existing) {
				existing.icon = icon;
				existing.text = text;
				//TODO: Move element to the front of the list
			} else {
				events.unshift({
					key: key,
					icon: icon,
					text: text
				});
			}
			// Truncate list if it's become too large
			events = events.slice(0, EVENT_LIMIT);

			// Trigger a broadcast
			broadcastUpdate();
		};

		this.start = function (port, cb) {
			http_server.listen(port, cb);
		};

		(function () {
			events = [];
			weather = {};

			http_server = http.createServer();
			server = new WSServer({server: http_server});

			server.on('connection', function (socket) {
				// Send init data to the client
				sendUpdate(socket);
				sendWeather(socket);
			});

			// Set up all data sources
			addEvent('TODO', 'fa-check', 'TODO: Add data sources');

			// Set up the weather client
			weather = {
				icon: 'wi-na',
				text: 'TODO: Setup weather client'
			};
		}());
	};

	module.exports = WebMirror;
}());
