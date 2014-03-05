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

	//Update all controls of control player (Ready state)
	this.resetControlPlayer = function() {
		//Send first informations
		var data = {};
		data.volume = $(masterPlayer.config.playerElement).jPlayer('option', 'volume') * 100;
		data.muted = $(masterPlayer.config.playerElement).jPlayer('option', 'muted');
		data.playlist = {};
		data.playlist.list =  [];

		//Todo: I need to remove some information from playlist to send to control Player. Best performance for this?
		var pl = masterPlayer.config.playlistInstance.playlist;
		for(var i = 0; i < pl.length; i++) {
			data.playlist.list.push({
				artist: pl[i].artist,
				thumbnail: pl[i].thumbnail,
				title: pl[i].title
			});
		}

		data.playlist.current = masterPlayer.config.playlistInstance.current;
		data.playlist.loop = masterPlayer.config.playlistInstance.loop;
		data.playlist.shuffled = masterPlayer.config.playlistInstance.shuffled;
		data.playlist.playing = masterPlayer.config.playing;
		data.playlist.currentTime = $(masterPlayer.config.playerElement).data('jPlayer').status.currentTime;
		data.playlist.duration = $(masterPlayer.config.playerElement).data('jPlayer').status.duration;
		_self.updateControlPlayer('update','playlist',data);
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
						_self.resetControlPlayer();
					}
				break;

				//Playlist updates
				case 'playlist':
					switch(m.message) {
						//Playing (play or pause)
						case 'playing':
							masterPlayer.config.viacp = true;
							if(m.data.playing == true) { masterPlayer.config.playlistInstance.play(); }
							else { masterPlayer.config.playlistInstance.pause(); }
						break;

						///Current playing
						case 'current':
							masterPlayer.config.viacp = true;

							//Next or prev
							if(m.data.current == '-') {
								if(masterPlayer.config.playlistInstance.current != 0)
									m.data.current = masterPlayer.config.playlistInstance.current - 1;
								else
									m.data.current = 0;
							} else if(m.data.current == '+') {
								if(masterPlayer.config.playlistInstance.current < masterPlayer.config.playlistInstance.playlist.length -1)
									m.data.current = masterPlayer.config.playlistInstance.current + 1;
								else
									m.data.current = masterPlayer.config.playlistInstance.playlist.length -1;
							}

							masterPlayer.config.playlistInstance.select(Number(m.data.current));
							masterPlayer.config.viacp = true;
							if(m.data.playing == true) { masterPlayer.config.playlistInstance.play(); }
							else { masterPlayer.config.playlistInstance.play(); masterPlayer.config.viacp = true; masterPlayer.config.playlistInstance.pause(); }
						break;
					};
				break;

				//Controls updates
				case 'control':
					//Volume
					if(m.message == 'volume') {
						masterPlayer.config.viacp = true;
						$(masterPlayer.config.playerElement).jPlayer('volume', m.data.volume);
						masterPlayer.config.viacp = true;
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

		//Update time
		$(masterPlayer.config.playerElement).on($.jPlayer.event.durationchange + '.socket', function() {
			if(masterPlayer.config.viacp == false) {
				var data = {};
				data.playlist = {};
				data.playlist.currentTime = $(masterPlayer.config.playerElement).data('jPlayer').status.currentTime;
				data.playlist.duration = $(masterPlayer.config.playerElement).data('jPlayer').status.duration;
				_self.updateControlPlayer('playlist','currenttime', data);
			} else {
				masterPlayer.config.viacp = false;
			}
		});

		//On seek
		$(masterPlayer.config.playerElement).on($.jPlayer.event.seeked + '.socket', function() {
			if(masterPlayer.config.viacp == false) {
				var data = {};
				data.playlist = {};
				data.playlist.currentTime = $(masterPlayer.config.playerElement).data('jPlayer').status.currentTime;
				data.playlist.duration = $(masterPlayer.config.playerElement).data('jPlayer').status.duration;
				_self.updateControlPlayer('playlist','currenttime', data);
			} else {
				masterPlayer.config.viacp = false;
			}
		});

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
				_self.resetControlPlayer();
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

		//On loading music files
		$(masterPlayer.config.playerElement).on('startloading.socket', function() {
			var data = {};
			data.loading = true;
			_self.updateControlPlayer('status','loading',data);
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