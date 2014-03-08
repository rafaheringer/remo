/// <reference path="_references.js" />
"use strict";

yepnope({
	//Have connection?
	test: yepnope.tests.online(),
	yep: {
		qrcodecore: CONFIG.dir.vendor + 'qrcode.js',
		jqueryqrcode: CONFIG.dir.vendor + 'jquery.qrcode.js'
	},
	callback: {
		jqueryqrcode: function(){
			masterPlayer.qrCodeInit();
		}
	}
});

//qrCode init
masterPlayer.qrCodeInit = function() {
	//qrCode
	//$('#qrcode').qrcode('remo.music://' + masterPlayer.config.id);
	$('#qrcode').qrcode(CONFIG.controlPlayerUrl + masterPlayer.config.id);
	
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
