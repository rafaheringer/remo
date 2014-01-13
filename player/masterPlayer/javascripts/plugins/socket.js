/// <reference path="_references.js" />
"use strict";

//Player start config
masterPlayer.config.socketID = null;
masterPlayer.config.playerSocket = null;


masterPlayer.prototype.socket = function() {
	var _self = this;

	//Constructor
	this.__constructor = function() {
		//Config
	};

	//Open Socket connection
	this.openSocket = function() {
		console.log('Socket: ' + CONFIG.nodeUrl + ':' + CONFIG.nodePort + '/player');
		masterPlayer.config.playerSocket = io.connect(CONFIG.nodeUrl + '/player', {port: CONFIG.nodePort});
	};

	//Send to CP updated info
	this.updateControlPlayer = function(type, message) {
		var data = {};

		switch(type) {
			//Playlist
			case 'playlist':
			case 'update':
				data.playlist = {};
				data.playlist.list =  masterPlayer.config.playlistInstance.playlist;
				data.playlist.current = masterPlayer.config.playlistInstance.current;
				data.playlist.loop = masterPlayer.config.playlistInstance.loop;
				data.playlist.shuffled = masterPlayer.config.playlistInstance.shuffled;
				data.playlist.playing = masterPlayer.config.playing;
			break;
		}

		//Send to control player
		console.log('Socket: Send message - ', type, message, data);
		masterPlayer.config.playerSocket.emit('cp', {
			type: type,
			message: message,
			data: data,
			playerId: masterPlayer.config.id
		});
	};

	//Receive messages from CP
	this.receiveMessages = function() {
		masterPlayer.config.playerSocket.on('message-mp', function(m) {
			console.log('Socket: received message - ', m);

			switch(m.type) {
				//Ready status
				case 'status':
					if(m.message == 'ready') {
						//Send firt informations
						_self.updateControlPlayer('update','playlist');
					}
				break;

				//Playlist updates
				case 'playlist':
					//Current playing

					//Play or pause
					if(masterPlayer.config.playing != m.data.playing) {
						if(m.data.playing == true) { masterPlayer.config.playlistInstance.play(); }
						else { masterPlayer.config.playlistInstance.pause(); }
					}
				break;
			}
		});
	};

	//Init
	this.init = function() {
		console.log('Socket: init');

		_self.openSocket();
		_self.receiveMessages();
		_self.delegateEvents();

		//System messages
		masterPlayer.config.playerSocket.on('message', function(data){
			switch(data.code) {
				case 'connect':
					console.log('Socket: Socket.io connected.');
				break;
			}
		});

		//Send authenticate request
		masterPlayer.config.playerSocket.emit('message', {playerId: masterPlayer.config.id, from: 'mp'});

		//Receive authenticate response
		masterPlayer.config.playerSocket.on('authenticateMessage', function(data){
			switch(data.code) {
				//Error
				case '001':
					console.log('Socket: Ops! Erro in connection.');
				break;

				//Success
				case '000':
					masterPlayer.config.socketID = data.socketID;
					console.log('Socket: User authenticated. ID:' + data.socketID);
				break;
			} 
		});
	};

	//Delegate events
	this.delegateEvents = function() {
		var _self = this;

		//Play
		$(masterPlayer.config.playerElement).on($.jPlayer.event.play + '.socket', function() {
			_self.updateControlPlayer('playlist');
		});

		//Pause
		$(masterPlayer.config.playerElement).on($.jPlayer.event.pause + '.socket', function() {
			_self.updateControlPlayer('playlist');
		});
	};

	this.__constructor();

	//Public methods
	return {
		init: this.init,
		updateControlPlayer: this.updateControlPlayer
	};
};

//Have Internet connection?
yepnope({
	test: yepnope.tests.online(),
	yep: {
		socketio: CONFIG.dir.vendor + 'socket.io.js'
	},
	callback: {
		socketio: function(){
			masterPlayer.plugins.socket = new mp.socket();
			masterPlayer.plugins.socket.init();
		}
	}
});