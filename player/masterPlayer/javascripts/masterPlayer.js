//Player MASTER
//http://www.jplayer.org/latest/developer-guide/
////////////////////////////////////////////
var newDate = new Date();

//Player start config
masterPlayer.config = {
	id: newDate.getTime(),
	socketID: null,
	playerInstance: null,
	playing: false,
	playerSocket: null,
	playerElement: '#jquery_jplayer',
	initialMusic: [
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
	]
};

//Player init
masterPlayer.playerInit = function(){
	//Start controls
	this.menuControl();

	//Binds
	this.keyboardEvents();

	//Start player
	this.config.playerInstance = new jPlayerPlaylist({
		jPlayer: this.config.playerElement,
		cssSelectorAncestor: "#jp_container"
	}, this.config.initialMusic, {
		swfPath: "javascripts/vendor",
		supplied: "oga, mp3, wav",
		wmode: "window",
		playlistOptions: {
			enableRemoveControls: false,
			loopOnPrevious: true,
			displayTime: 0,
			addTime: 0,
			removeTime: 0,
			shuffleTime: 0,
			onPlay: function(){
				//Scroll to music
				$('.jp-playlist').stop().animate({
						scrollTop: (38) * (this.current - 2)
				});

				//Set play
				masterPlayer.config.playing = true;
			},
			onPause: function(){
				//Set play
				masterPlayer.config.playing = false;
			}
		}
	});
};

//Menu control
masterPlayer.menuControl = function(){
	//On click in open files
	$('.menu-open-files').on('click', function(){
		$('#open-files').trigger('click');
	});

	//On open folder
	$('#open-files').on('change', function(event){
		masterPlayer.fileTreeReader(event.target.files);
	});

	//Open credits
	$('.menu-info').on('click', function(){
		window.location.hash = 'credits';
	});
};

//FileTree reader
masterPlayer.fileTreeReader = function(files){
	var playList = [],
		timeOutForDone = -1;
	
	//Filesystem for trees
	function traverseItemTree(item, path) {
		path = path || "";
		if (item.isFile) {
			// Get file
			item.file(function(file) {
				traverseFileTree(file);
			});
		} else if (item.isDirectory) {
			// Get folder contents
			var dirReader = item.createReader();
			dirReader.readEntries(function(entries) {
				for (var i=0; i<entries.length; i++) {
					traverseItemTree(entries[i], path + item.name + "/");
				}
			});
		}
	}

	//Filesystem for upload trees
	function traverseFileTree(file) {
		if(file.type === 'audio/mp3') {
			playList.push({
				title: file.name.replace(".mp3",""),
				mp3: window.URL.createObjectURL(file)
			});

			clearTimeout(timeOutForDone);
			timeOutForDone = setTimeout( function(){
				//Play the playlist
				if(playList.length) {
					masterPlayer.config.playerInstance.setPlaylist(playList);
					masterPlayer.config.playerInstance.play();
				}
			}, 200);
		}
	}


	//Detect
	for (var i=0; i < files.length; i++) {
		if(typeof files[i].webkitGetAsEntry == 'function') {
			var item = files[i].webkitGetAsEntry();
			if (item) {
				traverseItemTree(item);
			}
		} else {
			traverseFileTree(files[i]);
		}
	}
};

//FileReader
masterPlayer.fileReaderInit = function() {
	//Music listener with fileReader
	var dropTarget = $('#drag-drop-layer'),
		html = $('html'),
		showDrag = false,
		timeout = -1;

	$('html')
		//On drag enter
		.on('dragenter', function(event){
			dropTarget.addClass('hover');
			showDrag = true;
		})

		//On drag over
		.on('dragover', function(event){
			event.preventDefault();
			showDrag = true;
		})

		//On drag leave
		.on('dragleave', function(event){
			showDrag = false;
			clearTimeout(timeout);
			timeout = setTimeout(function(){
				if(!showDrag)
					dropTarget.removeClass('hover');
			}, 200);
		})

		//On drop files or folders
		.on('drop', function(event){
			//Prevent default actions
			event.preventDefault();
			event.stopPropagation();

			//Hide layer
			$('#drag-drop-layer').removeClass('hover');

			//var files = event.originalEvent.dataTransfer.files || event.dataTransfer.files,
			var items = event.originalEvent.dataTransfer.items || event.dataTransfer.items;

			masterPlayer.fileTreeReader(items);
				

			return false;
		});
};

//Bind keyboard events
masterPlayer.keyboardEvents = function(){
	$('body').on('keyup', function(event){

		switch(event.keyCode) {
			//Play or pause
			case 80: //p
			case 32: //space
			case 179: //Multimidia keyboard
				if(masterPlayer.config.playing)
					masterPlayer.config.playerInstance.pause();
				else
					masterPlayer.config.playerInstance.play();
			break;

			//Next music
			case 39: //Right arrow
			case 40: //Bottom arrow
			case 176: //Multimidia keyboard
				masterPlayer.config.playerInstance.next();
			break;

			//previous music
			case 37: //Left arrow
			case 38: //Up arrow
			case 177: //Multimidia keyboard
				masterPlayer.config.playerInstance.previous();
			break;
		}

		console.log(event);
		console.log(event.keyCode);
	});
};

//Socket init
masterPlayer.socketInit = function(){
	//Open socket for player
	this.config.playerSocket = io.connect(CONFIG.nodeUrl + '/player');

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

//qrCode init
masterPlayer.qrCodeInit = function() {
	//qrCode
	$('#qrcode').qrcode(CONFIG.nodeUrl + '/remote/' + masterPlayer.config.id);
	
	$('#show-QR-code').show().toggle(function(evt){
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
};

//Chrome actions init
masterPlayer.chromeWebInit = function() {
	//Default binds
	//=============

	//Prevent Google Chrome scroll (its a bug?)
	$('body').on('mousewheel', function(e){
		if(!$(e.target).hasClass('jp-playlist') && !$(e.target).hasClass('jp-playlist-item') && e.target.nodeName != 'UL' )
			e.preventDefault();
	});

	//Prevent right-mouse-button click
	document.oncontextmenu=new Function ("return false");

	//Chrome actions
	//==============
	$('#chrome-actions').show();

	//Close
	$('.chrome-close').hide();

	//Maximize
	$('.chrome-maximize').on('click', function(){

		var
			el = document.documentElement,
			isFullScreen = 
				document.fullscreen
				|| document.mozFullScreen
				|| document.webkitIsFullScreen
			cancel = 
				document.exitFullscreen
				|| document.mozCancelFullScreen
				|| document.webkitCancelFullScreen

			request =
				el.requestFullScreen
				|| el.mozRequestFullScreen
				|| el.webkitRequestFullScreen;

		
		isFullScreen ? cancel.call(document) : request.call(el);
	});

	//Minimize
	$('.chrome-minimize').hide();
}