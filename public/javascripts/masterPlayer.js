//Player MASTER
//http://www.jplayer.org/latest/developer-guide/
////////////////////////////////////////////
var newDate = new Date();

//Configurações do player
var PLAYER = {
	id: newDate.getTime(),
	socketID: null
};

//jQuery e SOCKET.IO
//Abre socket para o webplayer
var playerSocket = io.connect(CONFIG.hostname + '/player');

//Mensagens do sistema
playerSocket.on('message', function(data){
	switch(data.code) {
		case 'connect':
			console.log(data);
			CONFIG.url = 'http://' + data.url + ':' + data.port;
			CONFIG.hostname = data.hostname + ':' + data.port;
        break;
	}
});

//Autentica o player e ID
playerSocket.emit('message', {playerID: PLAYER.id});

//Comunicação de autenticação
playerSocket.on('authenticateMessage', function(data){
	switch(data.code) {
		//Desconectado, ID indefinido
		case '001':
			console.log('FALHOU!');
		break;

		//Autenticou
		case '000':
			PLAYER.socketID = data.socketID;
			console.log('Usuário autenticado. ID:' + data.socketID);

			$('#qrcode').qrcode(CONFIG.url + '/remote/' + PLAYER.id);
			
		break;
	} 
});

//Mensagens de controle de música
playerSocket.on('musicControl', function(data){
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
	}
});


//Leitor de músicas fileReader
$('body')
	//Ao começar a arrastar
	.on('dragover', function(event){
		console.log('Drag começou.. estilizar a tela inteira');	
		event.preventDefault();
	})

	//Ao terminar
	.on('dragend', function(event){
		//return false;
	})

	//Ao dropar as músicas
	.on('drop', function(event){
		event.preventDefault();
		event.stopPropagation();
		console.log(event);
		console.log('Dropou os seguintes arquivos:');

		var files = event.originalEvent.dataTransfer.files;
		var playList = [];

		for(i=0; f = files[i]; i++) {
			if(f.type === 'audio/mp3') {
				console.log('Nome: ' + f.name + ' - Tamanhos: ' + f.size + 'bytes', f);

				playList.push({
					title: f.name,
					mp3: window.URL.createObjectURL(f)
				});

				//Cria playlist ou adiciona ao existente (CTRL apertado)
				console.log(playList);

			}
		}

		//Toca player
		myPlaylist.setPlaylist(playList);

		myPlaylist.play();
		return false;
	});


//Inicializa PLAYER
var myPlaylist = new jPlayerPlaylist({
	jPlayer: "#jquery_jplayer",
	cssSelectorAncestor: "#jp_container"
}, [
	{
		title:"Cro Magnon Man",
		mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
		oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
	},
	{
		title:"Your Face",
		mp3:"http://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3",
		oga:"http://www.jplayer.org/audio/ogg/TSP-05-Your_face.ogg"
	},
	{
		title:"Cyber Sonnet",
		mp3:"http://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3",
		oga:"http://www.jplayer.org/audio/ogg/TSP-07-Cybersonnet.ogg"
	},
	{
		title:"Tempered Song",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-01-Tempered-song.ogg"
	},
	{
		title:"Hidden",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-02-Hidden.ogg"
	},
	{
		title:"Lentement",
		free:true,
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg"
	},
	{
		title:"Lismore",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-04-Lismore.ogg"
	},
	{
		title:"The Separation",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-05-The-separation.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-05-The-separation.ogg"
	},
	{
		title:"Beside Me",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-06-Beside-me.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-06-Beside-me.ogg"
	},
	{
		title:"Bubble",
		free:true,
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-07-Bubble.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
	},
	{
		title:"Stirring of a Fool",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-08-Stirring-of-a-fool.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-08-Stirring-of-a-fool.ogg"
	},
	{
		title:"Partir",
		free: true,
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-09-Partir.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-09-Partir.ogg"
	},
	{
		title:"Thin Ice",
		mp3:"http://www.jplayer.org/audio/mp3/Miaow-10-Thin-ice.mp3",
		oga:"http://www.jplayer.org/audio/ogg/Miaow-10-Thin-ice.ogg"
	}
], {
	swfPath: "javascripts/vendor",
	supplied: "oga, mp3",
	wmode: "window"
});

//qrCode
$('#showQRCode').toggle(function(evt){
	$(this).addClass('showed');
	$('.clickToShowQRCode').hide();
	$('#qrcode').fadeIn(100);
	evt.stopPropagation();
}, function(evt){
	$(this).removeClass('showed');
	$('#qrcode').fadeOut(100, function(){
		$('.clickToShowQRCode').show();
	});
	evt.stopPropagation();
});


$('body').on('click', function(){
	if($('#showQRCode').is('.showed')) {
		$('#showQRCode').trigger('click');
	}
});
