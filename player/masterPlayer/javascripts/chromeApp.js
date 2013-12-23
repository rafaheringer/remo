"use strict";

masterPlayer.chromeAppInit = function() {
	this.chromeApp = {
		startDrag: null,
		stopDrag: null,
		isDragging: false,
		currentMousePos: {x: -1, y: -1},
		currentBounds: chrome.app.window.current().getBounds()
	};

	//Save DEV
	if(typeof chrome.fileSystem.retainEntry == 'undefined')
		chrome.fileSystem.retainEntry = function(){return false};

	if(typeof chrome.fileSystem.isRestorable == 'undefined')
		chrome.fileSystem.isRestorable = function(){return false};

	if(typeof chrome.fileSystem.restoreEntry == 'undefined')
		chrome.fileSystem.restoreEntry = function(){return false};

	//Chrome actions
	//==============
	$('#chrome-actions').show();

	//Minimize
	$('.chrome-minimize').on('click', function(){
		chrome.app.window.current().minimize();
		analytics.track('minimize', 'click');
	});

	//Maximize
	$('.chrome-maximize').on('click', function(){
		if(chrome.app.window.current().isMaximized()) {
			chrome.app.window.current().restore();
			analytics.track('restore', 'click');
		}
		else {
			chrome.app.window.current().maximize();
			analytics.track('maximize', 'click');
		}
	});

	//Close
	$('.chrome-close').on('click', function(){
		analytics.track('close', 'click');
		setTimeout(function(){
			window.close();
		}, 600);
	});
};