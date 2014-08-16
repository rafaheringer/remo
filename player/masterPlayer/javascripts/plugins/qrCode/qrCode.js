/// <reference path="_references.js" />
"use strict";

//qrCode init
masterPlayer.prototype.qrCode = function() {
	var _self 				= this,
		qrCodeElement 		= null,
		qrCodeButton 		= null,
		clickToShowButton 	= null,
		timeOut 			= null;

	//Constructor
	this.__constructor = function() {
		//Create qrCode elements
		qrCodeButton = $('<div id="show-QR-code" class="animated fadeIn"></div>').insertAfter('#jp_container');
		clickToShowButton = $('<div class="click-to-show-QR-code"></div>').appendTo(qrCodeButton);
		qrCodeElement = $('<div class="qr-code" id="qrcode"></div>').appendTo(qrCodeButton);
	};

	//Init
	this.init = function() {
		//Apply qrCode function
		qrCodeElement.qrcode(CONFIG.controlPlayerUrl + masterPlayer.config.id);

		//On click in button
		qrCodeButton.on('click', function(event) {
			if(!$(this).hasClass('showed'))
				_self.show();
			else
				_self.hide();

			event.stopPropagation();
		});

		//On body click
		$('body').on('click', function(){
			if(qrCodeButton.is('.showed'))
				qrCodeButton.trigger('click');
		});

		//Show buttons
		qrCodeButton.show();
	};

	//Hide qrCode element
	this.hide = function() {
		qrCodeButton.removeClass('showed');
		qrCodeElement.fadeOut(100, function(){
			clickToShowButton.show();
		});

		clearTimeout(timeOut);

		//Analytics
		analytics.track('qrCode', 'off');
	};

	//Show qrCode element
	this.show = function() {
		qrCodeButton.addClass('showed');
		clickToShowButton.hide();
		qrCodeElement.fadeIn(100);

		//Timeout
		timeOut = setTimeout(function(){
			_self.hide();
		}, 20000);

		//Analytics
		analytics.track('qrCode', 'on');
	};

	this.__constructor();
};

yepnope({
	//Have connection?
	test: yepnope.tests.online(),
	yep: {
		qrcodecore: CONFIG.dir.vendor + 'qrcode.js',
		jqueryqrcode: CONFIG.dir.vendor + 'jquery.qrcode.js'
	},
	callback: {
		jqueryqrcode: function(){
			masterPlayer.plugins.qrCode = new mp.qrCode();
			masterPlayer.plugins.qrCode.init();
		}
	}
});