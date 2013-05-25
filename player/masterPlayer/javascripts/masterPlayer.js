//Player MASTER
//http://www.jplayer.org/latest/developer-guide/
////////////////////////////////////////////
var newDate = new Date();
var initialPlaylist = [
		{
		    title:"Cro Magnon Man",
		    artist: "The Stark Palace",
		    mp3:"http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
		    file: "http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/TSP-01-Cro_magnon_man.ogg"
		},
		{
		    title:"Your Face",
		    artist: "The Stark Palace",
		    mp3:"http://www.jplayer.org/audio/mp3/TSP-05-Your_face.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/TSP-05-Your_face.ogg"
		},
		{
		    title:"Cyber Sonnet",
		    artist: "The Stark Palace",
		    mp3:"http://www.jplayer.org/audio/mp3/TSP-07-Cybersonnet.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/TSP-07-Cybersonnet.ogg"
		},
		{
		    title:"Tempered Song",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-01-Tempered-song.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-01-Tempered-song.ogg"
		},
		{
		    title:"Hidden",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-02-Hidden.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-02-Hidden.ogg"
		},
		{
		    title:"Lentement",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-03-Lentement.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-03-Lentement.ogg"
		},
		{
		    title:"Lismore",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-04-Lismore.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-04-Lismore.ogg"
		},
		{
		    title:"The Separation",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-05-The-separation.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-05-The-separation.ogg"
		},
		{
		    title:"Beside Me",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-06-Beside-me.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-06-Beside-me.ogg"
		},
		{
		    title:"Bubble",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-07-Bubble.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
		},
		{
		    title:"Stirring of a Fool",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-08-Stirring-of-a-fool.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-08-Stirring-of-a-fool.ogg"
		},
		{
		    title:"Partir",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-09-Partir.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-09-Partir.ogg"
		},
		{
		    title:"Thin Ice",
		    artist: "Miow",
		    mp3:"http://www.jplayer.org/audio/mp3/Miaow-10-Thin-ice.mp3",
		    oga:"http://www.jplayer.org/audio/ogg/Miaow-10-Thin-ice.ogg"
		}
]

//Player list config
//TODO
if (yepnope.tests.windowsApp) {
    initialPlaylist = null;
}

//Player start config
masterPlayer.config = {
	id: parseInt(newDate.getTime() + Math.random()),
	socketID: null,
	playlistInstance: null,
	playing: false,
	playerSocket: null,
	playerElement: '#remoMusicPlayer',
	lastFmApiKey: 'f2923bd087687602324332057ed0473a',
	initialMusic: initialPlaylist
	
};

//Player init
masterPlayer.playerInit = function(){
	//Start controls
	this.menuControl();

	//Start player
	this.config.playlistInstance = new jPlayerPlaylist({
			jPlayer: this.config.playerElement,
			cssSelectorAncestor: "#jp_container"
		}, 
		this.config.initialMusic, {
		playlistOptions: {
			enableRemoveControls: false,
			loopOnPrevious: true,
			displayTime: 0,
			addTime: 0,
			removeTime: 0,
			shuffleTime: 0
		},
		supplied: "mp3",
		smoothPlayBar: false,
		preload: 'metadata',
		volume: 0.8,
		errorAlerts: false,
		solution: "html",
		warningAlerts: false,
		keyEnabled: false,
		play: function(a){
			//Scroll to music
			$('.jp-playlist').stop().animate({
					scrollTop: (41) * (masterPlayer.config.playlistInstance.current - 2)
			});

			//Set play
			masterPlayer.config.playing = true;

			//Get and set Music info
			masterPlayer.setMusicInfo(masterPlayer.config.playlistInstance.playlist[masterPlayer.config.playlistInstance.current]);
		},
		pause: function() {
			//Set play
			masterPlayer.config.playing = false;
		},
		seeking: function(a){
			//Analytics
			analytics.track('musicProgress', 'click');
		},
		volumechange: function(a) {
			//Analytics
			analytics.track('volume', 'click');
		}
	});

	//Binds
	this.keyboardEvents();
	this.mouseEvents();
	this.applyAnalytics();
};

