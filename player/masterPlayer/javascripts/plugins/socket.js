/// <reference path="_references.js" />
"use strict";

//Player start config
masterPlayer.config.socketID = null;
masterPlayer.config.playerSocket = null;

//Socket init
masterPlayer.socketInit = function(){
	//Open socket for player
	this.config.playerSocket = io.connect(CONFIG.nodeUrl + '/player');

	console.log(CONFIG.nodeUrl + '/player');

	//system messages
	this.config.playerSocket.on('message', function(data){
		switch(data.code) {
			case 'connect':
			break;
		}
	});

	//Autentica o player e ID
	this.config.playerSocket.emit('message', {playerID: this.config.id});

	//Comunicação de autenticação
	this.config.playerSocket.on('authenticateMessage', function(data){
		switch(data.code) {
			//Desconectado, ID indefinido
			case '001':
				console.log('FALHOU!');
			break;

			//Autenticou
			case '000':
				masterPlayer.config.socketID = data.socketID;
				console.log('Usuário autenticado. ID:' + data.socketID);
			break;
		} 
	});

	//Mensagens de controle de música
	this.config.playerSocket.on('musicControl', function(data){
		switch(data.action) {
			case 'play':
				$('.jp-play').trigger('click');
			break;

			case 'pause':
				$('.jp-pause').trigger('click');
			break;

			case 'next':
				$('.jp-next').trigger('click');
			break;

			case 'prev':
				$('.jp-previous').trigger('click');
			break;

			case 'ready':
				
			break;
		}
	});
};