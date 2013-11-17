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

var masterPlayer = {};

//Custom Options
//==============

//File System
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

//Audio Context
window.audioContext = window.webkitAudioContext || window.AudioContext;


//Load resources
//==============

//jQuery UI core, if use
var jQueryUiCore = [
	CONFIG.dir.vendor + 'jquery.ui.core.js',
	CONFIG.dir.vendor + 'jquery.ui.widget.js',
	CONFIG.dir.vendor + 'jquery.ui.mouse.js'
];

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

		//Is a Windows app?
		yepnope({
			test: yepnope.tests.windowsApp(),
			yep: {
				windowsApp: CONFIG.dir.scripts + 'windowsApp.js'
			},
			callback: {
				windowsApp: function(){
					masterPlayer.windowsAppInit();
				}
			}
		});

		//Is web app?
		yepnope({
			test: yepnope.tests.webApp(),
			yep: {
				windowsApp: CONFIG.dir.scripts + 'webApp.js'
			},
			callback: {
				windowsApp: function(){
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

		//Have AudioContext?
		yepnope({
			test: window.AudioContext || window.webkitAudioContext,
			yep: jQueryUiCore,
			complete: function(){
				yepnope({load: [
					CONFIG.dir.vendor + 'jquery.ui.slider.js',
					CONFIG.dir.scripts + 'plugins/equalizer.js'
				]});
			}
		});

		//Have connection and not a localhost AND not a Windows APP?
		yepnope({
			test: yepnope.tests.online() && !yepnope.tests.localhost() && !yepnope.tests.windowsApp() && !yepnope.tests.chromeApp(),
			yep: {
				analytics: CONFIG.dir.scripts + 'analytics.js'
			},
			nope: {
				analytics: CONFIG.dir.scripts + 'analytics.offline.js'
			}
		});
	}
});

//Have connection?
yepnope({
	test: yepnope.tests.online() && !yepnope.tests.windowsApp(),
	yep: {
		socket: CONFIG.dir.vendor + 'socket.io.js',
		qrcodecore: CONFIG.dir.vendor + 'qrcode.js',
		jqueryqrcode: CONFIG.dir.vendor + 'jquery.qrcode.js'
	},
	callback: {
		socket: function(){
			masterPlayer.socketInit();
		},
		jqueryqrcode: function(){
			masterPlayer.qrCodeInit();
		}
	}
});

//Windows App Initial Binds
if(yepnope.tests.windowsApp()) {
	var mediaControls;
	mediaControls = Windows.Media.MediaControl;

	//Start Application
	WinJS.Application.start();

	//On open application
	WinJS.Application.addEventListener("activated", function (e) {
		var PID = setInterval(function(){
			if(typeof masterPlayer.windowsApp != 'undefined') {
				masterPlayer.windowsApp.activated(e);
				clearInterval(PID);
			}
		}, 100);

		WinJS.Application.start();
	}, false);
}