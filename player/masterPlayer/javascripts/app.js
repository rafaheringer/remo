/// <reference path="_references.js" />
"use strict";

//Global config
//=============
var CONFIG = {
	hostname: '',
	//nodeUrl: 'http://localhost'
	nodeUrl: 'http://remomusic.herokuapp.com',
	devmode: false,
	fileSystemMaxStorage: 200 * 1024 * 1024,
	dir: {
		scripts: 	'/masterPlayer/javascripts/',
		vendor: 	'/masterPlayer/javascripts/vendor/',
		plugins: 	'/masterPlayer/javascripts/plugins/'
	}
};

var masterPlayer = function(){};
var mp = new masterPlayer();

//Custom Options
//==============

//File System
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

//Audio Context
window.audioContext = window.webkitAudioContext || window.AudioContext;


//Load resources
//==============

//System Required
yepnope({
	load: [
		CONFIG.dir.vendor + 'jquery.jplayer.js',
		CONFIG.dir.vendor + 'jplayer.playlist.js'
	]
});

//Core
yepnope({
	load: CONFIG.dir.scripts + 'masterPlayer.js',
	callback: function(){
		//Init player
		masterPlayer.playerInit();

		//Is a app for Google?
		yepnope({
			test: yepnope.tests.chromeApp(),
			yep: {
				chromeApp: CONFIG.dir.scripts + 'chromeApp.js'
			},
			callback: {
				chromeApp: function(){
					masterPlayer.chromeAppInit();
				}
			}
		});


		//Is web app?
		yepnope({
			test: yepnope.tests.webApp(),
			yep: {
				webApp: CONFIG.dir.scripts + 'webApp.js'
			},
			callback: {
				webApp: function(){
					masterPlayer.webAppInit();
				}
			}
		});

		//Have FileReader?
		yepnope({
			test: yepnope.tests.fileReader(),
			yep: {
				jdataview: CONFIG.dir.vendor + 'jdataview.js'
			},
			callback: {
				jdataview: function(){
					masterPlayer.fileReaderInit();
				}
			}
		});

		//Have connection and not a localhost?
		yepnope({
			test: yepnope.tests.online() && !yepnope.tests.localhost() && !yepnope.tests.chromeApp(),
			yep: {
				analytics: CONFIG.dir.scripts + 'analytics.js'
			},
			nope: {
				analytics: CONFIG.dir.scripts + 'analytics.offline.js'
			}
		});
	}
});

//Call plugins
yepnope([
	CONFIG.dir.plugins + 'qrCode.js',
	CONFIG.dir.plugins + 'equalizer/equalizer.js',
	CONFIG.dir.plugins + 'lyrics/lyrics.js'
]);
