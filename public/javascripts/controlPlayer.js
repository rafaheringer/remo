//Player controlador
//http://www.jplayer.org/latest/developer-guide/
////////////////////////////////////////////


require(['vendor/jquery', '/socket.io/socket.io.js'], function(){
	var REMOTEPLAYER = {
		playerID: window.location.href.split('/remote/')[1],
		actions: {
			play: function(){
				playerSocket.emit('musicControl', {
					to: REMOTEPLAYER.playerID,
					action: 'play'
				});
			},

			pause: function() {
				playerSocket.emit('musicControl', {
					to: REMOTEPLAYER.playerID,
					action: 'pause'
				});
			}
		}
	};

	//Abre socket para o webplayer
	var playerSocket = io.connect(CONFIG.hostname + '/player');

	$(function() {
		//Busca conteúdo do player
		$('<p>Play</p>').appendTo('body').on('click', function(){
			REMOTEPLAYER.actions.play();
		});

		$('<p>Pausar</p>').appendTo('body').on('click', function(){
			REMOTEPLAYER.actions.pause();
		});
	});

	//Envia comando "Estou pronto"
	playerSocket.emit('musicControl', {
		to: REMOTEPLAYER.playerID,
		action: 'ready'
	});
});
