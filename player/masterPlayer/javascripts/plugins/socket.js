/// <reference path="_references.js" />
"use strict";

//Player start config
masterPlayer.config.viacp = false;
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
	this.updateControlPlayer = function(type, message, data) {
		data = data || {};

		//Send to control player
		console.log('Socket: Send message - ', type, message, data);
		masterPlayer.config.playerSocket.emit('cp', {
			type: type,
			message: message,
			data: data,
			from: 'mp',
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
						var data = {};
						data.volume = $(masterPlayer.config.playerElement).jPlayer('option', 'volume') * 100;
						data.muted = $(masterPlayer.config.playerElement).jPlayer('option', 'muted');
						data.playlist = {};
						data.playlist.list =  masterPlayer.config.playlistInstance.playlist;
						data.playlist.current = masterPlayer.config.playlistInstance.current;
						data.playlist.loop = masterPlayer.config.playlistInstance.loop;
						data.playlist.shuffled = masterPlayer.config.playlistInstance.shuffled;
						data.playlist.playing = masterPlayer.config.playing;
						_self.updateControlPlayer('update','playlist',data);
					}
				break;

				//Playlist updates
				case 'playlist':
					//Current playing
					if(masterPlayer.config.playlistInstance.current != m.data.current) {
						masterPlayer.config.viacp = true;
						masterPlayer.config.playlistInstance.select(Number(m.data.current));
						if(m.data.playing == true) { masterPlayer.config.playlistInstance.play(); }
						else { masterPlayer.config.playlistInstance.play(); masterPlayer.config.playlistInstance.pause(); }
					}

					//Play or pause
					if(masterPlayer.config.playing != m.data.playing) {
						masterPlayer.config.viacp = true;
						if(m.data.playing == true) { masterPlayer.config.playlistInstance.play(); }
						else { masterPlayer.config.playlistInstance.pause(); }
					}
				break;


				//Controls updates
				case 'control':
					//Volume
					if(m.message == 'volume') {
						masterPlayer.config.viacp = true;
						$(masterPlayer.config.playerElement).jPlayer('volume', m.data.volume);
						$(masterPlayer.config.playerElement).jPlayer('mute', m.data.muted);
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
			if(masterPlayer.config.viacp == false) {
				var data = {};
				data.playlist = {};
				data.playlist.playing = masterPlayer.config.playing;
				data.playlist.current = masterPlayer.config.playlistInstance.current;
				_self.updateControlPlayer('playlist','play', data);
			} else {
				masterPlayer.config.viacp = false;
			}
		});

		//Pause
		$(masterPlayer.config.playerElement).on($.jPlayer.event.pause + '.socket', function() {
			if(masterPlayer.config.viacp == false) {
				var data = {};
				data.playlist = {};
				data.playlist.playing = masterPlayer.config.playing;
				_self.updateControlPlayer('playlist','play',data);
			} else {
				masterPlayer.config.viacp = false;
			}
		});

		//Update music info
		$(masterPlayer.config.playerElement).on('updatemusicinfo.socket', function() {
			if(masterPlayer.config.viacp == false) {
				_self.updateControlPlayer('playlist');
			} else {
				masterPlayer.config.viacp = false;
			}
		});

		//Update volume control
		$(masterPlayer.config.playerElement).on($.jPlayer.event.volumechange + '.socket', function() {
			if(masterPlayer.config.viacp == false) {
				var data = {};
				data.volume = $(masterPlayer.config.playerElement).jPlayer('option', 'volume') * 100;
				data.muted = $(masterPlayer.config.playerElement).jPlayer('option', 'muted');
				_self.updateControlPlayer('control','volume',data);
			} else {
				masterPlayer.config.viacp = false;
			}
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