masterPlayer.chromeAppInit = function() {
	this.chromeApp = {
		startDrag: null,
		stopDrag: null,
		isDragging: false,
		currentMousePos: {x: -1, y: -1},
		currentBounds: chrome.app.window.current().getBounds()
	};

	//Chrome actions
	//==============
	$('#chrome-actions').show();

	//Minimize
	$('.chrome-minimize').on('click', function(){
		chrome.app.window.current().minimize();
	});

	//Maximize
	$('.chrome-maximize').on('click', function(){
		if(chrome.app.window.current().isMaximized())
			chrome.app.window.current().restore();
		else
			chrome.app.window.current().maximize();
	});

	//Close
	$('.chrome-close').on('click', function(){
		window.close();
	});

	//Drag chrome methods
	this.chromeApp.startDrag = function(){
		this.isDragging = true;
		$(document).on('mousemove.startDrag', function(event){
			chrome.app.window.current().setBounds({
				left: event.pageX + chrome.app.window.current().getBounds().left - masterPlayer.chromeApp.currentMousePos.x,
				top: event.pageY + chrome.app.window.current().getBounds().top - masterPlayer.chromeApp.currentMousePos.y
			});

			event.preventDefault();
			return false;
		});
	};

	this.chromeApp.stopDrag = function(){
		this.isDragging = false;
		$(document).off('mousemove.startDrag');
	};

	//Drag
	$('#chrome-drag')
		.on('mousedown', function(event){
			masterPlayer.chromeApp.currentMousePos = {x: event.pageX, y: event.pageY};
			masterPlayer.chromeApp.currentBounds = chrome.app.window.current().getBounds();
			masterPlayer.chromeApp.startDrag();
		});

	$(document)
		.on('mouseup', function(){
			if(masterPlayer.chromeApp.isDragging)
				masterPlayer.chromeApp.stopDrag();
		});
};