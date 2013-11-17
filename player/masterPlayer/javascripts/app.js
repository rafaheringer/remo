/// <reference path="_references.js" />
"use strict";

//Global config
//=============
var CONFIG = {
	hostname: '',
	//nodeUrl: 'http://localhost'
	nodeUrl: 'http://remomusic.herokuapp.com',
	devmode: true,
	fileSystemMaxStorage: 200 * 1024 * 1024
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
	'/masterPlayer/javascripts/vendor/jquery.ui.core.js',
	'/masterPlayer/javascripts/vendor/jquery.ui.widget.js',
	'/masterPlayer/javascripts/vendor/jquery.ui.mouse.js'
];

//System Required
yepnope({
	load: [
		'/masterPlayer/javascripts/vendor/jquery.jplayer.js',
		'/masterPlayer/javascripts/vendor/jplayer.playlist.js'
	]
});

//Core
yepnope({
	load: '/masterPlayer/javascripts/masterPlayer.js',
	callback: function(){
		//Init player
		masterPlayer.playerInit();

		//Is a app for Google?
		yepnope({
			test: yepnope.tests.chromeApp(),
			yep: {
				chromeApp: '/masterPlayer/javascripts/chromeApp.js'
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
				windowsApp: '/masterPlayer/javascripts/windowsApp.js'
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
				windowsApp: '/masterPlayer/javascripts/webApp.js'
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
				jdataview: '/masterPlayer/javascripts/vendor/jdataview.js'
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
					'/masterPlayer/javascripts/vendor/jquery.ui.slider.js',
					'/masterPlayer/javascripts/equalizer.js'
				]});
			}
		});

		//Have connection and not a localhost AND not a Windows APP?
		yepnope({
			test: yepnope.tests.online() && !yepnope.tests.localhost() && !yepnope.tests.windowsApp() && !yepnope.tests.chromeApp(),
			yep: {
				analytics: '/masterPlayer/javascripts/analytics.js'
			},
			nope: {
				analytics: '/masterPlayer/javascripts/analytics.offline.js'
			}
		});
	}
});

//Have connection?
yepnope({
	test: yepnope.tests.online() && !yepnope.tests.windowsApp(),
	yep: {
		socket: '/masterPlayer/javascripts/vendor/socket.io.js',
		qrcodecore: '/masterPlayer/javascripts/vendor/qrcode.js',
		jqueryqrcode: '/masterPlayer/javascripts/vendor/jquery.qrcode.js'
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