"use strict";

masterPlayer.webAppInit = function() {
	//Default binds
	//=============

	//Prevent Google Chrome scroll (its a bug?)
	$('body').on('mousewheel', function(e){
		if(!$(e.target).hasClass('jp-playlist') && !$(e.target).hasClass('jp-playlist-item') && e.target.nodeName != 'UL' )
			e.preventDefault();
	});

	//Prevent right-mouse-button click
	document.oncontextmenu = new Function("return false");

	//Chrome actions
	//==============
	$('#chrome-actions').show();

	//Close
	$('.chrome-close').hide();

	//Maximize
	if(yepnope.tests.fullScreen()) {
		$('.chrome-maximize').on('click', function(){
			var
				el = document.documentElement,
				isFullScreen = 
					document.fullscreen
					|| document.mozFullScreen
					|| document.webkitIsFullScreen,
					
				cancel = 
					document.exitFullscreen
					|| document.mozCancelFullScreen
					|| document.webkitCancelFullScreen,

				request =
					el.requestFullScreen
					|| el.mozRequestFullScreen
					|| el.webkitRequestFullScreen;

			isFullScreen ? cancel.call(document) : request.call(el);
			analytics.track('fullscreen', isFullScreen ? 'off' : 'on');
		});
	} else {
		$('.chrome-maximize').hide();
	}

	//Minimize
	$('.chrome-minimize').hide();
};