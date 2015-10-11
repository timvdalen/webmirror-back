(function () {
	'use strict';

	var WebMirror = require('./lib/webmirror'),
		mirror;

	mirror = new WebMirror();

	mirror.start(4000, function () {
		console.log("Listening");
	});

	process.on('SIGUSR2', function () {
		mirror.broadcastRefresh();
	});
}());
