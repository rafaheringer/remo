/// <reference path="_references.js" />
"use strict";

masterPlayer.prototype.lyrics = function() {
	var _self = this;

	//Constructor
	this.__constructor = function() {
		//Config
		_self.elements = {
			lyricsOnBtn: null,
			lyricsOffBtn: null,
			lyricsContainer: null,
			lyricsContent: null,
			lyricsBoxContainer: null,
			autoScroll: null
		};

		_self.status = 'off';
		_self.autoscroll = false;
	};

	//Append Elements
	this.appendElements = function() {
		//Buttons and controls
		_self.elements.lyricsOnBtn = $('<div class="jp-lyrics jp-toggle"><a href="#lyrics" class="ico-file" title="Show lyrics"></a></div>');
		_self.elements.lyricsOffBtn = $('<div class="jp-lyrics-off jp-toggle"><a href="#" class="ico-file" title="Hide lyrics"></a></div>');
		_self.elements.lyricsContainer = window.appendBlankBox('lyrics', 'Lyrics', '<div class="lyrics-content"></div>');
		_self.elements.lyricsContent = $('.lyrics-content',_self.elements.lyricsContainer);
		_self.elements.lyricsBoxContainer = $('.box-container',_self.elements.lyricsContainer);
		$('<div class="lyrics-actions"> <label><input type="checkbox" id="lyrics-autoscroll">Auto scroll</label> </div>').appendTo(_self.elements.lyricsContainer);
		_self.elements.autoScroll = $('#lyrics-autoscroll');

		//Append CSS
		window.appendCSS('javascripts/plugins/lyrics/lyrics.css');
		
		//Append and show controls
		$('.jp-toggles','#jp_container').append(_self.elements.lyricsOnBtn);
		$('.jp-toggles','#jp_container').append(_self.elements.lyricsOffBtn);
	};

	//Search lyric
	this.searchLyric = function() {
		//Loading
		_self.elements.lyricsContainer.addClass('loading');

		//Get music info
		masterPlayer.getMusicInfo(function(ID3) {
			console.log('Lyrics: searchLyric', ID3);

			jQuery.getJSON(
				'http://www.vagalume.com.br/api/search.php'
				+ '?art=' +ID3.artist
				+ '&mus=' +ID3.title,
				function(data){
					//If Captcha
					if (data.captcha) {
						console.log('Captcha required.',data);
						_self.elements.lyricsContent.text('Sorry, you exceed the rate limit. Try again later.');
					} 

					//If song not found
					else if (data.type == 'song_notfound') {
						console.log('Song not found.',data,masterPlayer.config.musicInfo);
						_self.elements.lyricsContent.text('Sorry, song not found :(');
					}

					else if (data.type == 'notfound') {
						console.log('Artist not found.',data,masterPlayer.config.musicInfo);

						_self.elements.lyricsContent.text('Sorry, artist not found :(');
					}

					//If its ok
					else {
						_self.elements.lyricsContent.text(data.mus[0].text);
					}

					//Remove loading
					_self.elements.lyricsContainer.removeClass('loading');

					//Scroll to top
					$(_self.elements.lyricsBoxContainer).stop().animate({
							scrollTop: 0
					});

					//Add vagalume logo
					_self.elements.lyricsContent.prepend('<p><a target="_blank" href="http://www.vagalume.com.br"><img border="0" src="/masterPlayer/javascripts/plugins/lyrics/vagalume.jpg" alt="Vagalume"></a></p>');

				}
			);
		});
	};

	//Show lyrics
	this.showLyrics = function() {
		console.log('Lyrics: showLyrics');

		//Binds
		_self.binds();

		//Hide btn
		_self.elements.lyricsOnBtn.hide();
		_self.elements.lyricsOffBtn.show();
		_self.elements.lyricsContainer.show();

		//Search
		if(masterPlayer.config.playlistInstance.playlist.length) { 
			_self.searchLyric();
		}

		//Save state
		_self.status = 'on';
		savedUserInfo.set('lyrics.status', _self.status);
	};

	//Hide lyrics
	this.hideLyrics = function() {
		//Hide btn
		_self.elements.lyricsOnBtn.show();
		_self.elements.lyricsOffBtn.hide();
		_self.elements.lyricsContainer.hide();

		//Save state
		_self.status = 'off';
		savedUserInfo.set('lyrics.status', _self.status);

		//UnBinds
		_self.unbinds();
	};

	//Binds
	this.binds = function() {
		//On play
		$(masterPlayer.config.playerElement).on($.jPlayer.event.canplay + '.lyrics', function() {
			if(_self.status == 'on') {
				_self.searchLyric();
			}
		});

		//On seek
		$(masterPlayer.config.playerElement).on($.jPlayer.event.timeupdate + '.lyrics', function(event) {
			if(_self.autoscroll) {
				var height 	= 		_self.elements.lyricsContent.outerHeight(true, true);
				height 		= 		height - _self.elements.lyricsContainer.height();
				var calc 	= 		(height / 100)  * event.jPlayer.status.currentPercentAbsolute;

				//Scroll to top
				$(_self.elements.lyricsBoxContainer).stop().animate({
					scrollTop:  calc
				}, 200);
			}
		});
	};

	//Unbinds
	this.unbinds = function() {
		//On play
		$(masterPlayer.config.playerElement).off($.jPlayer.event.canplay + '.lyrics');

		//On seek
		$(masterPlayer.config.playerElement).off($.jPlayer.event.timeupdate + '.lyrics');
	};

	//Init
	this.init = function() {
		console.log('Lyrics: init');

		//Append all elements
		_self.appendElements();

		//Controls actions
		_self.elements.lyricsOnBtn.on('click', function() {
			_self.showLyrics();
		});
		_self.elements.lyricsOffBtn.on('click', function() {
			_self.hideLyrics();
		});
		_self.elements.autoScroll.on('change', function(){
			_self.autoscroll = $(this).is(':checked');
			savedUserInfo.set('lyrics.autoscroll', $(this).is(':checked'));
			console.log('Lyrics: AutoSroll?', _self.autoscroll);
		});

		//Retrieve Status
		savedUserInfo.get('lyrics.status', function(result) {
			if(!result) {
				_self.status = 'off'; //Or on
			} else {
				_self.status = result;

				if(result == 'on') {
					setTimeout(_self.showLyrics, 300);
				}
			}
		});

		//Retrieve autoScroll
		savedUserInfo.get('lyrics.autoscroll', function(result) {
			if(result == true) {
				_self.autoscroll = true;
				_self.elements.autoScroll.attr('checked', true).trigger('change');
			}

			else {
				_self.autoscroll = false;
				_self.elements.autoScroll.attr('checked', false).trigger('change');
			}
		});
	};

	this.__constructor();

	//Public methods
	return {
		init: this.init,
		show: this.showLyrics
	};
};

//Have Internet connection?
if(yepnope.tests.online()) {
	masterPlayer.plugins.lyrics = new mp.lyrics();
	masterPlayer.plugins.lyrics.init();
}