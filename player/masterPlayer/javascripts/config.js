"use strict";

//Global config
//=============
var CONFIG = {
	hostname: '',
	//nodeUrl: 'http://localhost'
	nodeUrl: 'http://remomusic.herokuapp.com'
};

var masterPlayer = {};

//Load resources
//==============

//Tests
yepnope.tests = {
	windowsApp: function(){ return typeof Windows != 'undefined'; },
	chromeApp: function(){ return typeof chrome != 'undefined' && typeof chrome.app.runtime != 'undefined'; },
	webApp: function(){ return (!this.windowsApp() && !this.chromeApp()); },
	fullScreen: function(){ return document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.requestFullScreen; },
	fileReader: function(){ return window.File && window.FileReader && window.FileList && window.Blob; },
	online: function(){ return navigator.onLine; },
	localhost: function() { return window.location.hostname == 'localhost'; }
};

//Mandatory
yepnope({
	load: [
		'/masterPlayer/javascripts/vendor/jquery.js',
		'/masterPlayer/javascripts/vendor/jquery.jplayer.min.js',
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

		//Have connection and not a localhost AND not a Windows APP?
		yepnope({
			test: yepnope.tests.online() && !yepnope.tests.localhost() && !yepnope.tests.windowsApp(),
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