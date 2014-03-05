//Player controlador
//http://www.jplayer.org/latest/developer-guide/
////////////////////////////////////////////

//Abre socket para o webplayer
var playerSocket = io.connect(CONFIG.nodeUrl + '/player');
var PLAYING = true;

var REMOTEPLAYER = {
	playerID: window.location.href.split('/remote/')[1],
	actions: {
		play: function(){
			PLAYING = true;

			playerSocket.emit('mp', {
				from: 'cp',
				type: 'playlist',
				message: 'playing',
				data: {playing: true},
				playerId: REMOTEPLAYER.playerID
			});

			$('#remotePlayer')
				.data('played', 'true')
				.find('.changeIcoToPlayOrPause')
					.removeClass('ico-play')
					.addClass('ico-pause');
		},

		pause: function() {
			PLAYING = false;

			playerSocket.emit('mp', {
				from: 'cp',
				type: 'playlist',
				message: 'playing',
				data: {playing: false},
				playerId: REMOTEPLAYER.playerID
			});

			$('#remotePlayer')
				.data('played', 'false')
				.find('.changeIcoToPlayOrPause')
					.removeClass('ico-pause')
					.addClass('ico-play');
		},

		next: function(){
			playerSocket.emit('mp', {
				from: 'cp',
				type: 'playlist',
				message: 'current',
				playerId: REMOTEPLAYER.playerID,
				data: {current: '+', playing: PLAYING}
			});
		},

		prev: function(){
			playerSocket.emit('mp', {
				from: 'cp',
				type: 'playlist',
				message: 'current',
				playerId: REMOTEPLAYER.playerID,
				data: {current: '-', playing: PLAYING}
			});
		}
	}
};

//Ações
///////
$('#remotePlayer').data('played', 'false');

//Música anterior
$('#prevMusic').on('click', function(){
	REMOTEPLAYER.actions.prev();
});

//Próxima música
$('#nextMusic').on('click', function(){
	REMOTEPLAYER.actions.next();
});

//Pausar ou play
$('#playPauseMusic').on('click', function(){
	$('#remotePlayer').data('played') == 'false' ? REMOTEPLAYER.actions.play() : REMOTEPLAYER.actions.pause();
});

//Envia comando "Estou pronto"
playerSocket.emit('musicControl', {
	to: REMOTEPLAYER.playerID,
	action: 'ready'
});