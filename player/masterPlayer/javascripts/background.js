"use strict";

//On start
chrome.app.runtime.onLaunched.addListener(function(items) {
	console.log("Loaded items: ", items);

	chrome.app.window.create('masterPlayer/index.html', {
		id: 'masterPlayer',
		width: 902,
		height: 500,
		minWidth: 900,
		minHeight: 500,
		frame: 'none'
	}, function(createdWindow){
		var contentWindow = createdWindow.contentWindow;
		
		//Register loaded itens
		contentWindow.loadedItems = items.items;

		//If player is already open, change playlist and play
		if(typeof contentWindow.masterPlayer == 'function'){
			contentWindow.masterPlayer.fileTreeReader(contentWindow.loadedItems, function () {
				contentWindow.masterPlayer.config.playlistInstance.play();
			});
		}

		//On suspend
		createdWindow.onClosed.addListener(function() {
			//Send close action to control player
			console.log('Master player closed.');
			contentWindow.masterPlayer.suspend();
		});
	});
});