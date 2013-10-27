"use strict";

//On start
chrome.app.runtime.onLaunched.addListener(function(items) {
	console.log(items);
	chrome.app.window.create('masterPlayer/index.html', {
		id: 'masterPlayer',
		width: 902,
		height: 500,
		minWidth: 900,
		minHeight: 500,
		frame: 'none'
	});
});