//Menu control
masterPlayer.menuControl = function() {
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

//Grab album cover from WEB and put in player
masterPlayer.grabAlbumCover = function(ID3) {
	//info.title and info.artist required; info.album prefer
	if(navigator.onLine) {
		var setImageCover = function(src) {
			var oldImage = $('.jp-music-cover img'),
				backupImage = oldImage.attr('src'),
				backupWidth = oldImage.attr('width'),
				backupHeight = oldImage.attr('height'),
				newImage = document.createElement('img');

			newImage.src = src;
			newImage.setAttribute('width', backupWidth);
			newImage.setAttribute('height', backupHeight);
			oldImage.remove();
			$(newImage)
				.appendTo('.jp-fake-image')
				.css({'opacity': 0.01, 'display': 'block'});

			newImage.onload = function(){
				$(newImage).animate({'opacity': 1}, 600, function(){
				 	$('.jp-fake-image').css('background-image','url("' + src + '")');
				});
			};
		};


		//Get album info
		$.ajax({
			url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=' + masterPlayer.config.lastFmApiKey + '&artist=' + ID3.artist + '&track=' + ID3.title + '&format=json',
			cache: true,
			success: function(result) {
				if(!result.error && typeof result.track.album != 'undefined') {
					//Create new image  (for get onload callback)
					//Create a blob file for packaged apps (see more at: http://developer.chrome.com/apps/app_external.html#objecttag)
					if(typeof chrome != 'undefined' && typeof chrome.app.runtime != 'undefined') {
						var xhr = new XMLHttpRequest();
						xhr.open('GET', result.track.album.image[1]['#text'], true);
						xhr.responseType = 'blob';

						xhr.onerror = function(e, o){
							console.log(this);
							console.log(e);
							console.log(o);
						};

						xhr.onload = function(e) {
							setImageCover(window.webkitURL.createObjectURL(this.response));
						};

						xhr.send();
					} 

					//Normal flow for create image
					else {
						setImageCover(result.track.album.image[1]['#text']);
					}

				} else {
					$('.jp-fake-image').css('background-image','none');
					$('.jp-music-cover img').attr('src','').animate({'opacity': 0.01}, 600);
				}
			}
		});
	}
};

//Music info
masterPlayer.setMusicInfo = function(music) {
	if(typeof music.file == 'object') {
		var reader = new FileReader();
		reader.readAsArrayBuffer(music.file);

		reader.onload = function(e) {
			var dv = new jDataView(this.result);
			var ID3 = {};

			//If dont load, use this information
			var fileName = music.file.name.replace(".mp3","");
			var title = fileName;
			var artist = null;
			if(fileName.split(' - ').length >= 2) {
				title = fileName.split(' - ')[1];
				artist = fileName.split(' - ')[0];
			}

			// "TAG" starts at byte -128 from EOF.
			// See http://en.wikipedia.org/wiki/ID3
			if (dv.getString(3, dv.byteLength - 128) == 'TAG') {
				ID3 = {
					title: dv.getString(30, dv.tell()),
					artist: dv.getString(30, dv.tell()),
					album: dv.getString(30, dv.tell()),
					year: dv.getString(4, dv.tell())
				};

			}

			//If wont find ID3
			else {
				ID3 = {
					title: title,
					artist: artist,
					album: '',
					year: ''
				};
			}

			//More verifications
			if($.trim(ID3.title).charCodeAt(0) == 0)
				ID3.title = title;

			if($.trim(ID3.artist).charCodeAt(0) == 0)
				ID3.artist = artist;

			//Set artist and title
			$('.jp-music-name').html(ID3.title);
			$('.jp-music-artist').html(ID3.artist);

			//Get album info
			masterPlayer.grabAlbumCover(ID3);
		};
	} else {
		var ID3 = {
			title: music.title,
			artist: music.artist,
			album: '',
			year: ''
		};

		//Set artist and title
		$('.jp-music-name').html(ID3.title);
		$('.jp-music-artist').html(ID3.artist);

		//Get album info
		masterPlayer.grabAlbumCover(ID3);
	}
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
		if(file.type === 'audio/mp3' || file.type === 'audio/mpeg' || file.contentType === 'audio/mpeg') {
			var fileName = file.name.replace(".mp3","");
			var title = fileName;
			var artist = null;
			
			if(fileName.split(' - ').length >= 2) {
				title = fileName.split(' - ')[1];
				artist = fileName.split(' - ')[0];
			}

			playList.push({
				title: title,
				artist: artist,
				file: file,
				mp3: window.URL.createObjectURL(file)
			});

			clearTimeout(timeOutForDone);
			timeOutForDone = setTimeout( function(){
				//Play the playlist
				if(playList.length) {
					masterPlayer.config.playlistInstance.setPlaylist(playList);
					masterPlayer.config.playlistInstance.play();
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

			var items = event.dataTransfer ? event.dataTransfer.items : (event.originalEvent.dataTransfer.items || event.originalEvent.dataTransfer.files);

			masterPlayer.fileTreeReader(items);

			return false;
		});
};

//Bind keyboard events
masterPlayer.keyboardEvents = function(){
	$('body').on('keydown', function(event){

		switch(event.keyCode) {
			//Play or pause
			case 80: //p
			case 32: //space
			case 179: //Multimidia keyboard
				if(masterPlayer.config.playing) {
					masterPlayer.config.playlistInstance.pause();
					analytics.track('pauseMusic', 'keyboard', event.keyCode);
				}
				else {
					masterPlayer.config.playlistInstance.play();
					analytics.track('playMusic', 'keyboard', event.keyCode);
				}
				return false;
				event.preventDefault();
			break;

			//Next music
			case 39: //Right arrow
			case 40: //Bottom arrow
			case 176: //Multimidia keyboard
				masterPlayer.config.playlistInstance.next();
				analytics.track('nextMusic', 'keyboard', event.keyCode);
				return false;
				event.preventDefault();
			break;

			//previous music
			case 37: //Left arrow
			case 38: //Up arrow
			case 177: //Multimidia keyboard
				masterPlayer.config.playlistInstance.previous();
				analytics.track('prevMusic', 'keyboard', event.keyCode);
				return false;
				event.preventDefault();
			break;
		}
	});
};

//Apply analytics events
masterPlayer.applyAnalytics = function() {
	//Play music
	//See keyboard events at masterPlayer.keyBoardEvents
	$('.jp-play').on('click', function(){
		analytics.track('playMusic', 'click');
	});

	//Pause music
	//See keyboard events at masterPlayer.keyBoardEvents
	$('.jp-pause').on('click', function(){
		analytics.track('pauseMusic', 'click');
	});

	//Next music
	//See keyboard events at masterPlayer.keyBoardEvents
	$('.jp-next').on('click', function(){
		analytics.track('nextMusic', 'click');
	});

	//Previous music
	//See keyboard events at masterPlayer.keyBoardEvents
	$('.jp-previous').on('click', function(){
		analytics.track('prevMusic', 'click');
	});

	//Shuffle
	$('.jp-shuffle').on('click', function(){
		analytics.track('suffle', 'on');
	});
	$('.jp-shuffle-off').on('click', function(){
		analytics.track('suffle', 'off');
	});

	//Repeat
	$('.jp-repeat').on('click', function(){
		analytics.track('repeat', 'on');
	});
	$('.jp-repeat-off').on('click', function(){
		analytics.track('repeat', 'off');
	});

	//Music progress
	//See event at masterPlayer.init: seeking event

	//Mute
	$('.jp-mute').on('click', function(){
		analytics.track('mute', 'on');
	});
	$('.jp-unmute').on('click', function(){
		analytics.track('mute', 'off');
	});

	//Volume Change
	//See event at masterPlayer.init: volumechange event

	//Chrome actions
	//See events at masterPlayer: chromeWebInit and chromeApp.js

	//qrCode actions
	//See events at masterPlayer.qrCodeInt

	//Change music
	$('#playlist').on('click', 'li:not(.jp-playlist-current)', function(){
		analytics.track('changeMusic', 'click');
	});

	//Open files
	$('.menu-open-files').on('click', function(){
		analytics.track('openFiles', 'click');
	});

	//About
	$('.menu-info').on('click', function(){
		analytics.track('openAbout', 'click');
	});
};

//Bind mouse events
masterPlayer.mouseEvents = function(){
	//Hide elements when mouse dont move
	var mousemovePID = this.hideOnMouseMove(true);
	
	$('html').on('mousemove', function(){
		masterPlayer.hideOnMouseMove(false);
		clearTimeout(mousemovePID);
		mousemovePID = masterPlayer.hideOnMouseMove(true);
	});
};

//Hide elements on mouse move
masterPlayer.hideOnMouseMove = function(hide){
	if(hide) {
		return setTimeout(function(){
			$('#show-QR-code, #menu, .jp-volume').addClass('hidden');
		}, 10000);
	} else {
		$('#show-QR-code, #menu, .jp-volume').removeClass('hidden');
	}
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
	
	$('#show-QR-code').show().on('click', function(event){
		if( !$(this).hasClass('showed') ) {

			$(this).addClass('showed');
			$('.click-to-show-QR-code').hide();
			$('#qrcode').fadeIn(100);

			//Analytics
			analytics.track('qrCode', 'on');
		}

		else {
			$(this).removeClass('showed');
			$('#qrcode').fadeOut(100, function(){
				$('.click-to-show-QR-code').show();
			});

			//Analytics
			analytics.track('qrCode', 'off');
		}

		event.stopPropagation();
	});

	$('body').on('click', function(){
		if($('#show-QR-code').is('.showed')) {
			$('#show-QR-code').trigger('click');
		}
	});
};