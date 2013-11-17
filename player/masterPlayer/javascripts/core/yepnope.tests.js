//Tests
yepnope.tests = {
	chromeApp: function(){ return typeof chrome != 'undefined' && typeof chrome.app.runtime != 'undefined'; },
	webApp: function(){ return (!this.windowsApp() && !this.chromeApp()); },
	fullScreen: function(){ return document.documentElement.webkitRequestFullScreen || document.documentElement.mozRequestFullScreen || document.documentElement.requestFullScreen; },
	fileReader: function(){ return window.File && window.FileReader && window.FileList && window.Blob; },
	online: function(){ return navigator.onLine; },
	localhost: function() { return window.location.hostname == 'localhost'; },
	
	//Tests for chrome apps
	chrome: {
		restorable: function(){return typeof chrome.fileSystem.isRestorable != 'undefined';},
		chooseEntry: function(){return typeof chrome.fileSystem.chooseEntry != 'undefined';}
	}
};
