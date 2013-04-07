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
var dropTarget = $('#drag-drop-layer'),
	html = $('html'),
	showDrag = false,
	timeout = -1;

$('html')
	//Ao entrar o primeiro drop
	.on('dragenter', function(event){
		dropTarget.addClass('hover');
		showDrag = true;
	})

	//Ao começar a arrastar
	.on('dragover', function(event){
		event.preventDefault();
		showDrag = true;
	})

	//Ao terminar
	.on('dragleave', function(event){
		showDrag = false;
		clearTimeout(timeout);
		timeout = setTimeout(function(){
			if(!showDrag)
				dropTarget.removeClass('hover');
		}, 200);
	})

	//Ao dropar as músicas
	.on('drop', function(event){
		//Previne eventos padrões
		event.preventDefault();
		event.stopPropagation();

		//Esconde layer
		$('#drag-drop-layer').removeClass('hover');

		console.log('Dropou os seguintes arquivos:');

		var files = event.originalEvent.dataTransfer.files || event.dataTransfer.files,
			items = event.originalEvent.dataTransfer.items || event.dataTransfer.items,
			playList = [],
			timeOutForDone = -1;
		
		//Filesystem para pastas
		function traverseFileTree(item, path) {
			path = path || "";
			if (item.isFile) {
				// Get file
				item.file(function(file) {
					if(file.type === 'audio/mp3') {
						playList.push({
							title: file.name.replace(".mp3",""),
							mp3: window.URL.createObjectURL(file)
						});
					}

					clearTimeout(timeOutForDone);
					timeOutForDone = setTimeout( function(){
						//Play the playlist
						if(playList.length) {
							myPlaylist.setPlaylist(playList);
							myPlaylist.play();
						}
					}, 200);
				});
			} else if (item.isDirectory) {
				// Get folder contents
				var dirReader = item.createReader();
				dirReader.readEntries(function(entries) {
					for (var i=0; i<entries.length; i++) {
						traverseFileTree(entries[i], path + item.name + "/");
					}
				});
			}
		}

		for (var i=0; i<items.length; i++) {
			var item = items[i].webkitGetAsEntry();
			if (item) {
				traverseFileTree(item);
			}
		}

		return false;
	});


//Player INIT
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
	supplied: "oga, mp3, wav",
	wmode: "window",
	playlistOptions: {
		enableRemoveControls: false,
		displayTime: 0,
		addTime: 0,
		removeTime: 0,
		shuffleTime: 0
	}
});

//qrCode
$('#show-QR-code').toggle(function(evt){
	$(this).addClass('showed');
	$('.click-to-show-QR-code').hide();
	$('#qrcode').fadeIn(100);
	evt.stopPropagation();
}, function(evt){
	$(this).removeClass('showed');
	$('#qrcode').fadeOut(100, function(){
		$('.click-to-show-QR-code').show();
	});
	evt.stopPropagation();
});


$('body').on('click', function(){
	if($('#show-QR-code').is('.showed')) {
		$('#show-QR-code').trigger('click');
	}
});