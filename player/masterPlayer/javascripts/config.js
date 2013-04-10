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

//Mandatory
yepnope([
	'/masterPlayer/javascripts/vendor/jquery.js',
	'/masterPlayer/javascripts/vendor/jquery.jplayer.min.js',
	'/masterPlayer/javascripts/vendor/jplayer.playlist.min.js'
]);

//Core
yepnope({
	load: '/masterPlayer/javascripts/masterPlayer.js',
	callback: function(){
		masterPlayer.playerInit();

		//Is an app for Google?
		if(chrome.app.runtime) {
			yepnope({
				load: '/masterPlayer/javascripts/chromeApp.js',
				callback: function() {
					masterPlayer.chromeAppInit();
				}
			});
		}

		//Is web?
		else {
			//Have fullscreen API?
			if(document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.requestFullScreen) {
				masterPlayer.chromeWebInit();
			}

		}
		
		//Have FileReader?
		if(window.File && window.FileReader && window.FileList && window.Blob) {
			masterPlayer.fileReaderInit();
		}
	}
});

//Have connection?
yepnope({
	test: navigator.onLine,
	yep: {
		'socket': '/masterPlayer/javascripts/vendor/socket.io.js',
		'qrcodecore': '/masterPlayer/javascripts/vendor/qrcode.js',
		'jqueryqrcode': '/masterPlayer/javascripts/vendor/jquery.qrcode.js'
	},
	callback: {
		'socket': function(){
			masterPlayer.socketInit();
		},
		'jqueryqrcode': function(){
			masterPlayer.qrCodeInit();
		}
	}
});